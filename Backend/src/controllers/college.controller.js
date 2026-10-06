import College from "../models/college.model.js";

export const createCollege = async (req, res) => {
  try {
    const college = await College.create(req.body);

    res.status(201).json({
      message: "College created successfully",
      data: college
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const getColleges = async (req, res) => {
  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.isTopCollege === "true") {
    filter.isTopCollege = true;
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const total = await College.countDocuments(filter);

  const colleges = await College.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    colleges,
    page,
    totalPages: Math.ceil(total / limit),
    total,
    limit,
  });
};

export const getCompareColleges = async (req, res) => {
  const ids = req.query.ids;

  if (!ids) {
    return res.status(400).json({
      message: "College ids are required",
    });
  }

  const idArray = ids.split(",").slice(0, 2);

  const colleges = await College.find({
    _id: { $in: idArray },
  });

  res.json({
    success: true,
    colleges,
  });
};

export const getCollege = async (req, res) => {
  const college = await College.findById(req.params.id);

  if (!college) {
    return res.status(404).json({
      message: "College not found",
    });
  }

  res.json({
    college,
  });
};

export const updateCollege = async (req, res) => {
  const college = await College.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!college) {
    return res.status(404).json({
      message: "College not found",
    });
  }

  res.json({
    message: "College updated successfully",
    college,
  });
};

export const deleteCollege = async (req, res) => {
  const college = await College.findByIdAndDelete(req.params.id);

  if (!college) {
    return res.status(404).json({
      message: "College not found",
    });
  }

  res.json({
    message: "College deleted successfully",
  });
};
