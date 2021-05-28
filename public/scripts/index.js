window.onload = (e) => { document.querySelector(".spinner-border").style.display = "none"; document.querySelector(".spinner").style.display = "none" };
const showSpinner = () => {
    document.querySelector(".spinner").style.display = "flex";
    document.querySelector(".spinner-border").style.display = "inline-block";
    if (document.querySelectorAll(".display-filename").length > 0)
        document.querySelectorAll(".display-filename").forEach(el => el.style.position = "unset");
}
if (document.querySelector("form.sign-block"))
    document.querySelector("form.sign-block").onsubmit = showSpinner;
if (document.querySelectorAll(".list-results li").length > 0)
    document.querySelectorAll(".list-results li").forEach(el => el.addEventListener("click", showSpinner))
window.onbeforeunload = showSpinner;

const url = window.location.pathname;
const element = document.querySelector(`div.navbar-collapse a[href="${url}"]`);
if (element)
    element.classList.add("active")

const applyBodyColor = (selector, color) => {
    if (document.querySelector(selector))
        document.querySelector(selector).parentNode.style.backgroundColor = color;
}

applyBodyColor(".list-results", "#03a9f4");
applyBodyColor(".login", "rgb(228, 229, 247)");
applyBodyColor(".register", "rgb(228, 229, 247)");

if (document.querySelector(".home"))
    document.querySelector(".home").parentNode.style.fontFamily = "'Montserrat', sans-serif";

const dropArea = document.getElementsByClassName("drop-area")[0];
const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
}
const highlight = () => dropArea.classList.add("highlight");
const unhighlight = () => dropArea.classList.remove("highlight");
if (dropArea) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => dropArea.addEventListener(eventName, preventDefaults));
    ["dragenter", "dragover"].forEach(eventName => dropArea.addEventListener(eventName, highlight));
    ["dragleave", "drop"].forEach(eventName => dropArea.addEventListener(eventName, unhighlight));
    dropArea.addEventListener('drop', e => document.querySelector("input#file").files = e.dataTransfer.files);
}





