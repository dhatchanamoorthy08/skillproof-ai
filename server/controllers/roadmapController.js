const mongoose = require('mongoose');
const Roadmap = require('../models/Roadmap');
const StudentRoadmapProgress = require('../models/StudentRoadmapProgress');
const roadmapsData = require('../data/roadmapsData');
const { fallbackRoadmaps, fallbackStudentRoadmapProgress, saveStore } = require('../services/fallbackStore');

// Helper to count total topics in a roadmap
const getRoadmapTotals = (roadmap) => {
  let totalTopics = 0;
  let totalModules = 0;
  (roadmap.levels || []).forEach((lvl) => {
    (lvl.modules || []).forEach((mod) => {
      totalModules++;
      totalTopics += (mod.topics || []).length;
    });
  });
  return { totalTopics, totalModules };
};

// Helper to find a topic and its parent module across all levels
const findTopicInRoadmap = (roadmap, topicId) => {
  for (const lvl of roadmap.levels || []) {
    for (const mod of lvl.modules || []) {
      const topic = (mod.topics || []).find((t) => t.topicId === topicId);
      if (topic) {
        return { topic, module: mod, level: lvl };
      }
    }
  }
  return null;
};

// Helper to find the recommended next topic based on completed topics
const calculateNextTopic = (roadmap, completedTopicIds = []) => {
  const completedSet = new Set(completedTopicIds);
  for (const lvl of roadmap.levels || []) {
    for (const mod of lvl.modules || []) {
      for (const t of mod.topics || []) {
        if (!completedSet.has(t.topicId)) {
          return {
            topicId: t.topicId,
            title: t.title,
            moduleId: mod.moduleId,
            moduleTitle: mod.title,
            level: lvl.level,
          };
        }
      }
    }
  }
  return null; // All topics completed
};

