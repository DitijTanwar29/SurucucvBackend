const Service = require("../models/Service");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const Sector = require("../models/Sector");

require("dotenv").config();

exports.createService = async(req,res) => {
    try{

        const userId = req.user.id;
        //fetch data
        const {serviceName,serviceDescription,status,sector} = req.body;

        const icon = req.files.serviceIcon;
        console.log("icon:", icon);
        // console.log("request : : ",req);
        console.log("REQUEST.FILES",req.files)
        console.log("REQUEST.FILES,SERVICEICON",req.files.serviceIcon);

        // console.log("req.file /; ", req.file);
        //validate data
        if(
            !serviceName ||
            !serviceDescription ||
            !icon ||
            !sector
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const sectorDetails = await Sector.findById(sector);
        if(!sectorDetails) {
            return res.status(404).json({
                success: false,
                message: 'Sector Details not found',
            });
        }

        //check for Admin
        const adminDetails = await User.findById(userId);
        console.log("Admin Details: ", adminDetails);

        if(!adminDetails){
            return res.status(404).json({
                success:false,
                message: "Admin details not found",
            });
        }

        if(!status || status == undefined) {
            status = "Inactive";
        }

        //upload serviceIcon to cloudinary
        const serviceIcon = await uploadImageToCloudinary(icon, process.env.FOLDER_NAME);

        //create an entry for new service
        const newService = await Service.create({
            serviceName,
            serviceDescription,
            icon: serviceIcon.secure_url,
            status: status,
            sector:sector,
        })
        

        //add the service to the sector schema 
        await Sector.findByIdAndUpdate(
            {_id: sector},
            {
                $push: {
                    services: newService._id,
                }
            },
            {new:true},
        );


        //return response
        return res.status(200).json({
            success:true,
            message:"Service created successfully",
            data:newService,
        });

    } catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create service",
            error:error.message,
        });
    }
};

exports.editService = async (req, res) => {
    try{

        const {serviceId} = req.body;
        const updates = req.body;
        const service = await Service.findById(serviceId);

        if(!serviceId){
            return res.status(404).json({
                success:false,
                message:"Service not found",
            });
        }

        //if serviceIcon is found, update it
        if(req.files){
            const icon = req.files.serviceIcon;
            const serviceIcon = await uploadImageToCloudinary(
                icon,
                process.env.FOLDER_NAME
            )
            service.icon = serviceIcon.secure_url
        }

        //updating fields that are present in request body
        for (const key in updates) {
            service[key] = updates[key];
        }

        await service.save();

        const updatedService = await Service.findOne({
                                                _id: serviceId,
        })
        // .populate("jobs")
        // .populate({
        //     path: "jobs",
        //     populate: {
        //         path: "service"
        //     }
        // })
        .exec();

        return res.status(200).json({
            success:true,
            message:"Service updated Successfully",
            data: updatedService,
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


exports.showAllServices = async (req, res) => {
    try{

        const allServices = await Service.find({}, {serviceName:true,
                                                    serviceDescription:true,
                                                    icon:true,
                                                    status:true,
                                                    sector:true,
                                                }).exec();
                                    
        return res.status(200).json({
            success:true,
            message:"Data for all services fetched successfully.",
            data: allServices,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch service data",
        });

    }
};

exports.getServiceDetails = async (req, res) => {
    try{

        //get id
        const {serviceId} = req.body;
        //find service details
        const serviceDetails = await Service.find(
                                                {_id: serviceId})
                                                .populate("jobs")
                                                .exec();

        //validation
        if(!serviceDetails) {
            return res.staus(400).json({
                success: false,
                message:`Could not find the service with ${serviceId}`,
            });
        }

        //return response
        return res.status(200).json({
            success:true,
            message:"Service details fetched successfully",
            data: serviceDetails,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

exports.deleteService = async(req,res) => {
    try{
        //fetch service id from request
        const {serviceId} = req.body;
        //validate the service 
        const servicePresent = await Service.findById(serviceId);

        if(!servicePresent){
            return res.status(404).json({
                success:false,
                message:"Service not present",
            });
        }

        await Service.findByIdAndDelete(serviceId);

        return res.status(200).json({
            success:true,
            message:"Service deleted successfully",
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.getActiveServices = async (req, res) => {
        try {
    // Find all services with status 'active'
    const activeServices = await Service.find({ status: 'Active' });


        //validation
        if(!activeServices) {
            return res.staus(400).json({
                success: false,
                message:"Could not find the Active Services",
            });
        }

      //return response
        return res.status(200).json({
            success:true,
            message:"Active Services details fetched successfully",
            data: activeServices,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

exports.updateServiceStatus = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const { status } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Update service status
    service.status = status;
    await service.save();

    return res.status(200).json({ success: true, message: 'Service status updated successfully', data: service });
  } catch (error) {
    console.error('Error updating service status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update service status', error: error.message });
  }
};



