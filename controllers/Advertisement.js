// controllers/advertisementController.js
const Advertisement = require('../models/Advertisement');
const CompanyProfile = require('../models/CompanyProfile');
const Company = require('../models/CompanyProfile');
const User = require('../models/User')
// Controller: createAdvertisement
exports.createAdvertisement = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      startDate, 
      publicationPeriod, 
      homePageDuration 
    } = req.body;
    
    const userId = req.user.id;

    // Calculate end date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + publicationPeriod);

    // Check for company's approved package
    const company = await User.findById(userId)
      .populate({
        path: "companyProfile",
        select: "package paymentStatus",
        populate: { path: "package", select: "_id" }
      });
      console.log("company details id i.e profile id : ",company?.companyDetails)
      const companyProfileId = company?.companyDetails
      const companyProfile = await CompanyProfile.findById(companyProfileId)
      console.log("company profile :",companyProfile)
    if (!companyProfile){
      return res.status(404).json({
        success: false,
        message: "Company profile details not found",
    });
    }
    console.log("company package log : ",companyProfile?.package)
    if(companyProfile?.package.length === 0){
      return res.status(404).json({
          success: false,
          message:"Please get a package and try again."
      })
  }
  if (companyProfile?.paymentStatus !== 'Approved'){
      return res.status(400).json({
          success: false,
          message:"Payment status not approved, try again later."
      })
  }


    const activePackage = companyProfile?.package.find(pkg => pkg._id);
    if (!activePackage || companyProfile.paymentStatus !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: "No approved package found.",
      });
    }

    const newAd = new Advertisement({
      title,
      description,
      company: company._id,
      startDate,
      endDate,
      publicationPeriod,
      homePageDuration,
      package: activePackage._id,
      status: "Inactive", // Default status
    });

    await newAd.save();
    return res.status(201).json({ 
      success: true, 
      message: 'Advertisement created', 
      data: newAd 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// Update Advertisement
exports.updateAdvertisement = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      startDate, 
      publicationPeriod, 
      homePageDuration, 
      canViewCandidateContacts, 
      cvOpeningLimit, 
      candidateMatchFee 
    } = req.body;
    
    const userId = req.user.id;
    const adId = req.params.id;  // Assuming the advertisement ID is sent via the URL params

    // Find the company for this user
    const company = await User.findById(userId)
      .populate({
        path: "companyProfile",
        select: "package paymentStatus",
        populate: { path: "package", select: "_id" } // Populating package data
      });

    if (!company || !company.companyProfile) {
      return res.status(404).json({
        success: false,
        message: "Company details not found",
      });
    }

    if (company.companyProfile.package.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Please get a package and try again."
      });
    }

    if (company.companyProfile.paymentStatus !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: "Payment status not approved, try again later."
      });
    }

    const latestPackage = company.companyProfile.package[company.companyProfile.package.length - 1];

    // Calculate the new end date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + publicationPeriod);

    // Update the advertisement
    const updatedAd = await Advertisement.findByIdAndUpdate(
      adId,
      {
        title,
        description,
        startDate,
        endDate,
        publicationPeriod,
        homePageDuration,
        canViewCandidateContacts,
        cvOpeningLimit,
        candidateMatchFee,
        package: latestPackage._id,  // Update package ID if necessary
      },
      { new: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ success: false, message: "Advertisement not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Advertisement updated successfully.",
      data: updatedAd
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};



// Delete Advertisement
exports.deleteAdvertisement = async (req, res) => {
  try {
    const userId = req.user.id;
    const adId = req.params.id;  // Assuming the advertisement ID is sent via the URL params

    // Find the company for this user
    const company = await User.findById(userId)
      .populate({
        path: "companyProfile",
        select: "package paymentStatus",
        populate: { path: "package", select: "_id" } // Populating package data
      });

    if (!company || !company.companyProfile) {
      return res.status(404).json({
        success: false,
        message: "Company details not found",
      });
    }

    if (company.companyProfile.package.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Please get a package and try again."
      });
    }

    if (company.companyProfile.paymentStatus !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: "Payment status not approved, try again later."
      });
    }

    // Delete the advertisement
    const deletedAd = await Advertisement.findByIdAndDelete(adId);

    if (!deletedAd) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully."
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.showAllAds = async (req, res) => {
  try{

      const allAds = await Advertisement.find({}).sort({ publishedDate: -1 })
                                              // .populate({
                                              //     path: "company",
                                              //     populate: {
                                              //         path: "companyDetails",
                                              //     }
                                              // })
                                              .populate("company")
                                              .populate("package")
                                              .exec();
                                  
      return res.status(200).json({
          success:true,
          message:"Data for all ads fetched successfully.",
          data: allAds,
      })
  }catch(error){
      console.log(error);
      return res.status(500).json({
          success:false,
          message:"Cannot fetch ads data",
      });

  }
};

exports.getAdById = async (req, res) => {
  try {
    const { adId } = req.body;

    // Find the advertisement by ID and populate its related package details
    const advertisement = await Advertisement.findById(adId)
      .populate({
        path: 'package',
        select: 'packageName packagePrice discountedPrice features enrolledCompanies',
      })
      .exec();

      console.log(advertisement)
    if (!advertisement) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    // Access the populated package details
    const { package: packageDetails } = advertisement;

    // Check if package details exist before accessing nested fields
    if (!packageDetails) {
      return res.status(404).json({ error: "Package details not found for this advertisement" });
    }

    // Extract and format the package details
    const response = {
      adTitle: advertisement.title,
      description: advertisement.description,
      startDate: advertisement.startDate,
      endDate: advertisement.endDate,
      status: advertisement.status,
      package: {
        name: packageDetails.packageName,
        price: packageDetails.packagePrice,
        discountedPrice: packageDetails.discountedPrice,
        features: packageDetails.features,
        enrolledCompaniesCount: packageDetails.enrolledCompanies ? packageDetails.enrolledCompanies.length : 0,
      },
    };

    return res.status(200).json({ 
      success:true,
      message:"Advertisement details fetched successfully",
      data: response });
  } catch (error) {
    console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
  }
};

exports.approveAnAdPost = async (req, res) => {
  try {
  const { adId } = req.body;
  const { status } = req.body;

  // Check if service exists
  const ad = await Advertisement.findById(adId);
  if (!ad) {
    return res.status(404).json({ success: false, message: 'Advertisement not found' });
  }

  // Update job status
  ad.status = status;

  if(status ==="Active"){
      ad.publishedDate = Date.now();
  }
  await ad.save();

  return res.status(200).json({ success: true, message: 'Advertisement status updated successfully', data: ad });
} catch (error) {
  console.error('Error updating advertisement status:', error);
  return res.status(500).json({ success: false, message: 'Failed to update advertisement status', error: error.message });
}
};


exports.getActiveAds = async (req, res) => {
  try {
// Find all advertisements with status 'active'
const activeAds = await Advertisement.find({ status: 'Active' });


  //validation
  if(!activeAds) {
      return res.staus(400).json({
          success: false,
          message:"Could not find the Active Advertisements",
      });
  }

//return response
  return res.status(200).json({
      success:true,
      message:"Active Advertisements details fetched successfully",
      data: activeAds,
  });
}catch(error){
  console.log(error);
  return res.status(500).json({
      success:false,
      message:error.message,
  });
}
}