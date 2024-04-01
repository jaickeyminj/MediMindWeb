const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer")


const {patientSignup, patientLogin, updatePatientData, validateTokenPatient} = require("../Controllers/patientAuth");
const {consultantSignup, consultantLogin, updateAvailabilityTime, validateTokenConsultant } = require("../Controllers/consultantAuth");
const { searchConsultantBySpecialty, getAllConsultants, getConsultantsData } = require("../Controllers/searchConsultant");
const {createAppointment, getallAppointmentsForPatient, getScheduledAppointmentsForConsultant, getRequestedAppointmentList, acceptAppointmentRequest, rejectAppointmentRequest } = require("../Controllers/appointment");

const { handleAppointment, handleGoogleRedirect,scheduleEvent} = require("../Controllers/meet2");
const { createRazorpayOrder} = require("../Config/razorpay");
const { storeReportLink } = require("../Controllers/uploadReports");
//const upload = require("../middlewares/multer");

router.post("/patient/login",patientLogin);  
router.post("/patient/signup", patientSignup);
router.post("/patient/validateTokenPatient", validateTokenPatient);
router.post("/patient/SearchConsultant", searchConsultantBySpecialty);
router.get("/patient/getAllConsultants", getAllConsultants);
router.get("/patient/getConsultantsData", getConsultantsData);
router.put("/patient/updatePatientData", updatePatientData);
router.post("/patient/RequestAppointment", createAppointment);
router.get("/patient/getallAppointmentsForPatient", getallAppointmentsForPatient);
router.post("/UploadReports",upload.array("files", 12),storeReportLink);
//router.post("/patient/uploadReports", upload.single("image"), patientSignup);


// router.get("/patient/getReports", patientSignup);

// router.post("/patient/ConsultantFeedback", patientSignup);



router.post("/consultant/login",consultantLogin);  
router.post("/consultant/signup", consultantSignup);
router.post("/consultant/validateTokenConsultant", validateTokenConsultant);
router.get("/consultant/getRequestedAppointmentList",getRequestedAppointmentList);

router.post("/consultant/acceptAppointmentRequest",acceptAppointmentRequest);
router.post("/consultant/rejectAppointmentRequest",rejectAppointmentRequest);
router.get("/consultant/getScheduledAppointmentsForConsultant",getScheduledAppointmentsForConsultant);
router.post("/consultant/updateAvailabilityTime",updateAvailabilityTime); 






// router.post("/consultant/getPatientReport", consultantSignup);
// router.post("/consultant/updloadPrescription", consultantSignup);
// router.post("/consultant/updateProfile",consultantLogin);  


// router.post("/shop", userGetShopCProducts);
// router.get("/validateTokenUser", validateTokenUser);

// router.post("/vendor/signup",upload.single("image"), vendorSignup);
// router.post("/vendor/addcategoryproduct",vendorCategory);
// router.post("/vendor/add-product", upload.single("image"), vendorAddProduct);  //given the category name

router.post("/patient/getMeetlink",handleAppointment);
router.post("/patient/handleGoogleRedirect",handleGoogleRedirect);
router.post("/patient/scheduleEvent",scheduleEvent);

router.post("/patient/razorpay/order",createRazorpayOrder);




module.exports = router;
