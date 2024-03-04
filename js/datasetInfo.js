const entityID = decodeURIComponent(window.location.href).split("?entity=")[1];
const prefix = "http://w3id.org/mlsea/"
const entity = prefix + entityID;

// Define the URL of your local GraphDB SPARQL endpoint
const endpointUrl = 'http://193.190.127.194:7200/repositories/mlsea-kg';

// Define the Fetch request options
const requestOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/sparql-results+json'
    }
  };

// function executeQuery(entity){
//     var sparqlQuery = datasetMetadataQuery(entity);
//     var encodedQuery = encodeURIComponent(sparqlQuery);
//     var searchingSpanDiv = document.getElementById('searchingSpan');
//     searchingSpanDiv.style.display = 'block';
//     fetchMetaData(endpointUrl, encodedQuery, requestOptions)
//     searchingSpanDiv.style.display = 'none';
// }

// executeQuery(entity);

// function fetchMetaData(endpointUrl, encodedQuery, requestOptions){
//     // Fetch data from the SPARQL endpoint
//     fetch(`${endpointUrl}?query=${encodedQuery}`, requestOptions)
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//         displayMetaData(data);
//     })
//     .catch(error => {
//         console.error('Error fetching data:', error);
//     });
// }

// function displayMetaData(data) {
//     // Handle and display the query results
//     // This can be similar to the displayResults function in your original page
//     const informationDiv = document.getElementById('informationDiv');
//     // Clear any existing content
//     informationDiv.innerHTML = '';
//     // Process and display the data
//     // For example:
//     informationDiv.innerHTML = `<h2>Entity: ${entity}</h2>`;
//     informationDiv.innerHTML += '<ul>';
//     data.results.bindings.forEach(binding => {
//         informationDiv.innerHTML += `<li>${binding.p.value}: ${binding.o.value}</li>`;
//     });
//     informationDiv.innerHTML += '</ul>';
// }