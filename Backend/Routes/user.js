const express = require("express");
const router = express.Router();


const {patientSignup, patientLogin, updatePatientData} = require("../Controllers/patientAuth");
const {consultantSignup, consultantLogin } = require("../Controllers/consultantAuth");
const { searchConsultantBySpecialty, getAllConsultants, getConsultantsData } = require("../Controllers/searchConsultant");
const {createAppointment, getRequestedAppointmentList } = require("../Controllers/appointment");
// const {meet} = require("../Controllers/googlemeet");

//const upload = require("../middlewares/multer");

router.post("/patient/login",patientLogin);  
router.post("/patient/signup", patientSignup);
router.post("/patient/SearchConsultant", searchConsultantBySpecialty);
router.post("/patient/getAllConsultants", getAllConsultants);
router.get("/patient/getConsultantsData", getConsultantsData);
router.post("/patient/updatePatientData", updatePatientData);
router.post("/patient/RequestAppointment", createAppointment);


// router.get("/patient/getRequestedAppointment", patientSignup);
// router.get("/patient/getConfimedAppointment", patientSignup);
// router.post("/patient/uploadReports", patientSignup);
// router.get("/patient/getReports", patientSignup);

// router.post("/patient/ConsultantFeedback", patientSignup);



router.post("/consultant/login",consultantLogin);  
router.post("/consultant/signup", consultantSignup);
router.get("/consultant/getRequestedAppointmentList",getRequestedAppointmentList); 

// router.post("/generate-meet-link",meet);

// router.post("/consultant/ApproveDeclineAppoinmentRequest", consultantSignup);
// router.post("/consultant/getAppointmentList",consultantLogin);  
// router.post("/consultant/getPatientReport", consultantSignup);
// router.post("/consultant/updateAvailibilityTime",consultantLogin);  
// router.post("/consultant/updloadPrescription", consultantSignup);
// router.post("/consultant/updateProfile",consultantLogin);  


// router.post("/shop", userGetShopCProducts);
// router.get("/validateTokenUser", validateTokenUser);

// router.post("/vendor/signup",upload.single("image"), vendorSignup);
// router.post("/vendor/addcategoryproduct",vendorCategory);
// router.post("/vendor/add-product", upload.single("image"), vendorAddProduct);  //given the category name


module.exports = router;
