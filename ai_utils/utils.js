const keyFilename = "credentials/client.json";
const projectId = "youtubeapi-testing-321117";
const { DocumentProcessorServiceClient } =
  require("@google-cloud/documentai").v1;
const { Storage } = require("@google-cloud/storage");
const bucketName = "my--first-test-images";

const storage = new Storage({ projectId, keyFilename });

async function uploadFile(fileName, customerId) {
  const path = `public/${fileName}`;
  try {
    const destFileName = `${customerId}-${fileName}`;
    await storage.bucket(bucketName).upload(path, {
      destination: destFileName,
    });
  } catch (e) {
    console.log(e);
  }
}

// uploadFile(filePath);

// download the objecdt
async function downloadFile(fileName) {
  const destFileName = `./public/${fileName}`;
  const bucketName = "my--first-test-images";
  const options = {
    destination: destFileName,
  };

  // Downloads the file
  await storage.bucket(bucketName).file(fileName).download(options);

  console.log(`gs://${bucketName}/${fileName} downloaded to ${destFileName}.`);
  return fileName;
}

const client1 = new DocumentProcessorServiceClient({ projectId, keyFilename });

async function processDocument() {
  const filePath = "./images/pdf.pdf";
  // The full resource name of the processor, e.g.:
  // projects/project-id/locations/location/processor/processor-id
  // You must create new processors in the Cloud Console first
  const name = `projects/${projectId1}/locations/${location}/processors/${processorId1}`;
  // const name = "projects/437335402199/locations/us/processors/803ebd2248a1011f";

  // Read the file into memory.
  const fs = require("fs").promises;
  const imageFile = await fs.readFile(filePath);

  // Convert the image data to a Buffer and base64 encode it.
  const encodedImage = Buffer.from(imageFile).toString("base64");

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: "application/pdf",
    },
  };

  // Recognizes text entities in the PDF document
  const [result] = await client1.processDocument(request);
  const { document } = result;

  // Get all of the document text as one big string
  const { text } = document;

  // Extract shards from the text field
  const getText = (textAnchor) => {
    if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
      return "";
    }

    // First shard in document doesn't have startIndex property
    const startIndex = textAnchor.textSegments[0].startIndex || 0;
    const endIndex = textAnchor.textSegments[0].endIndex;

    return text.substring(startIndex, endIndex);
  };

  // Read the text recognition output from the processor
  console.log("The document contains the following paragraphs:");
  const [page1] = document.pages;
  const { paragraphs } = page1;

  for (const paragraph of paragraphs) {
    const paragraphText = getText(paragraph.layout.textAnchor);
    console.log(`Paragraph text:\n${paragraphText}`);
  }

  // Form parsing provides additional output about
  // form-formatted PDFs. You  must create a form
  // processor in the Cloud Console to see full field details.
  console.log("\nThe following form key/value pairs were detected:");

  const { formFields } = page1;
  for (const field of formFields) {
    const fieldName = getText(field.fieldName.textAnchor);
    const fieldValue = getText(field.fieldValue.textAnchor);

    console.log("Extracted key value pair:");
    console.log(`\t(${fieldName}, ${fieldValue})`);
  }
}
module.exports = {
  downloadFile,
  processDocument,
  uploadFile,
};
