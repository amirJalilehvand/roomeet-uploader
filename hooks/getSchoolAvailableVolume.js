const School = require('../models/school');

module.exports = async (schoolId) => {
    const school = await School.findById(schoolId).populate({
        path:'fileService',
        populate:{
            path:'sale'
        }
    }).exec()
    
    if(!school || school.isRemoved){
        //todos error
        throw new Error("no files were found");
    }

    if(!school.fileService || !school.fileService.total){
        school.fileService = {
            isActive:false,
            sale:null,
            total:1024,
            used:0
        }

        school.markModified('fileService');
        const savedSchool = await school.save();
        return savedSchool.fileService.total - savedSchool.fileService.used;
    }else{
        return school.fileService.total - school.fileService.used;
    }
}