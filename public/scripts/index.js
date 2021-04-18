const url = window.location.pathname;
const element = document.querySelector(`div.navbar-collapse a[href="${url}"]`);
element.classList.add("active")

