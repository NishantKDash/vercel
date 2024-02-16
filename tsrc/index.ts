import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import generate from "./generator";

const app = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:5000",
  })
);
app.use(express.json());

app.post("/deploy", async (req, res) => {
  try {
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const id = generate();
    await simpleGit().clone(repoUrl, `./output/${id}`);
    res.json({ message: "Repository uploaded" });
  } catch (e) {
    console.log(e);
    res.json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
