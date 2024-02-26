const express = require("express");
const httpProxy = require("http-proxy");
const port = 8000;
const BASE_PATH = `https://vercl-clone.s3.ap-south-1.amazonaws.com/__output`;
const proxy = httpProxy.createProxy();

const app = express();
app.use((req, res) => {
  const hostName = req.hostname;
  const subDomain = hostName.split(".")[0];

  const resolvesTo = `${BASE_PATH}/${subDomain}`;
  return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
  const url = req.url;
  if (url === "/") proxyReq.path += "index.html";
  return proxyReq;
});

app.listen(port, () => {
  console.log(`Reverse_proxy started on ${port}`);
});
