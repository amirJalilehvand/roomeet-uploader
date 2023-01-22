var qjobs = new require("qjobs");
let Client = require("ssh2-sftp-client");

const Queue = require("../models/queue");
const File = require("../models/file");
const school = require("../models/school");

module.exports = async () => {
  const queues = await Queue.find({
    done: false,
    job_type: "UPLOAD",
  })

  const mainDir = "./sftpdir"
  let sftp = new Client();
  
  if (queues.length) {
    var q = new qjobs({ maxConcurrency: queues.length });
    var myjob = function (item, next) {
      //todos
      console.log(item);
      next();
    };

    queues.forEach((element) => {
      q.add(myjob, element);
    });

    q.on("start", function () {
      console.log("Starting ...");
    });

    q.on("end", function () {
      console.log("... All jobs done");
    });

    q.on("jobStart", function (item) {
      const schoolId = item.school.toString();
      console.log("jobStart", item);
      sftp
      .connect({
        host: "78.157.34.145",
        port: "3698",
        username: "sftpuser",
        password: "Gb696969+",
      }).then(async () => {
        const listedItems = await sftp.list(mainDir);
        let subDir = mainDir + '/' + schoolId + '/';
        if(listedItems.findIndex(item => item.name === schoolId) < 0){
          await sftp.mkdir(subDir);
        }

        //return sftp.fastGet(subDir + "/app.js" , './app2.js');
        const theFileItSelf = item.file_path.split('\\').pop()
        //return sftp.delete(subDir + "/app.js")
        return sftp.put(item.file_path, subDir + theFileItSelf);
      }).catch(err => console.log(err))
    });

    q.on("jobEnd", async function (item) {
      console.log("jobend", item);
      const queItem = await Queue.findById(item._id);
      queItem.done  = true;
      await queItem.save();

      const newFile = new File({
        file_path:`http://up.roomeet.ir/download/${item.school.toString()}/${item.fileName}`,
        file_size:item.file_size,
        meeting:item.meeting,
        school:item.school,
      })

      await newFile.save()
    });

    q.on("pause", function (since) {
      console.log("in pause since " + since + " milliseconds");
    });

    q.on("unpause", function () {
      console.log("pause end, continu ..");
    });

    q.run();
  }
};
