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
      resumeViews,
      packageDuration
    } = req.body;

    // validate data
    if (
      !packageName ||
      !packagePrice ||
      !discountedPrice ||
      !features ||
      !jobPostLimit ||
      !advertisingLimit ||
      !resumeViews || 
      !packageDuration
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
      resumeViews: resumeViews,
      packageDuration: packageDuration,
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
        resumeViews: true,
        packageDuration: true
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

// controllers/paymentController.js

const axios = require('axios');
// const xml2js = require('xml2js'); // Optional if you want to parse SOAP responses

// Placeholder: Replace with your actual admin phone number and credentials
const adminPhoneNumber = "5323047271";
const netgsmUsername = "2166066134";
const netgsmPassword = "W5-1vhsX";
const smsHeader = "ADRTURKLTD.";
const appKey = "01007a72af089606218e04d553a740f5";

// Handle payment confirmation and send SMS to admin
exports.confirmPayment = async (req, res) => {
  try {
    const { packageName, user, paymentDetails } = req.body;
    console.log("packageId from req.bpdy.props : ",packageName,"user from req body props : ",user)
    // Logic to verify payment details and save the payment information
    // Save to your database (e.g., Payments model) and mark payment as pending approval

    // Construct SOAP XML body for Netgsm API
    const message = `Payment received for Package Name: ${packageName} from User: ${user}. Please review and approve.`;
    const soapXML = `<?xml version="1.0"?>
      <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
           xmlns:xsd="http://www.w3.org/2001/XMLSchema"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <SOAP-ENV:Body>
            <ns3:smsGonder1NV2 xmlns:ns3="http://sms/">
                <username>${netgsmUsername}</username>
                <password>${netgsmPassword}</password>
                <header>${smsHeader}</header>
                <msg>${message}</msg>
                <gsm>${adminPhoneNumber}</gsm>
                <encoding>TR</encoding>
                <appkey>${appKey}</appkey>
            </ns3:smsGonder1NV2>
        </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>`;

    // Send the SOAP request using axios
    const response = await axios.post('http://soap.netgsm.com.tr:8080/Sms_webservis/SMS?wsdl', soapXML, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': ''
      }
    });

    // Handle response (Optional: use xml2js to parse the response)
    console.log('SMS Response:', response.data);

    // Return success message after sending SMS
    return res.status(200).json({ success: true, message: 'Payment confirmed. Admin notified via SMS.' });
  } catch (error) {
    console.error('Error confirming payment and sending SMS:', error);
    return res.status(500).json({ error: 'Error confirming payment.' });
  }
};

