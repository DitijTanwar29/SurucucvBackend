const Package = require("../models/Package");

exports.createPackage = async (req, res) => {
  try {
    const {
      packageName,
      packagePrice,
      discountedPrice,
      features,
      jobPostLimit,
      advertisingLimit,
      startDate,
      endDate,
      status,
    } = req.body;

    // validate data
    if (
      !packageName ||
      !packagePrice ||
      !discountedPrice ||
      !features ||
      !jobPostLimit ||
      !advertisingLimit
      // !startDate ||
      // !endDate
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (!status || status === undefined) {
      status = "Inactive";
    }

    // const newPackage = new Packages(req.body);
    const newPackage = await Package.create({
      packageName: packageName,
      packagePrice: packagePrice,
      discountedPrice: discountedPrice,
      features: features,
      jobPostLimit: jobPostLimit,
      advertisingLimit: advertisingLimit,
      startDate: startDate,
      endDate: endDate,
      status: status,
    });
    // await newPackage.save();
    return res.status(200).json({
      success: true,
      message: "Package created successfully.",
      data: newPackage,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update an existing advertising package
exports.updateAdvertisingPackage = async (req, res) => {
  try {
    const packageId = req.body.packageId;

    // Check if packageId is provided
    if (!packageId) {
      return res.status(400).json({
        success: false,
        message: "Package ID is required",
      });
    }

    console.log("log of package body:", req.body);
    console.log("log of packageId in body:", packageId);

    const updates = req.body;

    // Find the package by ID
    const package = await Package.findById(packageId);

    // Check if the package was found
    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    // Updating fields that are present in request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        package[key] = updates[key];
      }
    }

    await package.save();

    const updatedPackage = await Package.findById(packageId)
      // .populate("Service") // Uncomment if you have a relationship to populate
      .exec();

    return res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: updatedPackage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete an advertising package
exports.deleteAdvertisingPackage = async (req, res) => {
  try {
    //fetch package id from request
    const { packageId } = req.body;
    //validate the package
    const packagePresent = await Package.findById(packageId);

    if (!packagePresent) {
      return res.status(404).json({
        success: false,
        message: "Package not present",
      });
    }

    await Package.findByIdAndDelete(packageId);

    return res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.showAllPackages = async (req, res) => {
  try {
    const allPackages = await Package.find(
      {},
      {
        packageName: true,
        packagePrice: true,
        discountedPrice: true,
        status: true,
        features: true,
        jobPostLimit: true,
        advertisingLimit: true,
        features: true,
      }
    ).exec();

    return res.status(200).json({
      success: true,
      message: "Data for all packages fetched successfully.",
      data: allPackages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch package data",
    });
  }
};

exports.getPackageDetails = async (req, res) => {
  try {
    //get id
    const {packageId} = req.body;
    //find service details
    const packageDetails = await Package.find({_id: packageId })
      // .populate("jobs")
      .exec();
console.log('package details : ',packageDetails)
    //validation
    if (!packageDetails) {
      return res.staus(400).json({
        success: false,
        message: `Could not find the package with ${packageId}`,
      });
    }

    //return response
    return res.status(200).json({
      success: true,
      message: "Package details fetched successfully",
      data: packageDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getActivePackages = async (req, res) => {
  try {
    // Find all packages with status 'active'
    const activePackages = await Package.find({ status: "Active" });

    //validation
    if (!activePackages) {
      return res.staus(400).json({
        success: false,
        message: "Could not find the Active Packages",
      });
    }

    //return response
    return res.status(200).json({
      success: true,
      message: "Active Packages details fetched successfully",
      data: activePackages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePackageStatus = async (req, res) => {
  try {
    const { packageId } = req.body;
    const { status } = req.body;

    // Check if service exists
    const package = await Package.findById(packageId);
    if (!package) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }

    // Update package status
    package.status = status;
    await package.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Package status updated successfully",
        data: package,
      });
  } catch (error) {
    console.error("Error updating package status:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to update package status",
        error: error.message,
      });
  }
};
