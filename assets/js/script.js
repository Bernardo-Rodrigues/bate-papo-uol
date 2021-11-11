let inputScreen = document.querySelector(".input-screen")
let inputLogin = document.querySelector(".input-login")
let loadingAnimation = document.querySelector(".loading")

let chatBackground = document.querySelector("main")
let mainScreen = document.querySelector(".main-screen")
let transparentScreen = document.querySelector(".transparent-dark")
let menu = document.querySelector(".menu")

let contacts = document.querySelector(".contacts ul")
let selectedContact;
console.log(selectedContact)
let seletedVisibility = document.querySelector(".visibility .check")

let chat = document.querySelector(".chat")
let username = ""
let messageText = ""

let entered = false;


function treatMessageFail(answer){
    window.location.reload()
}
function sendMessage(){
    console.log(document.querySelector(".input-text"))
    messageText = document.querySelector(".input-text").value
    let message = {
        from: username,
        to: "Todos",
        text: messageText,
        type: "message"
    }
   const promess = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message)
   promess.catch(treatMessageFail)
}
function treatMessagesSucess(answer){
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
    let participants = answer.data;
    let contactsOnline = `
    <li class="flex space-between check" onclick="changeContact(this)">
        <div class="option">
            <img src="./assets/media/smallPeopleIcon.png" alt="">
            Todos
        </div>
        <div>
            <img src="./assets/media/checkIcon.png" alt="Check icon">
        </div>
    </li>
    `
    for(let i = 0; i < participants.length; i++){
        contactsOnline += `
        <li class="flex space-between" onclick="changeContact(this)">
            <div class="option">
                <img src="./assets/media/userIcon.png" alt="User icon" data-identifier="participant">
                ${participants[i].name}
            </div>
        </li>`
    }
    contacts.innerHTML += contactsOnline;
    selectedContact = document.querySelector(".contacts .check")
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

    selectedContact.innerHTML += `
    <div>
        <img src="./assets/media/checkIcon.png" alt="Check icon">
    </div>
    `
}
function changeVisibility(selected){
    seletedVisibility.children[1].remove();
    seletedVisibility = selected
    
    console.log(seletedVisibility)
    seletedVisibility.innerHTML += `
    <div>
        <img src="./assets/media/checkIcon.png" alt="Check icon">
    </div>
    `
}
