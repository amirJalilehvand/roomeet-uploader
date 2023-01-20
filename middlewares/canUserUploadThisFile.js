const fs = require('fs')
const getSchoolAvailableVolume = require("../hooks/getSchoolAvailableVolume");

module.exports = async (req, res, next) => {
  const schoolId = req.query.schoolId;

  try {
    if (!(req.files && req.files.length)) {
      //todos
      throw new Error("no files wre found");
    } else {
      let fileSize = req.files[0].size / (1024 * 1024);
      const availableSize = await getSchoolAvailableVolume(schoolId);

      if (fileSize > availableSize) {
        fs.unlinkSync(req.files[0].path);
        //todos
        throw new Error("low memory");
      }

      next();
    }
  } catch (err) {
    //todos
    throw new Error(err.message);
  }
};
