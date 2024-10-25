const Class = require('../models/class.js');
const User = require('../models/user.js');
const { Op } = require('sequelize');


function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

const getClassTimeInformation = async (req, res)=>{
    const classFound = await Class.findAll({where:{ClassCode:req.body.ClassCode}});
    if(!classFound) return res.sendStatus(400);
    const result = getTimeInformation(classFound.ClassTimeCode);
    return res.status(200).json(result);
}

const getClass = async (req, res)=>{
    const result = await Class.findAll();
    return res.status(200).json(result);
}

const registerClass = async (req, res)=>{
    const codeExist = await Class.findByPk(req.body.ClassCode)
    if(codeExist) return res.status(400).json("Code Already exist");
    const ClassTimeCode = req.body.ClassTimeCode;
    const ClassName = req.body.ClassName;
    var tempResult = '';
    var tempFull = '';
    if(Array.isArray(ClassTimeCode)) {
        var temp1 =  getTimeInformation(ClassTimeCode[0]).classFull
        var temp2 =  getTimeInformation(ClassTimeCode[1]).classFull
        var tempResult = temp1.concat(temp2);
        tempResult.map((e)=>tempFull= tempFull + e);
    }else{
        tempResult = getTimeInformation(ClassTimeCode).classFull
        
        tempResult.map((e)=>tempFull= tempFull + e);
    }
    const ClassTimeFull =tempFull;
    const ClassCode = req.body.ClassCode;
    
    var ClassTimeCodeF;
    if(Array.isArray(ClassTimeCode)){
        ClassTimeCodeF = ClassTimeCode[0] + ", " + ClassTimeCode[1]
    }else{
        ClassTimeCodeF = ClassTimeCode
    }
    

    if(!ClassName|| !ClassTimeCode || !ClassCode) return res.status(400).json("Some data is empty")
    const result = await Class.create({
    ClassTimeFull,
    ClassName,
    ClassTimeCode: ClassTimeCodeF,
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
            conflict.push(`${classResult[i].ClassName} conflita com ${classResult[j].ClassName}`)};
        }
    }
    if(conflict.length==0) return res.status(200).json("NO CONFLICT");
    return res.status(200).json(conflict);
}
// Worst code ever writen, but at least works
function getTimeFull(time, start, turn){
    switch (turn) {
        case 'M':
            switch(time){
                case 1:
                    if(start) return " 7:00"
                    return " 7:55"
                case 2:
                    if(start) return " 7:55"
                    return " 8:50"
                case 3:
                    if(start) return " 8:50"
                    return " 9:45"
                case 4:
                    if(start) return " 9:55"
                    return " 10:50"
                case 5:
                    if(start) return " 10:50"
                    return " 11:45"
                case 5:
                    if(start) return " 11:45"
                    return " 12:40"
            }
            break;
        case 'V':
            switch(time){
                case 1:
                    if(start) return " 13:00"
                    return " 13:55"
                case 2:
                    if(start) return " 13:55"
                    return " 14:50"
                case 3:
                    if(start) return " 14:50"
                    return " 15:45"
                case 4:
                    if(start) return " 15:55"
                    return " 16:50"
                case 5:
                    if(start) return " 16:50"
                    return " 17:45"
                case 5:
                    if(start) return " 17:45"
                    return " 18:40"
            }
            break;
        case 'N':
            switch(time){
                case 1:
                    if(start) return " 18:50"
                    return " 19:45"
                case 2:
                    if(start) return " 19:45"
                    return " 20:40"
                case 3:
                    if(start) return " 20:40"
                    return " 21:35"
                case 4:
                    if(start) return " 21:35"
                    return " 22:30"
            }
            break;
        default:
            return "NOT FOUND"
            break;
    }

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
    var classDay = ClassTimeInformationCode.substring(0,i).split('').map((e)=> parseInt(e));
    var classTurn = ClassTimeInformationCode.substring(i,i+1);
    var classTime = ClassTimeInformationCode.substring(i+1).split('').map((e)=> parseInt(e));
    
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
        switch(classDay[0]){
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
            inFull[1] = ", turno matutino";
            break;
        case 'V':
            inFull[1] = ", turno vespertino";
            break;
        case 'N':
            inFull[1] = ", turno noturno";
            break;
        default:
            inFull[1] = "NOT FOUND";
            break;
    }


    inFull[2] = (getTimeFull(classTime[0], true, classTurn) +'-' + getTimeFull(classTime[classTime.length-1], false, classTurn)+" ")
    

    if(ClassTimeInformationCode.length>7){
        var classTime = ClassTimeInformationCode.substring(i+1, i+3).split('').map((e)=> parseInt(e));
        const b =ClassTimeInformationCode.indexOf(',')
        ClassTimeInformationCode = ClassTimeInformationCode.replace(ClassTimeInformationCode.substring(0, b+2), '')
        var i = 0;
        while(isNumber(ClassTimeInformationCode.at(i))){
            i++;
            if(i>5) return false;
        }
        classDay = classDay + ClassTimeInformationCode.substring(0,i).split('').map((e)=> parseInt(e));
        classDay = classDay.split('').map((e)=> parseInt(e));
        if(ClassTimeInformationCode.substring(i,i+1) == classTurn){

        }else{
            classTurn = classTurn + ClassTimeInformationCode.substring(i,i+1);
        }
        classTime = classTime +"," + ClassTimeInformationCode.substring(i+1).split('').map((e)=> parseInt(e));
        classTime = classTime.split(',').map((e)=> parseInt(e))
        
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
            switch(classDay[3]){
                case 2:
                    inFull[3] = "Segunda";
                break;
                case 3:
                    inFull[3] = "Terça";
                break;
                case 4:
                    inFull[3] = "Quarta";
                break;
                case 5:
                    inFull[3] = "Quinta";
                break;
                case 6:
                    inFull[3] = "Sexta";
                break;
                default:
                        break;
            }
        }

        
        switch (classTurn) {
            case 'M':
                inFull[4] = ", turno matutino";
                break;
            case 'V':
                inFull[4] = ", turno vespertino";
                break;
            case 'N':
                inFull[4] = ", turno noturno";
                break;
            default:
                inFull[4] = "NOT FOUND";
                break;
        }

        inFull[5] = (getTimeFull(classTime[0], true, classTurn) +'-' + getTimeFull(classTime[classTime.length-1], false, classTurn))
        
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
    var conflict = false;
    var sameDay = false;
    const classInformation1 = getTimeInformation(ClassCode1.ClassTimeCode);
    console.log(classInformation1)
    const classInformation2 = getTimeInformation(ClassCode2.ClassTimeCode);
    //verify turn
    if(classInformation1.classTurn != classInformation2.classTurn) return true

    console.log(classInformation1)

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
    })

    if(conflict) return false

    return true;
}

module.exports = {getClass, registerClass, deleteClass, getClassByCode, verifyConflit, getClassTimeInformation};