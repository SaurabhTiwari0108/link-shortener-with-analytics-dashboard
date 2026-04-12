const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const Click = require('../models/Click');
const auth = require('../middleware/auth');

// @route   GET api/analytics/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ msg: 'URL not found' });
    }

    if (url.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const clicks = await Click.find({ urlId: url._id }).sort({ createdAt: 1 });

    const totalClicks = clicks.length;
    
    // Calculate unique visitors by IP
    const uniqueIps = new Set(clicks.map(c => c.ip));
    const uniqueVisitors = uniqueIps.size;

    // Timeline data (group by date)
    const clicksOverTime = {};
    clicks.forEach(c => {
      const date = new Date(c.createdAt).toLocaleDateString();
      clicksOverTime[date] = (clicksOverTime[date] || 0) + 1;
    });

    // Devices breakdown
    const devices = {};
    clicks.forEach(c => {
      const device = c.device || 'Unknown';
      devices[device] = (devices[device] || 0) + 1;
    });

    // Location breakdown
    const locations = {};
    clicks.forEach(c => {
      const country = (c.location && c.location.country) || 'Unknown';
      locations[country] = (locations[country] || 0) + 1;
    });

    res.json({
      url,
      stats: {
        totalClicks,
        uniqueVisitors,
        clicksOverTime,
        devices,
        locations
      }
    });

  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'URL not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
