const { Types } = require("mongoose");
let Client = require("ssh2-sftp-client");

const File = require("../models/file");
const School = require("../models/school");

module.exports = async () => {
  const file = await File.findOne();
  const schoolId = file.school.toString();

  const mainDir = "./sftpdir";
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
            const removedFileDir = `${mainDir}/${schoolId}/${file.fileName}`;

            const theJob = await sftp.delete(removedFileDir);

            const school = await School.findOne({_id: Types.ObjectId(file.school) , isRemoved: false});
            school.fileService.used = (school.fileService.used - file.file_size).toFixed(2);
            await school.save();
        
            const removedFile = await File.findByIdAndRemove(file._id);
            console.log('done');

        }catch(err){
            console.log(err);
        }

    })
};