// @desc    Get all published career roadmaps
// @route   GET /api/v1/roadmaps
// @access  Public / Student
const getRoadmaps = async (req, res, next) => {
  try {
    let roadmaps = [];
    if (mongoose.connection.readyState === 1) {
      roadmaps = await Roadmap.find({ status: 'published' }).select('-levels.modules.topics.studyMaterial');
      if (!roadmaps || roadmaps.length === 0) {
        roadmaps = fallbackRoadmaps;
      }
    } else {
      roadmaps = fallbackRoadmaps.filter((r) => r.status === 'published');
    }

    const summaryList = roadmaps.map((r) => {
      const { totalTopics, totalModules } = getRoadmapTotals(r);
      return {
        slug: r.slug,
        title: r.title,
        description: r.description,
        category: r.category,
        icon: r.icon,
        estimatedDuration: r.estimatedDuration,
        status: r.status,
        requiredSkills: r.requiredSkills || [],
        levelsCount: (r.levels || []).length,
        totalModules,
        totalTopics,
        finalProjectTitle: r.finalProject?.title || '',
      };
    });

    res.json({
      success: true,
      count: summaryList.length,
      roadmaps: summaryList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single roadmap details by slug
// @route   GET /api/v1/roadmaps/:slug
// @access  Public / Student
const getRoadmapBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let roadmap = null;

    if (mongoose.connection.readyState === 1) {
      roadmap = await Roadmap.findOne({ slug });
      if (!roadmap) {
        roadmap = fallbackRoadmaps.find((r) => r.slug === slug);
      }
    } else {
      roadmap = fallbackRoadmaps.find((r) => r.slug === slug);
    }

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: `Career roadmap '${slug}' not found.`,
      });
    }

    const { totalTopics, totalModules } = getRoadmapTotals(roadmap);

    res.json({
      success: true,
      roadmap: {
        ...roadmap.toObject ? roadmap.toObject() : roadmap,
        totalTopics,
        totalModules,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full topic study notes, code examples & verified free courses
// @route   GET /api/v1/roadmaps/:slug/topics/:topicId
// @access  Public / Student
const getTopicDetails = async (req, res, next) => {
  try {
    const { slug, topicId } = req.params;
    let roadmap = null;

    if (mongoose.connection.readyState === 1) {
      roadmap = await Roadmap.findOne({ slug });
      if (!roadmap) {
        roadmap = fallbackRoadmaps.find((r) => r.slug === slug);
      }
    } else {
      roadmap = fallbackRoadmaps.find((r) => r.slug === slug);
    }

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found.' });
    }

    const match = findTopicInRoadmap(roadmap, topicId);
    if (!match) {
      return res.status(404).json({ success: false, message: `Topic '${topicId}' not found in roadmap.` });
    }

    res.json({
      success: true,
      roadmapTitle: roadmap.title,
      roadmapSlug: roadmap.slug,
      level: match.level.level,
      levelTitle: match.level.title,
      module: {
        moduleId: match.module.moduleId,
        title: match.module.title,
        description: match.module.description,
      },
      topic: match.topic,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in student's learning progress for a roadmap
// @route   GET /api/v1/roadmaps/:slug/progress
// @access  Private (Student)
const getStudentProgress = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const studentId = req.user._id.toString();

    let roadmap = null;
    if (mongoose.connection.readyState === 1) {
      roadmap = await Roadmap.findOne({ slug });
    }
    if (!roadmap) {
      roadmap = fallbackRoadmaps.find((r) => r.slug === slug);
    }

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found.' });
    }

    const { totalTopics, totalModules } = getRoadmapTotals(roadmap);

    let progress = null;
    if (mongoose.connection.readyState === 1) {
      progress = await StudentRoadmapProgress.findOne({ student: studentId, roadmapSlug: slug });
    } else {
      const studentMap = fallbackStudentRoadmapProgress[studentId] || {};
      progress = studentMap[slug] || null;
    }

    const completedTopics = progress?.completedTopics || [];
    const completedModules = progress?.completedModules || [];
    const progressPercentage = totalTopics > 0 ? Math.round((completedTopics.length / totalTopics) * 100) : 0;
    const nextTopic = calculateNextTopic(roadmap, completedTopics);

    res.json({
      success: true,
      progress: {
        roadmapSlug: slug,
        completedTopics,
        completedModules,
        completedCount: completedTopics.length,
        totalTopics,
        totalModules,
        progressPercentage,
        lastActiveTopicId: progress?.lastActiveTopicId || '',
        lastActiveModuleId: progress?.lastActiveModuleId || '',
        nextTopic,
        exerciseSubmissionsCount: (progress?.exerciseSubmissions || []).length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle topic completion status (complete/incomplete)
// @route   POST /api/v1/roadmaps/:slug/progress/toggle-topic
// @access  Private (Student)
const toggleTopicCompletion = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { topicId } = req.body;
    const studentId = req.user._id.toString();

    if (!topicId) {
      return res.status(400).json({ success: false, message: 'Topic ID is required.' });
    }

    let roadmap = null;
    if (mongoose.connection.readyState === 1) {
      roadmap = await Roadmap.findOne({ slug });
    }
    if (!roadmap) {
      roadmap = fallbackRoadmaps.find((r) => r.slug === slug);
    }

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found.' });
    }

    const match = findTopicInRoadmap(roadmap, topicId);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Topic not found in roadmap.' });
    }

    const { totalTopics } = getRoadmapTotals(roadmap);

    if (mongoose.connection.readyState !== 1) {
      if (!fallbackStudentRoadmapProgress[studentId]) {
        fallbackStudentRoadmapProgress[studentId] = {};
      }
      let studentProgress = fallbackStudentRoadmapProgress[studentId][slug];
      if (!studentProgress) {
        studentProgress = {
          student: studentId,
          roadmapSlug: slug,
          completedTopics: [],
          completedModules: [],
          lastActiveTopicId: topicId,
          lastActiveModuleId: match.module.moduleId,
          progressPercentage: 0,
          exerciseSubmissions: [],
          status: 'in_progress',
        };
        fallbackStudentRoadmapProgress[studentId][slug] = studentProgress;
      }

      const idx = studentProgress.completedTopics.indexOf(topicId);
      if (idx > -1) {
        studentProgress.completedTopics.splice(idx, 1);
      } else {
        studentProgress.completedTopics.push(topicId);
      }

      studentProgress.lastActiveTopicId = topicId;
      studentProgress.lastActiveModuleId = match.module.moduleId;
      studentProgress.progressPercentage = totalTopics > 0 ? Math.round((studentProgress.completedTopics.length / totalTopics) * 100) : 0;
      if (studentProgress.progressPercentage === 100) {
        studentProgress.status = 'completed';
      }

      saveStore();

      return res.json({
        success: true,
        message: idx > -1 ? 'Topic marked as pending.' : 'Topic marked as completed!',
        progress: studentProgress,
      });
    }

    let progress = await StudentRoadmapProgress.findOne({ student: studentId, roadmapSlug: slug });
    if (!progress) {
      progress = new StudentRoadmapProgress({
        student: studentId,
        roadmapSlug: slug,
        completedTopics: [],
        completedModules: [],
        lastActiveTopicId: topicId,
        lastActiveModuleId: match.module.moduleId,
      });
    }

    const idx = progress.completedTopics.indexOf(topicId);
    if (idx > -1) {
      progress.completedTopics.splice(idx, 1);
    } else {
      progress.completedTopics.push(topicId);
    }

    progress.lastActiveTopicId = topicId;
    progress.lastActiveModuleId = match.module.moduleId;
    progress.progressPercentage = totalTopics > 0 ? Math.round((progress.completedTopics.length / totalTopics) * 100) : 0;
    if (progress.progressPercentage === 100) {
      progress.status = 'completed';
    }

    await progress.save();

    res.json({
      success: true,
      message: idx > -1 ? 'Topic marked as pending.' : 'Topic marked as completed!',
      progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit practical exercise solution
// @route   POST /api/v1/roadmaps/:slug/progress/save-exercise
// @access  Private (Student)
const submitExercise = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { topicId, exerciseId, code } = req.body;
    const studentId = req.user._id.toString();

    if (!topicId || !exerciseId) {
      return res.status(400).json({ success: false, message: 'Topic ID and Exercise ID are required.' });
    }

    if (mongoose.connection.readyState !== 1) {
      if (!fallbackStudentRoadmapProgress[studentId]) {
        fallbackStudentRoadmapProgress[studentId] = {};
      }
      let studentProgress = fallbackStudentRoadmapProgress[studentId][slug];
      if (!studentProgress) {
        studentProgress = {
          student: studentId,
          roadmapSlug: slug,
          completedTopics: [],
          completedModules: [],
          lastActiveTopicId: topicId,
          progressPercentage: 0,
          exerciseSubmissions: [],
        };
        fallbackStudentRoadmapProgress[studentId][slug] = studentProgress;
      }

      studentProgress.exerciseSubmissions.push({
        topicId,
        exerciseId,
        code: code || '',
        passed: true,
        submittedAt: new Date(),
      });

      // Auto-complete topic on exercise pass if not already completed
      if (!studentProgress.completedTopics.includes(topicId)) {
        studentProgress.completedTopics.push(topicId);
      }

      saveStore();

      return res.json({
        success: true,
        message: 'Exercise submitted and recorded successfully!',
      });
    }

    let progress = await StudentRoadmapProgress.findOne({ student: studentId, roadmapSlug: slug });
    if (!progress) {
      progress = new StudentRoadmapProgress({
        student: studentId,
        roadmapSlug: slug,
        completedTopics: [topicId],
        exerciseSubmissions: [],
      });
    }

    progress.exerciseSubmissions.push({
      topicId,
      exerciseId,
      code: code || '',
      passed: true,
      submittedAt: new Date(),
    });

    if (!progress.completedTopics.includes(topicId)) {
      progress.completedTopics.push(topicId);
    }

    await progress.save();

    res.json({
      success: true,
      message: 'Exercise submitted and recorded successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoadmaps,
  getRoadmapBySlug,
  getTopicDetails,
  getStudentProgress,
  toggleTopicCompletion,
  submitExercise,
};
