const express = require('express');
const Doubt = require('../models/Doubt');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// All doubt routes require login
router.use(protect);

// @route  POST /api/doubts
// @desc   Student asks a new doubt
router.post('/', requireRole('student'), async (req, res) => {
  try {
    const { subject, title, text } = req.body;
    if (!subject || !title || !text) {
      return res.status(400).json({ message: 'subject, title and text are required' });
    }

    const doubt = await Doubt.create({
      student: req.user.id,
      studentName: req.user.name,
      subject,
      title,
      text,
    });

    res.status(201).json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating doubt' });
  }
});

// @route  GET /api/doubts
// @desc   Student -> own doubts. Faculty -> all doubts (optionally filter by status/subject)
router.get('/', async (req, res) => {
  try {
    const { status, subject } = req.query;
    const filter = {};

    if (req.user.role === 'student') {
      filter.student = req.user.id;
    }
    if (status) filter.status = status;
    if (subject) filter.subject = subject;

    const doubts = await Doubt.find(filter).sort({ createdAt: -1 });
    res.json(doubts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching doubts' });
  }
});

// @route  GET /api/doubts/:id
router.get('/:id', async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    if (req.user.role === 'student' && String(doubt.student) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching doubt' });
  }
});

// @route  POST /api/doubts/:id/reply
// @desc   Faculty replies to a doubt
router.post('/:id/reply', requireRole('faculty'), async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Reply text is required' });

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    doubt.replies.push({
      faculty: req.user.id,
      facultyName: req.user.name,
      text,
    });
    doubt.status = 'resolved';
    await doubt.save();

    res.status(201).json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error posting reply' });
  }
});

// @route  PATCH /api/doubts/:id/status
// @desc   Faculty can reopen/mark a doubt
router.patch('/:id/status', requireRole('faculty'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['open', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const doubt = await Doubt.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
    res.json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating status' });
  }
});

module.exports = router;
