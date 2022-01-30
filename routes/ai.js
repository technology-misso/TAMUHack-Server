const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    console.log("Original file received", file);
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.originalname}`);
  },
});
const {
  downloadFile,
  processDocument,
  uploadFile,
} = require("../ai_utils/utils");
const host = "http://localhost:5000";
const aiRoute = express.Router();

aiRoute.get("/download_document/:fileName", async (req, res) => {
  const fileName = req.params.fileName;
  try {
    const file = await downloadFile(fileName);
    res.json({ data: `${host}/${file}` });
  } catch (e) {
    console.log(e);
  }
});

const upload = multer({ storage: storage });
aiRoute.post(
  "/upload_document/:customerId",
  upload.single("file"),
  async (req, res) => {
    const { fileName, customerId } = req.params;
    const file = req.file;
    try {
      const result = await uploadFile(file.originalname, customerId);
      return res.json({ data: "upload file done!" });
    } catch (e) {
      return res.json({ message: e });
    }
    // return res.json({ data: "viet" });
  }
);

module.exports = aiRoute;
