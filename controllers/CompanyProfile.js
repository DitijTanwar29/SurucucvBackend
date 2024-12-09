const CompanyProfile = require("../models/CompanyProfile");
const User = require("../models/User");
const Sector = require("../models/Sector")
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Job = require("../models/Job")
const Package = require("../models/Package")
const mongoose = require("mongoose");
exports.updateCompanyProfile = async (req, res) => {
    try{
        //get data
        const { 
        name="", email, position="", contactNumber, dateOfBirth="",
         companyTitle, sector, taxAdministration="",
          taxNumber, companyAddress="" } = req.body;

        // const profileImage = req.files.profileImage;
        // const coverImage = req.files.coverImage;
        console.log("name : ",name)
          //get userId
          const id = req.user.id;
        //validate data
        if(!name || !email || !position || !id){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        console.log("name",name);
        //find companyProfile
        const userDetails = await User.findById(id);
        const profileId = userDetails.companyDetails;
        const companyProfileDetails = await CompanyProfile.findById(profileId);

        console.log("userDetails",userDetails);

        const accountType = userDetails.accountType
        console.log("accountType : ",accountType)
        const user = await User.findByIdAndUpdate(id, {
          name,
          email, contactNumber,
          companyTitle,
          accountType
        })

        await user.save()
console.log("user :",user)

const sectorDetails = await Sector.findById(sector);
        if(!sectorDetails) {
            return res.status(404).json({
                success: false,
                message: 'Sector Details not found',
            });
        }
//add the service to the sector schema 
await Sector.findByIdAndUpdate(
  {_id: sector},
  {
      $push: {
          company: userDetails._id,
      }
  },
  {new:true},
);
        



        //update Company Profile 
        companyProfileDetails.name = name;
        companyProfileDetails.email = email;
        companyProfileDetails.position = position;
        companyProfileDetails.contactNumber = contactNumber;
        companyProfileDetails.dateOfBirth = dateOfBirth;
        companyProfileDetails.companyTitle = companyTitle;
        companyProfileDetails.sector = sector;
        companyProfileDetails.taxAdministration = taxAdministration;
        companyProfileDetails.taxNumber = taxNumber;
        companyProfileDetails.companyAddress = companyAddress;


        // companyProfileDetails.companyIcon = profilePic.secure_url;
        // companyProfileDetails.companyBackgroundIcon = coverPic.secure_url;

        await companyProfileDetails.save();

        //Find the updated user details
        const updatedUserDetails = await User.findById(id)
        .populate("companyDetails")
        .exec()
        //return response
        return res.status(200).json({
            success: true,
            updatedUserDetails,
            message:'Company Profile Updated Successfully',
        })
    }catch(error){
        console.log("error",error);
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Something went wrong while updating company profile."
        });
    }
}

