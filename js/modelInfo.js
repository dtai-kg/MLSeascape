const pwc_test = 'http://w3id.org/mlsea/pwc/model/COTS%3A%20Collaborative%20Two-Stream%20Vision-Language%20Pre-Training%20Model%20for%20Cross-Modal%20Retrieval/COTS' ;
const pwc_test2 = "http://w3id.org/mlsea/pwc/model/Deep%20Residual%20Learning%20for%20Image%20Recognition/ResNet-50%20%28generalization%29"

const entityID = decodeURIComponent(window.location.href).split("?entity=")[1];
const prefix = "http://w3id.org/"
const modelEntity = prefix+ entityID ; 
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

    var sparqlQuery = modelMetadataQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchModelMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = modelPublicationQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchModelTaskMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = modelSoftwareQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchModelSoftwareMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = modelTaskQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchModelTaskMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = modelAlgorithmQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchModelAlgorithmMetadata(endpointUrl, encodedQuery, requestOptions)

    searchingSpanDiv.style.display = 'none';
}

function fetchModelMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayModelMetadata(data.results.bindings);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchModelTaskMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayModelPublicationMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchModelSoftwareMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayModelSoftwareMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchModelTaskMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayModelTaskMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchModelAlgorithmMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayModelAlgorithmMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function displayModelMetadata(results) {
    // Handle and display the query results
    const informationDiv = document.getElementById('modelMetadataDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    var result = results[0];
    informationDiv.innerHTML += `<h2><img src="../img/model.png" style="width:30px;"> ${result.label.value}</h2><br><br><br>`

    if (variableCheck(result, "evalLabel")){
        var evalLabels = [];
        var evalValues = [];
        for (var i = 0; i < results.length; i++){
            evalLabels.push(results[i].evalLabel.value)
            evalValues.push(results[i].evalValues.value)
        }

        informationDiv.innerHTML += '<h3>Model Evaluations</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < evalLabels.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item"><p><b>${evalLabels[i].split(" evaluation")[0]}:</b> ${evalValues[i].replace("|",", ")}</p></li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }
}

function displayModelPublicationMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('modelPublicationDiv');
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

function displayModelSoftwareMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('modelSoftwareDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "repoSources")){
        var repoSources = result.repoSources.value.split("|")

        informationDiv.innerHTML += '<h3><img src="../img/software.png" style="width:25px;"> Related Repositories</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < repoSources.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item"><a href="${repoSources[i]}" target="_blank">${repoSources[i]}</a></li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}

function displayModelTaskMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('modelTaskDiv');
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

function displayModelAlgorithmMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('modelAlgorithmDiv');
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


executeQueries(modelEntity);