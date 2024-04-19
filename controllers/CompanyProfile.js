const CompanyProfile = require("../models/CompanyProfile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateCompanyProfile = async (req, res) => {
    try{
        //get data
        const { 
        name, email, position="", contactNumber, dateOfBirth="",
         companyTitle, industryName, taxAdministration="",
          taxNumber, companyAddress="" } = req.body;

        // const profileImage = req.files.profileImage;
        // const coverImage = req.files.coverImage;
        
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

        //upload profile pic
        // const profilePic = await uploadImageToCloudinary(
        //     profileImage,
        //     process.env.FOLDER_NAME,
        //     1000,
        //     1000
        // )
        // console.log(profilePic);
        //upload cover pic 
        // const coverPic = await uploadImageToCloudinary(
        //     coverImage,
        //     process.env.FOLDER_NAME,
        //     1000,
        //     1000
        // )
        // console.log(coverPic);


        //update Company Profile 
        companyProfileDetails.name = name;
        companyProfileDetails.email = email;
        companyProfileDetails.position = position;
        companyProfileDetails.contactNumber = contactNumber;
        companyProfileDetails.dateOfBirth = dateOfBirth;
        companyProfileDetails.companyTitle = companyTitle;
        companyProfileDetails.industryName = industryName;
        companyProfileDetails.taxAdministration = taxAdministration;
        companyProfileDetails.taxNumber = taxNumber;
        companyProfileDetails.companyAddress = companyAddress;


        // companyProfileDetails.companyIcon = profilePic.secure_url;
        // companyProfileDetails.companyBackgroundIcon = coverPic.secure_url;

        await companyProfileDetails.save();

        //return response
        return res.status(200).json({
            success: true,
            companyProfileDetails,
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
exports.deleteAccount = async (req, res) => {
    try{
            //  const job = schedule.scheduleJob("10 * * * * *", function () {
            // 	console.log("The answer to life, the universe, and everything!");
            // });
            // console.log(job);

        //get id 
        console.log("printing id",req.user.id);
        const id = req.user.id;
        //validation 
        const userDetails = await User.findByIdAndDelete(id);
        if(!userDetails) {
            return res.status(404).json({
                success:false,
                message:'User not found',
            });
        }
        //delete profile
        await CompanyProfile.findByIdAndDelete({_id: userDetails.companyDetails});
        

        //delete user
        await User.findByIdAndDelete({_id:id});
        
        //return response
        return res.status(200).json({
            success:true,
            message:'Company deleted successfully',
        });

    } catch(error) {
        return res.status(500).json({
            success:false,
            message:'Company cannot be deleted successfully',
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


