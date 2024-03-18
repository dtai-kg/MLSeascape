const pwc_test = 'http://w3id.org/mlsea/pwc/software/Faster%20R-CNN%3A%20Towards%20Real-Time%20Object%20Detection%20with%20Region%20Proposal%20Networks' ;
const kaggle_test = "http://w3id.org/mlsea/kaggle/software/19179"
const kaggle_test2 = "http://w3id.org/mlsea/kaggle/software/17711"

const entityID = decodeURIComponent(window.location.href).split("?entity=")[1];
const prefix = "http://w3id.org/"
const modelEntity = prefix + entityID ; 
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

    var sparqlQuery = softwareMetadataQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchSoftwareMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = softwareDatasetQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchSoftwareDatasetMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = softwareTaskQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchSoftwareTaskMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = softwareAlgorithmQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchSoftwareAlgorithmMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = softwarePublicationQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchSoftwarePublicationMetadata(endpointUrl, encodedQuery, requestOptions)

    searchingSpanDiv.style.display = 'none';
}

function fetchSoftwareMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displaySoftwareMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchSoftwareDatasetMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displaySoftwareDatasetMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchSoftwareTaskMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displaySoftwareTaskMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchSoftwareAlgorithmMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displaySoftwareAlgorithmMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchSoftwarePublicationMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displaySoftwarePublicationMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function displaySoftwareMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('softwareMetadataDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    informationDiv.innerHTML += `<h2><img src="../img/software.png" style="width:30px;"> ${result.label.value}</h2>`

    if (result.hasOwnProperty('source')){
        informationDiv.innerHTML += `<a href="${result.source.value}" class="sourceLink" target=”_blank”>Source</a>`
    }
    else {
        informationDiv.innerHTML += `<p>No designated source found.</p>`
    }

    var dateCheck = variableCheck(result, "date");
    var creatorCheck = variableCheck(result, "creatorLabel")
    informationDiv.innerHTML += '<br><span class="subtitle1">'
    + (dateCheck === true ? result.date.value.split("T")[0] + ' · ' : '') 
    + (creatorCheck === true ? 'Created by Kaggle user: ' + result.creatorLabel.value: '') 
    + '</span>'
    + '<br><br>'

    if (variableCheck(result, "requirements")){
        var requirements = result.requirements.value.replace("tf", "tensorflow").replace("pytorch", "pytorch").split("|");
        requirements = listClean(requirements, "none");

        if (requirements.length > 0){
            var requirementsText = requirements.toString().replaceAll(",",", ");
            informationDiv.innerHTML += `<p><b>Requirements:</b> ${requirementsText}</p>` 
        } 
    }

    if (variableCheck(result, "progLang")){
        informationDiv.innerHTML += `<p><b>Programming Language:</b> ${result.progLang.value}</p>` 
    }

    informationDiv.innerHTML += '<br><br><br><br>'
}

function displaySoftwareDatasetMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('softwareDatasetDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "datasetLabel")){

        informationDiv.innerHTML += '<h3><img src="../img/database.png" style="width:25px;"> Related Datasets</h3><hr>'
        if (variableCheck(result, "datasetSource")){
            informationDiv.innerHTML += `<p><a href="${result.datasetSource.value}" target="_blank">${result.datasetLabel.value}</a></p>`
        }
        else{
            informationDiv.innerHTML += `<p>${result.datasetLabel.value}</p>`
        }
        informationDiv.innerHTML += '<br><br><br><br>'
    }
    
}

function displaySoftwareTaskMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('softwareTaskDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "taskLabels")){

        var taskTypes = result.taskLabels.value.split("|")

        informationDiv.innerHTML += '<h3><img src="../img/task.png" style="width:25px;"> Task Types</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < taskTypes.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">${taskTypes[i]}</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
       
    }
    
}

function displaySoftwareAlgorithmMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('softwareAlgorithmDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "algoLabels")){
        var algorithms = result.algoLabels.value.split("|")

        informationDiv.innerHTML += '<h3><img src="../img/algorithm.png" style="width:25px;"> Related Algorithms</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < algorithms.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">${algorithms[i]}</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }
    
}

function displaySoftwarePublicationMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('softwarePublicationDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "paperLabel")){
        var publications = result.paperSources.value.split("|")
        if (publications[0].includes("paperswithcode")){
            var publication = publications[0];
            var originalLink = publications[1];
        }else {
            var publication = publications[1];
            var originalLink = publications[0];
        }

        informationDiv.innerHTML += '<h3><img src="../img/publication.png" style="width:25px;"> Publication</h3><hr>'
        informationDiv.innerHTML += `<p>Title: <b>'${result.paperLabel.value}'</b></p>`
        informationDiv.innerHTML += `<p>Source: <a href="${publication}" target="_blank">${publication.split("://")[1]}</a></p>`
        informationDiv.innerHTML += `<p>Original publication: <a href="${originalLink}" target="_blank">${originalLink.split("://")[1]}</a></p>`
        informationDiv.innerHTML += '<br><br><br><br>'
    }
    
}

executeQueries(modelEntity);