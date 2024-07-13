const Sector = require("../models/Sector");
const User = require("../models/User");

exports.createSector = async(req,res) => {
    try{

        const userId = req.user.id;
        //fetch data
        const {sectorName, status} = req.body;

        // console.log("request : : ",req);
        
        
        //validate data
        if(
            !sectorName 
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
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

    
        
        //create an entry for new service
        const newSector = await Sector.create({
            sectorName,
            status: status,
        });

        //add the sector to the admin schema 
        await User.findByIdAndUpdate(
            {_id: adminDetails._id},
            {
                $push: {
                    sectors: newSector._id,
                }
            },
            {new:true},
        );


        //return response
        return res.status(200).json({
            success:true,
            message:"Sector created successfully",
            data:newSector,
        });

    } catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create sector",
            error:error.message,
        });
    }
};


exports.editSector = async (req, res) => {
    try{

        const {sectorId} = req.body;
        const updates = req.body;
        const sector = await Sector.findById(sectorId);

        if(!sectorId){
            return res.status(404).json({
                success:false,
                message:"Sector not found",
            });
        }

        //updating fields that are present in request body
        for (const key in updates) {
            sector[key] = updates[key];
        }

        await sector.save();

        const updatedSector = await Sector.findOne({
                                                _id: sectorId,
        }).populate("services")
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
            message:"Sector updated Successfully",
            data: updatedSector,
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

exports.deleteSector = async(req,res) => {
    try{
        //fetch sector id from request
        const {sectorId} = req.body;
        //validate the sector 
        const sectorPresent = await Sector.findById(sectorId);

        if(!sectorPresent){
            return res.status(404).json({
                success:false,
                message:"Sector not present",
            });
        }

        await Sector.findByIdAndDelete(sectorId);

        return res.status(200).json({
            success:true,
            message:"Sector deleted successfully",
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.showAllSectors = async (req, res) => {
    try{

        const allSectors = await Sector.find({}, {sectorName:true,
                                                    services:true,
                                                    status:true,
                                                }).populate("services").exec();
                                    
        return res.status(200).json({
            success:true,
            message:"Data for all services fetched successfully.",
            data: allSectors,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch sector data",
        });

    }
};

exports.updateSectorStatus = async (req, res) => {
    try {
      const { sectorId } = req.body;
      const { status } = req.body;
  
      // Check if sector exists
      const sector = await Sector.findById(sectorId);
      if (!sector) {
        return res.status(404).json({ success: false, message: 'Sector not found' });
      }
  
      // Update sector status
      sector.status = status;
      await sector.save();
  
      return res.status(200).json({ success: true, message: 'Sector status updated successfully', data: sector });
    } catch (error) {
      console.error('Error updating sector status:', error);
      return res.status(500).json({ success: false, message: 'Failed to update sector status', error: error.message });
    }
};

exports.getActiveSectors = async (req, res) => {
    try {
// Find all sectors with status 'active'
const activeSectors = await Sector.find({ status: 'Active' });


    //validation
    if(!activeSectors) {
        return res.staus(400).json({
            success: false,
            message:"Could not find the Active Sectors",
        });
    }

  //return response
    return res.status(200).json({
        success:true,
        message:"Active Sectors details fetched successfully",
        data: activeSectors,
    });
}catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:error.message,
    });
}
}