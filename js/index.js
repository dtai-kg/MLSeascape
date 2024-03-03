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
        var sparqlQuery = datasetSearchQuery(searchTerm);

        // Encode the SPARQL query
        var encodedQuery = encodeURIComponent(sparqlQuery);
        
        //Show searching label
        searchingSpanDiv.style.display = 'block';
        
        // Perform your fetch request with the constructed query
        fetchSearchData(endpointUrl, encodedQuery, requestOptions);

        document.getElementById('resultsTitle').scrollIntoView({
            behavior: 'smooth'
        });

        //Hide searching label
        searchingSpanDiv.style.display = 'none';
    });
});

function fetchSearchData(endpointUrl, encodedQuery, requestOptions){
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

function fetchMetaData(endpointUrl, encodedQuery, requestOptions, entity){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        var encodedData = encodeURIComponent(JSON.stringify(data));
        window.open("datasetInfo.html?data=" + encodedData, "_blank");
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function displayResults(results) {

    var totalResults = results.length; // Total number of results

    var resultsTitle = document.getElementById('resultsTitle');
    resultsTitle.innerHTML = ''; // Clear previous results

    var resultsTitleBody = document.createElement('div');
    resultsTitleBody.classList.add("col-sm-12", "section-title", "text-center", "mb-5")

    var resultsTitleText = document.createElement('h5');
    if (totalResults > 0) {
        resultsTitleText.textContent = "Search Results";
    }
    else {
        resultsTitleText.textContent = "Oops! No results were found. Please try again!";
    }
    

    resultsTitleBody.appendChild(resultsTitleText);
    resultsTitle.appendChild(resultsTitleBody);

    var moreButtonContainer = document.getElementById('moreButtonContainer');
    moreButtonContainer.innerHTML = ''; // Clear previous results
    
    var resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Clear previous results

    var pageSize = 10; // Number of cards per page
    var currentPage = 1; // Current page number

    // Display initial results up to the page size
    var endIndex = Math.min(pageSize, totalResults);
    displayResultsPage(results, 0, endIndex);

    // Add "Show more" button if there are more results
    if (totalResults > pageSize * currentPage) {
        var showMoreButton = document.createElement('button');
        showMoreButton.classList.add('btn', 'btn-outline-primary', 'mt-3');
        showMoreButton.textContent = 'Show More';
        showMoreButton.addEventListener('click', function () {
            currentPage++;
            var nextIndex = (currentPage - 1) * pageSize;
            var nextEndIndex = Math.min(nextIndex + pageSize, totalResults);
            displayResultsPage(results, nextIndex, nextEndIndex);
            if (totalResults > pageSize * currentPage) {
                moreButtonContainer.appendChild(showMoreButton);
            }
            else {
                showMoreButton.style.display = 'none';
            }
        });
        moreButtonContainer.appendChild(showMoreButton);
    }
}

function displayResultsPage(results, startIndex, endIndex) {
    var resultsContainer = document.getElementById('resultsContainer');

    for (var i = startIndex; i < endIndex; i++) {
        var result = results[i];

        var box = document.createElement('div');
        box.classList.add('col-12', 'col-sm-10', 'col-md-8', 'col-lg-7');

        var card = document.createElement('div');
        card.classList.add('card', 'border-info');

        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'row', 'text-info');

        var cardTextDiv = document.createElement('div');
        cardTextDiv.classList.add('col-9', 'col-xl-10');

        var title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = result.label.value; 

        var content = document.createElement('p');
        content.classList.add('card-text');
        content.textContent = `Text: ${result.entity.value}, Object: ${1}`; 
        
        var iconDiv = document.createElement('div');
        iconDiv.classList.add('col-3', 'col-xl-2', 'icon-container')

        var icon = document.createElement('img');
        if (result.entity.value.includes("kaggle")) {
            icon.setAttribute('src', 'img/kaggle_logo.png');
        }
        else if (result.entity.value.includes("openml")) {
            icon.setAttribute('src', 'img/openml-logo.png');
        }
        else{
            icon.setAttribute('src', 'img/pwc-logo.png');
        }
        
        icon.setAttribute('alt', 'Platform Icon');

        cardTextDiv.appendChild(title);
        cardTextDiv.appendChild(content);
        iconDiv.appendChild(icon)
        cardBody.appendChild(cardTextDiv);
        cardBody.appendChild(iconDiv);
        card.appendChild(cardBody);
        box.appendChild(card);
        resultsContainer.appendChild(box);

        card.addEventListener('click', function (event) {
            var entity = result.entity.value; // Extract the entity (subject) from the clicked card
            var sparqlQuery = datasetMetadataQuery(entity);
            var encodedQuery = encodeURIComponent(sparqlQuery);
            fetchMetaData(endpointUrl, encodedQuery, requestOptions, entity)
        }.bind(null, result));

    }
};

function openNewHTMLFile(entity, data) {
    // Open a new HTML file
    var newWindow = window.open('datasetInfo.html', '_blank');
    if (newWindow) {
        // Construct the text content using the retrieved data
        var textContent = `<h2>Entity: ${entity}</h2>`;
        textContent += '<ul>';
        data.results.bindings.forEach(binding => {
            textContent += `<li>${binding.p.value}: ${binding.o.value}</li>`;
        });
        textContent += '</ul>';

        // Get the information div in the new HTML page
        var informationDiv = newWindow.document.getElementById('informationDiv');
        if (informationDiv) {
            // Insert the query information into the information div
            informationDiv.innerHTML = textContent;
        } else {
            console.error('Information div not found in the new HTML page.');
        }
    } else {
        console.error('Failed to open new HTML file.');
    }
}

