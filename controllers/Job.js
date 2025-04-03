const Job = require("../models/Job");
const User = require("../models/User");
const Service = require("../models/Service");
const mailSender = require("../utils/mailSender")
const Sector = require("../models/Sector")
const mongoose = require("mongoose");
const CompanyProfile = require("../models/CompanyProfile");
const Package = require("../models/Package")
const { sendNotificationToAdmin } = require("../utils/notificationUtils");
  
exports.createJob = async (req, res) => {
    try {
      const userId = req.user.id;
      const {
        title, 
        description, 
        service, 
        requiredExperience, 
        location, 
        companyName, 
        salaryRange, 
        salaryType, 
        vacancy, 
        startDate, 
        endDate, 
        jobType, 
        status,
        isSrc1, 
        isSrc2, 
        isSrc3, 
        isSrc4, 
        psikoteknik, 
        adrDriverLicence, 
        isCode95Document, 
        passport, 
        visa, 
        abroadExperience, 
        isBlindSpotTraining, 
        isSafeDrivingTraining, 
        isFuelEconomyTraining, 
        isInternationalJob
      } = req.body;
  
      console.log("Raw License Type Data:", req.body.licenseType);
      console.log("req body:", req.body);
      console.log("Raw License Type Data:", req.body.selectedLicenses);


    //   const licenseType = req.body.licenseType;
       // Ensure licenseType is always an array
    //    const licenseTypeArray = Array.isArray(req.body.licenseType) ? req.body.licenseType : [];
    const licenseTypeArray = Array.isArray(req.body["licenseType[]"]) 
            ? req.body["licenseType[]"] 
            : req.body["licenseType[]"] ? [req.body["licenseType[]"]] : [];
// const licenseTypeArray = [].concat(req.body.licenseType || []);
      // Validate required fields
      if (!title || !description || !requiredExperience || !location || !companyName ||
          !salaryRange || !salaryType || !vacancy || !startDate || !endDate || !jobType || !service 
          || licenseTypeArray.length === 0) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
  
      // Check for company details and package status
      const userDetails = await User.findById(userId)
        .populate({
          path: "companyProfile",
          select: "package paymentStatus",
          populate: { path: "package", select: "_id" }
        });
  
      if (!userDetails || !userDetails.companyDetails) {
        return res.status(404).json({
          success: false,
          message: "Company details not found",
        });
      }
  
      console.log("user Details log : ",userDetails)
      console.log("company details inside user details : ",userDetails?.companyDetails)
const companyProfileId = userDetails?.companyDetails;
const companyProfileDetails = await CompanyProfile.findById(companyProfileId)
      if (companyProfileDetails?.package === 0) {
        return res.status(404).json({
          success: false,
          message: "Please get a package and try again."
        });
      }
  
      if (companyProfileDetails.paymentStatus !== 'Approved') {
        return res.status(400).json({
          success: false,
          message: "Payment status not approved, try again later."
        });
      }
  
      // Validate service
      const serviceDetails = await Service.findById(service);
      if (!serviceDetails) {
        return res.status(404).json({
          success: false,
          message: "Service Details not found",
        });
      }

      console.log(companyProfileDetails)
      console.log("companyProfileDetails?.package : ",companyProfileDetails?.package)
      const packageId = companyProfileDetails?.package;
//finding package details
const packageDetails = await Package.findById(packageId)
console.log("package details oin job creation controller : ",packageDetails)
console.log("packageDetails?.jobPostLimit :",packageDetails?.jobPostLimit)
 // Check job post limit
 const jobCount = await Job.countDocuments({ company: companyProfileDetails._id });
 if (jobCount >= packageDetails?.jobPostLimit) {
     return res.status(429).json({
         success: false,
         message: `Job post limit reached. Your limit is ${packageDetails.jobPostLimit}.`,
     });
 }

 // Continue with job creation
  
//       // Create new job entry
      const newJob = new Job({
        jobTitle: title,
        jobDescription: description,
        company: companyProfileDetails._id,
        companyImage: userDetails?.image,
        service,
        requiredExperience,
        rangeOfSalary: salaryRange,
        salaryType,
        jobLocation: location,
        companyName,
        numberOfVacancy: vacancy,
        startDate,
        endDate,
        jobType,
        licenseType : licenseTypeArray,
        isSrc1,
        isSrc2,
        isSrc3,
        isSrc4,
        psikoteknik,
        adrDrivingLicence: adrDriverLicence,
        isCode95Document,
        passport,
        visa,
        abroadExperience,
        isBlindSpotTraining,
        isSafeDrivingTraining,
        isFuelEconomyTraining,
        isInternationalJob,
        status,
      });
  
      await newJob.save();
  
      // Update user (company) with the new job
      await User.findByIdAndUpdate(
        { _id: userDetails._id },
        { $push: { jobs: newJob._id } },
        { new: true }
      );
  
      // Update service with the new job
      await Service.findByIdAndUpdate(
        { _id: service },
        { $push: { jobs: newJob._id } },
        { new: true }
      );

      // Send job notification to admin
    await sendNotificationToAdmin("Job", companyProfile.companyTitle, title);
  
      return res.status(200).json({
        success: true,
        message: "Request for Job creation sent successfully",
        data: newJob,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to create job",
        error: error.message,
      });
    }
  };

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

        const allJobs = await Job.find({}).sort({ publishedDate: -1 })
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
//tested this api need ot add come alteratioon
// here currently its bursting out in My Jobs on company dashboard
exports.showJobsByUserOrCompany = async (req, res) => {
    const { userId, companyId } = req.body;

    try {
        let jobs;

        // Fetch jobs by companyId if provided
        if (companyId) {
            jobs = await Job.find({ company: companyId })
                .sort({ publishedDate: -1 })
                .populate({
                    path: "company",
                    populate: {
                        path: "companyDetails",
                    }
                })
                .populate("service")
                .exec();
        }
        // Fetch jobs by userId if provided
        else if (userId) {
            const user = await User.findById(userId).populate({
                path: "jobs",
                populate: {
                    path: "company",
                    populate: {
                        path: "companyDetails",
                    }
                }
            }).populate("service");

            jobs = user?.jobs || [];
        } else {
            return res.status(400).json({
                success: false,
                message: "Please provide either userId or companyId.",
            });
        }

        // Check if there are any jobs found
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No jobs found.",
                data:[]
            });
        }

        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully.",
            data: jobs,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Cannot fetch jobs data.",
        });
    }
};


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

        if(status ==="Active"){
            job.publishedDate = Date.now();
        }
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

