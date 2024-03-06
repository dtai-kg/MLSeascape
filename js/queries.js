const searchLimit = 50;

const prefixes = `
PREFIX luc: <http://www.ontotext.com/connectors/lucene#>
PREFIX luc-index: <http://www.ontotext.com/connectors/lucene/instance#>
PREFIX mls: <http://www.w3.org/ns/mls#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX mlso: <http://w3id.org/mlso/>
PREFIX schema: <http://schema.org/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
`;

function datasetSearchQuery(searchTerm) {

    query = `
    SELECT ?entity ?label ?description (COALESCE(?dateIssued, ?dateCreated) AS ?date){
    ?search a luc-index:dataset_index ;
        luc:query "name:${searchTerm}" ;
        luc:entities ?entity .
    ?entity rdfs:label ?label .
        
    OPTIONAL {?entity dcterms:description ?description}
    OPTIONAL {?entity dcterms:issued ?dateIssued}
    OPTIONAL {?entity dcterms:created ?dateCreated}
    } LIMIT ${searchLimit}
    `;

    return prefixes + query
}

function datasetMetadataQuery(entity) {

    query = `
    SELECT ?label ?source (COALESCE(?dateIssued, ?dateCreated) AS ?date)
    ?description (GROUP_CONCAT(DISTINCT ?creator; separator="|") AS ?creators) ?license (GROUP_CONCAT(DISTINCT ?tag; separator="|") AS ?tags)
    (GROUP_CONCAT(DISTINCT ?feature; separator="|") AS ?features) 
    (GROUP_CONCAT(DISTINCT ?dataLoader; separator='|') AS ?dataLoaders) 
    (GROUP_CONCAT(DISTINCT ?variantLabel; separator='|') AS ?variantLabels)
    WHERE {
        <${entity}> rdfs:label ?label.
        
        OPTIONAL{<${entity}> dcat:landingPage ?source.}
        OPTIONAL{<${entity}> dcterms:issued ?dateIssued.}
        OPTIONAL{<${entity}> dcterms:created ?dateCreated.}
        OPTIONAL {<${entity}> dcterms:description ?description.}
        OPTIONAL {<${entity}> dcterms:creator ?creatorID.
                ?creatorID rdfs:label ?creator.}
        OPTIONAL{<${entity}> dcterms:license ?license.}
        OPTIONAL{<${entity}> dcat:keyword ?tag.}
        OPTIONAL{<${entity}> dcat:distribution ?distributionID.
                ?distributionID mls:hasPart ?featureID.
                ?featureID rdfs:label ?feature}
        OPTIONAL{<${entity}> mlso:hasDataLoaderLocation ?dataLoader.}
        OPTIONAL{<${entity}> mlso:hasVariant ?variantID.
                ?variantID rdfs:label ?variantLabel.}

    } GROUP BY ?label ?source ?dateIssued ?dateCreated ?description ?license
    LIMIT 1
    `;

    return prefixes + query
}

function datasetTaskQuery(entity) {

    query = `
    SELECT ?label (GROUP_CONCAT(?taskLabel; separator="|") AS ?taskLabels) 
    (GROUP_CONCAT(?taskSource; separator="|") AS ?taskSources) 
    (GROUP_CONCAT(DISTINCT ?taskTypeID; separator="|") AS ?taskTypeIDs) 
    (GROUP_CONCAT(DISTINCT ?taskType; separator="|") AS ?taskTypes)
    WHERE {
        <${entity}> rdfs:label ?label.
        
        OPTIONAL {?taskID mls:definedOn <${entity}>;
                    prov:atLocation ?taskSource;
                    rdfs:label ?taskLabel.}
        OPTIONAL {<${entity}> mlso:hasTaskType ?taskTypeID.
                ?taskTypeID skos:prefLabel ?taskType.}
        

    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

function datasetSoftwareQuery(entity) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?codeNotebook; separator="|") AS ?codeNotebooks) 
    (GROUP_CONCAT(DISTINCT ?codeRepo; separator="|") AS ?codeRepos) 
    WHERE {
        <${entity}> rdfs:label ?label.
        
        OPTIONAL {<${entity}> mlso:hasRelatedSoftware ?softwareID.
                ?softwareID schema:codeRepository ?codeNotebook.}
        OPTIONAL {<${entity}> mlso:hasScientificReference ?publicationID.
                ?publicationID mlso:hasRelatedSoftware  ?softwareID.
                ?softwareID schema:codeRepository ?codeRepo.}

    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

function datasetPublicationQuery(entity) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?publication; separator="|") AS ?publications)
    WHERE {
        <${entity}> rdfs:label ?label.
        
        OPTIONAL {<${entity}> mlso:hasScientificReference ?publicationID.
                    ?publicationID dcterms:source  ?publication.}

    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

