// const mongoose = require('mongoose');

// const AdsPackageSchema = new mongoose.Schema({
//     packageName: {
//         type: String,
//         required: true
//     },
//     packagePrice: {
//         type: Number,
//         required: true
//     },
//     discountedPrice: {
//         type: Number,
//         default: 0
//     },
//     features: {
//         type: [String],
//         required: true
//     },
//     jobPostLimit: {
//         type: Number,
//         required: true
//     },
//     advertisingLimit: {
//         type: Number,
//         required: true
//     },
//     status: {
//         type: String,
//         enum: ['Inctive','Active'],
//         default: 'Inactive'
//     },
//     resumeViews: {
//         type: Number,
//         required: true,
//     },
//     packageDuration: {
//         type: Number,
//         required: true,
//     },
//     paymentStatus: {
//         type: String,
//         enum: ['Unpurchased', 'Requested', 'Approved', 'Rejected'],
//         default: 'Unpurchased',
//     },
//     //add user obj id so that it gets enrolled when company purchased a pack
//     enrolledCompanies: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "CompanyProfile",
//         },
//     ],
// }, { timestamps: true });

// module.exports = mongoose.model('Package', AdsPackageSchema);


const mongoose = require('mongoose');

const AdsPackageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
  },
  packagePrice: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    default: 0,
  },
  features: {
    type: [String],
    required: true,
  },

  // Job & Ad Limits
  jobPostLimit: {
    type: Number,
    required: true,
  },
  advertisingLimit: {
    type: Number,
    required: true,
  },

  // Resume access
  resumeViews: {
    type: Number,
    required: true,
  },

  // Duration of the package validity in days
  packageDuration: {
    type: Number,
    required: true,
  },

  // Package visibility and payment state
  status: {
    type: String,
    enum: ['Inactive', 'Active'],
    default: 'Inactive',
  },
  paymentStatus: {
    type: String,
    enum: ['Unpurchased', 'Requested', 'Approved', 'Rejected'],
    default: 'Unpurchased',
  },

  // Companies enrolled in this package
  enrolledCompanies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyProfile',
    },
  ],

  // ✅ Enhanced Fields:

  // Total time (in days) ads can be published in this package
  totalAdPublicationTime: {
    type: Number,
    required: true,
    default: 0,
  },

  // Replaces homePageAppearances — how long ads are visible on homepage (in days)
  homePageVisibilityTime: {
    type: Number,
    required: true,
    default: 0,
  },

  // Homepage positions where ads can appear (e.g., ["Top Banner", "Sidebar"])
  homePagePositions: {
    type: [String],
    default: [],
  },

  // Whether this package allows access to the candidate pool
  candidatePoolAccess: {
    type: Boolean,
    default: false,
  },

  // Duration in days for which the candidate pool can be used
  candidatePoolAccessDuration: {
    type: Number,
    default: 0,
  },

  // Number of candidate profiles that can be viewed from the candidate pool
  candidatePoolViewLimit: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Package', AdsPackageSchema);
