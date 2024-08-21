function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000))
    let expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`
}
function deleteCookie(name) {
    setCookie(name, null, null)
}
function getCookie(name) {
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split("; ");
    let result = null;

    cArray.forEach(element => {
        if (element.indexOf(name) == 0) {
            result = element.substring(name.length + 1)
        }
    })
    return result;
}

function logout() {
    deleteCookie('userInfo')
    window.location.replace('./home.html')
}

async function renderClasses(){
    console.log(getCookie("userInfo"))
    const father = document.getElementById('classTable')
    const classes = await fetch("http://localhost:3333/")
    const classesResult = await classes.json()
    for (var i = 0; i < classesResult.length; i++) {
        const classTBody = document.createElement('tbody');
        father.appendChild(classTBody)
        const classTR = document.createElement('tr');
        classTBody.appendChild(classTR)
        const classTD = document.createElement('td');
        classTR.appendChild(classTD)
        const classInput = document.createElement('input');
        classInput.type= "checkbox";
        classInput.className= "checkbox";
        classInput.id= `${classesResult[i].ClassCode}`;
        classTD.appendChild(classInput)

        const classTD1 = document.createElement('td');
        classTD1.textContent = classesResult[i].ClassCode
        classTR.appendChild(classTD1)
        const classTD2 = document.createElement('td');
        classTD2.textContent = classesResult[i].ClassName
        classTR.appendChild(classTD2)
        const classTD3 = document.createElement('td');
        classTD3.textContent = "NULO"
        classTR.appendChild(classTD3)
        const classTD4 = document.createElement('td');
        classTD4.textContent = classesResult[i].ClassTimeCode
        classTR.appendChild(classTD4)
        const classTD5 = document.createElement('td');
        classTD5.textContent = 'op'
        classTR.appendChild(classTD5)
    }
}

async function handleSubmit(){
    const classes = document.querySelectorAll('input');
    var checkedClasses = [];
    for(var i = 0; i<(classes.length-1);i++){
        if(classes[i].checked) checkedClasses.push(classes[i].id)
    }
    const result = await fetch("http://localhost:3333/conflict", {
        headers: {
            "Content-Type": "application/json",
        },
        method:"POST",
        body: JSON.stringify({
            ClassCodes: checkedClasses,
            userInfo: getCookie('userInfo')
        })
    })
    const response = await result.json()
    if(response != "NO CONFLICT") return alert(response)

    const submit = await fetch("http://localhost:3333/registerToUser", {
        headers: {
            "Content-Type": "application/json",
        },
        method:"POST",
        body: JSON.stringify({
            userInfo: getCookie('userInfo'),
            classes: checkedClasses
        })
    })
    const submitResponse = await submit.json()
    alert(submitResponse);
}


async function loginController(){
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    if(!username.value || !password.value) return alert('Campo de senha e usuario devem serem preenchidos');
    const user = {
        Username:username.value,
        Password:password.value
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const result = await fetch("http://localhost:3333/login", {
        method: "POST",
        body: JSON.stringify(user),
        headers: myHeaders,
    });
    if(result.status !=200) return alert('Informação invalida');

    setCookie("userInfo", username.value, 1)
    //Temp cookie system
    
    return window.location.replace('./index')
}