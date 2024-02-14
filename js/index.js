// Header Scroll
let nav = document.querySelector(".navbar");
window.onscroll = function () {
    if (document.documentElement.scrollTop > 50) {
        nav.classList.add("header-scrolled");
    } else {
        nav.classList.remove("header-scrolled");
    }
}

// nav hide 
let navBar = document.querySelectorAll(".nav-link");
let navCollapse = document.querySelector(".navbar-collapse.collapse");
navBar.forEach(function (a) {
    a.addEventListener("click", function () {
        navCollapse.classList.remove("show");
    })
})


function enableSearch(placeholderText) {
    let placeholderDefault = "Search for machine learning ";
    document.getElementById('searchInput').setAttribute('placeholder', placeholderDefault + placeholderText);
    document.getElementById('searchContainer').style.display = 'block';
}

let datasetDiv = document.querySelector("#datasetDiv");
let modelDiv = document.querySelector("#modelDiv");
let softwareDiv = document.querySelector("#softwareDiv");
let taskDiv = document.querySelector("#taskDiv");
let algorithmDiv = document.querySelector("#algorithmDiv");
let implementationDiv = document.querySelector("#implementationDiv");
let publicationDiv = document.querySelector("#publicationDiv");

function datasetClick(){

    enableSearch('datasets');

    datasetDiv.classList.add("is-active");
    modelDiv.classList.remove("is-active");
    softwareDiv.classList.remove("is-active");
    taskDiv.classList.remove("is-active");
    algorithmDiv.classList.remove("is-active");
    implementationDiv.classList.remove("is-active");
    publicationDiv.classList.remove("is-active");
}

function modelClick(){

    enableSearch('models');

    datasetDiv.classList.remove("is-active");
    modelDiv.classList.add("is-active");
    softwareDiv.classList.remove("is-active");
    taskDiv.classList.remove("is-active");
    algorithmDiv.classList.remove("is-active");
    implementationDiv.classList.remove("is-active");
    publicationDiv.classList.remove("is-active");
}

function softwareClick(){

    enableSearch('software');

    datasetDiv.classList.remove("is-active");
    modelDiv.classList.remove("is-active");
    softwareDiv.classList.add("is-active");
    taskDiv.classList.remove("is-active");
    algorithmDiv.classList.remove("is-active");
    implementationDiv.classList.remove("is-active");
    publicationDiv.classList.remove("is-active");
}

function taskClick(){

    enableSearch('tasks');

    datasetDiv.classList.remove("is-active");
    modelDiv.classList.remove("is-active");
    softwareDiv.classList.remove("is-active");
    taskDiv.classList.add("is-active");
    algorithmDiv.classList.remove("is-active");
    implementationDiv.classList.remove("is-active");
    publicationDiv.classList.remove("is-active");
}

function algorithmClick(){

    enableSearch('algorithms');

    datasetDiv.classList.remove("is-active");
    modelDiv.classList.remove("is-active");
    softwareDiv.classList.remove("is-active");
    taskDiv.classList.remove("is-active");
    algorithmDiv.classList.add("is-active");
    implementationDiv.classList.remove("is-active");
    publicationDiv.classList.remove("is-active");
}

function implementationClick(){

    enableSearch('implementations');

    datasetDiv.classList.remove("is-active");
    modelDiv.classList.remove("is-active");
    softwareDiv.classList.remove("is-active");
    taskDiv.classList.remove("is-active");
    algorithmDiv.classList.remove("is-active");
    implementationDiv.classList.add("is-active");
    publicationDiv.classList.remove("is-active");
}

function publicationClick(){

    enableSearch('publications');

    datasetDiv.classList.remove("is-active");
    modelDiv.classList.remove("is-active");
    softwareDiv.classList.remove("is-active");
    taskDiv.classList.remove("is-active");
    algorithmDiv.classList.remove("is-active");
    implementationDiv.classList.remove("is-active");
    publicationDiv.classList.add("is-active");
}