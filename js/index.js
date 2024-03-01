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

var searchMode = ""; 
function enableSearch(placeholderText) {
    let placeholderDefault = "Search for machine learning ";
    document.getElementById('searchInput').setAttribute('placeholder', placeholderDefault + placeholderText);
    document.getElementById('searchContainer').style.display = 'block';
    searchMode = placeholderText
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

// Define the URL of your local GraphDB SPARQL endpoint
const endpointUrl = 'http://localhost:7200/repositories/mlsea-kg';

// Define the Fetch request options
const requestOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/sparql-results+json'
    }
  };

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('searchButton').addEventListener('click', function () {
        //Get the searching label item
        var searchingSpanDiv = document.getElementById('searchingSpan');

        // Get the value entered in the search input
        var searchTerm = document.getElementById('searchInput').value;
        
        // Construct your query with the search term as a variable
        var sparqlQuery = datasetInitial(searchTerm);

        // Encode the SPARQL query
        var encodedQuery = encodeURIComponent(sparqlQuery);
        
        //Show searching label
        searchingSpanDiv.style.display = 'block';
        
        // Perform your fetch request with the constructed query
        fetchData(endpointUrl, encodedQuery, requestOptions);

        document.getElementById('resultsTitle').scrollIntoView({
            behavior: 'smooth'
        });

        //Hide searching label
        searchingSpanDiv.style.display = 'none';
    });
});

function fetchData(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayResults(data.results.bindings);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function displayResults(results) {

    var resultsTitle = document.getElementById('resultsTitle');
    resultsTitle.innerHTML = ''; // Clear previous results

    var resultsTitleBody = document.createElement('div');
    resultsTitleBody.classList.add("col-sm-12", "section-title", "text-center", "mb-5")

    var resultsTitleText = document.createElement('h5');
    resultsTitleText.textContent = "Search Results"

    resultsTitleBody.appendChild(resultsTitleText);
    resultsTitle.appendChild(resultsTitleBody);

    var resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous results

    results.forEach(result => {
        var box = document.createElement('div');
        box.classList.add('col-12');

        var card = document.createElement('div');
        card.classList.add('card');

        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        var title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = result.label.value; 

        var content = document.createElement('p');
        content.classList.add('card-text');
        content.textContent = `Predicate: ${result.entity.value}, Object: ${1}`; 

        var iconWrapper = document.createElement('div');
        iconWrapper.classList.add('float-right', 'info-icon-wrapper');

        var icon = document.createElement('img');
        icon.setAttribute('src', 'img/Kaggle_logo copy.png');
        icon.setAttribute('alt', 'Info Icon');
        icon.classList.add('img-fluid', 'info-icon'); // Adjust classes as needed 

        iconWrapper.appendChild(icon);
        cardBody.appendChild(title);
        cardBody.appendChild(content);
        cardBody.appendChild(iconWrapper);
        card.appendChild(cardBody);
        card.appendChild(icon);
        box.appendChild(card);
        resultsContainer.appendChild(box);
    });
}

