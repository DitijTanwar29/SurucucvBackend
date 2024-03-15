const CandidateProfile = require("../models/CandidateProfile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateCandidateProfile = async (req,res) => {
    try{

        //get data
        const { 
            name, email, contactNumber, dateOfBirth="", 
            about="", skills="", preferedJobLocation, 
            degree, province, district
            } = req.body;
        const profileImage  = req.files.profileImage;
        const backgroundImage  =req.files.backgroundImage;

        // get userId
        const id = req.user.id;

        // validate data
        if(!name || !email || !contactNumber || !id ) {
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            }); 
        }

        //find candidateProfile
        const userDetails = await User.findById(id);
        const profileId = userDetails.candidateDetails;
        const candidateProfileDetails = await CandidateProfile.findById(profileId);


        //upload profile pic
        const profilePic = await uploadImageToCloudinary(
            profileImage,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(profilePic);
        //upload cover pic 
        const coverPic = await uploadImageToCloudinary(
            backgroundImage,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(coverPic);


        //update Admin Profile 
        candidateProfileDetails.name = name;
        candidateProfileDetails.email = email;
        candidateProfileDetails.contactNumber = contactNumber;
        candidateProfileDetails.dateOfBirth = dateOfBirth;
        candidateProfileDetails.about = about;
        candidateProfileDetails.skills = skills;
        candidateProfileDetails.province = province;
        candidateProfileDetails.district = district;
        candidateProfileDetails.preferedJobLocation = preferedJobLocation;
        candidateProfileDetails.degree = degree;

        candidateProfileDetails.profileImage = profilePic.secure_url;
        candidateProfileDetails.backgroundImage = coverPic.secure_url;

        await candidateProfileDetails.save();
        
        //return response
        return res.status(200).json({
            success: true,
            message:'Candidate Profile Updated Successfully',
            candidateProfileDetails,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Something went wrong while updating candidate profile."
        });
    }
}


//Todo both below are not tested yet 
// get all candidate profile details
exports.getCandidateDetails = async (req, res) => {
    try {
      const id = req.user.id
      const candidateDetails = await User.findById(id)
        .populate("candidateDetails")
        .exec()
      console.log(candidateDetails)
      res.status(200).json({
        success: true,
        message: "Candidate Data fetched successfully",
        data: candidateDetails,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
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
        await CandidateProfile.findByIdAndDelete({_id: userDetails.candidateDetails});
        

        //delete user
        await User.findByIdAndDelete({_id:id});
        
        //return response
        return res.status(200).json({
            success:true,
            message:'Candidate deleted successfully',
        });

    } catch(error) {
        return res.status(500).json({
            success:false,
            message:'Candidate cannot be deleted successfully',
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


