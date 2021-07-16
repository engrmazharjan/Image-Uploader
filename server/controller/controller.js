const UploadModel = require("../model/schema.js");
const fs = require("fs");

exports.home = async (req, res) => {
  let all_images = await UploadModel.find();
  res.render("main", { images: all_images });
};

exports.upload = (req, res, next) => {
  const files = req.files;
  if (!files) {
    const error = new Error("Please Choose Files");
    error.httpStatusCode = 400;
    return next(error);
  }

  // Convert images into base64 encoding
  let imgArray = files.map((file) => {
    let img = fs.readFileSync(file.path);
    // console.log(img);
    return (encode_img = img.toString("base64"));
  });

  let result = imgArray.map((src, index) => {
    // Create object to store data in the collection/database
    let finalImg = {
      filename: files[index].originalname,
      contentType: files[index].mimetype,
      imageBase64: src,
    };

    let newUpload = new UploadModel(finalImg);

    return newUpload
      .save()
      .then(() => {
        return {
          img: `${files[index].originalname} Uploaded Successfylly...!`,
        };
      })
      .catch((error) => {
        if (error) {
          if (error.name === "MongoError" && error.code === 11000) {
            return Promise.reject({
              error: `Duplicate ${files[index].originalname}.File Already Exists!`,
            });
          }
          return Promise.reject({
            error:
              error.message ||
              `Cannot Upload ${files[index].originalname} Something Missing`,
          });
        }
      });
  });
  Promise.all(result)
    .then((msg) => {
      // res.json(msg);
      res.redirect("/");
    })
    .catch((err) => {
      res.json(err);
    });
};
