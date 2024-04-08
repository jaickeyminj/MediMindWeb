const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer")


const {patientSignup, patientLogin, updatePatientData, validateTokenPatient} = require("../Controllers/patientAuth");
const {consultantSignup, consultantLogin, updateAvailabilityTime, validateTokenConsultant } = require("../Controllers/consultantAuth");
const { searchConsultantBySpecialty, getAllConsultants, getConsultantsData } = require("../Controllers/searchConsultant");
const {createAppointment, getallAppointmentsForPatient, getScheduledAppointmentsForConsultant, getRequestedAppointmentList, acceptAppointmentRequest, rejectAppointmentRequest, getMeetingLink } = require("../Controllers/appointment");
const {addPredictedDisease, updatePredictionStatus, getPredictedDiseases} = require("../Controllers/diseaseprediction");

const { handleAppointment, handleGoogleRedirect,scheduleEvent,redirectToGoogle} = require("../Controllers/meet2");
const { createRazorpayOrder, createMeetLink} = require("../Config/razorpay");
const { storeReportLink, getAllReportIds } = require("../Controllers/uploadReports");
//const upload = require("../middlewares/multer");

router.post("/patient/login",patientLogin);  
router.post("/patient/signup", patientSignup);
router.post("/patient/validateTokenPatient", validateTokenPatient);
router.post("/patient/SearchConsultant", searchConsultantBySpecialty);
router.get("/patient/getAllConsultants", getAllConsultants);
router.post("/patient/getConsultantsData", getConsultantsData);
router.put("/patient/updatePatientData", updatePatientData);
router.post("/patient/RequestAppointment", createAppointment);
router.get("/patient/getallAppointmentsForPatient", getallAppointmentsForPatient);
router.post("/UploadReports",upload.array("files", 12),storeReportLink);
router.post("/getAllReportIds",getAllReportIds);
router.post("/getMeetingLink",getMeetingLink);
router.post("/patient/addPredictedDisease", addPredictedDisease);
router.post("/patient/updatePredictionStatus", updatePredictionStatus);
router.post("/patient/getPredictedDiseases", getPredictedDiseases);

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

router.get("/patient/getMeetlink",redirectToGoogle);
router.get("/patient/handleGoogleRedirect",handleGoogleRedirect);
router.get("/patient/scheduleEvent",scheduleEvent);

router.post("/patient/razorpay/order",createRazorpayOrder);
router.post("/patient/createMeetLink",createMeetLink);




module.exports = router;