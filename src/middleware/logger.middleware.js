import express from "express";
import morgan from "morgan";
const app = express();


app.use(morgan("combined"));


function logger(req, res, next) {
  console.log("Request Method: ", req.method);
  console.log("Request URL: ", req.url);
  // console.log("Status Code: ", res.status());
  next();
}

app.use(logger);


export default logger;