//Todo both below are not tested yet 
// get all company profile details
exports.getCompanyDetails = async (req, res) => {
    try {
      const id = req.user.id
      const companyDetails = await User.findById(id)
        .populate("companyDetails")
        .populate("employees")
        .exec()
      console.log(companyDetails)
      res.status(200).json({
        success: true,
        message: "Company Data fetched successfully",
        data: companyDetails,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
} 


// Get Company List
exports.getAllCompanies = async (req, res) => {
    try {
      const allCourses = await Course.find(
        { status: "Published" },
        {
          courseName: true,
          price: true,
          thumbnail: true,
          instructor: true,
          ratingAndReviews: true,
          studentsEnrolled: true,
        }
      )
        .populate("instructor")
        .exec()
  
      return res.status(200).json({
        success: true,
        data: allCourses,
      })
    } catch (error) {
      console.log(error)
      return res.status(404).json({
        success: false,
        message: `Can't Fetch Course Data`,
        error: error.message,
      })
    }
}
//Delete Account
// exports.deleteAccount = async (req, res) => {
//   try {
//       // Get user ID
//       console.log("printing id", req.user.id);
//       const id = req.user.id;

//       // Validate user
//       const userDetails = await User.findById(id);
//       if (!userDetails) {
//           return res.status(404).json({
//               success: false,
//               message: 'User not found',
//           });
//       }

//       // Delete associated company profile
//       await CompanyProfile.findByIdAndDelete(userDetails.companyDetails);

//       // Delete associated jobs
//       const jobIds = userDetails.jobs;
//       if (jobIds && jobIds.length > 0) {
//           await Job.deleteMany({ _id: { $in: jobIds } });
//       }

//       // Remove jobs from user's jobs array
//       await User.findByIdAndUpdate(id, { $set: { jobs: [] } });

//       // Delete user
//       await User.findByIdAndDelete(id);

//       // Return response
//       return res.status(200).json({
//           success: true,
//           message: 'Company and associated jobs deleted successfully',
//       });

//   } catch (error) {
//       console.error(error);
//       return res.status(500).json({
//           success: false,
//           message: 'Company cannot be deleted successfully',
//       });
//   }
// };

exports.deleteAccount = async (req, res) => {
  try {
      // Get user ID
      console.log("printing id", req.user.id);
      const id = req.user.id;

      // Validate user
      const userDetails = await User.findById(id);
      if (!userDetails) {
          return res.status(404).json({
              success: false,
              message: 'User not found',
          });
      }

      // Delete associated company profile
      await CompanyProfile.findByIdAndDelete(userDetails.companyDetails);

      // Delete associated jobs
      const jobIds = userDetails.jobs;
      if (jobIds && jobIds.length > 0) {
          await Job.deleteMany({ _id: { $in: jobIds } });
      }

      // Remove jobs from user's jobs array
      await User.findByIdAndUpdate(id, { $set: { jobs: [] } });

      // Delete user
      await User.findByIdAndDelete(id);

      // Return response
      return res.status(200).json({
          success: true,
          message: 'Company and associated jobs deleted successfully',
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: 'Company cannot be deleted successfully',
      });
  }
};



exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.params || req.body;

    console.log("company Id: ", companyId)
    // Fetch company details by companyId
    const company = await CompanyProfile.findById(companyId);
    console.log("company by Id : ",company)
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    // Structure the response, including employees
    res.json({
      success: true,
      data: {
        companyTitle: company.companyTitle,
        sector: company.sector,
        taxAdministration: company.taxAdministration,
        taxNumber: company.taxNumber,
        companyAddress: company.companyAddress,
        employees: company.employees, // Returning employees array with contactPerson flag
      },
    });
  } catch (error) {
    console.error("Error fetching company details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }

}

exports.getCompanyPackages = async (req, res) => {
  const { companyId } = req.body.companyId;
console.log("inside backend request :", companyId)
try {
        // const { companyId } = req.body; // Assuming the frontend sends companyId in the request body


        // Query the database to find the company by its ID
        const company = await CompanyProfile.findById(companyId)
            .populate("package")
            .populate("requestedPackage");

        // Handle the case where the company is not found
        if (!company) {
            return res.status(404).json({ success:false, message: "Company not found" });
        }


        console.log(company)
        console.log("company.package",company.package)
        console.log("company?.requestedPackage",company?.requestedPackage)

        // Return the packages and requested packages
        return res.status(200).json({ 
          success:true,
            packages: company.package, 
            requestedPackages: company?.requestedPackage 
        });
    } catch (error) {
        console.error("Error fetching company packages:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.unenrollCompanyFromPackage = async (req, res) => {
  try {
    const { companyId, packageId } = req.body;

    // Remove the package from the company
    const updatedCompany = await CompanyProfile.findByIdAndUpdate(
      companyId,
      {
        $pull: { package: packageId }, // Remove the package from the array
      },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Remove the company from the package
    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      {
        $pull: { enrolledCompanies: companyId }, // Remove the company from enrolled companies
      },
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Company successfully unenrolled from the package.",
    });
  } catch (error) {
    console.error("Error unenrolling company from package:", error);
    return res.status(500).json({ error: "Error unenrolling company." });
  }
};