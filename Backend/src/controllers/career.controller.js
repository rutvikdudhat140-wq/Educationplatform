import Career from '../models/career.model.js';
import Course from '../models/course.model.js';



export const createCareer = async (req, res) => {
  try {
    const career = await Career.create({
      ...req.body,
      isActive: req.body.isActive ?? true,
      status: req.body.status || 'Active',
    })
    res.status(201).json({
      message: "career created successfully",
      career,
    })
  } catch (error) {

  }
}

export const getCareers = async (req, res) => {
  try {
    const filter = {};

    if (req.query.isActive && req.query.isActive !== 'all') {
      filter.isActive = req.query.isActive === 'true';
    }

    if (req.query.stream) {
      filter.stream = req.query.stream;
    }

    if (req.query.course) {
      filter.relatedCourses = req.query.course;
    }

    const careers = await Career.find(filter).populate('relatedCourses', 'name');

    res.status(200).json({
      careers,
    });
  } catch (error) {
  }
};

export const getCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        message: 'Career not found',
      });
    }

    let relatedCourses = [];

    if (career.relatedCourses?.length) {
      relatedCourses = await Course.find({
        _id: { $in: career.relatedCourses },
      });
    }

    res.status(200).json({
      career,
      relatedCourses,
    });
  } catch (error) {
  }
};

export const updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(
      req.params.id,
      req.body,
    );

    if (!career) {
      return res.status(404).json({
        message: 'Career not found',
      });
    }

    res.status(200).json({
      career,
    });
  } catch (error) {
  }
};



export const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);

    if (!career) {
      return res.status(404).json({
        message: 'Career not found'
      })
    }
    res.status(200).json({
      message: 'career deleted successfully',
      career,
    })
  } catch (error) {

  }
}
