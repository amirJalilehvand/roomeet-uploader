const { Types } = require("mongoose");
let Client = require("ssh2-sftp-client");

const File = require("../models/file");
const School = require("../models/school");

module.exports = async () => {
  const file = await File.findOne();
  const newFileName = `${
    file.fileName.split("_-_-_")[0]
  }_-_-_${new Date().getTime()}.${file.fileName.split(".").pop()}`;
  const currentDir = `/sftpdir/${file.school.toString()}/${file.fileName}`;
  const newDir = `/sftpdir/${file.school.toString()}/${newFileName}`;
  let sftp = new Client();
  sftp
    .connect({
      host: "78.157.34.145",
      port: "3698",
      username: "sftpuser",
      password: "Gb696969+",
    })
    .then(async () => {
      try {
        const theJob = await sftp.rename(currentDir, newDir);
        let myArray = file.file_path.split("/");
        let newFilePath = "";
        myArray.forEach((element, index) => {
          if (index === myArray.length - 1) {
            newFilePath += newFileName;
          } else {
            newFilePath += element + "/";
          }
        });
        file.file_path = newFilePath;
        file.fileName = newFileName;
        await file.save();

        console.log("done");
      } catch (err) {
        console.log(err);
      }
    });
};
