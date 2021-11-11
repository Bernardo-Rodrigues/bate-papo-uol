let inputScreen = document.querySelector(".input-screen")
let inputLogin = document.querySelector(".input-login")
let loadingAnimation = document.querySelector(".loading")

let mainScreen = document.querySelector(".main-screen")
let transparentScreen = document.querySelector(".transparent-dark")
let menu = document.querySelector(".menu")


let selectedContact = document.querySelector(".contacts .check")
let seletedVisibility = document.querySelector(".visibility .check")

let chat = document.querySelector(".chat")

let entered = false;

function treatMessageSucess(answer){
    let messages = answer.data;
    let chatMessages = "";

    for(let i = 0; i < messages.length; i++){
        switch(messages[i].type){
            case "status":
                chatMessages += `
                <div class="item status">
                    <p class="message-text"><span>(${messages[i].time})</span><b>${messages[i].from}</b> ${messages[i].text}...</p>
                </div>
                `
                break;
            case "message":
                chatMessages += `
                <div class="item message">
                    <p class="message-text"><span>(${messages[i].time})</span><b>${messages[i].from}</b> para <b>${messages[i].to}</b>:  ${messages[i].text}</p>
                </div>
                `
                break;
            case "private_message":
                chatMessages += `
                <div class="item private_message">
                    <p class="message-text"><span>(${messages[i].time})</span><b>${messages[i].from}</b> reservadamente para <b>${messages[i].to}</b>:  ${messages[i].text}</p>
                </div>
                `
                
                break;
        }
        console.log(chatMessages)
    }
    chat.innerHTML = chatMessages
    if(!entered){
        let ultima = chat.children[99];
        ultima.scrollIntoView();
        entered = true;
    }
}
function treatMessageFail(answer){
    console.log(answer)
}
function treatSucess(answer){
    let username = document.querySelector(".username").value
    entrou()
    
    setInterval(function(){
        const promess = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")
        promess.then(treatMessageSucess, treatMessageFail)
    }, 3000)
    setInterval(function(){
        axios.post("https://mock-api.driven.com.br/api/v4/uol/status", { name: username })
    }, 5000)
}
function treatFail(answer){
    window.location.reload()
}
function enter(){
    let username = document.querySelector(".username").value

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
function sendMessage(){
    alert("enviou")
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
