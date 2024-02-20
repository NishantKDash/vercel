const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
// const {accessKeyId,secretAccessKey} = require('./config')

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
});
const PROJECT_ID = process.env.PROJECT_ID;
async function init() {
  console.log("Script.js executing");
  const outDirPath = path.join(__dirname, "output");

  const p = exec(`cd ${outDirPath} && npm install && npm run build`);
  p.stdout.on("data", function (data) {
    console.log(data.toString());
  });

  p.stdout.on("error", function (data) {
    console.log("Error", data.toString());
  });

  p.on("close", async function () {
    console.log("Build complete");
    const distPath = path.join(__dirname, "output", "dist");
    const distContents = fs.readdirSync(distPath, { recursive: true });
    for (const file of distContents) {
      console.log(file)
      const filePath = path.join(distPath,file)
      if (fs.lstatSync(filePath).isDirectory()) continue;
      console.log("Uploading", filePath);
      const command = new PutObjectCommand({
        Bucket: "vercl-clone",
        Key: `__output/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath),
      });
      await s3Client.send(command);
      console.log("Uploaded", filePath);
    }
    console.log("Built code has been uploaded to S3");
  });
}
init();
