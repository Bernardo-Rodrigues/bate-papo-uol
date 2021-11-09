let inputScreen = document.querySelector(".input-screen")
let menu = document.querySelector(".menu")
let transparentScreen = document.querySelector(".transparent-dark")
let mainScreen = document.querySelector(".main-screen")
let menuScreen = document.querySelector(".menu-screen")
let absolute = document.querySelector(".absolute")

function enter(){
    inputScreen.classList.add("none")
    mainScreen.classList.remove("none")

}
function toggleMenu(){
    menuScreen.classList.toggle("none")
    absolute.classList.toggle("none")
}