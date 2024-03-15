const Job = require("../models/Job");
const User = require("../models/User");
const Service = require("../models/Service");
const mailSender = require("../utils/mailSender")

exports.createJob = async (req, res) => {
    try{
        //fetch data
        const userId = req.user.id;
        console.log("Request body : ",req.body)
        const {
            title, description, service, skills, requiredExperience, 
            location,companyName, salaryRange, salaryType, 
            vacancy, startDate, endDate, jobType, status,
            licenseType,srcBox,isSrc1,isSrc2,isSrc3,isSrc4,psikoteknik,adrDriverLicence,
            passport,visa,abroadExperience,
            isBlindSpotTraining,isSafeDrivingTraining,isFuelEconomyTraining
        } = req.body;

        //validate data
        if(
            !title ||
            !description ||
            !skills ||
            !requiredExperience ||
            !location ||
            !companyName ||
            !salaryRange ||
            !salaryType ||
            !vacancy ||
            !startDate ||
            !endDate ||
            !jobType ||
            !service ||
            !licenseType
            // !srcBox ||
            // !psikoteknik ||
            // !adrDriverLicence ||
            // !passport ||
            // !visa ||
            // !abroadExperience ||
            // !isBlindSpotTraining ||
            // !isSafeDrivingTraining ||
            // !isFuelEconomyTraining
        ) {
            return res.status(400).json({
                success: false,
                message:"All fields are required",
            });
        }

        // check for companyDetails 
        const companyDetails = await User.findById(userId);
        console.log("Company Details: ", companyDetails);

        if(!companyDetails){
            return res.status(404).json({
                success: false,
                message: "Company details not found",
            });
        }

        // if( !status || status === undefined) {
            // status = "Inactive";
        // }

        //check given Service is valid or not
        const serviceDetails = await Service.findById(service);
        if(!serviceDetails) {
            return res.status(404).json({
                success: false,
                message: 'Service Details not found',
            });
        }

        //create an entry for new job
        const newJob = await Job.create({
            jobTitle : title,
            jobDescription: description,
            company: companyDetails._id,
            service: service,
            requiredSkills: skills,
            requiredExperience: requiredExperience,
            rangeOfSalary: salaryRange,
            salaryType: salaryType,
            jobLocation: location,
            companyName: companyName,
            numberOfVacancy: vacancy,
            applicationStartDate: startDate,
            applicationEndDate: endDate,
            jobType: jobType,
            licenseType:licenseType,
            // srcBox: srcBox,
            isSrc1: isSrc1,
            isSrc2: isSrc2,
            isSrc3: isSrc3,
            isSrc4: isSrc4,
            psikoteknik: psikoteknik,
            adrDriverLicence: adrDriverLicence,
            passport: passport,
            visa: visa,
            abroadExperience: abroadExperience,
            isBlindSpotTraining: isBlindSpotTraining,
            isSafeDrivingTraining: isSafeDrivingTraining,
            isFuelEconomyTraining: isFuelEconomyTraining,
        })

        console.log(" New Job details : ",newJob)
        //add new job to the user schema of company
        await User.findByIdAndUpdate(
            {_id: companyDetails._id},
            {
                $push: {
                    jobs: newJob._id,
                }
            },
            {new: true},
        );
        
        //update the service schema i.e adding new job to the services
        await Service.findByIdAndUpdate(
            {_id: service},
            {
                $push: {
                    jobs: newJob._id,
                }
            },
            {new: true},
        );

        //return res
        return res.status(200).json({
            success:true,
            message:'Request for Job createation sent successfully',
            data:newJob,
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create job',
            error:error.message,
        })
    }
}
//TODO : POSTMAN AND ROUTE IS PENDING FOR EDIT APII
exports.updateJob = async (req, res) => {
    try{

        const {jobId} = req.body;
        const updates = req.body;
        const job = await Job.findById(jobId);

        if(!jobId){
            return res.status(404).json({
                success:false,
                message:"Job not found",
            });
        }

        

        //updating fields that are present in request body
        for (const key in updates) {
            job[key] = updates[key];
        }

        await job.save();

        const updatedJob= await Job.findOne({
                                                _id: jobId,
        })
        .populate("Service")
        .exec();

        return res.status(200).json({
            success:true,
            message:"Job updated Successfully",
            data: updatedJob,
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

exports.showAllJobs = async (req, res) => {
    try{

        const allJobs = await Job.find({})
                                                .populate({
                                                    path: "company",
                                                    populate: {
                                                        path: "companyDetails",
                                                    }
                                                })
                                                .populate("service")
                                                .exec();
                                    
        return res.status(200).json({
            success:true,
            message:"Data for all jobs fetched successfully.",
            data: allJobs,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch jobs data",
        });

    }
};
//TODO : POSTMAN AND ROUTE IS PENDING FOR DELETE APII
exports.deleteJob = async(req,res) => {
    try{
        //fetch service id from request
        const {jobId, serviceId} = req.body;

        await Service.findByIdAndUpdate(serviceId, {
            $pull: {
                jobs: jobId,
            },
        })

        //validate the job 
        const jobPresent = await Job.findById(jobId);

        if(!jobPresent){
            return res.status(404).json({
                success:false,
                message:"Job not found",
            });
        }

        await Job.findByIdAndDelete(jobId);

        //find the updated service and return it
        const service = await Service.findById(serviceId)
            .populate("jobs").exec();
        
        return res.status(200).json({
            success:true,
            message:"Job deleted successfully",
            data: service,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.getJobDetails = async (req, res) => {
    try{

        //get id
        const {jobId} = req.body;
        //find job details
        const jobDetails = await Job.find(
                                                {_id: jobId})
                                                .populate("company")
                                                .exec();

        //validation
        if(!jobDetails) {
            return res.staus(400).json({
                success: false,
                message:`Could not find the job with ${jobId}`,
            });
        }

        //return response
        return res.status(200).json({
            success:true,
            message:"Service details fetched successfully",
            data: jobDetails,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

exports.getAllApprovedJobPosts = async (req, res) => {
    try {
        const jobPosts = await Job.find({ status: 'Inactive' }).populate('company');

        if(!jobPosts){
            return res.status(404).json({
                success:false,
                message:"No Approved job post found",
            })
        }else{
            return res.status(200).json({
                success: true,
                data: jobPosts
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch job posts',
            error: error.message
        });
    }
};

exports.approveAJobPost = async (req, res) => {
    try {
        const jobId = req.params.id;
        const jobPost = await Job.findByIdAndUpdate(jobId, { status: 'Approved' }, { new: true });
        if (!jobPost) {
            return res.status(404).json({
                success: false,
                message: 'Job post not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Job post approved successfully',
            data: jobPost
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to approve job post',
            error: error.message
        });
    }
};


exports.applyForJob = async (req, res) => {

    const {jobId} = req.body;
    console.log("jobId :", jobId);
    const userId = req.user.id;
// console.log("apply job post request log :",req)
console.log("req.user :",req.user)
if(!userId){
    return res
    .status(400)
    .json({ success: false, message: "Please Provide  User ID" })
}
    if (!jobId ) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Job ID " })
    }
  
    
      try {
        // Find the course and enroll the student in it
        const jobPost = await Job.findOneAndUpdate(
          { _id: jobId },
          { $push: { appliedCandidates: userId } },
          { new: true }
        )
  
        if (!jobPost) {
          return res
            .status(500)
            .json({ success: false, error: "Job Post not found" })
        }
        console.log("Updated job: ", jobPost)
  
        
        // Find the student and add the job to their list of jobs
        const appliedCandidate = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              jobs: jobId,
            },
          },
          { new: true }
        )
  
        console.log("applied candidate: ", appliedCandidate)
        // Send an email notification to the enrolled student
        // const emailResponse = await mailSender(
        //   enrolledStudent.email,
        //   `Successfully Enrolled into ${jobPost.title}`,
        //   courseEnrollmentEmail(
        //     jobPost.title,
        //     `${appliedCandidate.firstName} ${appliedCandidate.lastName}`
        //   )
        // )

        return res.status(200).json({
            success: true,
            message: `Candidate Applied Successfully for the job role with jobId ${jobId}`,
            data:jobPost, data:appliedCandidate
        })
  
        // console.log("Email sent successfully: ", emailResponse.response)
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message  })
      }
    }

//todo yaha se kaam krna h ab candidate ko applied job post ka table bnake dikhana h sb applied jobs show krni h 

exports.showAppliedJobs = async (req, res) => {
    try{

        const userId = req.user.id;
        const appliedJobs = await User.findById({_id: userId})
                                                .populate("jobs")
                                                .populate("companyDetails")
                                                .exec();
                                    
        return res.status(200).json({
            success:true,
            message:"Data for all applied jobs fetched successfully.",
            data: appliedJobs,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch applied jobs data",
        });

    }
};