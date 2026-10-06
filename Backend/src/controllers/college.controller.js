import College from '../models/college.model.js';

export const createCollege = async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    }
    const college = await College.create(req.body);
    res.status(201).json({
      message: 'College created successfully',
      college,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getColleges = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.isTopCollege === 'true') {
      filter.isTopCollege = true;
    }
    const colleges = await College.find(filter);

    res.status(200).json({
      colleges,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompareColleges = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({
        message: 'College ids are required'
      });
    }
    const idArray = ids.split(',').slice(0, 2);
    const colleges = await College.find({
      _id: { $in: idArray },
    });
    res.status(200).json({
      success: true,
      colleges
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        message: 'College not found',
      });
    }
    res.status(200).json({
      college,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({
        message: 'College not found',
      });
    }
    res.status(200).json({
      message: 'College updated successfully',
      college,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return res.status(404).json({
        message: 'College not found',
      });
    }
    res.status(200).json({
      message: 'College deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
