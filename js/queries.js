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
PREFIX fabio: <http://purl.org/spar/fabio/>
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

function modelSearchQuery(searchTerm) {

    query = `
    SELECT ?entity ?label ?paperLabel{
        ?search a luc-index:model_index ;
            luc:query "name:${searchTerm}" ;
            luc:entities ?entity .
        ?entity rdfs:label ?label .
        
          OPTIONAL{
            ?runID mls:hasOutput ?entity;
               mls:executes ?implID.
          ?paperID mlso:hasRelatedImplementation ?implID;
                   rdfs:label ?paperLabel.}
          
      } LIMIT ${searchLimit}
    `;

    return prefixes + query
}

function softwareSearchQuery(searchTerm) {

    query = `
    SELECT ?entity ?label {
        ?search a luc-index:software_index ;
            luc:query "name:${searchTerm}" ;
            luc:entities ?entity .
        ?entity rdfs:label ?label .
          
      } LIMIT ${searchLimit}
    `;

    return prefixes + query
}

function taskSearchQuery(searchTerm) {

    query = `
    SELECT * WHERE
    { 
    {
        SELECT ?entity ?label WHERE{
        ?search a luc-index:concept_index ;
            luc:query "name:${searchTerm}" ;
            luc:entities ?entity .
        FILTER(CONTAINS(STR(?entity), "task"))
        ?entity skos:prefLabel ?label.
        }  
        }
    UNION
        {
        SELECT ?entity ?label WHERE{
        ?search a luc-index:task1_index ;
            luc:query "name:${searchTerm}" ;
            luc:entities ?entity.
        ?entity rdfs:label ?label.
        }  
        }
    } LIMIT ${searchLimit}
    `;

    return prefixes + query
}

function algorithmSearchQuery(searchTerm) {

    query = `
    SELECT ?entity ?label ?algoDefinition{
        ?search a luc-index:algorithm_index ;
            luc:query "name:${searchTerm}" ;
            luc:entities ?entity .
        ?entity rdfs:label ?label .

        OPTIONAL{?entity mlso:hasAlgorithmType ?algoTypeID.
            ?algoTypeID skos:definition ?algoDefinition.}
          
      } LIMIT ${searchLimit}
    `;

    return prefixes + query
}

function implementationSearchQuery(searchTerm) {

    query = `
    SELECT * WHERE
    { 
    {
        SELECT ?entity ?label ?description WHERE{
        ?search a luc-index:implementation1_index ;
            luc:query "name:${searchTerm}" ;
            luc:entities ?entity .
        ?entity rdfs:label ?label.
        OPTIONAL {?entity dcterms:description ?description.}
        }  
        }
    UNION
        {
        SELECT ?entity ?label ?description WHERE{
        ?search a luc-index:implementation2_index ;
            luc:query "name:${searchTerm}" ;
            luc:entities ?entity .
        ?entity dcterms:title ?label;
        
        OPTIONAL {?entity dcterms:description ?description.}
        }  
        }
    } LIMIT ${searchLimit}
    `;

    return prefixes + query
}

function publicationSearchQuery(searchTerm) {

    query = `
    SELECT ?entity ?label ?date ?description{
        ?search a luc-index:publication_index ;
            luc:query "name:${searchTerm}" ;
            luc:entities ?entity .
        ?entity rdfs:label ?label .
          OPTIONAL{?entity dcterms:issued ?date}
          OPTIONAL{?entity fabio:abstract ?description}
          
      } LIMIT ${searchLimit}
    `;

    return prefixes + query
}





    

