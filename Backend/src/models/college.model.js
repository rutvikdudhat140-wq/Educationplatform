import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Engineering', 'MBA', 'Medical', 'Law'],
    },
    collegeType: {
      type: String,
      enum: ['Government', 'Private', 'Autonomous'],
      default: 'Private'
    },
    establishedYear: {
      type: Number,
    },
    universiy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University'
    },

    location: {
      city: {
        type: String,
        default: '',
      },
      state: {
        type: String,
        default: '',
      },
      country: {
        type: String,
        default: 'india',
      },
    },

    address: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },

    // Accreditations like NAAC A++, NBA, AICTE, UGC, NBA
    accreditations: {
      type: [String],
      default: [],
    },

    // Overall rating (e.g. 4.70)
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    highlights: {
      facultyStrength: {
        type: String,
        default: '',
      },
      campusSize: {
        type: String,
        default: '',
      },
      totalCourses: {
        type: String,
        default: '',
      },
    },
    facilities: {
      type: [String],
      default: [],
    },

    courses: [
      {
        courseName: {
          type: String,
          default: '',
        },
        specialization: {
          type: String,
          default: '',
        },
        duration: {
          type: String,
          default: '',
        },
        fees: {
          type: String,
          default: '',
        },
        eligibility: {
          type: String,
          default: '',
        },
        // Total number of semesters for this course
        totalSemesters: {
          type: Number,
          default: 8,
        },
        // Semester-wise breakdown
        semesters: [
          {
            semesterNumber: {
              type: Number,
            },
            semesterName: {
              type: String,
              default: '',
            },
            semesterFees: {
              type: String,
              default: '',
            },
            subjects: [
              {
                name: {
                  type: String,
                  default: '',
                },
                code: {
                  type: String,
                  default: '',
                },
                credits: {
                  type: Number,
                  default: 0,
                },
                type: {
                  type: String,
                  enum: ['Theory', 'Practical', 'Elective'],
                  default: 'Theory',
                },
              }
            ],
          }
        ],
      },
    ],

    admissions: {
      admissionDetails: {
        type: String,
        default: '',
      },
      entranceExams: {
        type: [String],
        default: [],
      },
      importantDates: {
        type: String,
        default: '',
      },
    },

    ranking: [
      {
        rankingBody: {
          type: String,
          required: true,
        },
        year: {
          type: Number,
          required: true,
        },
        rank: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          default: '',
        },
      },
    ],

    placements: [
      {
        year: {
          type: Number,
          required: true,
        },
        averagePackage: {
          type: String,
          default: '',
        },
        highestPackage: {
          type: String,
          default: '',
        },
        medianPackage: {
          type: String,
          default: '',
        },
        totalOffers: {
          type: Number,
          default: 0,
        },
        topRecruiters: {
          type: [String],
          default: [],
        },
        placementRate: {
          type: String,
          default: '',
        },
        description: {
          type: String,
          default: '',
        },
      },
    ],

    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    isTopCollege: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const College = mongoose.model('College', collegeSchema);

export default College;
