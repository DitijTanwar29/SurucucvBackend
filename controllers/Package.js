const Package = require("../models/Package");
const nodemailer = require("nodemailer")
const CompanyProfile = require("../models/CompanyProfile")

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
      packageDuration,
      paymentStatus
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

// Handle payment confirmation approval SMS to admin
// exports.paymentApprovalSms = async (req, res) => {
//   try {
//     const { packageName, user, packageId, companyProfileId } = req.body;
//     console.log("packageId from req.bpdy.props : ",packageName,"user from req body props : ",user)

//     company = CompanyProfile.findById(companyProfileId);
    
//     console.log(company)
//     const updatedStatus = "Requested";

//     const updatedPaymentStatus = await CompanyProfile.findByIdAndUpdate(companyProfileId,
//        {paymentStatus :updatedStatus},
//         {new:true},
//        )

//        await updatedPaymentStatus.save()

//        console.log(updatedPaymentStatus)

       
//       await CompanyProfile.findByIdAndUpdate(companyProfileId,
//         //add the package to the companyProfile schema 
//        {
//         $push: {
//             package: packageId,
//         }
//         },{new:true})
 
// //     const companyProfileDetails = await CompanyProfile.findById(profileId);

// //     console.log("userDetails",userDetails);

// //     const accountType = userDetails.accountType
// //     console.log("accountType : ",accountType)
// //     const user = await User.findByIdAndUpdate(id, {
// //       name,
// //       email, contactNumber,
// //       companyTitle,
// //       accountType
// //     })

// //     await user.save()
// // console.log("user :",user)


//     console.log("company.paymentStatus - ",company.paymentStatus)

//     // Logic to verify payment details and save the payment information
//     // Save to your database (e.g., Payments model) and mark payment as pending approval


//     // Construct SOAP XML body for Netgsm API
//     const message = `Payment received for Package Name: ${packageName} from User: ${user}. Please review and approve.`;
//     const soapXML = `<?xml version="1.0"?>
//       <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
//            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
//            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
//         <SOAP-ENV:Body>
//             <ns3:smsGonder1NV2 xmlns:ns3="http://sms/">
//                 <username>${netgsmUsername}</username>
//                 <password>${netgsmPassword}</password>
//                 <header>${smsHeader}</header>
//                 <msg>${message}</msg>
//                 <gsm>${adminPhoneNumber}</gsm>
//                 <encoding>TR</encoding>
//                 <appkey>${appKey}</appkey>
//             </ns3:smsGonder1NV2>
//         </SOAP-ENV:Body>
//       </SOAP-ENV:Envelope>`;

//     // Send the SOAP request using axios
//     const response = await axios.post('http://soap.netgsm.com.tr:8080/Sms_webservis/SMS?wsdl', soapXML, {
//       headers: {
//         'Content-Type': 'text/xml',
//         'SOAPAction': ''
//       }
//     });

//     // Handle response (Optional: use xml2js to parse the response)
//     console.log('SMS Response:', response.data);

//     // Return success message after sending SMS
//     return res.status(200).json({ success: true, message: 'Payment confirmed. Admin notified via SMS.',
//   data: updatedPaymentStatus });
//   } catch (error) {
//     console.error('Error confirming payment and sending SMS:', error);
//     return res.status(500).json({ error: 'Error confirming payment.' });
//   }
// };

exports.paymentApprovalSms = async (req, res) => {
  try {
    const { packageName, user, packageId, companyProfileId } = req.body;
    console.log("Package Name from req.body: ", packageName, "User from req body: ", user);

    // Find the company by its ID
    const company = await CompanyProfile.findById(companyProfileId);

    if (!company) {
      return res.status(404).json({ error: 'Company profile not found.' });
    }

    // Update payment status to 'Requested'
    const updatedPaymentStatus = await CompanyProfile.findByIdAndUpdate(
      companyProfileId,
      { 
        paymentStatus: "Requested",
        requestedPackage: packageId, // Store the requested package ID
      },      
      { new: true }
    );

    console.log("Updated Payment Status: ", updatedPaymentStatus);

    const updatedPaymentStatusInsidePack = await Package.findByIdAndUpdate(
      packageId,
      {
        paymentStatus: "Requested",
      },
      { new: true }
    );

    console.log("Updated Payment Status In Package: ", updatedPaymentStatusInsidePack);
    
    // // Push the package to the companyProfile schema (ensure 'package' is an array in the schema)
    // await CompanyProfile.findByIdAndUpdate(
    //   companyProfileId,
    //   {
    //     $push: {
    //       package: packageId,
    //     }
    //   },
    //   { new: true }
    // );

    // Create the message for SMS
    const message = `Payment received for Package Name: ${packageName} from User: ${user}. Please review and approve.`;

    // Construct SOAP XML body for Netgsm API
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

    // Handle response
    console.log('SMS Response:', response.data);

    // Return success message after sending SMS
    return res.status(200).json({
      success: true,
      message: 'Payment approval requested. Admin notified via SMS.',
      data: { updatedPaymentStatus, updatedPaymentStatusInsidePack }
  
    });
  } catch (error) {
    console.error('Error confirming payment and sending SMS:', error);
    return res.status(500).json({ error: 'Error confirming payment.' });
  }
};


