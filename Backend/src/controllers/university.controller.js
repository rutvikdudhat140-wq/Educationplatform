import University from "../models/university.model.js";


export const createUniversity = async (req, res) => {
  try {
    const university = await University.create(req.body);

    res.status(201).json({
      success: true,
      message: "University created successfully",
      data: university,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getUniversities = async (req, res) => {
  try {
    const universities = await University.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: universities.length,
      data: universities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getUniversity = async (req, res) => {
  try {
    const university = await University.findById(req.params.id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    res.status(200).json({
      success: true,
      data: university,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateUniversity = async (req, res) => {
  try {
    const university = await University.findByIdAndUpdate(
      req.params.id,
      req.body,
    );

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "University updated successfully",
      data: university,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteUniversity = async (req, res) => {
  try {
    const university = await University.findByIdAndDelete(req.params.id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "University not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "University deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
