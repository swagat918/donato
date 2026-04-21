const streamerService = require('../services/streamerService');

async function listStreamers(req, res) {
  const streamers = await streamerService.listStreamers();
  res.json({
    success: true,
    streamers
  });
}

async function getStreamer(req, res) {
  const streamer = await streamerService.getStreamerById(req.params.id);
  res.json({
    success: true,
    streamer
  });
}

module.exports = {
  listStreamers,
  getStreamer
};
