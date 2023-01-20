const Queue = require("../models/queue");
var FTPS = require("ftps");
var fs = require("fs");
const md5 = require("md5");

const { Router } = require("express");

const canUserUploadThisFile = require("../middlewares/canUserUploadThisFile");

const router = Router();

router.post("/", canUserUploadThisFile, async (req, res, next) => {
  const schoolId = req.query.schoolId;
  const meetingId = req.query.meetingId;
  try {
    if (!(req.files && req.files.length)) {
      //todos
      throw new Error("no files wre found");
    } else {
      let fileSize = req.files[0].size / (1024 * 1024);

      const queue = new Queue({
        file_path: req.files[0].path,
        file_size: fileSize.toFixed(2),
        school: schoolId,
        meeting: meetingId,
        job_type: "UPLOAD",
      });

      await queue.save();

      var ftps = new FTPS({
        host: "up.roomeet.ir", // required
        username: "root", // Optional. Use empty username for anonymous access.
        password: "Up369963", // Required if username is not empty, except when requiresPassword: false
        protocol: "sftp", // Optional, values : 'ftp', 'sftp', 'ftps', ... default: 'ftp'
        // // protocol is added on beginning of host, ex : sftp://domain.com in this case
        port: 3698, // Optional
        // // port is added to the end of the host, ex: sftp://domain.com:22 in this case
        // escape: true, // optional, used for escaping shell characters (space, $, etc.), default: true
        // retries: 2, // Optional, defaults to 1 (1 = no retries, 0 = unlimited retries)
        // timeout: 10, // Optional, Time before failing a connection attempt. Defaults to 10
        // retryInterval: 5, // Optional, Time in seconds between attempts. Defaults to 5
        // retryMultiplier: 1, // Optional, Multiplier by which retryInterval is multiplied each time new attempt fails. Defaults to 1
        // requiresPassword: true, // Optional, defaults to true
        // autoConfirm: true, // Optional, is used to auto confirm ssl questions on sftp or fish protocols, defaults to false
        // cwd: '', // Optional, defaults to the directory from where the script is executed
        // additionalLftpCommands: '', // Additional commands to pass to lftp, splitted by ';'
        // requireSSHKey:  true, //  Optional, defaults to false, This option for SFTP Protocol with ssh key authentication
        // sshKeyPath: '/home1/phrasee/id_dsa', // Required if requireSSHKey: true , defaults to empty string, This option for SFTP Protocol with ssh key authentication
        // sshKeyOptions: '' // ssh key options such as 'StrictHostKeyChecking=no'
      });
      // Do some amazing things
      ftps.ls().exec(console.log);

      return res.status(200).json({
        fuck: "yes",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/upload", async (req, res, next) => {
  try {
    const { name, totalChunks, currentChunkIndex } = req.query;
    const ext = name.split(".").pop();
    const data = req.body.toString().split(",")[1];
    const buffer = new Buffer.from(data ,'base64');
    const tempFileName = "temp_" + md5(name) + "." + ext;

    const firstChunk = parseInt(currentChunkIndex) === 0;
    const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) - 1;

    if (firstChunk && fs.existsSync("./public/uploads/" + tempFileName)) {
      fs.unlinkSync("./public/uploads/" + tempFileName);
    }

    fs.appendFileSync("./public/uploads/" + tempFileName, buffer);

    let finalFileName;
    if (lastChunk) {
      const originalNameArray = name.split(".");
      let originalName = "";
      originalNameArray.forEach((element, index) => {
        if (index !== originalNameArray.length - 1) {
          originalName += element + ".";
        } else {
          originalName += new Date().getTime() + "." + ext;
        }
      });
      finalFileName = originalName;
      fs.renameSync(
        "./public/uploads/" + tempFileName,
        "./public/uploads/" + finalFileName
      );

      res.status(201).json({
        finalFileName,
      });
    } else {
      res.status(201).json({
        data: "ok",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
