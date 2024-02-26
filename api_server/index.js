const express = require("express");
const { generateSlug } = require("random-word-slugs");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");

const app = express();
const port = 9000;
app.use(express.json());

const ecsClient = new ECSClient({
  region:'ap-south-1',
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
});

app.post("/deploy", async (req, res) => {
  const { gitUrl } = req.body;
  const project_id = generateSlug();

  const command = new RunTaskCommand({
    cluster: process.env.cluster,
    taskDefinition: process.env.task,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [
          "subnet-09cbe3f145866bbcc",
          "subnet-0ec41c76aef6a4473",
          "subnet-0f43efd52562b4dc5",
        ],
        securityGroups: ["sg-0259483210c946a3f"],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "vercel_builder_image",
          environment: [
            {
              name: "GIT_REPOSITORY_URL",
              value: gitUrl,
            },
            {
              name: "PROJECT_ID",
              value: project_id,
            },
            {
              name: "accessKeyId",
              value: process.env.accessKeyId,
            },
            {
              name: "secretAccessKey",
              value: process.env.secretAccessKey,
            },
            {
              name:"redisUri",
              value: process.env.redisUri
            }
          ],
        },
      ],
    },
  });

  await ecsClient.send(command);
  return res.json({
    status: "Processing",
    data: {
      project_id,
      url: `http://${project_id}.localhost:8000`,
    },
  });
});

app.listen(port, () => {
  console.log(`Api server started on port ${port}`);
});
