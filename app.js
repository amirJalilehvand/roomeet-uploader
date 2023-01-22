/*
var qjobs = new require('qjobs');
                                
// My non blocking main job     
var myjob = function(args,next) {
    setTimeout(function() {
        console.log('Do something interesting here',args);
        next();
    },10000);
}

var q = new qjobs({maxConcurrency:10});

// Let's add 30 job to the queue
for (var i = 0; i<30; i++) {
    q.add(myjob,[i,'test '+i]);
}

q.on('start',function() {
    console.log('Starting ...');
});

q.on('end',function() {
    console.log('... All jobs done');
});

q.on('jobStart',function(args) {
    console.log('jobStart',args);
});

q.on('jobEnd',function(args) {

    console.log('jobend',args);

    // If i'm jobId 10, then make a pause of 5 sec

    if (args._jobId == 10) {
        q.pause(true);
        setTimeout(function() {
            q.pause(false);
        },50000);
    }
});

q.on('pause',function(since) {
    console.log('in pause since '+since+' milliseconds');
});

q.on('unpause',function() {
    console.log('pause end, continu ..');
});

q.run();
*/
const express = require("express");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser')

const fileRouter = require("./router/file");
const uploadFile = require("./hooks/uploadFile");

const app = express();
app.use(bodyParser.raw({type:'application/octet-stream' , limit:'100mb'}));
app.use(cors())

// let Client = require("ssh2-sftp-client");
// const File = require("./models/file");
// const school = require("./models/school");
// File.findOne()
//   .then(async (_) => {
//     const schoolId = "62c16d51b918f956459897e6";
//     const mainDir = "./sftpdir"
//     let sftp = new Client();
//     sftp
//       .connect({
//         host: "78.157.34.145",
//         port: "3698",
//         username: "sftpuser",
//         password: "Gb696969+",
//       })
//       .then(async() => {
//         const listedItems = await sftp.list(mainDir);
//         let subDir = mainDir + '/' + schoolId;
//         if(listedItems.findIndex(item => item.name === schoolId) < 0){
//           await sftp.mkdir(subDir);
//         }

//         //return sftp.fastGet(subDir + "/app.js" , './app2.js');

//         //return sftp.delete(subDir + "/app.js")
//         return sftp.put("./app.js", subDir + "/app.js");
//         //return sftp.delete('./sftpdir/app.mkv')
//       })
//       .then((data) => {
//         console.log(data, "the data info");
//       })
//       .catch((err) => {
//         console.log(err, "catch error");
//       });

//     // Do some amazing things
//     //ftps.ls().exec(console.log);
//     //ftps.put('./hooks/uploadFile.js' , './')
//     // ftps.pwd().exec(function (err, res) {
//     //   if (err || res.error) return console.log("Error", err || res.error);
//     //   console.log(res);
//     // });
//   })
//   .catch((err) => console.log(err));

app.use("/file", fileRouter);

// const func= async () => {
//   await uploadFile()
// }

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
      uploadFile()
      console.log("mongo connected");
      app.listen(5000);
    }
  }
);