// exports.approvePaymentRequest = async (req, res) => {
//   try {
//     const { companyId, packageId } = req.body;

//     // Find the company profile and update the payment status to 'Approved'
//     const updatedCompany = await CompanyProfile.findByIdAndUpdate(
//       companyId,
//       {
//         $addToSet: { package: packageId }, // Add the package to the array
//         paymentStatus: "Approved"
//       },
//       { new: true }
//     );

//     if (!updatedCompany) {
//       return res.status(404).json({ error: "Company not found" });
//     }

//     // Find the package and enroll the company
//     const updatedPackage = await Package.findByIdAndUpdate(
//       packageId,
//       {
//         $addToSet: { enrolledCompanies: companyId } // Add the company to enrolled companies
//       },
//       { new: true }
//     );

//     if (!updatedPackage) {
//       return res.status(404).json({ error: "Package not found" });
//     }

//     // Send approval email to the company
//     await sendApprovalEmail(updatedCompany.email, updatedCompany.name);

//     // Return success response
//     return res.status(200).json({
//       success:true,
//        message: "Payment approved and company enrolled." });
//   } catch (error) {
//     console.error("Error approving payment request:", error);
//     return res.status(500).json({ error: "Error approving payment." });
//   }
// };

// exports.approvePaymentRequest = async (req, res) => {
//   try {
//     const { companyId, packageId } = req.body;

//     console.log("Approving Payment Request...");
//     console.log("Company ID:", companyId);
//     console.log("Package ID:", packageId);

//     // Update the company's payment status and add the package
//     const updatedCompany = await CompanyProfile.findByIdAndUpdate(
//       companyId,
//       {
//         $addToSet: { package: packageId }, // Add package ID to array
//         paymentStatus: "Approved",        // Update payment status
//       },
//       { new: true }
//     );

//     if (!updatedCompany) {
//       console.error("Company not found.");
//       return res.status(404).json({ error: "Company not found" });
//     }

//     console.log("Updated Company:", updatedCompany);

//     // Update the package to enroll the company
//     const updatedPackage = await Package.findByIdAndUpdate(
//       packageId,
//       {
//         $addToSet: { enrolledCompanies: companyId }, // Add company ID to array
//       },
//       { new: true }
//     );

//     if (!updatedPackage) {
//       console.error("Package not found.");
//       return res.status(404).json({ error: "Package not found" });
//     }

//     console.log("Updated Package:", updatedPackage);

//     // Send approval email
//     try {
//       await sendApprovalEmail(updatedCompany.email, updatedCompany.name);
//       console.log("Approval email sent successfully.");
//     } catch (emailError) {
//       console.error("Error sending approval email:", emailError);
//     }

//     // Respond with success
//     return res.status(200).json({
//       success: true,
//       message: "Payment approved and company enrolled.",
//       data: updatedCompany
//     });
//   } catch (error) {
//     console.error("Error approving payment request:", error);
//     return res.status(500).json({ error: "Error approving payment." });
//   }
// };


// USE THIS CONTROLLER AND CHECK THE 
//PACKAGEID IN ABOVE REQUESTAPPROVESMS CONTROLLER
//BCZ PACKID IS NOT STORING SO MAY BE THATS WHY AT THE TIME OF APPROVAL
// PACKID IS UNDEFINED AND UNABLE TO APPROVE BY ADMIN AT THAT TIME SO
//RESOLVE THIS THING 
exports.approvePaymentRequest = async (req, res) => {
  try {
    const { companyId, packageId } = req.body;

    console.log("Approving Payment Request...");
    console.log("Company ID:", companyId);
    console.log("Package ID:", packageId);

    // Validate company and package existence
    const company = await CompanyProfile.findById(companyId);
    const packageData = await Package.findById(packageId);

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    if (!packageData) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }


    // Check if payment status for the package is already approved
    //need to add some changes here if someone send more purchase request 
    //then what to do in this validation 
    if (packageData.paymentStatus === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Payment request is already approved for this package.",
      });
    }

    // Update the package with company enrollment and payment status
    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      {
        $addToSet: { enrolledCompanies: companyId }, // Add company to enrolledCompanies
        paymentStatus: "Approved", // Update payment status
      },
      { new: true }
    );

    // Update the company with the package reference and payment status
    const updatedCompany = await CompanyProfile.findByIdAndUpdate(
      companyId,
      {
        $addToSet: { package: packageId }, // Add package to the company
        paymentStatus: "Approved", // Update payment status
        requestedPackage: null,
      },
      { new: true }
    );

    console.log("Updated Company:", updatedCompany);
    console.log("Updated Package:", updatedPackage);

    // Send approval email (optional)
    try {
      await sendApprovalEmail(updatedCompany.email, updatedCompany.name);
      console.log("Approval email sent successfully.");
    } catch (emailError) {
      console.error("Error sending approval email:", emailError);
    }

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Payment approved, and company enrolled successfully.",
      data: { updatedCompany, updatedPackage },
    });
  } catch (error) {
    console.error("Error approving payment request:", error);
    return res.status(500).json({ success: false, message: "Error approving payment." });
  }
};
//code above is fine but new is updated with more validations 

