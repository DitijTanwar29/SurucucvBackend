const Service = require("../models/Service");
const AdminProfile = require("../models/AdminProfile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


exports.updateAdminProfile = async (req,res) => {
    try{

        //get data
        const { firstName, middleName, lastName, post="", bio="" } = req.body;
        // const profileImage  = req.files.profileImage;
        // const backgroundImage  =req.files.backgroundImage;

        // get userId
        const id = req.user.id;

        // validate data
        if(!firstName || !lastName || !id) {
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            }); 
        }

        //find adminProfile
        const userDetails = await User.findById(id);
        const profileId = userDetails.adminDetails;
        const adminProfileDetails = await AdminProfile.findById(profileId);


        //upload profile pic
        // const profilePic = await uploadImageToCloudinary(
        //     profileImage,
        //     process.env.FOLDER_NAME,
        //     1000,
        //     1000
        // )
        // console.log(profilePic);
        // //upload cover pic 
        // const coverPic = await uploadImageToCloudinary(
        //     backgroundImage,
        //     process.env.FOLDER_NAME,
        //     1000,
        //     1000
        // )
        // console.log(coverPic);


        //update Admin Profile 
        adminProfileDetails.firstName = firstName;
        adminProfileDetails.middleName = middleName;
        adminProfileDetails.lastName = lastName;
        adminProfileDetails.post = post;
        adminProfileDetails.bio = bio;

        // adminProfileDetails.profileImage = profilePic.secure_url;
        // adminProfileDetails.backgroundImage = coverPic.secure_url;

        await adminProfileDetails.save();
        
        //return response
        return res.status(200).json({
            success: true,
            message:'Admin Profile Updated Successfully',
            adminProfileDetails,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Something went wrong while updating admin profile."
        });
    }
}

//Todo both below are not tested yet 
// get all admin profile details
exports.getAdminDetails = async (req, res) => {
    try {
      const id = req.user.id
      const adminDetails = await User.findById(id)
        .populate("adminDetails")
        .exec()
      console.log(adminDetails)
      res.status(200).json({
        success: true,
        message: "Admin Data fetched successfully",
        data: adminDetails,
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
        await AdminProfile.findByIdAndDelete({_id: userDetails.adminDetails});
        

        //delete user
        await User.findByIdAndDelete({_id:id});
        
        //return response
        return res.status(200).json({
            success:true,
            message:'Admin deleted successfully',
        });

    } catch(error) {
        return res.status(500).json({
            success:false,
            message:'Admin cannot be deleted successfully',
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