//withdraw job application
exports.withdrawJobApplication = async (req, res) => {
    try {
      const { jobId, userId } = req.body;
      console.log("req.body : ",req.body)
      
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "Please Provide User ID" });
      }
      if (!jobId) {
        return res
          .status(400)
          .json({ success: false, message: "Please Provide Job ID" });
      }
  
      // Remove candidate from job's appliedCandidates list
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $pull: { appliedCandidates: userId } },
        { new: true }
      );
  
      if (!updatedJob) {
        return res
          .status(404)
          .json({ success: false, message: "Job post not found" });
      }
  
      // Remove job from candidate's jobs list
      const updatedCandidate = await User.findByIdAndUpdate(
        userId,
        { $pull: { jobs: jobId } },
        { new: true }
      );
  
      if (!updatedCandidate) {
        return res
          .status(404)
          .json({ success: false, message: "Candidate not found" });
      }
  
      return res.status(200).json({
        success: true,
        message: "Successfully withdrawn from the job application",
      });
    } catch (error) {
      console.error("Error withdrawing job application:", error);
      return res.status(500).json({ error: "Error withdrawing application" });
    }
  };


//     try {
//         const topJobPostings = await Job.aggregate([
//             { 
//                 $match: { status: "Active" } // Filter active job postings
//             },
//             {
//                 $group: {
//                     _id: "$jobTitle", // Group by job title
//                     totalJobs: { $sum: "$numberOfVacancy" } // Count total jobs for each title
//                 }
//             },
//             {
//                 $sort: { totalJobs: -1 } // Sort by total jobs in descending order
//             },
//             {
//                 $limit: 5 // Limit to the top 5 job postings
//             }
//         ]);

//         // Transform the result to include only job title and total jobs
//         const formattedResults = topJobPostings.map(job => ({
//             jobTitle: job._id,
//             totalJobs: job.totalJobs
//         }));

//         return res.status(200).json({ success: true, data: formattedResults });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// exports.getTopJobPostings = async (req, res) => {
//     try {
//       const result = await Job.aggregate([
//         // Group by job title and count the number of job postings for each title
//         { $group: { _id: "$jobTitle", count: { $sum: 1 } } },
//         // Sort by count in descending order
//         { $sort: { count: -1 } },
//         // Limit to the top 5 job titles
//         { $limit: 5 },
//         // Project to rename fields and include only necessary fields
//         {
//           $project: {
//             _id: 0,
//             jobTitle: "$_id",
//             numberOfJobPostings: "$count"
//           }
//         }
//       ]);
  
