const express = require("express");
const app = express();

// import routes
// const authRoutes = require ('./Routes/authRoutes.js')
const userRoutes= require ('./Routes/User');
const adminProfileRoutes = require("./Routes/AdminProfile");
const candidateProfileRoutes = require("./Routes/CandidateProfile");
const companyProfileRoutes = require("./Routes/CompanyProfile");
const serviceRoutes = require('./Routes/Service');
const jobRoutes = require('./Routes/Job');
const resumeRoutes = require('./Routes/Resume');
const sectorRoutes = require('./Routes/Sector')
const packageRoutes = require('./Routes/Package')
const AdvertisementRoutes = require('./Routes/Advertisement')
const filtersRoutes = require('./Routes/Filters')
const database = require("./config/database");
const morgan = require("morgan");
const bodyParser = require ("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const {cloudinaryConnect} = require("./config/cloudinary");
const dotenv = require("dotenv");   
const notificationRoutes = require("./Routes/Notification");

// port 
const PORT = process.env.PORT || 1200;

// Database connection 
database.connect();

// Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());   
// app.use(
//    cors(
//       {origin:"http://localhost:3000", credentials:true}
//    )
// )

app.use(
   cors()
)
app.use(
   fileUpload({
      useTempFiles:true,
      tempFileDir:"/tmp",
   })
)

//cloudinary connect
cloudinaryConnect();

//routes
app.use("/api/v1/auth",userRoutes);
//profiles route
app.use("/api/v1/adminProfile",adminProfileRoutes);
app.use("/api/v1/candidateProfile",candidateProfileRoutes);
app.use("/api/v1/companyProfile",companyProfileRoutes);
//functionalities routes
app.use("/api/v1/service",serviceRoutes);
app.use("/api/v1/job",jobRoutes);
app.use("/api/v1/resume",resumeRoutes);
app.use("/api/v1/sector", sectorRoutes);
app.use("/api/v1/package",packageRoutes);
app.use("/api/v1/advertisement",AdvertisementRoutes)
app.use("/api/v1/filters",filtersRoutes)
app.use("/api/v1/notification", notificationRoutes);
//default route
app.get('/',(req,res)=>{
   res.send("Your server is up and running..");
})

// app.use("/public", express.static(path.join(__dirname, "public")));
app.listen(PORT, ()=>{
   console.log( `Server is running at ${PORT}`)
});