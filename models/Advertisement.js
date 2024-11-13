// Advertisement model
const mongoose = require('mongoose');
const { Schema } = mongoose;

const advertisementSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: {
    type: String,
    required: true,
},
  company: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }, // Derived from start date + publication period
  publicationPeriod: { type: Number, required: true }, // In days
  homePageDuration: { type: Number, default: 0 }, // Duration in days for homepage
  status: {
    type: String,
    enum: ["Active","Inactive"],
    default: "Inactive",
},
  // canViewCandidateContacts: { type: Boolean, default: false },
  // cvOpeningLimit: { type: Number, default: 0 }, // Packages like 20 CVs, 50 CVs
  // candidateMatchFee: { type: Boolean, default: false }, // Pay for matching candidates
  package: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  createdAt: { type: Date, default: Date.now },
  publishedDate: {
    type: Date,
}
});

module.exports = mongoose.model('Advertisement', advertisementSchema);