// exports.approvePaymentRequest = async (req, res) => {
//   try {
//     const { companyId, packageId } = req.body;

//     console.log("Approving Payment Request...");
//     console.log("Company ID:", companyId);
//     console.log("Package ID:", packageId);

//     // Validate company and package existence
//     const company = await CompanyProfile.findById(companyId);
//     const packageData = await Package.findById(packageId);

//     if (!company) {
//       return res.status(404).json({ success: false, message: "Company not found" });
//     }

//     if (!packageData) {
//       return res.status(404).json({ success: false, message: "Package not found" });
//     }

//     // Check if the package is already approved for this company
//     if (packageData.enrolledCompanies.includes(companyId)) {
//       return res.status(400).json({
//         success: false,
//         message: "This package is already approved for the company.",
//       });
//     }

//     // Check if the company already has an active package and handle upgrades
//     const activePackages = await Package.find({
//       _id: { $in: company.package }, // Check the packages linked to the company
//       paymentStatus: "Approved",
//     });

//     if (activePackages.length > 0) {
//       // Handle the upgrade scenario
//       return res.status(400).json({
//         success: false,
//         message: "The company already has an active package. Please handle the upgrade scenario.",
//       });
//     }

//     // Approve the payment request
//     const updatedPackage = await Package.findByIdAndUpdate(
//       packageId,
//       {
//         $addToSet: { enrolledCompanies: companyId }, // Add company to enrolledCompanies
//         paymentStatus: "Approved", // Update payment status
//       },
//       { new: true }
//     );

//     // Update the company with the approved package reference
//     const updatedCompany = await CompanyProfile.findByIdAndUpdate(
//       companyId,
//       {
//         $addToSet: { package: packageId }, // Add package to the company
//         paymentStatus: "Approved", // Update payment status
//       },
//       { new: true }
//     );

//     console.log("Updated Company:", updatedCompany);
//     console.log("Updated Package:", updatedPackage);

//     // Send approval email (optional)
//     try {
//       await sendApprovalEmail(updatedCompany.email, updatedCompany.name);
//       console.log("Approval email sent successfully.");
//     } catch (emailError) {
//       console.error("Error sending approval email:", emailError);
//     }

//     // Respond with success
//     return res.status(200).json({
//       success: true,
//       message: "Payment approved, and company enrolled successfully.",
//       data: { updatedCompany, updatedPackage },
//     });
//   } catch (error) {
//     console.error("Error approving payment request:", error);
//     return res.status(500).json({ success: false, message: "Error approving payment." });
//   }
// };
// updated this api check chatgpt and remove above controller use new its 
//adding package id event after not approving second payment request or 3rd 4th 5tt

// exports.approvePaymentRequest = async (req, res) => {
//   try {
//     const { companyId, packageId } = req.body;

//     console.log("Approving Payment Request...");
//     console.log("Company ID:", companyId);
//     console.log("Package ID:", packageId);

//     // Validate company existence
//     const company = await CompanyProfile.findById(companyId);
//     if (!company) {
//       return res.status(404).json({ success: false, message: "Company not found." });
//     }

//     // Validate package existence
//     const packageData = await Package.findById(packageId);
//     if (!packageData) {
//       return res.status(404).json({ success: false, message: "Package not found." });
//     }

//     // Check if the package is already approved for this company
//     if (packageData.enrolledCompanies.includes(companyId)) {
//       return res.status(400).json({
//         success: false,
//         message: "This package is already approved for the company.",
//       });
//     }

//     // Check if the company already has an active package
//     const activePackages = await Package.find({
//       _id: { $in: company.package }, // Check the packages linked to the company
//       paymentStatus: "Approved",
//     });

//     if (activePackages.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "The company already has an active package. Please handle the upgrade scenario.",
//       });
//     }

