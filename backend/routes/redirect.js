const express = require('express');
const router = express.Router();
const axios = require('axios');
const Url = require('../models/Url');
const Click = require('../models/Click');

// @route   GET /:shortcode
// @desc    Redirect to original URL and track analytics
router.get('/:shortcode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortcode });

    if (url) {
      // Check expiration
      if (url.expiryDate && new Date() > new Date(url.expiryDate)) {
        return res.status(410).send('This link has expired.');
      }

      // Track analytics
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      let locationData = { country: 'Unknown', region: 'Unknown', city: 'Unknown' };

      // Geolocation lookup
      // Since it's a free API, don't block the redirect if it fails
      try {
        const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 2000 });
        if (geoResponse.data.status === 'success') {
          locationData = {
            country: geoResponse.data.country,
            region: geoResponse.data.regionName,
            city: geoResponse.data.city
          };
        }
      } catch (err) {
        console.error('Geolocation error:', err.message);
      }

      let deviceType = 'Desktop';
      if (req.useragent.isMobile) deviceType = 'Mobile';
      if (req.useragent.isTablet) deviceType = 'Tablet';

      const click = new Click({
        urlId: url._id,
        ip,
        location: locationData,
        device: deviceType,
        browser: req.useragent.browser
      });

      await click.save();

      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).send('No URL found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
