const Candidate = require("../models/CandidateProfile");
const User = require("../models/User");
const Resume = require("../models/Resume");



exports.createResume = async(req, res) => {
    try {
        //get userId from request object
        const userId = req.user.id;
        const email = req.user.email;
        
        //fetch data
        let {
            tcNumber, firstName = "", lastName = "", age, gsm, city, state,
            licenseType = [], isSrc1, isSrc2, isSrc3, isSrc4, psikoteknik, adrDriverLicense, mykCertificate,
            passport, dateOfReceipt, duration, visa, abroadExperience,
            isBlindSpotTraining, isSafeDrivingTraining, isFuelEconomyTraining, isCode95Document,
            europeanExperiencePeriod,
            russiaExperiencePeriod,
            turkicRepublicsExperiencePeriod,
            southExperienceTime
        } = req.body;
        
        console.log("tcNumber", tcNumber);
        console.log("licenseType", licenseType);

        //validation
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        //check for candidate
        const candidateDetails = await User.findById(userId);
        console.log("candidate details: ", candidateDetails);

        if (!candidateDetails) {
            return res.status(404).json({
                success: false,
                message: "Candidate details not found",
            });
        }

        // Adding 5 years to psikoteknik and adrDriverLicense dates
        const addYears = (date, years) => {
            let result = new Date(date);
            result.setFullYear(result.getFullYear() + years);
            return result;
        };

        const psikoteknikExpiryDate = psikoteknik ? addYears(psikoteknik, 5) : null;
        const adrExpiryDate = adrDriverLicense ? addYears(adrDriverLicense, 5) : null;
        const mykExpiryDate = mykCertificate ? addYears(mykCertificate, 5) : null;
        
        //create a resume for the user 
        const resume = await Resume.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            tcNumber: tcNumber,
            age: age,
            gsm: gsm,
            city: city,
            state: state,
            licenseType: licenseType,
            isSrc1: isSrc1,
            isSrc2: isSrc2,
            isSrc3: isSrc3,
            isSrc4: isSrc4,
            psikoteknik: psikoteknik,
            psikoteknikExpiryDate: psikoteknikExpiryDate,
            adrDriverLicense: adrDriverLicense,
            adrExpiryDate: adrExpiryDate,
            mykCertificate: mykCertificate,
            mykExpiryDate: mykExpiryDate,
            passport: passport,
            dateOfReceipt: dateOfReceipt,
            duration: duration,
            visa: visa,
            abroadExperience: abroadExperience,
            isCode95Document: isCode95Document,
            isBlindSpotTraining: isBlindSpotTraining,
            isSafeDrivingTraining: isSafeDrivingTraining,
            isFuelEconomyTraining: isFuelEconomyTraining,
            europeanExperiencePeriod: europeanExperiencePeriod,
            russiaExperiencePeriod: russiaExperiencePeriod,
            turkicRepublicsExperiencePeriod: turkicRepublicsExperiencePeriod,
            southExperienceTime: southExperienceTime,
        });
        
        //add the resume to the candidate schema
        await User.findByIdAndUpdate(
            {_id: candidateDetails._id},
            {
                $push: {
                    resume: resume._id,
                }
            },
            {new: true},
        );

        //return response
        return res.status(200).json({
            success: true,
            message: 'Resume created successfully',
            data: resume,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create resume',
            error: error.message,
        });
    }
};

exports.getResumeDetails = async (req, res) => {
    try{

        //get id
        // const {resumeId} = req.body;
        //find resume details
        // const resumeDetails = await Resume.find({})
        //                                         .exec();
        const resumeDetails = await Resume.findOne().sort({ createdAt: -1 }).exec();
        console.log("Resume Details : ",resumeDetails);
        //validation
        if(!resumeDetails) {
            return res.staus(400).json({
                success: false,
                message:`Could not find the resume`,
            });
        }

        //return response
        return res.status(200).json({
            success:true,
            message:"Resume details fetched successfully",
            data: resumeDetails,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

//not finished yet -> route and frontend pending
exports.updateResume = async (req, res) => {
    try{

        const {resumeId} = req.body;
        const updates = req.body;
        const resume = await Resume.findById(resumeId);

        if(!resumeId){
            return res.status(404).json({
                success:false,
                message:"Resume not found",
            });
        }

        

        //updating fields that are present in request body
        for (const key in updates) {
            resume[key] = updates[key];
        }

        await resume.save();

        const updatedResume= await Resume.findOne({
                                                _id: resumeId,
        })
        .exec();

        return res.status(200).json({
            success:true,
            message:"Resume updated Successfully",
            data: updatedResume,
        });
    }catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error: error.message,
        })
    }
}