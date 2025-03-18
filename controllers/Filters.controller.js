const ServiceModel = require("../models/Service");
const jobs = require("../models/Job");
const resume = require("../models/Resume");
const mongoose = require("mongoose");

const USER_TYPES = {
  CANDIDATE: "Candidate",
  COMPANY: "Company",
};

// Define reusable license types
const LICENSE_TYPES = {
  M: { label: "M" },
  A1: { label: "A1" },
  A2: { label: "A2" },
  A: { label: "A" },
  B1: { label: "B1" },
  B: { label: "B" },
  C1: { label: "C1" },
  C: { label: "C" },
  D1: { label: "D1" },
  D: { label: "D" },
  BE: { label: "BE" },
  C1E: { label: "C1E" },
  CE: { label: "CE" },
  D1E: { label: "D1E" },
  DE: { label: "DE" },
  F: { label: "F" },
  G: { label: "G" },
};

// Define base filters common to all users
const BASE_FILTERS = {
  location: {
    category: "location",
    label: "Location",
    type: "text",
    defaultOptions: {}, // Will be populated dynamically
  },
  history: {
    category: "history",
    label: "Time Period",
    type: "radio",
    defaultOptions: {
      "last-hour": { label: "Last Hour" },
      today: { label: "Today" },
      "last-24": { label: "Last 24 Hours" },
      "last-3-days": { label: "Last 3 Days" },
      "last-week": { label: "Last Week" },
      "last-month": { label: "Last Month" },
    },
  },
};

// Define filters for Candidates
const CANDIDATE_FILTERS = {
  jobType: {
    category: "working",
    label: "Job Type",
    type: "checkbox",
    defaultOptions: {
      Full_Time: { label: "Full Time" },
      Part_Time: { label: "Part Time" },
      Internship: { label: "Internship" },
      Temporary_Job: { label: "Temporary Job" },
    },
  },
  licenseType: {
    category: "position",
    label: "License Type",
    type: "checkbox",
    defaultOptions: LICENSE_TYPES,
  },
  srcType: {
    category: "certificates",
    label: "SRC Requirements",
    type: "checkbox",
    defaultOptions: {
      src1: { label: "SRC 1" },
      src2: { label: "SRC 2" },
      src3: { label: "SRC 3" },
      src4: { label: "SRC 4" },
    },
  },
  certificates: {
    category: "certificates",
    label: "Additional Certificates",
    type: "checkbox",
    defaultOptions: {
      code95: { label: "Code 95 Document" },
      adr: { label: "ADR License" },
      psikoteknik: { label: "Psychotechnical" },
      myk: { label: "MYK Certificate" },
    },
  },
  additionalTraining: {
    category: "training",
    label: "Additional Training",
    type: "checkbox",
    defaultOptions: {
      blindSpot: { label: "Blind Spot Training" },
      safeDriving: { label: "Safe Driving Training" },
      fuelEconomy: { label: "Fuel Economy Training" },
    },
  },
};

// Define filters for Companies
const COMPANY_FILTERS = {
  experience: {
    category: "experience",
    label: "Experience",
    type: "radio",
    defaultOptions: {
      "0-1": { label: "0-1 Year" },
      "1-3": { label: "1-3 Years" },
      "3-5": { label: "3-5 Years" },
      "5-10": { label: "5-10 Years" },
      "10+": { label: "10+ Years" },
    },
  },
  licenseType: {
    category: "position",
    label: "License Type",
    type: "checkbox",
    defaultOptions: LICENSE_TYPES,
  },
  additionalTraining: {
    category: "training",
    label: "Additional Training",
    type: "checkbox",
    defaultOptions: {
      blindSpot: { label: "Blind Spot Training" },
      safeDriving: { label: "Safe Driving Training" },
      fuelEconomy: { label: "Fuel Economy Training" },
    },
  },
};

// Function to get dynamic filters based on user type
const getFilterOptions = async (userType) => {
  // Fetch available services dynamically
  const servicesList = await ServiceModel.find({}).select("serviceName");

  // Map services to a checkbox format
  const servicesFilter = {
    category: "services",
    label: "Available Services",
    type: "checkbox",
    defaultOptions: Object.fromEntries(
      servicesList.map((service) => [
        service._id,
        { label: service.serviceName },
      ])
    ),
  };

  // Determine filters based on user type
  if (userType === USER_TYPES.CANDIDATE) {
    return { ...BASE_FILTERS, ...CANDIDATE_FILTERS, services: servicesFilter };
  } else if (userType === USER_TYPES.COMPANY) {
    return { ...BASE_FILTERS, ...COMPANY_FILTERS };
  } else {
    throw new Error("Invalid user type");
  }
};

