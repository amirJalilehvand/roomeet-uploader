const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser')

const fileRouter = require("./router/file");
const uploadFile = require("./hooks/uploadFile");
const removeFile = require("./hooks/changeFileName");

const app = express();
app.use(bodyParser.raw({type:'application/octet-stream' , limit:'100mb'}));
app.use(cors())


app.use("/file", fileRouter);

mongoose.connect(
  "mongodb://localhost:27017/roomeet",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      //uploadFile()
      removeFile()
      console.log("mongo connected");
      app.listen(5000);
    }
  }
);
