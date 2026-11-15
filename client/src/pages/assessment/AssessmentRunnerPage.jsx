import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  ShieldAlert,
  Award,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft,
  Camera,
  Video,
  VideoOff,
  Maximize2,
  RefreshCw,
  Eye,
  AlertOctagon,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';

export const AssessmentRunnerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Phase: 'pre_check' | 'in_exam' | 'paused_camera' | 'submitted' | 'terminated'
  const [phase, setPhase] = useState('pre_check');
  const [terminationData, setTerminationData] = useState(null);

  // Webcam & Permissions (Privacy-friendly: Phone detection only, no face monitoring)
  const [cameraGranted, setCameraGranted] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [phoneDetectedInFrame, setPhoneDetectedInFrame] = useState(false);

  // Exam Session
  const [attemptId, setAttemptId] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [violationsCount, setViolationsCount] = useState(0);
  const [warningMessage, setWarningMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [warningLimit, setWarningLimit] = useState(5);
  const [needsFullscreenReentry, setNeedsFullscreenReentry] = useState(false);

  // Counters
  const [tabSwitches, setTabSwitches] = useState(0);
  const [focusLosses, setFocusLosses] = useState(0);
  const [cameraInterruptions, setCameraInterruptions] = useState(0);

  // Video, Canvas, Computer Vision & Fullscreen Refs
  const previewVideoRef = useRef(null);
  const liveVideoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const cocoModelRef = useRef(null);
  const [visionModelReady, setVisionModelReady] = useState(false);
  const phoneDetectionCooldownRef = useRef(0);
  const hasEnteredFullscreenRef = useRef(false);

  // Initialize TensorFlow.js COCO-SSD Computer Vision Model
  useEffect(() => {
    let isMounted = true;
    const loadVisionModel = async () => {
      try {
        const cocoSsd = await import('@tensorflow-models/coco-ssd');
        await import('@tensorflow/tfjs');
        const loaded = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
        if (isMounted) {
          cocoModelRef.current = loaded;
          setVisionModelReady(true);
          console.log('[SkillProof AI Proctor] Computer Vision COCO-SSD Model Loaded Successfully');
        }
      } catch (err) {
        console.warn('[SkillProof AI Proctor] ML Vision model fallback to visual heuristics:', err);
      }
    };
    loadVisionModel();
    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Initial Assessment Metadata Fetch & Refresh Persistence
  useEffect(() => {
    const fetchAssessmentInfo = async () => {
      try {
        // Step A: Check if an active attempt is already in-progress on the backend
        try {
          const activeRes = await api.get(`/assessments/${id}/active`);
          if (activeRes.data.success && activeRes.data.hasActiveAttempt) {
            setAttemptId(activeRes.data.attemptId);
            setAssessment(activeRes.data.assessment);
            setTimeLeftSeconds(activeRes.data.remainingSeconds);
            setWarningLimit(activeRes.data.maxAllowedViolations || 5);
            setPhase('in_exam');
            setCameraGranted(true);
            setConsentChecked(true);

            // Re-acquire camera stream for active examination
            requestCameraAccess();

            // Refresh exits fullscreen; prompt candidate to re-enter fullscreen via user gesture
            if (!document.fullscreenElement) {
              setNeedsFullscreenReentry(true);
              hasEnteredFullscreenRef.current = false;
            } else {
              hasEnteredFullscreenRef.current = true;
            }
            return;
          }
        } catch {
          // If no active attempt or error, proceed to normal pre-check flow
        }

        const res = await api.get(`/assessments/${id}`);
        if (res.data.success) {
          setAssessment(res.data.assessment);
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to load assessment information.');
        navigate('/assessments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessmentInfo();
  }, [id, navigate]);

  // Request Webcam Access
  const requestCameraAccess = async () => {
    setCameraLoading(true);
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam media devices API is not supported on this browser or requires an HTTPS connection.');
      }

      // Stop previous tracks if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraGranted(true);

      // Attach track ended listener
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          handleCameraInterrupted('Webcam video track ended unexpectedly.');
        };
      }

      // Set to preview element if in pre-check
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraGranted(false);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please click the camera icon in your browser URL bar to allow camera access.'
          : err.name === 'NotFoundError'
          ? 'No webcam detected on this device. A working camera is mandatory for proctored examination.'
          : err.message || 'Unable to access webcam. Please check device permissions.'
      );
    } finally {
      setCameraLoading(false);
    }
  };

  // Trigger camera request automatically in pre-check
  useEffect(() => {
    if (phase === 'pre_check') {
      requestCameraAccess();
    }
  }, [phase]);

  // Clean up media tracks on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // 2. Start Assessment Once Pre-Check Complete
  const handleStartExam = async () => {
    if (!cameraGranted) {
      alert('Camera access is mandatory. Please grant camera permission before starting.');
      return;
    }
    if (!consentChecked) {
      alert('You must acknowledge the proctoring policy and security restrictions.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/assessments/${id}/start`, {
        cameraVerified: true,
        consentGranted: true,
      });

      if (res.data.success) {
        setAttemptId(res.data.attemptId);
        setAssessment(res.data.assessment);
        setWarningLimit(res.data.maxAllowedViolations || 5);

        // Calculate timer
        const expTime = new Date(res.data.expiresAt).getTime();
        const now = Date.now();
        const remaining = Math.max(Math.floor((expTime - now) / 1000), 0);
        setTimeLeftSeconds(remaining || (res.data.assessment.durationMinutes || 20) * 60);

        setPhase('in_exam');

        // Request Fullscreen
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen()
            .then(() => {
              hasEnteredFullscreenRef.current = true;
            })
            .catch(() => {
              console.warn('Fullscreen entry prevented by browser gesture requirement.');
              hasEnteredFullscreenRef.current = true;
            });
        } else {
          hasEnteredFullscreenRef.current = true;
        }

        // Attach stream to live video element
        setTimeout(() => {
          if (liveVideoRef.current && streamRef.current) {
            liveVideoRef.current.srcObject = streamRef.current;
          }
        }, 300);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to initialize assessment.');
    } finally {
      setLoading(false);
    }
  };

  // Offline resilience: listen for online event to flush any queued termination
  useEffect(() => {
    const handleOnline = async () => {
      try {
        const cached = localStorage.getItem('pending_assessment_termination');
        if (cached) {
          const payload = JSON.parse(cached);
          await api.post(`/assessments/${payload.assessmentId || id}/terminate`, payload);
          localStorage.removeItem('pending_assessment_termination');
          console.log('[Anti-Cheat] Queued assessment termination successfully synchronized with backend.');
        }
      } catch (err) {
        console.error('[Anti-Cheat] Failed to flush queued termination payload:', err);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [id]);

  // Immediate Termination Handler: zero grace period for proctoring violations
  const handleImmediateTermination = async (reason, violationType = 'security_termination') => {
    if (phase === 'terminated' || phase === 'submitted') return;

    setPhase('terminated');
    setTerminationData({
      reason,
      violationType,
      timestamp: new Date().toISOString(),
    });

    // Terminate camera stream immediately
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Exit full-screen mode if currently active
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    const userAnswers = Object.entries(selectedAnswers).map(([questionId, selectedOptionIndex]) => ({
      questionId,
      selectedOptionIndex,
    }));

    const payload = {
      attemptId,
      reason,
      violationType,
      userAnswers,
      assessmentId: id,
    };

    try {
      await api.post(`/assessments/${id}/terminate`, payload);
    } catch (err) {
      console.warn('[Anti-Cheat] Network error during termination submission. Storing locally for retry.', err);
      try {
        localStorage.setItem('pending_assessment_termination', JSON.stringify(payload));
      } catch (e) {
        console.error('LocalStorage write failed:', e);
      }
    }
  };

  // Camera Interruption Handler
  const handleCameraInterrupted = (reason) => {
    if (phase !== 'in_exam') return;
    handleImmediateTermination(
      reason || 'Assessment terminated due to a proctoring violation.',
      'camera_disconnected'
    );
  };

  // Log Violation Event to Backend
  const reportViolation = async (
    type,
    details,
    severity = 'medium',
    actionTaken = 'warning_recorded',
    confidence = 1.0
  ) => {
    setViolationsCount((prev) => prev + 1);
    try {
      const res = await api.post(`/assessments/${id}/violations`, {
        attemptId,
        type,
        details,
        severity,
        actionTaken,
        confidence,
        cameraStatus: cameraGranted ? 'connected' : 'disconnected',
      });
      if (res.data?.shouldAutoSubmit) {
        handleImmediateTermination(
          'Assessment terminated due to exceeding maximum allowed proctoring violations.',
          'violation_limit_exceeded'
        );
      }
    } catch (err) {
      console.warn('Failed to report violation to backend:', err);
    }
  };

  // 3. Periodic Mobile Phone Detection Engine (Privacy-Friendly: Phone Detection Only)
  useEffect(() => {
    if (phase !== 'in_exam' || !liveVideoRef.current || !canvasRef.current) return;

    const interval = setInterval(async () => {
      const video = liveVideoRef.current;
      const canvas = canvasRef.current;

      // Verify stream is actively sending frames
      if (!streamRef.current || !streamRef.current.active) {
        handleCameraInterrupted('Assessment terminated due to a proctoring violation.');
        return;
      }

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        let isPhoneDetected = false;
        let detectionConfidence = 0;

        // TENSORFLOW.JS COCO-SSD OBJECT DETECTION (CELL PHONE DETECTION ONLY)
        if (cocoModelRef.current && video.readyState >= 2) {
          try {
            const predictions = await cocoModelRef.current.detect(video);
            // Strict check for visible mobile phone
            const phonePred = predictions.find(
              (p) => (p.class === 'cell phone' || p.class === 'remote') && p.score >= 0.50
            );
            if (phonePred) {
              isPhoneDetected = true;
              detectionConfidence = phonePred.score;
            }
          } catch (cvErr) {
            // graceful fallback
          }
        }

        // Secondary optical highlight check for illuminated handheld screen if ML is initializing
        if (!isPhoneDetected && canvas) {
          try {
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            const W = 96;
            const H = 72;
            canvas.width = W;
            canvas.height = H;
            ctx.drawImage(video, 0, 0, W, H);
            const imgData = ctx.getImageData(0, 0, W, H).data;
            let phoneGlowPixels = 0;

            for (let y = Math.floor(H * 0.5); y < H; y++) {
              for (let x = 0; x < W; x++) {
                const idx = (y * W + x) * 4;
                const r = imgData[idx];
                const g = imgData[idx + 1];
                const b = imgData[idx + 2];
                const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                if (lum > 225 && (b >= r - 10 || b > 210)) {
                  phoneGlowPixels++;
                }
              }
            }

            if (phoneGlowPixels > 75) {
              isPhoneDetected = true;
              detectionConfidence = 0.80;
            }
          } catch {
            // ignore canvas read errors
          }
        }

        // ZERO TOLERANCE: IMMEDIATE TERMINATION & EXIT UPON PHONE DETECTION (NO WARNINGS)
        if (isPhoneDetected) {
          setPhoneDetectedInFrame(true);
          reportViolation(
            'phone_detected',
            `Visible mobile phone detected in camera frame (${Math.round(detectionConfidence * 100)}% confidence). Session terminated under zero-tolerance policy.`,
            'critical',
            'session_terminated',
            detectionConfidence
          );
          handleImmediateTermination(
            'Assessment terminated due to a proctoring violation: Visible mobile phone detected.',
            'phone_detected'
          );
          return;
        } else {
          setPhoneDetectedInFrame(false);
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [phase, attemptId, violationsCount, warningLimit]);

  // 4. Strict Browser Security Event Listeners (Zero Tolerance)
  useEffect(() => {
    if (phase !== 'in_exam') return;

    // Fullscreen Exit -> Immediate Termination without warning once fullscreen was entered
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && hasEnteredFullscreenRef.current) {
        reportViolation('fullscreen_exit', 'Candidate exited full-screen mode.', 'critical', 'session_terminated');
        handleImmediateTermination(
          'Assessment terminated due to a proctoring violation.',
          'fullscreen_exit'
        );
      }
    };

    // Tab Switch / Page Visibility -> Immediate Termination without warning
    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation('tab_hidden', 'Browser tab switch or window minimization detected.', 'critical', 'session_terminated');
        handleImmediateTermination(
          'Assessment terminated due to a proctoring violation.',
          'tab_hidden'
        );
      }
    };

    // Window Blur (Focus Loss to external window/application) -> Immediate Termination
    const handleWindowBlur = () => {
      reportViolation('focus_loss', 'Page lost focus to an external window or background application.', 'critical', 'session_terminated');
      handleImmediateTermination(
        'Assessment terminated due to a proctoring violation.',
        'focus_loss'
      );
    };

    // Text Selection & Clipboard Copy Suppression
    const handleCopy = (e) => {
      e.preventDefault();
      setWarningMessage('Copy command is disabled in proctored assessments.');
      reportViolation('copy_paste_attempt', 'Candidate attempted clipboard copy.', 'medium', 'warning_displayed');
      setTimeout(() => setWarningMessage(null), 3000);
    };

    const handleCut = (e) => {
      e.preventDefault();
      setWarningMessage('Cut command is disabled in proctored assessments.');
      reportViolation('copy_paste_attempt', 'Candidate attempted clipboard cut.', 'medium', 'warning_displayed');
      setTimeout(() => setWarningMessage(null), 3000);
    };

    const handlePaste = (e) => {
      e.preventDefault();
      setWarningMessage('Paste command is disabled in proctored assessments.');
      reportViolation('copy_paste_attempt', 'Candidate attempted clipboard paste.', 'medium', 'warning_displayed');
      setTimeout(() => setWarningMessage(null), 3000);
    };

    // Right-Click Context Menu Suppression
    const handleContextMenu = (e) => {
      e.preventDefault();
      setWarningMessage('Right-click context menu is disabled in proctored assessments.');
      reportViolation('context_menu', 'Right-click context menu requested.', 'low', 'warning_displayed');
      setTimeout(() => setWarningMessage(null), 3000);
    };

    // Block Keyboard Shortcuts (Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+U, PrintScreen, F12, etc.)
    const handleKeyDown = (e) => {
      // PrintScreen Screenshot Suppression
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        setWarningMessage('Screen capture is disabled during proctored assessment.');
        reportViolation('screenshot_attempt', 'PrintScreen key pressed during active assessment.', 'high', 'warning_displayed');
        setTimeout(() => setWarningMessage(null), 3000);
        return;
      }

      // Windows/Mac Snipping Tool Shortcut
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setWarningMessage('Screen snipping shortcuts are disabled.');
        reportViolation('screenshot_attempt', 'Screen snipping shortcut detected.', 'high', 'warning_displayed');
        setTimeout(() => setWarningMessage(null), 3000);
        return;
      }

      if (
        (e.ctrlKey || e.metaKey) &&
        ['c', 'v', 'x', 'a', 'u', 'p', 's'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        setWarningMessage(`Prohibited shortcut (Ctrl+${e.key.toUpperCase()}) blocked.`);
        reportViolation('copy_paste_attempt', `Shortcut Ctrl+${e.key.toUpperCase()} blocked.`, 'medium', 'warning_displayed');
        setTimeout(() => setWarningMessage(null), 3000);
      }

      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        setWarningMessage('Developer Inspection Tools are disabled.');
        reportViolation('devtools_attempt', 'Developer inspection shortcut blocked.', 'high', 'warning_displayed');
        setTimeout(() => setWarningMessage(null), 3000);
      }
    };

    // Unload confirmation
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Assessment is currently active. Navigating away will immediately terminate and submit your attempt.';
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCut);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('cut', handleCut);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [phase, attemptId, selectedAnswers]);

  // 5. Timer Countdown (only runs during 'in_exam')
  useEffect(() => {
    if (phase !== 'in_exam' || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, timeLeftSeconds]);

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitExam = async () => {
    if (submitting || phase === 'submitted') return;

    const answeredCount = Object.keys(selectedAnswers).length;
    const totalCount = assessment?.questions?.length || 0;
    if (answeredCount < totalCount) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalCount} questions. Are you sure you want to submit your assessment?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);

    const userAnswers = Object.entries(selectedAnswers).map(([questionId, selectedOptionIndex]) => ({
      questionId,
      selectedOptionIndex,
    }));

    try {
      const res = await api.post(`/assessments/${id}/submit`, {
        attemptId,
        userAnswers,
      });

      if (res.data.success) {
        setTestResult(res.data.result);
        setPhase('submitted');

        // Stop camera tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Exit fullscreen
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  // Format Timer HH:MM:SS
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Current Question
  const currentQ = assessment?.questions?.[currentQuestionIndex];

  // Hidden Canvas for optical detection
  const hiddenCanvas = <canvas ref={canvasRef} style={{ display: 'none' }} />;

  // ==========================================
  // RENDER PHASE: 1. PRE-CHECK & WEBCAM PERMISSION
  // ==========================================
  if (phase === 'pre_check') {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#F8FAF9',
          padding: '2.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        {hiddenCanvas}
        <div style={{ maxWidth: '850px', width: '100%' }}>
          <div className="card" style={{ background: '#FFFFFF', border: '1px solid #DFE8E1', padding: '2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(37, 99, 235, 0.1)',
                color: '#07866A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: '#142D2B' }}>
                Secure Proctoring & Camera Verification
              </h2>
              <p style={{ color: '#68756F', fontSize: '0.875rem', margin: '2px 0 0 0' }}>
                {assessment?.title || 'Technical Assessment'} &bull; Mandatory anti-cheating security protocol
              </p>
            </div>
          </div>

          {/* Camera Preview Box */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
              marginBottom: '1.75rem',
            }}
          >
            {/* Live Camera View */}
            <div
              style={{
                position: 'relative',
                background: '#142D2B',
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '4 / 3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: cameraGranted ? '2px solid #247A48' : '2px dashed #8B9892',
              }}
            >
              <video
                ref={previewVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: cameraGranted ? 'block' : 'none',
                  transform: 'scaleX(-1)', // Mirror preview
                }}
              />

              {!cameraGranted && (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#8B9892' }}>
                  {cameraLoading ? (
                    <>
                      <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 0.75rem', color: '#07866A' }} />
                      <div style={{ fontWeight: 600, color: '#FAFAF5' }}>Requesting camera permission...</div>
                      <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Please click "Allow" in your browser popup.</div>
                    </>
                  ) : (
                    <>
                      <VideoOff size={40} style={{ margin: '0 auto 0.75rem', color: '#C83E4D' }} />
                      <div style={{ fontWeight: 700, color: '#FAFAF5', marginBottom: '4px' }}>Webcam Access Required</div>
                      <p style={{ fontSize: '0.8rem', color: '#8B9892', maxWidth: '280px', margin: '0 auto 1rem' }}>
                        {cameraError || 'Camera permissions have not been granted.'}
                      </p>
                      <button
                        onClick={requestCameraAccess}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <RefreshCw size={14} /> Retry Permission
                      </button>
                    </>
                  )}
                </div>
              )}

              {cameraGranted && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#EFF8F2',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#247A48',
                      boxShadow: '0 0 6px #247A48',
                    }}
                  />
                  Camera Ready
                </div>
              )}
            </div>

            {/* Assessment Security Rules */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#142D2B', marginBottom: '0.75rem' }}>
                Proctoring Rules & Security Checklist:
              </h4>
              <ul style={{ paddingLeft: '1.2rem', color: '#4A5651', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                <li>
                  <strong style={{ color: '#142D2B' }}>Zero-Tolerance Phone Policy:</strong> Mobile phones are strictly prohibited. Detecting a mobile phone in camera view will immediately terminate and exit the assessment without warnings.
                </li>
                <li>
                  <strong style={{ color: '#142D2B' }}>Automatic Fullscreen Mode:</strong> Exiting fullscreen or navigating away will log a security violation.
                </li>
                <li>
                  <strong style={{ color: '#142D2B' }}>Tab Switching & Focus Loss:</strong> Switching tabs or opening external software triggers an anti-cheat alert.
                </li>
                <li>
                  <strong style={{ color: '#142D2B' }}>Randomized Questions:</strong> Question order and answer choices are dynamically shuffled per account.
                </li>
                <li>
                  <strong style={{ color: '#142D2B' }}>Violation Limit:</strong> Exceeding 5 warnings will terminate or auto-submit your exam for administrative review.
                </li>
              </ul>

              {/* Consent Checkbox */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  marginTop: '1.25rem',
                  padding: '0.85rem',
                  background: '#FAFAF5',
                  borderRadius: '8px',
                  border: '1px solid #DFE8E1',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#142D2B',
                }}
              >
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  style={{ marginTop: '3px', cursor: 'pointer' }}
                />
                <span>
                  I consent to automated mobile phone detection and browser security logging during this assessment. I understand that no video recordings or personal photos are stored.
                </span>
              </label>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #DFE8E1', paddingTop: '1.25rem' }}>
            <Link to="/assessments" className="btn btn-secondary">
              Back to Catalog
            </Link>
            <button
              onClick={handleStartExam}
              disabled={!cameraGranted || !consentChecked || loading}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.4rem',
                fontWeight: 700,
                opacity: !cameraGranted || !consentChecked ? 0.6 : 1,
                cursor: !cameraGranted || !consentChecked ? 'not-allowed' : 'pointer',
              }}
            >
              <Maximize2 size={16} /> Enter Fullscreen & Begin Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  }

  // ==========================================
  // RENDER PHASE: TERMINATED DUE TO STRICT VIOLATION
  // ==========================================
  if (phase === 'terminated') {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#F8FAF9',
          padding: '2.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '680px', width: '100%' }}>
          <div
            className="card"
            style={{
              background: '#FFFFFF',
              border: '2px solid #EF4444',
              textAlign: 'center',
              padding: '3rem 2rem',
              boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.1)',
            }}
          >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#FCF0F2',
              color: '#C83E4D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <AlertOctagon size={40} />
          </div>

          <span
            style={{
              display: 'inline-block',
              background: '#FCF0F2',
              color: '#822430',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
            }}
          >
            Zero Tolerance Security Action
          </span>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#C83E4D', marginBottom: '0.5rem' }}>
            Assessment terminated due to a proctoring violation.
          </h2>

          <p style={{ color: '#68756F', fontSize: '0.925rem', margin: '0 auto 1.5rem', maxWidth: '520px', lineHeight: 1.55 }}>
            This assessment attempt was automatically terminated and submitted because a proctoring policy violation was detected by the monitoring system.
          </p>

          {/* Details Box */}
          <div
            style={{
              background: '#FAFAF5',
              border: '1px solid #DFE8E1',
              borderRadius: '10px',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#68756F', fontWeight: 700, textTransform: 'uppercase' }}>
                Termination Cause
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#C83E4D', marginTop: '2px' }}>
                {terminationData?.reason || 'Strict proctoring violation detected.'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #DFE8E1' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#68756F', fontWeight: 600 }}>TERMINATION TIMESTAMP</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#142D2B', marginTop: '2px' }}>
                  {new Date(terminationData?.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#68756F', fontWeight: 600 }}>ATTEMPT RECORD</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#142D2B', marginTop: '2px' }}>
                  {attemptId || 'Recorded & Locked'}
                </div>
              </div>
            </div>
          </div>

          {/* Administrative Notice */}
          <div
            style={{
              background: '#F0F7F4',
              border: '1px solid #DFE8E1',
              borderRadius: '8px',
              padding: '0.9rem',
              color: '#142D2B',
              fontSize: '0.825rem',
              lineHeight: 1.5,
              textAlign: 'left',
              marginBottom: '2rem',
            }}
          >
            <strong>Administrative Notice:</strong> All responses recorded prior to termination have been submitted for faculty &amp; placement audit. In accordance with examination regulations, candidates cannot restart this attempt unless authorized by an administrator.
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/assessments" className="btn btn-primary" style={{ fontWeight: 700 }}>
              Return to Assessments Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
    );
  }

  // ==========================================
  // RENDER PHASE: 2. EXAM COMPLETED / SUBMITTED
  // ==========================================
  if (phase === 'submitted' || testResult) {
    const passed = testResult?.passed;
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#F8FAF9',
          padding: '2.5rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '650px', width: '100%' }}>
          <div
            className="card"
            style={{
              background: '#FFFFFF',
              border: passed ? '2px solid #C8E6D2' : '2px solid #F7D4D7',
              textAlign: 'center',
              padding: '2.75rem 2rem',
            }}
          >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: passed ? '#EFF8F2' : '#FCF0F2',
              color: passed ? '#247A48' : '#C83E4D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            {passed ? <Award size={36} /> : <AlertTriangle size={36} />}
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#142D2B', marginBottom: '0.35rem' }}>
            {passed ? 'Assessment Completed & Passed!' : 'Assessment Completed'}
          </h2>
          <p style={{ color: '#68756F', fontSize: '0.925rem', margin: '0 auto 1.5rem', maxWidth: '450px' }}>
            {passed
              ? 'Your competencies have been verified and upgraded to Assessed status in your Digital Skill Passport.'
              : 'Thank you for completing the technical examination. Review your results below.'}
          </p>

          {/* Score Box */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1rem',
              marginBottom: '1.75rem',
              padding: '1.25rem',
              background: '#FAFAF5',
              borderRadius: '8px',
              border: '1px solid #DFE8E1',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#68756F', fontWeight: 600, textTransform: 'uppercase' }}>
                Score
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: passed ? '#247A48' : '#E8A23A', marginTop: '2px' }}>
                {testResult?.scorePercentage || 0}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#68756F', fontWeight: 600, textTransform: 'uppercase' }}>
                Threshold
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#142D2B', marginTop: '2px' }}>
                {testResult?.passingThreshold || 70}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#68756F', fontWeight: 600, textTransform: 'uppercase' }}>
                Security Flags
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: violationsCount > 0 ? '#C83E4D' : '#247A48', marginTop: '2px' }}>
                {violationsCount}
              </div>
            </div>
          </div>

          {/* Proctoring Summary Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '999px',
              background: violationsCount >= 3 ? '#FCF0F2' : '#EFF8F2',
              color: violationsCount >= 3 ? '#822430' : '#247A48',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '2rem',
            }}
          >
            <ShieldCheck size={14} />
            {violationsCount >= 3
              ? `Proctored session flagged for review (${violationsCount} security events logged).`
              : 'Proctored session verified. No disqualifying violations detected.'}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/student/passport" className="btn btn-primary">
              View Updated Skill Passport &rarr;
            </Link>
            <Link to="/assessments" className="btn btn-secondary">
              Back to Assessments
            </Link>
          </div>
        </div>
      </div>
    </div>
    );
  }

  // ==========================================
  // RENDER PHASE: 3. IN_EXAM & PAUSED_CAMERA
  // ==========================================
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100%',
        backgroundColor: '#F8FAF9',
        padding: '1.25rem 2rem 3rem 2rem',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {hiddenCanvas}

        {/* Floating Picture-in-Picture Webcam Box */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          width: '210px',
          background: '#142D2B',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          border: phoneDetectedInFrame ? '2px solid #EF4444' : '2px solid #247A48',
          zIndex: 100,
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
          <video
            ref={liveVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
          />

          {/* Status Badge */}
          <div
            style={{
              position: 'absolute',
              top: '6px',
              left: '6px',
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#FFFFFF',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '0.65rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: phase === 'in_exam' ? '#247A48' : '#EF4444',
                boxShadow: phase === 'in_exam' ? '0 0 6px #247A48' : 'none',
              }}
            />
            {phase === 'in_exam' ? 'Camera Live' : 'Camera Paused'}
          </div>

          {phoneDetectedInFrame && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(239, 68, 68, 0.95)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '3px 6px',
                textAlign: 'center',
              }}
            >
              ⚠️ Phone Detected
            </div>
          )}
        </div>
      </div>

      {/* Paused Camera Modal Overlay */}
      {phase === 'paused_camera' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '520px',
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#FCF0F2',
                color: '#C83E4D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <VideoOff size={32} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#142D2B', marginBottom: '0.5rem' }}>
              Webcam Feed Disconnected
            </h3>
            <p style={{ color: '#68756F', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Per institutional proctoring regulations, camera monitoring must remain uninterrupted. Your examination timer has been temporarily paused.
            </p>

            <button
              onClick={handleResumeAfterCamera}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <RefreshCw size={16} /> Reconnect Webcam & Resume Exam
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Required Modal on Active Exam Restore */}
      {needsFullscreenReentry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '520px',
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#EFF8F2',
                color: '#07866A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <Maximize2 size={32} />
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#142D2B', marginBottom: '0.5rem' }}>
              Active Assessment Session Resumed
            </h3>
            <p style={{ color: '#68756F', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Your proctored session is currently in progress and the timer is running. To adhere to exam security regulations, you must re-enter full-screen mode to continue.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#F0F7F4',
                color: '#07866A',
                border: '1px solid #DFE8E1',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '1.15rem',
                marginBottom: '1.75rem',
              }}
            >
              <Clock size={18} />
              <span>Time Left: {formatTime(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={async () => {
                try {
                  if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                  }
                } catch (e) {
                  console.warn('Fullscreen entry rejected:', e);
                }
                hasEnteredFullscreenRef.current = true;
                setNeedsFullscreenReentry(false);
              }}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <Maximize2 size={18} /> Re-enter Full-Screen Mode & Resume
            </button>
          </div>
        </div>
      )}

      {/* Top Floating Security Banner & Warnings */}
      {warningMessage && (
        <div
          style={{
            position: 'sticky',
            top: '10px',
            zIndex: 90,
            background: '#FCF0F2',
            border: '1.5px solid #C83E4D',
            borderRadius: '8px',
            padding: '0.75rem 1.25rem',
            color: '#822430',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
          }}
        >
          <AlertOctagon size={18} />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Exam Header Bar */}
      <div
        className="card"
        style={{
          marginBottom: '1rem',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#FFFFFF',
          border: '1px solid #DFE8E1',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '4px',
                background: '#EFF8F2',
                color: '#247A48',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ShieldCheck size={11} /> Proctored Session
            </span>
            <span style={{ fontSize: '0.8rem', color: '#68756F' }}>
              Warnings: <strong>{violationsCount} / {warningLimit}</strong>
            </span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 0 0', color: '#142D2B' }}>
            {assessment?.title}
          </h2>
        </div>

        {/* Top Right: Current Question Position */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              background: '#F0F7F4',
              border: '1px solid #DFE8E1',
              color: '#07866A',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            Question {currentQuestionIndex + 1} of {assessment?.questions?.length || 0}
          </div>
        </div>
      </div>

      {/* Question Progress & Palette */}
      <div
        className="card"
        style={{
          marginBottom: '1rem',
          padding: '1rem 1.25rem',
          background: '#FFFFFF',
          border: '1px solid #DFE8E1',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#142D2B' }}>Question Progress</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#68756F' }}>
            {Object.keys(selectedAnswers).length} of {assessment?.questions?.length || 0} Answered
          </span>
        </div>

        {/* Question Palette Buttons */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {assessment?.questions?.map((q, idx) => {
            const isAnswered = selectedAnswers[q._id] !== undefined;
            const isCurrent = currentQuestionIndex === idx;
            return (
              <button
                key={q._id}
                type="button"
                onClick={() => setCurrentQuestionIndex(idx)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: isCurrent ? '2px solid #07866A' : isAnswered ? '1px solid #247A48' : '1px solid #DFE8E1',
                  backgroundColor: isCurrent ? '#F0F7F4' : isAnswered ? '#EFF8F2' : '#FFFFFF',
                  color: isCurrent ? '#07866A' : isAnswered ? '#247A48' : '#68756F',
                  fontWeight: isCurrent ? 800 : isAnswered ? 700 : 500,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Card - Strict Anti-Copy Protected Area */}
      {currentQ && (
        <div
          className="card"
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          onSelectStart={(e) => e.preventDefault()}
          style={{
            padding: '2rem',
            background: '#FFFFFF',
            border: '1px solid #DFE8E1',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#68756F' }}>
              Question {currentQuestionIndex + 1} of {assessment.questions.length}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                background: '#F0F7F4',
                color: '#07866A',
                border: '1px solid #DFE8E1',
              }}
            >
              {currentQ.skillTag}
            </span>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#142D2B', marginBottom: '1.25rem', lineHeight: 1.45 }}>
            {currentQ.questionText}
          </h3>

          {/* Code Snippet if applicable */}
          {currentQ.codeSnippet && (
            <pre
              style={{
                padding: '1rem',
                backgroundColor: '#142D2B',
                color: '#07866A',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                marginBottom: '1.5rem',
              }}
            >
              <code>{currentQ.codeSnippet}</code>
            </pre>
          )}

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {currentQ.options?.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQ._id] === optIdx;
              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ._id, optIdx)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #07866A' : '1px solid #DFE8E1',
                    backgroundColor: isSelected ? '#F0F7F4' : '#FFFFFF',
                    color: isSelected ? '#142D2B' : '#142D2B',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.925rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: isSelected ? '6px solid #07866A' : '2px solid #DFE8E1',
                      backgroundColor: '#FFFFFF',
                      flexShrink: 0,
                    }}
                  />
                  <span>{opt.text}</span>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls & Timer at Down (Bottom) of Assessment */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              borderTop: '1px solid #DFE8E1',
              paddingTop: '1.25rem',
              marginTop: '1.5rem',
            }}
          >
            {/* Previous Button */}
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
              className="btn btn-secondary btn-sm"
              disabled={currentQuestionIndex === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 600,
                padding: '0.55rem 1.15rem',
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {/* Countdown Timer (Displayed at the bottom of the assessment) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: timeLeftSeconds < 180 ? '#FCF0F2' : '#F0F7F4',
                color: timeLeftSeconds < 180 ? '#C83E4D' : '#07866A',
                border: `1.5px solid ${timeLeftSeconds < 180 ? '#F7D4D7' : '#DFE8E1'}`,
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '1.15rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
              }}
            >
              <Clock size={18} className={timeLeftSeconds < 180 ? 'animate-pulse' : ''} />
              <span>Time Remaining: {formatTime(timeLeftSeconds)}</span>
            </div>

            {/* Next Button OR Final Submit Button */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {currentQuestionIndex < (assessment?.questions?.length || 0) - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="btn btn-primary btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: 700,
                    padding: '0.55rem 1.25rem',
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 800,
                    padding: '0.6rem 1.5rem',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 12px rgba(7, 134, 106, 0.25)',
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>{submitting ? 'Submitting Answers...' : 'Submit Assessment'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AssessmentRunnerPage;
