const Class = require('../models/class.js');
const User = require('../models/user.js');
const { Op } = require('sequelize');


function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

const getClass = async (req, res)=>{
    const result = await Class.findAll();
    return res.status(200).json(result);
}

const registerClass = async (req, res)=>{
    const codeExist = await Class.findByPk(req.body.ClassCode)
    if(codeExist) return res.status(400).json("Code Already exist");

    const ClassTimeCode = req.body.ClassTimeCode;
    const ClassName = req.body.ClassName;
    const ClassCode = req.body.ClassCode;
    if(!ClassName|| !ClassTimeCode || !ClassCode) return res.status(400).json("Some data is empty")
    const result = await Class.create({
    ClassName,
    ClassTimeCode,
    ClassCode,
}); 
    return res.json(result);
}

const deleteClass = async (req, res)=>{
    const classFound = await Class.findByPk(req.body.ClassCode) 
    if(!classFound) return res.status(400).json('Class not found')
    await Class.destroy({where: {ClassCode: req.body.ClassCode}})
    return res.status(200).json(`Class ${classFound.ClassCode} Deleted`);
}

const getClassByCode = async (req, res)=>{
    // if req.params._id is favicon.ico then response immediately
    if (req.params.id === "favicon.ico") {
        return res.status(404)
    }
    const classFound = await Class.findByPk(req.params.ClassCode);
    if(!classFound) return res.status(400).json('class not found');
    return res.status(200).json(classFound);
}


const verifyConflit = async (req, res)=>{
    var classResult=[];
    var conflict = [];
    var tempClasses = [];
    const classCodes = req.body.ClassCodes;
    const username = req.body.userInfo;
    const ResultUser = await User.findOne({where: {
        UserName:username,
    },
});
    if(!(ResultUser.Classes == null)){
        JSON.parse(ResultUser.Classes).map((e)=>tempClasses.push(e))
    }
    const userClasses = await Class.findAll({where: {
        ClassCode:tempClasses,
    },
});

    const Result = await Class.findAll({where: {
        ClassCode:classCodes,
    },
});
    
    Result.map((e)=>classResult.push(e.dataValues))
    userClasses.map((e)=>classResult.push(e.dataValues))
    for(var i =0; i<classResult.length; i++){
        for(var j = (1+i); j<classResult.length; j++){
        if(!verifyTime(classResult[i], classResult[j])){
            conflict.push(`${classResult[i].ClassCode} conflita com ${classResult[j].ClassCode}`)};
        }
    }
    if(conflict.length==0) return res.status(200).json("NO CONFLICT");
    return res.status(200).json(conflict);
}


//TODO: ADD TIME TO FULL
function getTimeInformation(ClassTimeInformationCode){
    //inFull 0: Days; 1: turn; 2: time
    var inFull=[];
    var i = 0;
    while(isNumber(ClassTimeInformationCode.at(i))){
        i++;
        if(i>5) return false;
    }
    const classDay = ClassTimeInformationCode.substring(0,i).split('').map((e)=> parseInt(e));
    const classTurn = ClassTimeInformationCode.substring(i,i+1);
    const classTime = ClassTimeInformationCode.substring(i+1).split('').map((e)=> parseInt(e));
    
    if(classDay.length>1){
        var tempFull = [];
        for(var i =0; classDay.length>i; i++){
            switch(classDay[i]){
                case 2:
                    tempFull[i] = "Segunda";
                break;
                case 3:
                    tempFull[i] = "Terça";
                break;
                case 4:
                    tempFull[i] = "Quarta";
                break;
                case 5:
                    tempFull[i] = "Quinta";
                break;
                case 6:
                    tempFull[i] = "Sexta";
                break;
                default:
                break;
            }
        }
        inFull[0] = `${tempFull[0]} e ${tempFull[1]}`;
    }else{
        switch(classDay){
            case 2:
                inFull[0] = "Segunda";
            break;
            case 3:
                inFull[0] = "Terça";
            break;
            case 4:
                inFull[0] = "Quarta";
            break;
            case 5:
                inFull[0] = "Quinta";
            break;
            case 6:
                inFull[0] = "Sexta";
            break;
            default:
                    break;
        }
    }

    
    switch (classTurn) {
        case 'M':
            inFull[1] = "Matutino";
            break;
        case 'V':
            inFull[1] = "Vespertino";
            break;
        case 'N':
            inFull[1] = "Noturno";
            break;
        default:
            inFull[1] = "NOT FOUND";
            break;
    }

    const ClassTimeInformationCodeResult = {
    classDay: classDay,
    classTurn: classTurn,
    classTime: classTime,
    classFull: inFull
}
    return ClassTimeInformationCodeResult;
}

//TODO: Flag error when code is wrong
//TRUE = NO confict; FALSE = Conflict
function verifyTime(ClassCode1, ClassCode2){
    const classInformation1 = getTimeInformation(ClassCode1.ClassTimeCode);
    const classInformation2 = getTimeInformation(ClassCode2.ClassTimeCode);
    console.log(classInformation1)
    console.log(classInformation2)
    var conflict = false;
    var sameDay = false;

    //verify turn
    if(classInformation1.classTurn != classInformation2.classTurn) return true

    classInformation1.classDay.map((e)=>{
        if(classInformation2.classDay.includes(e)){
            sameDay = true
        } 
    })
    
    //verify time
    classInformation1.classTime.map((e)=>{
        if((classInformation2.classTime.includes(e)) && sameDay &&(ClassCode1.classTurn ==ClassCode2.classTurn)) {
            conflict = true;
        }
        console.log((ClassCode1.ClassCode !=ClassCode2.ClassCode))
    })

    if(conflict) return false

    return true;
}

module.exports = {getClass, registerClass, deleteClass, getClassByCode, verifyConflit};