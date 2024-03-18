const pwc_test = 'http://w3id.org/mlso/vocab/ml_task_type/Multi-ObjectTracking' ;
const openml_test = "http://w3id.org/mlsea/openml/task/31"

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

    var sparqlQuery = taskMetadataQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchTaskMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = taskTypeMetadataQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchTaskTypeMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = taskTypeDatasetQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchTaskTypeDataset(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = taskTypePublicationQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchTaskTypePublication(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = taskTypeModelQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchTaskTypeModel(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = taskTypeAlgorithmQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchTaskTypeAlgorithm(endpointUrl, encodedQuery, requestOptions)

    searchingSpanDiv.style.display = 'none';
}

function fetchTaskMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayTaskMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchTaskTypeMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayTaskTypeMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchTaskTypeDataset(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayTaskTypeDatasetMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchTaskTypePublication(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayTaskTypePublicationMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchTaskTypeModel(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayTaskTypeModelMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchTaskTypeAlgorithm(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayTaskTypeAlgorithmMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}


function displayTaskMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('taskMetadataDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (result.hasOwnProperty('label')){
        informationDiv.innerHTML += `<h2><img src="../img/task.png" style="width:30px;"> ${result.label.value}</h2>`
    }
        if (result.hasOwnProperty('source')){
        informationDiv.innerHTML += `<a href="${result.source.value}" class="sourceLink" target=”_blank”>Source</a><br><br>`
    }
    if (variableCheck(result, "taskTypeID")){
        informationDiv.innerHTML += '<p><b>Task Category:</b> ' + result.taskTypeID.value.split("ml_task_type#")[1].replaceAll("_"," ") + '</p>'
    }
    if (result.hasOwnProperty('datasetLabel')){
        informationDiv.innerHTML += '<br><br><br><br>'
        informationDiv.innerHTML += `<h2><img src="../img/database.png" style="width:30px;"> Dataset</h2><hr>`
        informationDiv.innerHTML += `<p><a href="${result.datasetSource.value}" target="_blank">${result.datasetLabel.value}</a></p>`
    }
    
}

function displayTaskTypeMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('taskTypeMetadataDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (result.hasOwnProperty('label')){
        informationDiv.innerHTML += `<h2><img src="../img/task.png" style="width:30px;"> ${result.label.value}</h2>`
    }
    if (variableCheck(result, "sources")){
        var sources = result.sources.value.split("|")
        if (sources.length === 1){
            informationDiv.innerHTML += `<a href="${sources[0]}" class="sourceLink" target=”_blank”>Source</a><br><br><br><br>`
        }
        else{
            informationDiv.innerHTML += '<br><br><h3>Relevant Sources</h3><hr>'
            informationDiv.innerHTML += '<ul class="list-group">'
            for (var i=0; i < sources.length; i++){
                informationDiv.innerHTML += `<li class="list-group-item">` + getHTMLink(sources[i],sources[i]) + `</li>`
            }
            informationDiv.innerHTML += '</ul><br><br><br><br>'
        }
        
    }

    if (variableCheck(result, "broaderLabels")){
        var broaderLabels = result.broaderLabels.value.split("|")
        var broaderIDs = result.broaderIDs.value.split("|")
        informationDiv.innerHTML += '<h3>Broader Tasks</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < broaderLabels.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">` + getMLSeascapeLink("task",broaderIDs[i],broaderLabels[i]) +`</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

    if (variableCheck(result, "narrowerLabels")){
        var narrowerLabels = result.narrowerLabels.value.split("|")
        var narrowerIDs = result.narrowerIDs.value.split("|")
        informationDiv.innerHTML += '<h3>Narrower Tasks</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < narrowerLabels.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">` + getMLSeascapeLink("task",narrowerIDs[i],narrowerLabels[i]) +`</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }
    
    
}

function displayTaskTypeDatasetMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('taskTypeDatasetDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "datasetIDs")){
        var datasetIDs = result.datasetIDs.value.split("|")
        var datasetLabels = result.datasetLabels.value.split("|")

        informationDiv.innerHTML += `<h3><img src="../img/database.png" style="width:25px;"> Datasets</h3><hr>`
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < datasetIDs.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">` + getMLSeascapeLink("dataset",datasetIDs[i],datasetLabels[i]) +`</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}

function displayTaskTypePublicationMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('taskTypePublicationDiv');
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

function displayTaskTypeModelMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('taskTypeModelDiv');
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

function displayTaskTypeAlgorithmMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('taskTypeAlgorithmDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "algoIDs")){
        var algoIDs = result.algoIDs.value.split("|")
        var algoLabels = result.algoLabels.value.split("|")

        informationDiv.innerHTML += `<h3><img src="../img/algorithm.png" style="width:25px;"> Algorithms</h3><hr>`
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < algoIDs.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">` + getMLSeascapeLink("algorithm", algoIDs[i],algoLabels[i]) +`</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}


executeQueries(taskEntity);