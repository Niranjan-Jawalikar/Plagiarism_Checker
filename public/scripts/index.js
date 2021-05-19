const url = window.location.pathname;
const element = document.querySelector(`div.navbar-collapse a[href="${url}"]`);
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