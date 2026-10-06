import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Engineering'
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


    accreditations: {
      type: [String],
      default: [],
    },

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
      
        totalSemesters: {
          type: Number,
          default: 8,
        },

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
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        // Seeded documents were written with `collegeName`, so `name` comes back
        // empty and every consumer renders a blank heading.
        if (!ret.name) {
          ret.name = ret.collegeName || '';
        }
        delete ret.collegeName;

        // Same for images: `coverImageUrl` holds the real photo while
        // `coverImage` was stored empty, and `images[0]` is Google's favicon
        // proxy, which 404s for any domain it has no icon cached for.
        if (!ret.coverImage) {
          ret.coverImage = ret.coverImageUrl || '';
        }

        return ret;
      },
    },
  }
);

const College = mongoose.model('College', collegeSchema);

export default College;
