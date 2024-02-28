function datasetInitial(searchTerm) {

    query = `
    PREFIX luc: <http://www.ontotext.com/connectors/lucene#>
    PREFIX luc-index: <http://www.ontotext.com/connectors/lucene/instance#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?entity ?label {
    ?search a luc-index:dataset_index ;
        luc:query "name:${searchTerm}" ;
        luc:entities ?entity .
    ?entity rdfs:label ?label .
    } LIMIT 10
    `;

    return query
}

