const pwc_test = 'http://w3id.org/mlsea/pwc/scientificWork/Likelihood%20Ratios%20for%20Out-of-Distribution%20Detection' ;

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

    var sparqlQuery = publicationMetadataQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchPublicationMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = publicationSoftwareQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchPublicationSoftware(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = publicationTaskQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchPublicationTask(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = publicationDatasetQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchPublicationDataset(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = publicationModelQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchPublicationModel(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = publicationAlgorithmQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchPublicationAlgorithm(endpointUrl, encodedQuery, requestOptions)

    searchingSpanDiv.style.display = 'none';
}

function fetchPublicationMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayPublicationMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchPublicationSoftware(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayPublicationSoftware(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchPublicationTask(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayPublicationTaskMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchPublicationDataset(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayPublicationDatasetMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchPublicationModel(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayPublicationModelMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchPublicationAlgorithm(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayPublicationAlgorithmMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}



function displayPublicationMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('publicationMetadataDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    var dateCheck = variableCheck(result, "date");
    var creatorCheck = variableCheck(result, "creatorLabels")
    informationDiv.innerHTML += `<h2><img src="img/publication.png" style="width:30px;"> ${result.label.value}</h2>`
    informationDiv.innerHTML += '<span class="subtitle1">'
    + (dateCheck === true ? result.date.value.split("T")[0] : '') 
    + (creatorCheck === true ? ' · ' + result.creatorLabels.value.replaceAll("|",", ") : '') 
    + '</span>'
    + '<br>' 

    if (variableCheck(result, "arxivID")){
        informationDiv.innerHTML += '<p><b>ArXivId: </b>' + result.arxivID.value + '</p><br>'
    }

    if (variableCheck(result, "sources")){
        var sources = result.sources.value.split("|")
        if (sources[0].includes("paperswithcode")){
            var publication = sources[0];
            var originalLink = sources[1];
        }else {
            var publication = sources[1];
            var originalLink = sources[0];
        }

        informationDiv.innerHTML += `<span>Source: <a href="${publication}" target="_blank">${publication.split("://")[1]}</a></span><br>`
        informationDiv.innerHTML += `<span>Original publication: <a href="${originalLink}" target="_blank">${originalLink.split("://")[1]}</a></span><br><br>`
    }

    if (variableCheck(result, "description")){
        informationDiv.innerHTML += '<p>' + result.description.value + '</p><br>'
    }

    if (variableCheck(result, "tags")){
        informationDiv.innerHTML += '<p><b>Tags:</b> ' + result.tags.value.replaceAll("|",", ") + '</p>'
    }

    informationDiv.innerHTML += '<br><br><br><br>'
    
}

function displayPublicationSoftware(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('publicationSoftwareDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "softwareSources")){
        var softwareSources = result.softwareSources.value.split("|")

        informationDiv.innerHTML += '<h3><img src="img/software.png" style="width:25px;"> Related Repositories</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < softwareSources.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item"><a href="${softwareSources[i]}" target="_blank">${softwareSources[i]}</a></li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}

function displayPublicationTaskMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('publicationTaskDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "taskTypeLabels")){
        var taskTypes = result.taskTypeLabels.value.split("|")
        var taskTypeIDs = result.taskTypeIDs.value.split("|")

        informationDiv.innerHTML += '<h3><img src="img/task.png" style="width:25px;"> Task Types</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < taskTypes.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">` + getMLSeascapeLink("task", taskTypeIDs[i], taskTypes[i]) + `</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}

function displayPublicationDatasetMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('publicationDatasetDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "datasetIDs")){
        var datasetIDs = result.datasetIDs.value.split("|")
        var datasetLabels = result.datasetLabels.value.split("|")

        informationDiv.innerHTML += `<h3><img src="img/database.png" style="width:25px;"> Datasets</h3><hr>`
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < datasetIDs.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">` + getMLSeascapeLink("dataset",datasetIDs[i],datasetLabels[i]) +`</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}

function displayPublicationModelMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('publicationModelDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "modelIDs")){
        var modelIDs = result.modelIDs.value.split("|")
        var modelLabels = result.modelLabels.value.split("|")

        informationDiv.innerHTML += `<h3><img src="img/model.png" style="width:25px;"> Models</h3><hr>`
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < modelLabels.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">` + getMLSeascapeLink("model", modelIDs[i],modelLabels[i]) +`</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}

function displayPublicationAlgorithmMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('publicationAlgorithmDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "algoIDs")){
        var algoLabels = result.algoLabels.value.split("|")
        var algoIDs = result.algoIDs.value.split("|")

        informationDiv.innerHTML += '<h3><img src="img/algorithm.png" style="width:25px;"> Algorithms</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < algoLabels.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">` + getMLSeascapeLink("algorithm", algoIDs[i], algoLabels[i]) + `</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}



function variableCheck (object, field){

    var check = false;
    if (object.hasOwnProperty(field)) {
        if (object[field].value !== ""){
            var check = true;
        }
    }
    return check;
}

function listClean (list, string){

    while (list.indexOf(string) !== -1) {
        // Find the index of the string to remove
        let index = list.indexOf(string);
        // Remove the string from the list
        list.splice(index, 1);
    }
    return list
}

function getHTMLink(link, linkText){

    return `<a href="${link}" target="_blank">${linkText}</a>`
}

function getMLSeascapeLink (page, entity, linkText){

    return `<a href="${page}Info.html?entity=${encodeURIComponent(entity.split("w3id.org/")[1])}" target="_blank">${linkText}</a>`
}


executeQueries(taskEntity);