const searchLimit = 50;

function datasetSearchQuery(searchTerm) {

    query = `
    PREFIX luc: <http://www.ontotext.com/connectors/lucene#>
    PREFIX luc-index: <http://www.ontotext.com/connectors/lucene/instance#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    
    SELECT ?entity ?label{
    ?search a luc-index:dataset_index ;
        luc:query "name:${searchTerm}" ;
        luc:entities ?entity .
    ?entity rdfs:label ?label.
    } LIMIT ${searchLimit}
    `;

    return query
}

function datasetMetadataQuery(entity) {

    query = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    
    SELECT ?p ?o
    WHERE {
    <${entity}> ?p ?o.
    } LIMIT 10
    `;

    return query
}

