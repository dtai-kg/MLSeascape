// Retrieve the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const encodedData = urlParams.get('data');

// Decode the data
const decodedData = JSON.parse(decodeURIComponent(encodedData));

// Extract and display the data from the decoded JSON object
const informationDiv = document.getElementById('informationDiv');
if (decodedData && decodedData.results && decodedData.results.bindings) {
    const bindings = decodedData.results.bindings;
    const listItems = bindings.map(binding => {
        const predicate = binding.predicate.value;
        const object = binding.object.value;
        return `<li>${predicate}: ${object}</li>`;
    });
    informationDiv.innerHTML += '<ul>' + listItems.join('') + '</ul>';
} else {
    informationDiv.innerHTML += '<p>No data found.</p>';
}