const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Url = require('../models/Url');
const Click = require('../models/Click');
const auth = require('../middleware/auth');

// @route   POST api/urls/shorten
router.post('/shorten', auth, async (req, res) => {
  const { originalUrl, customAlias, expiryDate } = req.body;

  let finalUrl = originalUrl;
  if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
    finalUrl = 'http://' + finalUrl;
  }

  try {
    new URL(finalUrl);
  } catch (err) {
    return res.status(400).json({ msg: 'Invalid URL' });
  }

  let shortCode = customAlias || shortid.generate();

  try {
    // Check if alias is taken
    let urlExists = await Url.findOne({ shortCode });
    if (urlExists) {
      return res.status(400).json({ msg: 'Alias already in use. Please choose another.' });
    }

    const newUrl = new Url({
      originalUrl: finalUrl,
      shortCode,
      userId: req.user.id,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    });

    await newUrl.save();
    res.json(newUrl);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/urls
router.get('/', auth, async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    // Fetch clicks for summary
    const urlsWithStats = await Promise.all(urls.map(async (url) => {
      const clickCount = await Click.countDocuments({ urlId: url._id });
      return { ...url._doc, clicks: clickCount };
    }));

    res.json(urlsWithStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/urls/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ msg: 'URL not found' });
    }

    // Check user
    if (url.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Click.deleteMany({ urlId: url._id }); // Delete associated clicks
    await Url.findByIdAndDelete(req.params.id);

    res.json({ msg: 'URL removed' });
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'URL not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
