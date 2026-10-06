import Course from '../models/course.model.js';
import Career from '../models/career.model.js';

export const addCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      isActive: req.body.isActive ?? true,
      status: req.body.status || 'Active',
    });

    res.status(201).json({
      message: 'Course added successfully',
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const filter = {}
    if (req.query.level) {
      filter.level = req.query.level;
    }
    if (req.query.stream) {
      filter.stream = req.query.stream;
    }
    if (req.query.isActive && req.query.isActive !== 'all') {
      filter.isActive = req.query.isActive === 'true';
    }
    const courses = await Course.find(filter)
    res.status(200).json({
      data: courses,
      courses
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    let relatedCareers = [];

    if (course.relatedCareers?.length) {
      relatedCareers = await Career.find({
        _id: { $in: course.relatedCareers },
      });
    }

    res.status(200).json({
      data: course,
      course,
      relatedCareers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
    );

    if (!course) {
      return res.status(404).json({
        message: 'Course not found',
      });
    }

    res.status(200).json({
      message: 'Course updated successfully',
      data: course,
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: 'course not found'
      });
    }

    res.status(200).json({
      message: 'course deleted successfully',
      data: course,
      course
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}


export const getPopularCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      isPopular: true,
      isActive: true,
      status: 'Active',
    });

    const popularCourses = courses.slice(0, 6);

    res.status(200).json({
      data: popularCourses,
      courses: popularCourses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
