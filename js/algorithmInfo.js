const pwc_test = 'http://w3id.org/mlsea/pwc/algorithm/GAN' ;

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

    var sparqlQuery = algorithmMetadataQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchAlgorithmMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = algorithmPublicationQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchAlgorithmPublication(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = algorithmTaskQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchAlgorithmTask(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = algorithmModelQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchAlgorithmModel(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = algorithmSoftwareQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchAlgorithmSoftware(endpointUrl, encodedQuery, requestOptions)

    searchingSpanDiv.style.display = 'none';
}

function fetchAlgorithmMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayAlgorithmMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchAlgorithmPublication(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayAlgorithmPublication(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchAlgorithmTask(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayAlgorithmTaskMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchAlgorithmModel(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayAlgorithmModelMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchAlgorithmSoftware(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayAlgorithmSoftwareMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}



function displayAlgorithmMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('algorithmMetadataDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    informationDiv.innerHTML += `<h2><img src="../img/algorithm.png" style="width:30px;"> ${result.label.value}</h2>`

    if (variableCheck(result, "source")){
        informationDiv.innerHTML += `<a href="${result.source.value}" class="sourceLink" target=”_blank”>Source</a><br><br>`
    }
    if (variableCheck(result, "description")){
        informationDiv.innerHTML += '<p>' + result.description.value + '</p><br>'
    }
    if (variableCheck(result, "altLabels")){
        var altLabels = result.altLabels.value.split("|")
        altLabels = listClean(altLabels, result.label.value)

        if (altLabels.length > 0){
            var altLabelsText = altLabels.toString().replaceAll(",",", ");
        }
        informationDiv.innerHTML += '<p><b>Alternative names:</b> ' + altLabelsText + '</p>'
    }
    if (variableCheck(result, "repoSource")){
        informationDiv.innerHTML += '<p><b>Algorithm Implementation Repository:</b> ' + getHTMLink(result.repoSource.value, result.repoSource.value) + '</p>'
    }

    informationDiv.innerHTML += '<br><br><br><br>'
    
}

function displayAlgorithmPublication(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('algorithmPublicationDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "paperLabels")){
        var paperSources = result.paperSources.value.split("|")
        var paperLabels = result.paperLabels.value.split("|")

        informationDiv.innerHTML += `<h3><img src="../img/publication.png" style="width:25px;"> Publications</h3><hr>`
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < paperLabels.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">` + getHTMLink(paperSources[i],paperLabels[i]) +`</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}

function displayAlgorithmTaskMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('algorithmTaskDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "taskTypeLabels")){
        var taskTypes = result.taskTypeLabels.value.split("|")
        var taskTypeIDs = result.taskTypeIDs.value.split("|")

        informationDiv.innerHTML += '<h3><img src="../img/task.png" style="width:25px;"> Task Types</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < taskTypes.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">` + getMLSeascapeLink("task", taskTypeIDs[i], taskTypes[i]) + `</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}

function displayAlgorithmModelMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('algorithmModelDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "modelIDs")){
        var modelIDs = result.modelIDs.value.split("|")
        var modelLabels = result.modelLabels.value.split("|")

        informationDiv.innerHTML += `<h3><img src="../img/model.png" style="width:25px;"> Models</h3><hr>`
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < modelLabels.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">` + getMLSeascapeLink("model", modelIDs[i],modelLabels[i]) +`</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}

function displayAlgorithmSoftwareMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('algorithmSoftwareDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "softwareSources")){
        var softwareSources = result.softwareSources.value.split("|")

        informationDiv.innerHTML += '<h3><img src="../img/software.png" style="width:25px;"> Related Repositories</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < softwareSources.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item"><a href="${softwareSources[i]}" target="_blank">${softwareSources[i]}</a></li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}


executeQueries(taskEntity);