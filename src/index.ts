import express from "express";
import cors from "cors";

const app = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:5000",
  })
);
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  console.log(repoUrl);
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});

function generate(): string {
  const subset = "123456789qwertyuiopasdfghjklzxcvbnm";
  const length = 5;
  var id = "";
  for(let i = 0;i<=length;i++)
  id += subset[Math.floor(Math.random() * subset.length)]
  return id;
}