//     // Proceed to approve payment
//     const updatedPackage = await Package.findByIdAndUpdate(
//       packageId,
//       {
//         $addToSet: { enrolledCompanies: companyId }, // Add company to enrolledCompanies
//         paymentStatus: "Approved", // Update payment status
//       },
//       { new: true }
//     );

//     // If package update fails, return an error
//     if (!updatedPackage) {
//       return res.status(400).json({
//         success: false,
//         message: "Error updating the package. Please try again.",
//       });
//     }

//     // Update the company profile only after package is successfully updated
//     const updatedCompany = await CompanyProfile.findByIdAndUpdate(
//       companyId,
//       {
//         $addToSet: { package: packageId }, // Add package to the company
//         paymentStatus: "Approved", // Update payment status
//       },
//       { new: true }
//     );

//     console.log("Updated Company:", updatedCompany);
//     console.log("Updated Package:", updatedPackage);

//     // Send approval email (optional)
//     try {
//       await sendApprovalEmail(updatedCompany.email, updatedCompany.name);
//       console.log("Approval email sent successfully.");
//     } catch (emailError) {
//       console.error("Error sending approval email:", emailError);
//     }

//     // Respond with success
//     return res.status(200).json({
//       success: true,
//       message: "Payment approved, and company enrolled successfully.",
//       data: { updatedCompany, updatedPackage },
//     });
//   } catch (error) {
//     console.error("Error approving payment request:", error);
//     return res.status(500).json({ success: false, message: "Error approving payment." });
//   }
// };



// Function to send approval email
const sendApprovalEmail = async (email, companyName) => {
  try{

    let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    secure: false,
  });
  console.log(email,"    ",companyName)
  console.log("inside send approval email function")
  let mailOptions = await transporter.sendMail({
    from: `"SurucuCv" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Payment Request Approved',
    text: `Dear ${companyName},\n\nYour payment request has been approved.\n\nThank you for choosing us.`
  });
  
  console.log(mailOptions.response);
  return mailOptions
}
catch (error){
  console.log(error.message)
  return error.message
}
};


// Controller for rejecting payment
exports.rejectPayment = async (req, res) => {
  try {
    const { companyId, packageId } = req.body;

    // Find the company profile and pop the package
    const updatedCompany = await CompanyProfile.findByIdAndUpdate(
      companyId,
      {
        $pull: { requestedPackage: packageId }, // Pop the package from the array
        paymentStatus: "Rejected"
      },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Send rejection email to the company
    await sendRejectionEmail(updatedCompany.email, updatedCompany.name);

    res.json({ message: 'Payment rejected and package removed.' });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    res.status(500).json({ error: 'Error rejecting payment.' });
  }
};

// Function to send rejection email
const sendRejectionEmail = async (email, companyName) => {
  // Use your email service provider to send the email
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    secure:false,
  });

  let mailOptions =  await transporter.sendMail({
    from: `"SurucuCv" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Payment Request Rejected',
    text: `Dear ${companyName},\n\nYour payment request has been rejected.\n\nThank you.`
  });
  
  console.log(mailOptions.response);
  return mailOptions
};


exports.getCompaniesWithRequestedStatus = async (req, res) => {
  try {
    // Fetch all companies where the paymentStatus is 'Requested'
    const companies = await CompanyProfile.find({ paymentStatus: "Requested" }).populate();

    console.log(companies)
    if (!companies) {
      return res.status(404).json({ message: "No companies found with payment status 'Requested'" });
    }

    res.status(200).json({
      success: true,
      message: "Companies fetched successfully with payment status as 'Requested' ",
      data:companies});
  } catch (error) {
    console.error("Error fetching companies with requested status:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// exports.getCompaniesWithRequestedStatus = async (req, res) => {
//   try {
//     // Fetch all companies where the paymentStatus is 'Requested'
//     const companies = await CompanyProfile.find({ paymentStatus: "Requested" }).populate("package"); // Populate package details

//     if (!companies) {
//       return res.status(404).json({ message: "No companies found with payment status 'Requested'" });
//     }

//     // Fetch the package details and include the package name
//     const companiesWithPackage = await Promise.all(
//       companies.map(async (company) => {
//         const packageDetails = await Package.findById(company.package); // Assuming 'company.package' holds the packageId
//         return {
//           ...company.toObject(), // Convert company document to plain JS object
//           packageName: packageDetails ? packageDetails.name : "N/A" // Include package name or fallback to 'N/A'
//         };
//       })
//     );

//     res.status(200).json({
//       success: true,
//       message: "Companies fetched successfully with payment status as 'Requested'",
//       data: companiesWithPackage
//     });
//   } catch (error) {
//     console.error("Error fetching companies with requested status:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };
