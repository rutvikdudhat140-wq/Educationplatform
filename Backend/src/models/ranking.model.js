import mongoose from "mongoose";

const indicatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
    },
    scoreOutOf: {
      type: Number,
    },
  },
  { _id: false }
);

const trendSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
    },
    indiaRank: {
      type: String,
      default: "",
    },
    globalRank: {
      type: String,
      default: "",
    },
    rank: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const parameterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
    },
  },
  { _id: false }
);

const rankingSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    rankingBody: {
      type: String,
      required: true,
    },

    rankingName: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      default: "",
    },

    rankType: {
      type: String,
      enum: ["Numeric", "Range"],
      default: "Numeric",
    },

    rank: {
      type: Number,
    },

    rankFrom: {
      type: Number,
    },

    rankTo: {
      type: Number,
    },

    score: {
      type: Number,
    },

    scoreOutOf: {
      type: Number,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    indicators: {
      type: [indicatorSchema],
      default: [],
    },

    trend: {
      type: [trendSchema],
      default: [],
    },

    parameters: {
      type: [parameterSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ranking", rankingSchema);
