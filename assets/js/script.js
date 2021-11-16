let inputScreen = document.querySelector(".input-screen")
let inputMessage = document.querySelector(".input-message")
let selectedContact = document.querySelector(".contacts ul").children[0];
let seletedVisibility = document.querySelector(".visibility ul").children[0];

let public = seletedVisibility;
let username = ""
let messageText = ""
let nameContactSelected = "Todos"
let nameVisibilitySelected = "message"
let visibilitySelected = "Público";
let lastMessage = "";

const inputLogin = document.querySelector(".input-login")
    const loadingAnimation = document.querySelector(".loading")

function pressEnterUser(event){
    if(event.keyCode === 13) login()
}
function pressEnterChat(event){
    if(event.keyCode === 13) sendMessage()
}
function sendTo(){
    let visibilitySelected;
    if(inputMessage.children.length > 1) inputMessage.children[1].remove()
    
    if(nameVisibilitySelected === "message") visibilitySelected = "Público"
    else visibilitySelected = "Reservadamente"

    inputMessage.innerHTML += `
    <div class="send-to">
        <p>Enviando para ${nameContactSelected} (${visibilitySelected})</p>
    </div>
    `
}
function login(){
    username = document.querySelector(".username").value

    const promess = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", { name: username })
    promess.then(enterRoomSucess, enterRoomFail)

    searchParticipants()
    setInterval(searchParticipants, 10000)

    inputLogin.classList.add("none")
    loadingAnimation.classList.remove("none")
    loadingAnimation.classList.add("flex", "column")
}
function enterRoomSucess(){
    const mainScreen = document.querySelector(".main-screen")
    sendTo()

    let promess = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
    inputScreen.classList.add("none")
    mainScreen.classList.remove("none")

    promess.then(messagesSucess)
    
   setInterval(function(){
        promess = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
        promess.then(messagesSucess)
    }, 3000)
    setInterval(function(){
        axios.post("https://mock-api.driven.com.br/api/v4/uol/status", { name: username })
    }, 5000)
}
function enterRoomFail(){
    inputLogin.classList.remove("none")
    loadingAnimation.classList.add("none")
    loadingAnimation.classList.remove("flex", "column")
    document.querySelector(".username").value = "";

    if(inputScreen.children.length > 3) return
    inputScreen.innerHTML += "<p>Esse nome já está em uso</p>"
}
    
function searchParticipants(){
    const promess = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants")
    promess.then(treatSearchSucess)
}
function treatSearchSucess(answer){
    const contactsList = document.querySelector(".contacts ul")
    let countUser = 0;
    let keep = false;
    let keepSelected;
    let participants = answer.data;
    let contactsOnline = `
    <li class="flex space-between" onclick="changeContact(this)">
        <div class="option flex flex-start">
            <img class="flex" src="./assets/media/smallPeopleIcon.png" alt="">
            <span class="flex align-normal">Todos</span>
        </div>
    </li>
    `

    contactsList.innerHTML = "";
    
    for(let i = 0; i < participants.length; i++){
        if(participants[i].name !== username){
            if (participants[i].name === nameContactSelected){
                keep = true;
                keepSelected = i + 1 - countUser;
                contactsOnline +=`
                <li class="flex space-between" onclick="changeContact(this)" data-identifier="participant">
                    <div class="option flex flex-start">
                        <img class="flex" src="./assets/media/userIcon.png" alt="User icon">
                        <span class="flex align-normal">${participants[i].name}</span>
                    </div>
                    <div>
                        <img src="./assets/media/checkIcon.png" alt="Check icon">
                    </div>
                </li>
                 `
            }else{  
                contactsOnline += `
                <li class="flex space-between" onclick="changeContact(this)" data-identifier="participant">
                    <div class="option flex flex-start">
                        <img class="flex" src="./assets/media/userIcon.png" alt="User icon">
                        <span class="flex align-normal">${participants[i].name}</span>
                    </div>
                </li>
                `
            }
        }else countUser = 1;
    }
    contactsList.innerHTML = contactsOnline;

    if(keepSelected) selectedContact = contactsList.children[keepSelected]

    if(!keep){
        nameContactSelected = "Todos"
        selectedContact = contactsList.children[0]
        selectedContact.innerHTML += `
        <div>
            <img src="./assets/media/checkIcon.png" alt="Check icon">
        </div>
        `
        changeVisibility(public)
    }
}
function messagesSucess(answer){
    const chatBackground = document.querySelector("main")
    const chat = document.querySelector(".chat")

    chatBackground.style.height = "auto"

    let messages = answer.data;
    let chatMessages = "";
    let last = "";

    for(let i = 0; i < messages.length; i++){
        if(i === messages.length-1) last = "last";
        switch(messages[i].type){
            case "status":
                chatMessages += `
                <div class="item status ${last}" data-identifier="message">
                    <p class="message-text"><span>(${messages[i].time})</span><b>${messages[i].from}</b> ${messages[i].text}...</p>
                </div>
                `
                break;
            case "message":
                chatMessages += `
                <div class="item message ${last}" data-identifier="message">
                    <p class="message-text"><span>(${messages[i].time})</span><b>${messages[i].from}</b> para <b>${messages[i].to}</b>:  ${messages[i].text}</p>
                </div>
                `
                break;
            case "private_message":
                if(messages[i].from !== username && messages[i].to !== username) break
                chatMessages += `
                <div class="item private_message ${last}" data-identifier="message">
                    <p class="message-text"><span>(${messages[i].time})</span><b>${messages[i].from}</b> reservadamente para <b>${messages[i].to}</b>:  ${messages[i].text}</p>
                </div>
                `
                break;
        }
    }
    chat.innerHTML = chatMessages

    const currentLastMessage = document.querySelector(".last");
    const currentLastText = currentLastMessage.querySelector("p").innerHTML;
    if(currentLastText !== lastMessage){
        lastMessage = currentLastText
        currentLastMessage.scrollIntoView();
    } 
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
   promess.then(sendMessageSucess, sendMessageFail)
}
function sendMessageSucess(){
    const promess = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
    promess.then(messagesSucess)
}
function sendMessageFail(){
    window.location.reload()
}
function toggleMenu(){
    const menu = document.querySelector(".menu")
    const transparentScreen = document.querySelector(".transparent-dark")
    
    menu.classList.toggle("none")
    transparentScreen.classList.toggle("none")
}
function changeContact(selected){
    selectedContact.children[1].remove();
    selectedContact = selected
    nameContactSelected = selectedContact.querySelector("span").innerHTML

    if(nameContactSelected === "Todos" && nameVisibilitySelected === "private_message"){
        changeVisibility(public)
    }

    selectedContact.innerHTML += `
    <div>
        <img src="./assets/media/checkIcon.png" alt="Check icon">
    </div>
    `
    sendTo()
}
function changeVisibility(selected){
    if(nameContactSelected === "Todos" && selected.querySelector("span").innerHTML === "Reservadamente") return

    seletedVisibility.children[1].remove();
    seletedVisibility = selected

    const visibilities = document.querySelectorAll(".visibility ul li")

    if(seletedVisibility == visibilities[0]) nameVisibilitySelected = "message"
    else nameVisibilitySelected = "private_message"
    
    seletedVisibility.innerHTML += `
    <div>
        <img src="./assets/media/checkIcon.png" alt="Check icon">
    </div>
    `
    sendTo()
}
