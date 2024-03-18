const openml_test = 'http://w3id.org/mlsea/openml/flow/19037' ;

const entityID = decodeURIComponent(window.location.href).split("?entity=")[1];
const prefix = "http://w3id.org/"
const taskEntity = prefix + entityID; 
//console.log(datasetEntity)

// Define the URL of your local GraphDB SPARQL endpoint
const endpointUrl = 'https://193.190.127.194:7200/repositories/mlsea-kg';

// Define the Fetch request options
const requestOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/sparql-results+json'
    }
  };

function executeQueries(entity){

    var searchingSpanDiv = document.getElementById('searchingSpan');
    searchingSpanDiv.style.display = 'block';

    var sparqlQuery = implementationMetadataQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchImplementationMetadata(endpointUrl, encodedQuery, requestOptions)

    searchingSpanDiv.style.display = 'none';
}

function fetchImplementationMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayImplementationMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}


function displayImplementationMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('implementationMetadataDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    informationDiv.innerHTML += `<h2><img src="../img/implementation.png" style="width:30px;"> ${result.label.value}</h2>`
    if (result.hasOwnProperty('source')){
        informationDiv.innerHTML += `<a href="${result.source.value}" class="sourceLink" target=”_blank”>Source</a>`
    }
    var dateCheck = variableCheck(result, "date");
    informationDiv.innerHTML += '<br><span class="subtitle1">'
    + (dateCheck === true ? result.date.value.split("T")[0] : '')
    + '</span>'
    + '<br><br>'

    if (variableCheck(result, "description")){
        informationDiv.innerHTML += '<p>' + result.description.value + '</p><br>'
    }

    if (variableCheck(result, "hpLabels")){
        informationDiv.innerHTML += '<p><b>Hyper-Parameters:</b> ' + result.hpLabels.value.replaceAll("|",", ") + '</p><br>'
    }

    if (variableCheck(result, "softwareReqs")){
        informationDiv.innerHTML += '<p><b>Requirements:</b> ' + result.softwareReqs.value.replaceAll("|",", ") + '</p><br>'
    }

    if (result.hasOwnProperty('datasetLabel')){
        informationDiv.innerHTML += '<br><br><br>'
        informationDiv.innerHTML += `<h2><img src="../img/database.png" style="width:30px;"> Dataset</h2><hr>`
        informationDiv.innerHTML += `<p><a href="${result.datasetSource.value}" target="_blank">${result.datasetLabel.value}</a></p>`
    }

    
}


executeQueries(taskEntity);