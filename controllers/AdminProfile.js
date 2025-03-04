const Service = require("../models/Service");
const AdminProfile = require("../models/AdminProfile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const HeroImage = require("../models/HeroImage");
const fs = require("fs");
const path = require("path");
// const DEFAULT_HERO_IMAGE = require("../public/images/Driver-pro-logo.jfif"); // Replace with your actual default image URL
const DEFAULT_HERO_IMAGE = "../public/images/Driver-pro-logo.jfif";
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

        const accountType = userDetails.accountType
        console.log("accountType : ",accountType)
        const user = await User.findByIdAndUpdate(id, {
          firstName,
          middleName,
          lastName,
          accountType
        })

        await user.save()
console.log("user :",user)
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
        
        //Find the updated user details
        const updatedUserDetails = await User.findById(id)
        .populate("adminDetails")
        .exec()

        //return response
        return res.status(200).json({
            success: true,
            message:'Admin Profile Updated Successfully',
            updatedUserDetails,
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





// Read the default image and convert it to Base64
const DEFAULT_IMAGE_PATH = path.join(__dirname, "../public/images/Driver-pro-logo.jfif");
let DEFAULT_IMAGE_BASE64 = "";

try {
  DEFAULT_IMAGE_BASE64 = fs.readFileSync(DEFAULT_HERO_IMAGE, { encoding: "base64" });
} catch (error) {
  console.error("Error reading default image:", error.message);
}

exports.uploadHeroImage = async (req, res) => {
  try {
    let imageUrl = `data:image/jpeg;base64,${DEFAULT_IMAGE_BASE64}`; // Default to local base64 image

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(req.file, "heroImages", 500, "auto");
      imageUrl = uploadResult.secure_url;
    }

    let heroImage = await HeroImage.findOne();
    if (heroImage) {
      heroImage.imageUrl = imageUrl;
      await heroImage.save();
    } else {
      heroImage = await HeroImage.create({ imageUrl });
    }

    res.status(200).json({ message: "Hero image updated successfully", imageUrl: heroImage.imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error uploading hero image", error: error.message });
  }
};
// console.log(DEFAULT_IMAGE_PATH);
// exports.getHeroImage = async (req, res) => {
//   try {
//     let heroImage = await HeroImage.findOne();

//     if (!heroImage || !heroImage.imageUrl) {
//       console.log("No uploaded hero image found, returning default image.");
//       return res.status(200).json({
//         success: true,
//         imageUrl: `data:image/jpeg;base64,${DEFAULT_IMAGE_BASE64}`,
//       });
//     }

//     console.log("Returning uploaded hero image:", heroImage.imageUrl);
//     res.status(200).json({
//       success: true,
//       imageUrl: heroImage.imageUrl,
//     });
//   } catch (error) {
//     console.error("Error fetching hero image:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching hero image",
//       error: error.message,
//     });
//   }
// };


//To Do: upload hero section image controllers -> chirag test them from here 
exports.getHeroImage = async (req, res) => {
  try {
    let heroImage = await HeroImage.findOne();

    if (!heroImage || !heroImage.imageUrl) {
      console.log("No uploaded hero image found, returning default image.");

      // Return the static URL of the default image
      return res.status(200).json({
        success: true,
        imageUrl: "/public/images/Driver-pro-logo.jfif",
      });
    }

    console.log("Returning uploaded hero image:", heroImage.imageUrl);
    res.status(200).json({
      success: true,
      imageUrl: heroImage.imageUrl,
    });
  } catch (error) {
    console.error("Error fetching hero image:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching hero image",
      error: error.message,
    });
  }
};