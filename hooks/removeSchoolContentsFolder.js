const { Types } = require("mongoose");
let Client = require("ssh2-sftp-client");

const File = require("../models/file");
const School = require("../models/school");

module.exports = async () => {
  const schoolId = "62c408e26727114fd623a1bd";

  const mainDir = "/sftpdir";
  let sftp = new Client();
  sftp
    .connect({
      host: "78.157.34.145",
      port: "3698",
      username: "sftpuser",
      password: "Gb696969+",
    })
    .then(async () => {
        try{
            const removedDir = `${mainDir}/${schoolId}`;

            const theJob = await sftp.rmdir(removedDir , true);

            const files = await File.find({school:schoolId});
            files.forEach(async item => {
                await File.findByIdAndRemove(item._id);
            })

            console.log('done');

        }catch(err){
            console.log(err);
        }
    })
};
