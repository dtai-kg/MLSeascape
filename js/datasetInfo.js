const openml_test = 'http://w3id.org/mlsea/openml/dataset/2';
const kaggle_test = 'http://w3id.org/mlsea/kaggle/dataset/74082';
const pwc_test = 'http://w3id.org/mlsea/pwc/dataset/MNIST' ;

const tf_repo = "https://github.com/tensorflow/datasets"
const hf_repo = "https://github.com/huggingface/datasets"

const entityID = decodeURIComponent(window.location.href).split("?entity=")[1];
const prefix = "http://w3id.org/"
const datasetEntity = prefix + entityID; //"http://w3id.org/mlsea/pwc/dataset/MNIST" 
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

    var sparqlQuery = datasetMetadataQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchDatasetMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = datasetTaskQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchDatasetTaskMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = datasetSoftwareQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchDatasetSoftwareMetadata(endpointUrl, encodedQuery, requestOptions)

    var sparqlQuery = datasetPublicationQuery(entity);
    var encodedQuery = encodeURIComponent(sparqlQuery);
    fetchDatasetPublicationMetadata(endpointUrl, encodedQuery, requestOptions)

    searchingSpanDiv.style.display = 'none';
}

function fetchDatasetMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayDatasetMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchDatasetTaskMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayDatasetTaskMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchDatasetSoftwareMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayDatasetSoftwareMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function fetchDatasetPublicationMetadata(endpointUrl, encodedQuery, requestOptions){
    // Fetch data from the SPARQL endpoint
    fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
    .then(response => response.json())
    .then(data => {
        displayDatasetPublicationMetadata(data.results.bindings[0]);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function displayDatasetMetadata(result) {
    // Handle and display the query results
    const informationDiv = document.getElementById('datasetMetadataDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';


    informationDiv.innerHTML += `<h2><img src="../img/database.png" style="width:30px;"> ${result.label.value}</h2>`
    if (result.hasOwnProperty('source')){
        informationDiv.innerHTML += `<a href="${result.source.value}" class="sourceLink" target=”_blank”>Source</a>`
    }
    else {
        informationDiv.innerHTML += `<p>No designated source found.</p>`
    }

    var dateCheck = variableCheck(result, "date");
    var creatorCheck = variableCheck(result, "creators")
    var licenseCheck = variableCheck(result, "license");
    informationDiv.innerHTML += '<br><span class="subtitle1">'
    + (dateCheck === true ? result.date.value.split("T")[0] + ' · ' : '') 
    + (creatorCheck === true ? result.creators.value.replaceAll("|",", ") + ' · ' : '') 
    + (licenseCheck === true ? result.license.value + ' License': 'Unknown License')
    + '</span>'
    + '<br><br>'


    if (variableCheck(result, "description")){
        informationDiv.innerHTML += '<p>' + result.description.value + '</p><br>'
    }
    if (variableCheck(result, "tags")){
        informationDiv.innerHTML += '<p><b>Tags:</b> ' + result.tags.value.replaceAll("|",", ") + '</p>'
    }
    if (variableCheck(result, "features")){
        informationDiv.innerHTML += '<p><b>Features:</b> ' + decodeURIComponent(result.features.value).replaceAll("|",", ") + '</p>'
    }
    informationDiv.innerHTML += '<br><br><br>'

    if (variableCheck(result, "dataLoaders")){
        var dataLoaders = result.dataLoaders.value.split("|")
        dataLoaders = listClean(dataLoaders, tf_repo);
        dataLoaders = listClean(dataLoaders, hf_repo);
        dataLoaders = [...new Set(dataLoaders)];
        
        informationDiv.innerHTML += '<h3>Data Loaders</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < dataLoaders.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item"><a href="${dataLoaders[i]}" target="_blank">${dataLoaders[i].split("://")[1]}</a></li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

    if (variableCheck(result, "variantLabels")){
        var variantLabels = result.variantLabels.value.split("|")
        variantLabels = listClean(variantLabels, result.label.value)

        if (variantLabels.length > 0){
            informationDiv.innerHTML += '<h3>Similar Datasets</h3><hr>'
            informationDiv.innerHTML += '<ul class="list-group">'
            for (var i=0; i < variantLabels.length; i++){
                informationDiv.innerHTML += `<li class="list-group-item">${variantLabels[i]}</li>`
            }
            informationDiv.innerHTML += '</ul><br><br><br><br>'
        }
    }
}

function displayDatasetTaskMetadata(result) {

    const informationDiv = document.getElementById('datasetTaskDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "taskLabels")){
        var taskSources = result.taskSources.value.split("|")
        var taskLabels = result.taskLabels.value.split("|")
        
        informationDiv.innerHTML += '<h3><img src="../img/task.png" style="width:25px;"> Tasks</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < taskSources.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">${taskLabels[i]}: <a href="${taskSources[i]}" target="_blank">${taskSources[i].split("://")[1]}</a></li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

    if (variableCheck(result, "taskTypes")){
        var taskTypes = result.taskTypes.value.split("|")

        informationDiv.innerHTML += '<h3><img src="../img/task.png" style="width:25px;"> Task Types</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < taskTypes.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item">${taskTypes[i]}</li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}

function displayDatasetSoftwareMetadata(result) {

    const informationDiv = document.getElementById('datasetSoftwareDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "codeNotebooks")){
        var codeNotebooks = result.codeNotebooks.value.split("|")

        informationDiv.innerHTML += '<h3><img src="../img/software.png" style="width:25px;"> Code Notebooks</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < codeNotebooks.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item"><a href="${codeNotebooks[i]}" target="_blank">${codeNotebooks[i].split("www.")[1]}</a></li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

    if (variableCheck(result, "codeRepos")){
        var codeRepos = result.codeRepos.value.split("|")


        informationDiv.innerHTML += '<h3><img src="../img/software.png" style="width:25px;"> Code Repositories</h3><hr>'
        informationDiv.innerHTML += '<ul class="list-group">'
        for (var i=0; i < codeRepos.length; i++){
            informationDiv.innerHTML += `<li class="list-group-item"><a href="${codeRepos[i]}" target="_blank">${codeRepos[i]}</a></li>`
        }
        informationDiv.innerHTML += '</ul><br><br><br><br>'
    }

}

function displayDatasetPublicationMetadata(result) {

    const informationDiv = document.getElementById('datasetPublicationDiv');
    // Clear any existing content
    informationDiv.innerHTML = '';

    if (variableCheck(result, "publications")){
        var publications = result.publications.value.split("|")
        if (publications[0].includes("paperswithcode")){
            var publication = publications[0];
            var originalLink = publications[1];
        }else {
            var publication = publications[1];
            var originalLink = publications[0];
        }

        informationDiv.innerHTML += '<h3><img src="../img/publication.png" style="width:25px;"> Publication Introduced</h3><hr>'
        informationDiv.innerHTML += `<p>Title: <b>'${result.paperLabel.value}'</b></p>`
        informationDiv.innerHTML += `<p>Source: <a href="${publication}" target="_blank">${publication.split("://")[1]}</a></p>`
        informationDiv.innerHTML += `<p>Original publication: <a href="${originalLink}" target="_blank">${originalLink.split("://")[1]}</a></p>`
        informationDiv.innerHTML += '<br><br><br><br>'
    }

}


executeQueries(datasetEntity);