//       return res.status(200).json({ success: true, data: result });

//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
//   };
exports.getTopJobPostings = async (req, res) => {
    try {
      const result = await Job.aggregate([
        // Group by job title and count the number of job postings for each title
        { $group: { _id: "$jobTitle", count: { $sum: 1 }, jobIds: { $push: "$_id" } } },
        // Sort by count in descending order
        { $sort: { count: -1 } },
        // Limit to the top 5 job titles
        { $limit: 5 },
        // Project to rename fields and include only necessary fields
        {
          $project: {
            _id: 0,
            jobTitle: "$_id",
            numberOfJobPostings: "$count",
            id: { $arrayElemAt: ["$jobIds", 0] }
          }
        }
      ]);
  
      return res.status(200).json({ success: true, data: result });
  
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  exports.getTopJobLocations = async (req, res) => {
    
    try {
        const topLocations = await Job.aggregate([
          // Group by jobLocation and count the number of jobs for each location
          {
            $group: {
              _id: "$jobLocation",
              jobCount: { $sum: 1 },
            jobs: { $push: "$_id" }
              
            },
          },
          // Sort by jobCount in descending order
          {
            $sort: { jobCount: -1 },
          },
          // Limit to the top 5 locations
          {
            $limit: 5,
          },
        ]);
    
        res.status(200).json({
          success: true,
          data: topLocations,
        });
      } catch (error) {
        console.error("Error fetching top job locations:", error.message);
        res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
};

// exports.searchActiveJobs = async (searchTerm) => {
//     try {
//       // Perform a case-insensitive search for job titles containing the searchTerm
//       const result = await Job.find({
//         jobTitle: { $regex: searchTerm, $options: "i" },
//         status: "Active"
//       });
      
//       return result;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   };

exports.searchJobs = async (req, res) => {
    const { keyword } = req.query;
  console.log("value of keyword in backend req :",keyword)
    try {
      const jobs = await Job.find({
        jobTitle: { $regex: keyword, $options: 'i' }, // Case-insensitive search
        status: "Active"
      }); // Limiting to 10 results

      if(jobs.length === 0 ){
        return res.status(404).json({success: false, message: "Jobs not available for this search"})
      }
      console.log("searched jobs backend response :",jobs)
  
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };


  exports.getRecentlyPublishedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'Active' })
            .sort({ publishedDate: -1 }) // Sort by published date in descending order
            .limit(6)
            .populate({
                path: "company",
                populate: {
                    path: "User",
                }
            }); // Limit the results to 6 jobs
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getFullTimeJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'Active', jobType: "Full Time" })
            //.sort({  }) // Sort by published date in descending order
            .limit(6)
            .populate({
                path: "company",
                populate: {
                    path: "User",
                }
            }); // Limit the results to 6 jobs
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPartTimeJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'Active', jobType: "Part Time" })
            //.sort({  }) // Sort by published date in descending order
            .limit(6)
            .populate({
                path: "company",
                populate: {
                    path: "User",
                }
            }); // Limit the results to 6 jobs
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
  
