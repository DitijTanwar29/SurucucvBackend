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
        //     status = "Inactive";
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
            startDate: startDate,
            endDate: endDate,
            jobType: jobType,
            licenseType:licenseType,
            // srcBox: srcBox,
            isSrc1: isSrc1,
            isSrc2: isSrc2,
            isSrc3: isSrc3,
            isSrc4: isSrc4,
            psikoteknik: psikoteknik,
            adrDrivingLicence: adrDriverLicence,
            passport: passport,
            visa: visa,
            abroadExperience: abroadExperience,
            isBlindSpotTraining: isBlindSpotTraining,
            isSafeDrivingTraining: isSafeDrivingTraining,
            isFuelEconomyTraining: isFuelEconomyTraining,
            status: status,
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
// exports.deleteJob = async(req,res) => {
//     try{
//         //fetch service id from request
//         const {jobId} = req.body;
//         const userId = req.user.id;

//         //validate the job 
//         const jobPresent = await Job.findById(jobId);

//         if(!jobPresent){
//             return res.status(404).json({
//                 success:false,
//                 message:"Job not found",
//             });
//         }

//         const jobDetails = Job.findById({_id: jobId})
//         const serviceId = jobDetails.find({service})
        
//         console.log("jobDetails : ",jobDetails)
//         console.log("serviceId : ",serviceId)
//         // await Service.findByIdAndUpdate(serviceId, {
//         //     $pull: {
//         //         jobs: jobId,
//         //     },
//         // },
//         // {new:true},
//         // )


//         // await User.findByIdAndUpdate(
//         //     {_id: userId},
//         //     {
//         //         $pull: {
//         //             jobs: jobId,
//         //         }
//         //     },
//         //     {new: true},
//         // );


//         // await Job.findByIdAndDelete(jobId);

//         //find the updated service and return it
//         const service = await Service.findById(serviceId)
//             .populate("jobs").exec();
        
//         return res.status(200).json({
//             success:true,
//             message:"Job deleted successfully",
//             data: service,
//         });
//     }catch(error){
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }
// }

exports.deleteJob = async (req, res) => {
    try {
        // Get job ID from request parameters
        const {jobId} = req.body;
        const userId = req.user.id;
        console.log(" jobId :",jobId)
        // Find the job post
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        // Remove the job post from the user's jobs array
        const user = await User.findByIdAndUpdate(
             userId ,
            { $pull: { jobs: jobId } },
            { new: true }
        );

        // Remove the job post from the associated service's jobs array
        await Service.findByIdAndUpdate(
            { _id: job.service },
            { $pull: { jobs: jobId } },
            { new: true }
        );

        // Delete the job post from the database
        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            success: true,
            message: 'Job deleted successfully',
            data: user, // You can return updated user data if needed
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete job',
            error: error.message,
        });
    }
};

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
        const jobPosts = await Job.find({ status: 'Active' }).populate('company');

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
        const { jobId } = req.body;
        const { status } = req.body;
    
        // Check if service exists
        const job = await Job.findById(jobId);
        if (!job) {
          return res.status(404).json({ success: false, message: 'Job not found' });
        }
    
        // Update job status
        job.status = status;
        await job.save();
    
        return res.status(200).json({ success: true, message: 'Job status updated successfully', data: job });
      } catch (error) {
        console.error('Error updating job status:', error);
        return res.status(500).json({ success: false, message: 'Failed to update job status', error: error.message });
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
          // TODO: Validation for already applied -> 
        //   const alreadyApplied = await Job.find({_id: {$eq:jobId}});
        //   return res.status(409).json({
        //     success:false,
        //     message:"Candidate already applied for the job"
        //   })
          

      
        // Find the course and enroll the student in it
        const jobPost = await Job.findOneAndUpdate(
          { _id: jobId },
          { $push: { appliedCandidates: userId } },
          { new: true }
        )

        console.log("job post :",jobPost)
  
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
        ).populate("jobs").exec();

        // const appliedCandidate = await User.findByIdAndUpdate(
        //     {_id: userId},
        //     {
        //       $push: {
        //         jobs: jobId,
        //       },
        //     },
        //     { new: true },
        //   )
  
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
            data:jobPost,
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

        console.log("req data :",req)
        const userId = req.user.id;        
        // console.log("req.user: ",req.user)
        // console.log("userId : ",userId)
        const userDetails = await User.findById({_id: userId})
                                                .populate("jobs")
                                                // .populate("companyDetails")
                                                .exec();

        
        // console.log("user Details : ", userDetails)
        const jobsData = userDetails?.jobs
        console.log("jobs in user schema :",userDetails?.jobs)    

        return res.status(200).json({
            success:true,
            message:"Data for all applied jobs fetched successfully.",
            data: jobsData,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch applied jobs data",
        });

    }
};

exports.showAppliedCandidates = async (req, res) => {

    try{

        const jobId = req.query.jobId;
        const jobDetails = await Job.findById(jobId).populate("appliedCandidates").exec();

        if(!jobDetails) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }
        console.log("jobDetails :", jobDetails)
        const appliedCandidates = jobDetails?.appliedCandidates;
        console.log("appliedCandidates : ",appliedCandidates);

        return res.status(200).json({
            success:true,
            message:"Applied Candidates fetched successfully",
            data: appliedCandidates,
        })
        
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message,
            // message:"Unable to get details about applied candidates"
        })
    }
};