const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const Redis = require("ioredis");
// const {accessKeyId,secretAccessKey} = require('./config')

const publisher = new Redis(process.env.redisUri);
const PROJECT_ID = process.env.PROJECT_ID;

function publishLog(log) {
  publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }));
}
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
});

async function init() {
  console.log("Script.js executing");
  publishLog('Build started')
  const outDirPath = path.join(__dirname, "output");

  const p = exec(`cd ${outDirPath} && npm install && npm run build`);
  p.stdout.on("data", function (data) {
    console.log(data.toString());
    publishLog(data.toString())
  });

  p.stdout.on("error", function (data) {
    console.log("Error", data.toString());
    publishLog(`Error : ${data.toString()}`)
  });

  p.on("close", async function () {
    console.log("Build complete");
    publishLog('Build Complete')
    const distPath = path.join(__dirname, "output", "dist");
    const distContents = fs.readdirSync(distPath, { recursive: true });

    publishLog('Uploading to S3')
    for (const file of distContents) {
      console.log(file);
      const filePath = path.join(distPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;
      console.log("Uploading", filePath);
      publishLog(`Uploading : ${file}`)
      const command = new PutObjectCommand({
        Bucket: "vercl-clone",
        Key: `__output/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath),
      });
      await s3Client.send(command);
      console.log("Uploaded", filePath);
      publishLog(`Uploaded ${file}`)
    }
    console.log("Built code has been uploaded to S3");
    publishLog('Files uploaded')
  });
}
init();
