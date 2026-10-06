
import Ranking from "../models/ranking.model.js";
import Review from "../models/review.model.js";
import College from "../models/college.model.js";

export const getAllRankings = async (req, res) => {
  const rankings = await Ranking.find().populate("collegeId", "name");

  res.json({
    success: true,
    rankings,
  });
};


export const getRankingById = async (req, res) => {
  const ranking = await Ranking.findById(req.params.id)
    .populate("collegeId", "name");

  res.json({
    success: true,
    ranking,
  });
};


export const createRanking = async (req, res) => {
  const ranking = await Ranking.create(req.body);

  res.status(201).json({
    success: true,
    ranking,
  });
};


export const updateRanking = async (req, res) => {
  const ranking = await Ranking.findByIdAndUpdate(
    req.params.id,
    req.body,
  );

  res.json({
    success: true,
    ranking,
  });
};


export const deleteRanking = async (req, res) => {
  await Ranking.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Ranking deleted",
  });
};


export const getUserRankings = async (req, res) => {
  const rankings = await Ranking.find()
    .populate("collegeId", "_id name logo location");

  res.json({
    success: true,
    rankings,
  });
};


export const getRankingsByCollege = async (req, res) => {
  const rankings = await Ranking.find({
    collegeId: req.params.collegeId,
    status: "Active",
  })
    .sort({ year: -1, rank: 1 })
    .populate("collegeId", "name");

  res.json({
    success: true,
    rankings,
  });
};


export const getTopRatedColleges = async (req, res) => {
  const colleges = await Review.aggregate([
    {
      $match: {
        status: "approved",
      },
    },
    {
      $group: {
        _id: "$collegeId",
        averageRating: {
          $avg: "$ratings.overall",
        },
        reviewCount: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        averageRating: -1,
        reviewCount: -1,
      },
    },
    {
      $limit: 3,
    },
  ]);

  const data = await Promise.all(
    colleges.map(async (item, index) => {
      const college = await College.findById(item._id).select(
        "name logo location"
      );

      return {
        rank: index + 1,
        collegeId: college._id,
        collegeName: college.name,
        logo: college.logo,
        location: college.location,
        averageRating: Number(item.averageRating.toFixed(1)),
        reviewCount: item.reviewCount,
      };
    })
  );
  res.json({
    success: true,
    data,
  });
}