exports.filterJobs = async (req, res) => {
    try {
        const query = {};

        // Construct query based on request parameters
        if (req.query.jobLocation) {
            query.jobLocation = { $in: Array.isArray(req.query.jobLocation) ? req.query.jobLocation : [req.query.jobLocation] };
        }
        if (req.query.jobTitle) {
            query.jobTitle = { $in: Array.isArray(req.query.jobTitle) ? req.query.jobTitle : [req.query.jobTitle] };
        }
        if (req.query.service) {
            query.service = { $in: Array.isArray(req.query.service) ? req.query.service : [req.query.service] };
        }
        if (req.query.jobType) {
            query.jobType = { $in: Array.isArray(req.query.jobType) ? req.query.jobType : [req.query.jobType] };
        }
        if (req.query.salaryType) {
            query.salaryType = { $in: Array.isArray(req.query.salaryType) ? req.query.salaryType : [req.query.salaryType] };
        }
        
        // Ensure at least one filter is applied
        if (Object.keys(query).length === 0 && !req.query.sectorId) {
            return res.status(400).json({ message: 'No filter applied' });
        }

        console.log('Constructed Query:', JSON.stringify(query, null, 2));

        let jobs;
        if (req.query.sectorId) {
            // If sectorId is present, perform aggregation to filter jobs by sectorId
            jobs = await Job.aggregate([
                {
                    $lookup: {
                        from: "services",
                        localField: "service",
                        foreignField: "_id",
                        as: "serviceDetails"
                    }
                },
                {
                    $unwind: "$serviceDetails"
                },
                {
                    $match: {
                        "serviceDetails.sector": mongoose.Types.ObjectId(req.query.sectorId),
                        ...query
                    }
                },
                {
                    $sort: { publishedDate: -1 }
                }
            ]);
        } else {
            // If sectorId is not present, perform a regular find query
            jobs = await Job.find(query).sort({ publishedDate: -1 });
        }

        console.log("fetched filtered jobs: ", jobs);
        res.status(200).json({
            success: true,
            message: "Filtered jobs fetched successfully!",
            data: jobs,
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getInternationalJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'Active', isInternationalJob: "true" })
            //.sort({  }) // Sort by published date in descending order
            .limit(6)
            .populate({
                path: "company",
                populate: {
                    path: "User",
                }
            }); // Limit the results to 6 jobs
        res.status(200).json({ success: true, data: jobs,
        message:"International Jobs fetches successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getJobsByProvince = async (req, res) => {
    try {
        const jobPostings = await Job.aggregate([
            { $group: { _id: "$jobLocation", count: { $sum: 1 } } }
        ]);
        res.status(200).json(jobPostings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.getJobsBySector = async (req, res) => {
//     // try {
//     //     const jobPostings = await Service.aggregate([
//     //         { $group: { _id: "$sector", count: { $sum: { $size: "$jobs" } } } }
//     //     ]);
//     //     res.status(200).json(jobPostings);
//     // } catch (error) {
//     //     res.status(500).json({ error: error.message });
//     // }
//     try {
//         const sectors = await Sector.aggregate([
//             {
//                 $lookup: {
//                     from: "services",
//                     localField: "services",
//                     foreignField: "_id",
//                     as: "serviceDetails",
//                 },
//             },
//             {
//                 $unwind: "$serviceDetails"
//             },
//             {
//                 $match: {
//                     "serviceDetails.status": "Active",
//                 }
//             },
//             {
//                 $group: {
//                     _id: {
//                         sectorId: "$_id",
//                         sectorName: "$sectorName"
//                     },
//                     count: { $sum: { $size: "$serviceDetails.jobs" } }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     sectorId: "$_id.sectorId",
//                     sectorName: "$_id.sectorName",
//                     count: 1
//                 }
//             }
//         ]);
//         res.status(200).json(sectors);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
    
// };

exports.getJobsBySector = async (req, res) => {
    try {
        const sectors = await Sector.aggregate([
            {
                $lookup: {
                    from: "services",
                    localField: "_id", // Match the sector ID with the services' sector field
                    foreignField: "sector",
                    as: "serviceDetails",
                },
            },
            {
                $unwind: "$serviceDetails",
            },
            {
                $match: {
                    "serviceDetails.status": "Active",
                }
            },
            {
                $group: {
                    _id: "$_id", // Group by sector ID
                    sectorName: { $first: "$sectorName" }, // Get sector name
                    count: { $sum: { $size: "$serviceDetails.jobs" } }
                }
            },
            {
                $project: {
                    _id: 0,
                    sectorId: "$_id", // Project sector ID as separate field
                    sectorName: 1,
                    count: 1
                }
            }
        ]);
        res.status(200).json(sectors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// exports.getJobsByService = async (req, res) => {
//     try {
//         const jobPostings = await Job.aggregate([
//             {
//                 $group: {
//                     _id: "$service",
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "services",
//                     localField: "_id",
//                     foreignField: "_id",
//                     as: "service"
//                 }
//             },
//             {
//                 $unwind: "$service"
//             },
//             {
//                 $project: {
//                     _id: "$service.serviceName",
//                     count: 1
//                 }
//             }
//         ]);
//         res.status(200).json(jobPostings);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
    
// };

exports.getJobsByService = async (req, res) => {
    try {
        const services = await Service.aggregate([
            {
                $lookup: {
                    from: "jobs",
                    localField: "_id",
                    foreignField: "service",
                    as: "jobDetails",
                },
            },
            {
                $unwind: "$jobDetails",
            },
            {
                $match: {
                    "jobDetails.status": "Active",
                }
            },
            {
                $group: {
                    _id: "$_id", // Group by service ID
                    serviceName: { $first: "$serviceName" }, // Get service name
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    serviceId: "$_id", // Project service ID as separate field
                    serviceName: 1,
                    count: 1
                }
            }
        ]);
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
