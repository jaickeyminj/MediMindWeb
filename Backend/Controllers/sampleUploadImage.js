const {uploadImageToCloudinary} = require("../Utils/imageUploader");
const cloudinary = require("../Config/cloudinary");
const upload = require("../middlewares/multer");

exports.uploadDemo = async (req, res, next) => { 
  
    // req.files is array of `profile-files` files 
    // req.body will contain the text fields, 
    // if there were any 
    var imageUrlList = []; 
  
    for (var i = 0; i < req.files.length; i++) { 
        var locaFilePath = req.files[i].path; 
  
        // Upload the local image to Cloudinary 
        // and get image url as response 
        // var result = await uploadImageToCloudinary(locaFilePath); 
        var result = await cloudinary.uploader.upload(locaFilePath);
        imageUrlList.push(result.url); 
        console.log(result.url);
    } 
  
    // var response = buildSuccessMsg(imageUrlList); 
  
    return res.send(imageUrlList); 
};
