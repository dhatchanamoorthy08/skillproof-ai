const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'coding_concept', 'debug_fix'],
    default: 'multiple_choice',
  },
  options: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],
  codeSnippet: {
    type: String,
    default: '',
  },
  explanation: {
    type: String,
    default: '',
  },
  points: {
    type: Number,
    default: 10,
  },
  skillTag: {
    type: String,
    required: true,
  },
});

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      enum: [
        'Full Stack Development',
        'Frontend Development',
        'Backend Development',
        'Data Structures & Algorithms',
        'Cloud & DevOps',
        'AI & Machine Learning',
      ],
    },
    description: {
      type: String,
      default: '',
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 20,
    },
    passingScorePercentage: {
      type: Number,
      default: 70,
    },
    primarySkills: [String],
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    questions: [questionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
