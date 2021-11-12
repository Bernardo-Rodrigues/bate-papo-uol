let inputScreen = document.querySelector(".input-screen")
let inputLogin = document.querySelector(".input-login")
let loadingAnimation = document.querySelector(".loading")

let chatBackground = document.querySelector("main")
let mainScreen = document.querySelector(".main-screen")
let transparentScreen = document.querySelector(".transparent-dark")
let menu = document.querySelector(".menu")

let contacts = document.querySelector(".contacts ul")
let selectedContact = document.querySelector(".contacts ul").children[0];
let seletedVisibility = document.querySelector(".visibility ul").children[0];
let public = seletedVisibility;

let chat = document.querySelector(".chat")
let username = ""
let messageText = ""

let entered = false;

let nameContactSelected = "Todos"
let nameVisibilitySelected = "message"


function treatMessageFail(answer){
    window.location.reload()
}
function sendMessage(){
    messageText = document.querySelector(".input-text").value
    document.querySelector(".input-text").value = "";
    let message = {
        from: username,
        to: nameContactSelected,
        text: messageText,
        type: nameVisibilitySelected
    }
   const promess = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message)
   promess.catch(treatMessageFail)
}
function treatMessagesSucess(answer){
    chatBackground.style.height = "auto"
    let messages = answer.data;
    let chatMessages = "";

    for(let i = 0; i < messages.length; i++){
        switch(messages[i].type){
            case "status":
                chatMessages += `
                <div class="item status">
                    <p class="message-text" data-identifier="message"><span>(${messages[i].time})</span><b>${messages[i].from}</b> ${messages[i].text}...</p>
                </div>
                `
                break;
            case "message":
                chatMessages += `
                <div class="item message">
                    <p class="message-text" data-identifier="message"><span>(${messages[i].time})</span><b>${messages[i].from}</b> para <b>${messages[i].to}</b>:  ${messages[i].text}</p>
                </div>
                `
                break;
            case "private_message":
                //if(messages[i].to !== username) break
                chatMessages += `
                <div class="item private_message">
                    <p class="message-text" data-identifier="message"><span>(${messages[i].time})</span><b>${messages[i].from}</b> reservadamente para <b>${messages[i].to}</b>:  ${messages[i].text}</p>
                </div>
                `
                
                break;
        }
    }
    chat.innerHTML = chatMessages
    chatBackground.classList.add("main-color")
    if(!entered){
        let ultima = chat.children[99];
        ultima.scrollIntoView();
        entered = true;
    }
}
function treatSearchSucess(answer){
    let less1 = 0;
    let flag = false;
    let keepSelected;
    let participants = answer.data;
    contacts.innerHTML = "";
    let contactsOnline = `
    <li class="flex space-between" onclick="changeContact(this)">
        <div class="option flex flex-start">
            <img class="flex" src="./assets/media/smallPeopleIcon.png" alt="">
            <span class="flex align-normal">Todos</span>
        </div>
    </li>
    `
    for(let i = 0; i < participants.length; i++){
        if(participants[i].name !== username){
            if (participants[i].name === nameContactSelected){
                flag = true;
                keepSelected = i + 1 - less1;
                contactsOnline +=`
                <li class="flex space-between" onclick="changeContact(this)">
                    <div class="option flex flex-start">
                        <img class="flex" src="./assets/media/userIcon.png" alt="User icon" data-identifier="participant">
                        <span class="flex align-normal">${participants[i].name}</span>
                    </div>
                    <div>
                        <img src="./assets/media/checkIcon.png" alt="Check icon">
                    </div>
                </li>
                 `
            }else{  
                contactsOnline += `
                <li class="flex space-between" onclick="changeContact(this)">
                    <div class="option flex flex-start">
                        <img class="flex" src="./assets/media/userIcon.png" alt="User icon" data-identifier="participant">
                        <span class="flex align-normal">${participants[i].name}</span>
                    </div>
                </li>
                `
            }
        }else less1 = 1;
    }
    contacts.innerHTML = contactsOnline;
    console.log(keepSelected)
    if(keepSelected) selectedContact = contacts.children[keepSelected]
    if(!flag){
        nameContactSelected = "Todos"
        selectedContact = contacts.children[0]
        selectedContact.innerHTML += `
        <div>
            <img src="./assets/media/checkIcon.png" alt="Check icon">
        </div>
        `
        changeVisibility(public)
    }
    console.log(nameContactSelected)
    console.log(selectedContact)
}
function searchParticipants(){
    const promess = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants")
    promess.then(treatSearchSucess)
}
function treatSucess(answer){
    entrou()
    const promess = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
    promess.then(treatMessagesSucess)
    
   setInterval(function(){
        const promess = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
        promess.then(treatMessagesSucess)
    }, 3000)
    setInterval(function(){
        axios.post("https://mock-api.driven.com.br/api/v4/uol/status", { name: username })
    }, 5000)
}
function treatFail(answer){
    window.location.reload()
}
function enter(){
    username = document.querySelector(".username").value
    searchParticipants()
    setInterval(searchParticipants, 10000)

    const promess = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", { name: username })
    promess.then(treatSucess, treatFail)

    inputLogin.classList.add("none")
    loadingAnimation.classList.remove("none")
    loadingAnimation.classList.add("flex", "column")
}
function entrou(){
    inputScreen.classList.add("none")
    mainScreen.classList.remove("none")
}
function toggleMenu(){
    menu.classList.toggle("none")
    transparentScreen.classList.toggle("none")
}
function changeContact(selected){
    
    selectedContact.children[1].remove();
    selectedContact = selected
    console.log(selectedContact)
    nameContactSelected = selectedContact.querySelector("span").innerHTML

    if(nameContactSelected === "Todos" && nameVisibilitySelected === "private_message"){
        changeVisibility(public)
    }

    selectedContact.innerHTML += `
    <div>
        <img src="./assets/media/checkIcon.png" alt="Check icon">
    </div>
    `
}
function changeVisibility(selected){
    if(nameContactSelected === "Todos" && selected.querySelector("span").innerHTML === "Reservadamente") return
    seletedVisibility.children[1].remove();
    seletedVisibility = selected
    let visibilities = document.querySelectorAll(".visibility ul li")
    console.log(visibilities)

    if(seletedVisibility == visibilities[0]) nameVisibilitySelected = "message"
    else nameVisibilitySelected = "private_message"
    console.log(nameVisibilitySelected)
    
    seletedVisibility.innerHTML += `
    <div>
        <img src="./assets/media/checkIcon.png" alt="Check icon">
    </div>
    `
}