// Controller to get filters
const getFilters = async (req, res) => {
  try {
    const { userType } = req.query;
    console.log("userType", userType);

    if (!userType) {
      return res.status(400).json({
        success: false,
        message: "User type is required",
      });
    }

    // Get filters based on user type
    const filters = await getFilterOptions(userType);

    return res.status(200).json({
      success: true,
      filters: filters,
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching filters",
      error: error.message,
    });
  }
};

// // Controller to apply filters
const applyFilters = async (req, res) => {
  try {
    const { userType, filters } = req.body;

    if (!userType) {
      return res.status(400).json({
        success: false,
        message: "User type and filters are required",
      });
    }

    const results = await getFilteredJobs(filters, userType);

    return res.status(200).json({
      success: true,
      results: results,
    });
  } catch (error) {
    console.error("Error applying filters:", error);
    return res.status(500).json({
      success: false,
      message: "Error applying filters",
      error: error.message,
    });
  }
};

const getFilteredJobs = async (filters, userType, page = 1, limit = 10) => {
  try {
    const matchStage = buildQueryFromFilters(filters);

    const pipeline = [
      { $match: matchStage },
      { $sort: { publishedDate: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceDetails",
        },
      },
      {
        $project: {
          jobTitle: 1,
          jobDescription: 1,
          companyImage: 1,
          companyName: 1,
          jobType: 1,
          rangeOfSalary: 1,
          jobLocation: 1,
          isSrc1: 1,
          licenseType: 1,
          isSrc2: 1,
          isSrc3: 1,
          isSrc4: 1,
          psikoteknik: 1,
          adrDrivingLicence: 1,
          isCode95Document: 1,
          tcNumber: 1,
          firstName: 1,
          lastName: 1,
          age: 1,
          email: 1,
          serviceDetails: { name: 1 },
        },
      },
    ];

    if (userType === USER_TYPES.CANDIDATE) {
      console.log("CandidateJobs");
      return await jobs.aggregate(pipeline);
    }

    return await resume.aggregate(pipeline);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Helper function to build MongoDB query from filters
const buildQueryFromFilters = (filters) => {
  const matchStage = {};

  const filterMapping = {
    services: (value) => ({
      service: { $in: value.map((id) => new mongoose.Types.ObjectId(id)) },
    }),
    jobType: (value) => ({
      jobType: { $in: value.map((job) => job.replace("_", " ")) },
    }),

    licenseType: (value) => ({
      licenseType: { $in: value },
    }),
    certificates: (value) => {
      const certConditions = value
        .map((cert) => {
          if (cert === "code95") return { isCode95Document: true };
          if (cert === "adr") return { adrDrivingLicence: { $gt: 0 } };
          return null;
        })
        .filter(Boolean); // Remove null values

      return certConditions.length ? { $or: certConditions } : null;
    },
    srcType: (value) => {
      const srcConditions = value
        .map((src) => {
          if (src === "src1") return { isSrc1: true };
          if (src === "src2") return { isSrc2: true };
          if (src === "src3") return { isSrc3: true };
          if (src === "src4") return { isSrc4: true };
          return null;
        })
        .filter(Boolean);

      return srcConditions.length ? { $or: srcConditions } : null;
    },
    additionalTraining: (value) => {
      const trainingConditions = value
        .map((training) => {
          if (training === "blindSpot") return { isBlindSpotTraining: true };
          if (training === "safeDriving")
            return { isSafeDrivingTraining: true };
          if (training === "fuelEconomy")
            return { isFuelEconomyTraining: true };
          return null;
        })
        .filter(Boolean);

      return trainingConditions.length ? { $or: trainingConditions } : null;
    },
    experience: (value) => {
      const experienceMap = {
        "0-1": { requiredExperience: { $gte: 0, $lte: 1 } },
        "1-3": { requiredExperience: { $gte: 1, $lte: 3 } },
        "3-5": { requiredExperience: { $gte: 3, $lte: 5 } },
        "5-10": { requiredExperience: { $gte: 5, $lte: 10 } },
        "10+": { requiredExperience: { $gte: 10 } },
      };

      return experienceMap[value] || null;
    },
    history: (value) => {
      const now = new Date();
      const historyMap = {
        "last-hour": new Date(now.getTime() - 60 * 60 * 1000),
        today: new Date(now.setHours(0, 0, 0, 0)),
        "last-24": new Date(now.getTime() - 24 * 60 * 60 * 1000),
        "last-3-days": new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        "last-week": new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        "last-month": new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };

      return historyMap[value]
        ? { publishedDate: { $gte: historyMap[value] } }
        : null;
    },
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value?.length && filterMapping[key]) {
      Object.assign(matchStage, filterMapping[key](value));
    }
  });

  return matchStage;
};

module.exports = { getFilters, applyFilters };
