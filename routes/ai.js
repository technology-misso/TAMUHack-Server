const express = require("express");
const { download } = require("express/lib/response");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./google-apis/output");
  },
  filename: function (req, file, cb) {
    console.log("Original file received", file);
    const ext = file.mimetype.split("/")[1];
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const {
  downloadFile,
  processDocument,
  uploadFile,
} = require("./ai_utils/utils");
const host = "http://localhost:5000";
const aiRoute = express.Router();

aiRoute.get("/download_document/:fileName", async (req, res) => {
  const fileName = req.params.fileName;

  try {
    const fileName = await downloadFile(fileName);
    // return the public link
    return `host/${fileName}`;
  } catch (e) {
    console.log(e);
  }
});

aiRoute.post("/upload_documnet/:fileName/:customerId", async (req, res) => {
  const { fileName, customerId } = req.params;

  try {
    const fileName = await uploadFile(fileName);
    // return the public link
    // return `host/${fileName}`;
  } catch (e) {
    console.log(e);
  }
});
