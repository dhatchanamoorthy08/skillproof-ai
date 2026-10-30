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

  // Webcam & Permissions
  const [cameraGranted, setCameraGranted] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [faceInFrame, setFaceInFrame] = useState(true);

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

  // Counters
  const [tabSwitches, setTabSwitches] = useState(0);
  const [focusLosses, setFocusLosses] = useState(0);
  const [cameraInterruptions, setCameraInterruptions] = useState(0);

  // Video & Canvas Refs
  const previewVideoRef = useRef(null);
  const liveVideoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMissingCounterRef = useRef(0);
  const phoneDetectedCounterRef = useRef(0);
  const multiFaceCounterRef = useRef(0);

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

            // Request Fullscreen
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen().catch(() => {});
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
          document.documentElement.requestFullscreen().catch(() => {
            console.warn('Fullscreen entry prevented by browser gesture requirement.');
          });
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
  const reportViolation = async (type, details) => {
    setViolationsCount((prev) => prev + 1);
    try {
      await api.post(`/assessments/${id}/violations`, {
        attemptId,
        type,
        details,
        cameraStatus: cameraGranted ? 'connected' : 'disconnected',
      });
    } catch (err) {
      console.warn('Failed to report violation to backend:', err);
    }
  };

  // 3. Periodic Camera, Face-Presence & Mobile Phone Detection Engine
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
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const W = 96;
        const H = 72;
        canvas.width = W;
        canvas.height = H;
        ctx.drawImage(video, 0, 0, W, H);

        // --- STEP 1: CHROMIUM SHAPE DETECTION API (Native Face Detector if available) ---
        let detectedFaceCount = -1;
        if ('FaceDetector' in window) {
          try {
            const faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
            const faces = await faceDetector.detect(video);
            detectedFaceCount = faces.length;
          } catch {
            detectedFaceCount = -1;
          }
        }

        // --- STEP 2: PIXEL-LEVEL LUMINANCE & COMPUTER VISION ANALYSIS ---
        try {
          const imgData = ctx.getImageData(0, 0, W, H).data;
          let totalLuminance = 0;
          let pixelCount = imgData.length / 4;
          let skinPixelsTotal = 0;
          let skinLeft = 0;
          let skinRight = 0;

          // Potential mobile phone screen glow / rectangular specular highlights in lower hand region
          let phoneGlowPixels = 0;

          for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
              const idx = (y * W + x) * 4;
              const r = imgData[idx];
              const g = imgData[idx + 1];
              const b = imgData[idx + 2];

              const lum = 0.299 * r + 0.587 * g + 0.114 * b;
              totalLuminance += lum;

              // Peer-reviewed RGB Skin Color Segmentation (Kovac / Chai)
              const isSkin =
                r > 95 &&
                g > 40 &&
                b > 20 &&
                Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
                Math.abs(r - g) > 15 &&
                r > g &&
                r > b;

              if (isSkin) {
                skinPixelsTotal++;
                if (x < W / 2) skinLeft++;
                else skinRight++;
              }

              // Mobile phone screen detection: bright rectangular high-contrast screen in lower half
              if (y > H * 0.55 && lum > 215 && (b >= r - 10 || b > 200)) {
                phoneGlowPixels++;
              }
            }
          }

          const avgLuminance = totalLuminance / pixelCount;
          const skinRatio = skinPixelsTotal / pixelCount;

          // Lens covered or completely dark
          if (avgLuminance < 6 || avgLuminance > 252) {
            faceMissingCounterRef.current += 1;
          } else {
            // FACE ABSENCE / CANDIDATE LEAVING CAMERA VIEW
            if (detectedFaceCount === 0 || (detectedFaceCount === -1 && skinRatio < 0.025)) {
              faceMissingCounterRef.current += 1;
            } else {
              faceMissingCounterRef.current = 0;
              setFaceInFrame(true);
            }

            // MULTIPLE FACES DETECTION
            if (
              detectedFaceCount > 1 ||
              (detectedFaceCount === -1 && skinLeft > pixelCount * 0.08 && skinRight > pixelCount * 0.08)
            ) {
              multiFaceCounterRef.current += 1;
            } else {
              multiFaceCounterRef.current = 0;
            }

            // MOBILE PHONE USAGE DETECTION (concentrated screen glow or device in candidate frame)
            if (phoneGlowPixels > 55) {
              phoneDetectedCounterRef.current += 1;
            } else {
              if (phoneDetectedCounterRef.current > 0) {
                phoneDetectedCounterRef.current -= 1;
              }
            }
          }

          // Violation Trigger 1: Candidate leaves camera view
          if (faceMissingCounterRef.current >= 3) {
            setFaceInFrame(false);
            setWarningMessage('Security Warning: Candidate face not in camera view. Return to frame immediately.');
            reportViolation('face_missing', 'Candidate face out of camera view.');
            setTimeout(() => setWarningMessage(null), 5000);
            faceMissingCounterRef.current = 0;
          }

          // Violation Trigger 2: Multiple faces detected
          if (multiFaceCounterRef.current >= 2) {
            setWarningMessage('Security Violation: Multiple individuals detected in proctored camera view.');
            reportViolation('multiple_faces', 'Multiple faces detected in proctored camera view.');
            setTimeout(() => setWarningMessage(null), 5000);
            multiFaceCounterRef.current = 0;
          }

          // Violation Trigger 3: Mobile phone detected -> AUTOMATIC IMMEDIATE TERMINATION
          if (phoneDetectedCounterRef.current >= 2) {
            phoneDetectedCounterRef.current = 0;
            handleImmediateTermination(
              'Assessment terminated due to a proctoring violation.',
              'phone_usage'
            );
          }
        } catch {
          // Canvas read error bypass
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [phase, attemptId]);

  // 4. Strict Browser Security Event Listeners (Zero Tolerance)
  useEffect(() => {
    if (phase !== 'in_exam') return;

    // Fullscreen Exit -> Immediate Termination without warning
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleImmediateTermination(
          'Assessment Terminated: Candidate exited full-screen mode.',
          'fullscreen_exit'
        );
      }
    };

    // Tab Switch / Page Visibility -> Immediate Termination without warning
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleImmediateTermination(
          'Assessment Terminated: Browser tab switch or window minimization detected.',
          'tab_hidden'
        );
      }
    };

    // Window Blur (Focus Loss to external window/application) -> Immediate Termination
    const handleWindowBlur = () => {
      handleImmediateTermination(
        'Assessment Terminated: Page lost focus to an external window or background application.',
        'focus_loss'
      );
    };

    // Text Selection & Clipboard Copy Suppression
    const handleCopy = (e) => {
      e.preventDefault();
      setWarningMessage('Copy command is disabled in proctored assessments.');
      setTimeout(() => setWarningMessage(null), 3000);
    };

    const handleCut = (e) => {
      e.preventDefault();
      setWarningMessage('Cut command is disabled in proctored assessments.');
      setTimeout(() => setWarningMessage(null), 3000);
    };

    const handlePaste = (e) => {
      e.preventDefault();
      setWarningMessage('Paste command is disabled in proctored assessments.');
      setTimeout(() => setWarningMessage(null), 3000);
    };

    // Right-Click Context Menu Suppression
    const handleContextMenu = (e) => {
      e.preventDefault();
      setWarningMessage('Right-click context menu is disabled in proctored assessments.');
      setTimeout(() => setWarningMessage(null), 3000);
    };

    // Block Keyboard Shortcuts (Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+U, F12, etc.)
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ['c', 'v', 'x', 'a', 'u', 'p', 's'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        setWarningMessage(`Prohibited shortcut (Ctrl+${e.key.toUpperCase()}) blocked.`);
        setTimeout(() => setWarningMessage(null), 3000);
      }
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        setWarningMessage('Developer Inspection Tools are disabled.');
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

  // Hidden Canvas for face heuristic
  const hiddenCanvas = <canvas ref={canvasRef} style={{ display: 'none' }} />;

  // ==========================================
  // RENDER PHASE: 1. PRE-CHECK & WEBCAM PERMISSION
  // ==========================================
  if (phase === 'pre_check') {
    return (
      <div style={{ maxWidth: '850px', margin: '1.5rem auto', padding: '0 1rem' }}>
        {hiddenCanvas}
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
                  <strong style={{ color: '#142D2B' }}>Mandatory Webcam Feed:</strong> Your camera must remain active and unobstructed throughout the examination.
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
                  <strong style={{ color: '#142D2B' }}>Violation Limit:</strong> Exceeding 5 warnings will pause or auto-submit your exam for administrative review.
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
                  I consent to continuous webcam monitoring and browser security logging during this assessment. I understand that violations will be recorded in my candidate audit log.
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
    );
  }

  // ==========================================
  // RENDER PHASE: TERMINATED DUE TO STRICT VIOLATION
  // ==========================================
  if (phase === 'terminated') {
    return (
      <div style={{ maxWidth: '680px', margin: '2.5rem auto', padding: '0 1rem' }}>
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
    );
  }

  // ==========================================
  // RENDER PHASE: 2. EXAM COMPLETED / SUBMITTED
  // ==========================================
  if (phase === 'submitted' || testResult) {
    const passed = testResult?.passed;
    return (
      <div style={{ maxWidth: '650px', margin: '2rem auto', padding: '0 1rem' }}>
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
    );
  }

  // ==========================================
  // RENDER PHASE: 3. IN_EXAM & PAUSED_CAMERA
  // ==========================================
  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', paddingBottom: '3rem', position: 'relative' }}>
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
          border: faceInFrame ? '2px solid #247A48' : '2px solid #E8A23A',
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

          {!faceInFrame && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(217, 119, 6, 0.95)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '3px 6px',
                textAlign: 'center',
              }}
            >
              Align Face in Camera
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

        {/* Timer Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: timeLeftSeconds < 180 ? '#FCF0F2' : '#F0F7F4',
            color: timeLeftSeconds < 180 ? '#C83E4D' : '#07866A',
            border: `1px solid ${timeLeftSeconds < 180 ? '#F7D4D7' : '#DFE8E1'}`,
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '1.25rem',
          }}
        >
          <Clock size={20} />
          <span>{formatTime(timeLeftSeconds)}</span>
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

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
              className="btn btn-secondary btn-sm"
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {currentQuestionIndex < assessment.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="btn btn-primary btn-sm"
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ fontWeight: 700 }}
                >
                  {submitting ? 'Submitting Answers...' : 'Finish & Submit Exam'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentRunnerPage;
