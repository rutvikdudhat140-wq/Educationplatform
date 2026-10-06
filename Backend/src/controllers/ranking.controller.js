import Ranking from '../models/ranking.model.js';
import College from '../models/college.model.js';

// Admin: Get all rankings with filters
export const getAllRankings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.rankingBody) filter.rankingBody = req.query.rankingBody;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.year) filter.year = Number(req.query.year);
    if (req.query.status) filter.status = req.query.status;
    if (req.query.collegeId) filter.collegeId = req.query.collegeId;

    const rankings = await Ranking.find(filter).populate('collegeId', 'name location category').sort({ year: -1 });
    res.json({ success: true, rankings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get single ranking
export const getRankingById = async (req, res) => {
  try {
    const ranking = await Ranking.findById(req.params.id).populate('collegeId', 'name');
    if (!ranking) return res.status(404).json({ success: false, message: 'Ranking not found' });
    res.json({ success: true, ranking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Create ranking
export const createRanking = async (req, res) => {
  try {
    const ranking = await Ranking.create(req.body);
    res.status(201).json({ success: true, ranking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin: Update ranking
export const updateRanking = async (req, res) => {
  try {
    const ranking = await Ranking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ranking) return res.status(404).json({ success: false, message: 'Ranking not found' });
    res.json({ success: true, ranking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete ranking
export const deleteRanking = async (req, res) => {
  try {
    await Ranking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ranking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: Get rankings with filters (only Active)
export const getUserRankings = async (req, res) => {
  try {
    const filter = { status: 'Active' };
    if (req.query.rankingBody) filter.rankingBody = req.query.rankingBody;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.year) filter.year = Number(req.query.year);
    if (req.query.search) {
      const colleges = await College.find({ name: { $regex: req.query.search, $options: 'i' } }).select('_id');
      filter.collegeId = { $in: colleges.map(c => c._id) };
    }
    if (req.query.state || req.query.city) {
      const locationFilter = {};
      if (req.query.state) locationFilter['location.state'] = { $regex: req.query.state, $options: 'i' };
      if (req.query.city) locationFilter['location.city'] = { $regex: req.query.city, $options: 'i' };
      const colleges = await College.find(locationFilter).select('_id');
      if (filter.collegeId) {
        const existingIds = filter.collegeId.$in.map(id => id.toString());
        filter.collegeId = { $in: colleges.filter(c => existingIds.includes(c._id.toString())).map(c => c._id) };
      } else {
        filter.collegeId = { $in: colleges.map(c => c._id) };
      }
    }

    const rankings = await Ranking.find(filter).populate('collegeId', 'name location category logo').sort({ year: -1, rank: 1 });
    res.json({ success: true, rankings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: Get rankings for a specific college (only Active)
export const getRankingsByCollege = async (req, res) => {
  try {
    const rankings = await Ranking.find({ collegeId: req.params.collegeId, status: 'Active' }).sort({ year: -1 });
    res.json({ success: true, rankings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
