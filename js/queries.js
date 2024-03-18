var searchLimit = 50;

var prefixes = `
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
PREFIX sdo: <https://w3id.org/okn/o/sd#>
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
    SELECT ?label ?paperLabel (GROUP_CONCAT(DISTINCT ?publication; separator="|") AS ?publications)
    WHERE {
        <${entity}> rdfs:label ?label.
        
        OPTIONAL {<${entity}> mlso:hasScientificReference ?publicationID.
                    ?publicationID dcterms:source  ?publication;
                                   rdfs:label ?paperLabel.}

    } GROUP BY ?label ?paperLabel
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

function modelMetadataQuery(searchTerm) {

    query = `
    SELECT ?label ?evalLabel (GROUP_CONCAT(DISTINCT ?evalValue; separator="|") AS ?evalValues)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL{?runID mls:hasOutput <${searchTerm}>;
                        mls:hasOutput ?evalID.
                ?evalID rdf:type mls:ModelEvaluation;
                        rdfs:label ?evalLabel;
                        mls:hasValue ?evalValue.}

    } GROUP BY ?label ?evalLabel
    LIMIT 20
    `;

    return prefixes + query
}

function modelSoftwareQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?repoSource; separator="|") AS ?repoSources)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        OPTIONAL {<${searchTerm}> schema:codeRepository ?repoSource.}
        

    } GROUP BY ?label
    LIMIT 1
    `;

    return prefixes + query
}

function modelPublicationQuery(searchTerm) {

    query = `
    SELECT ?label ?paperLabel (GROUP_CONCAT(DISTINCT ?paperSource; separator="|") AS ?paperSources)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL{
        ?runID mls:hasOutput <${searchTerm}>;
            mls:executes ?implID.
        ?paperID mlso:hasRelatedImplementation ?implID;
                rdfs:label ?paperLabel;
                dcterms:source ?paperSource.}
        

    } GROUP BY ?label ?paperLabel
    LIMIT 1
    `;

    return prefixes + query
}

function modelTaskQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?taskLabel; separator="|") AS ?taskLabels)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL{
        ?runID mls:hasOutput <${searchTerm}>;
            mls:executes ?implID.
        ?paperID mlso:hasRelatedImplementation ?implID;
                mlso:hasTaskType ?taskTypeID.
        ?taskTypeID skos:prefLabel ?taskLabel.}
        

    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

function modelAlgorithmQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?algoLabel; separator="|") AS ?algoLabels)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL{
        ?runID mls:hasOutput <${searchTerm}>;
            mls:executes ?implID.
        ?implID mls:implements ?algoID.
        ?algoID rdfs:label ?algoLabel.}
        

    } GROUP BY ?label 
    LIMIT 1
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

function softwareMetadataQuery(searchTerm) {

    query = `
    SELECT ?label ?source (GROUP_CONCAT(DISTINCT ?requirement; separator="|") AS ?requirements) ?creatorLabel ?date ?progLang
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL {<${searchTerm}> schema:codeRepository ?source.}
        OPTIONAL {<${searchTerm}> sdo:softwareRequirements ?requirement.}
        OPTIONAL {<${searchTerm}> dcterms:creator ?creatorID.
                ?creatorID rdfs:label ?creatorLabel.}
        OPTIONAL {<${searchTerm}> dcterms:created ?date.}
        OPTIONAL {<${searchTerm}> sdo:hasSourceCode ?sourceCode.
                ?sourceCode sdo:programmingLanguage ?progLang.}

    } GROUP BY ?label ?source ?creatorLabel ?date ?progLang
    LIMIT 1
    `;

    return prefixes + query
}

function softwareDatasetQuery(searchTerm) {

    query = `
    SELECT ?label ?datasetLabel ?datasetSource
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL{?datasetID mlso:hasRelatedSoftware <${searchTerm}>;
                            rdf:type mls:Dataset;
                            rdfs:label ?datasetLabel.}
        OPTIONAL{?datasetID mlso:hasRelatedSoftware <${searchTerm}>;
                            dcat:landingPage ?datasetSource.}

    } 
    LIMIT 1
    `;

    return prefixes + query
}

function softwarePublicationQuery(searchTerm) {

    query = `
    SELECT ?label ?paperLabel (GROUP_CONCAT(DISTINCT ?paperSource; separator="|") AS ?paperSources)
    WHERE {
        <${searchTerm}>  rdfs:label ?label.
        OPTIONAL{?paperID mlso:hasRelatedSoftware <${searchTerm}>;
                            rdf:type mlso:ScientificWork;
                            rdfs:label ?paperLabel;
                            dcterms:source ?paperSource.}
    } GROUP BY ?label ?paperLabel
    LIMIT 1
    `;

    return prefixes + query
}

function softwareTaskQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?taskLabel; separator="|") AS ?taskLabels)
    WHERE {
        <${searchTerm}> rdfs:label ?label.

        OPTIONAL{?paperID mlso:hasRelatedSoftware <${searchTerm}>;
                        mlso:hasTaskType ?taskTypeID.
                ?taskTypeID skos:prefLabel ?taskLabel.}
    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

function softwareAlgorithmQuery(searchTerm) {

    query = `
    SELECT ?label ?paperID ?implemID (GROUP_CONCAT(DISTINCT ?algoLabel; separator="|") AS ?algoLabels)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL{?paperID mlso:hasRelatedSoftware <${searchTerm}>.
        ?paperID mlso:hasRelatedImplementation ?implemID.
        ?implemID mls:implements ?algoID.
            ?algoID rdfs:label ?algoLabel.}
                
    } GROUP BY ?label ?paperID ?implemID
    LIMIT 1
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

function taskMetadataQuery(searchTerm) {

    query = `
    SELECT ?label ?source ?taskTypeID ?datasetID ?datasetLabel ?datasetSource
    WHERE {
        OPTIONAL {<${searchTerm}> rdfs:label ?label.}

        OPTIONAL {<${searchTerm}> prov:atLocation ?source.}
        OPTIONAL {<${searchTerm}> mlso:hasTaskType ?taskTypeID.}
        OPTIONAL {<${searchTerm}> mls:definedOn ?datasetID.
                ?datasetID rdf:type mls:Dataset;
                            rdfs:label ?datasetLabel;
                            dcat:landingPage ?datasetSource.}
    } LIMIT 1
    `;

    return prefixes + query
}

function taskTypeMetadataQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?source; separator="|") AS ?sources) (GROUP_CONCAT(DISTINCT ?broaderLabel; separator="|") AS ?broaderLabels) (GROUP_CONCAT(DISTINCT ?narrowerLabel; separator="|") AS ?narrowerLabels) 
    (GROUP_CONCAT(DISTINCT ?broaderID; separator="|") AS ?broaderIDs) (GROUP_CONCAT(DISTINCT ?narrowerID; separator="|") AS ?narrowerIDs)
    WHERE {
        OPTIONAL {<${searchTerm}> skos:prefLabel ?label.}
        OPTIONAL {<${searchTerm}> rdfs:seeAlso ?source.}
        OPTIONAL {<${searchTerm}> skos:broader ?broaderID.
                ?broaderID skos:prefLabel ?broaderLabel.}
        OPTIONAL {<${searchTerm}> skos:narrower ?narrowerID.
                ?narrowerID skos:prefLabel ?narrowerLabel.}
    } GROUP BY ?label
    LIMIT 1
    `;

    return prefixes + query
}

function taskTypeDatasetQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?datasetLabel; separator="|") AS ?datasetLabels) (GROUP_CONCAT(DISTINCT ?datasetSource; separator="|") AS ?datasetSources) 
    (GROUP_CONCAT(DISTINCT ?datasetID; separator="|") AS ?datasetIDs)
    WHERE {

        OPTIONAL {<${searchTerm}>  skos:prefLabel ?label.}
        OPTIONAL {?datasetID mlso:hasTaskType <${searchTerm}> ;
                            rdf:type mls:Dataset;
                            rdfs:label ?datasetLabel;
                            dcterms:source ?datasetSource.}
        
    } GROUP BY ?label
    LIMIT 1
    `;

    return prefixes + query
}

function taskTypePublicationQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?paperLabel; separator="|") AS ?paperLabels)  (GROUP_CONCAT(DISTINCT ?paperSource; separator="|") AS ?paperSources)
    WHERE {
        OPTIONAL {<${searchTerm}> skos:prefLabel ?label.}
        
        OPTIONAL {?paperID mlso:hasTaskType <${searchTerm}>;
                rdfs:label ?paperLabel;
                dcterms:source ?paperSource.
                FILTER(CONTAINS(STR(?paperSource),"paperswithcode"))}
        
    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

function taskTypeModelQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?modelID; separator="|") AS ?modelIDs)  (GROUP_CONCAT(DISTINCT ?modelLabel; separator="|") AS ?modelLabels) 
    WHERE {
        OPTIONAL {<${searchTerm}> skos:prefLabel ?label.}
        
        OPTIONAL {?paperID mlso:hasTaskType <${searchTerm}>;
                            rdf:type mlso:ScientificWork;
                            mlso:hasRelatedImplementation ?implID.
                ?runID mls:executes ?implID;
                        mls:hasOutput ?modelID.
                ?modelID rdfs:label ?modelLabel;
                    rdf:type mls:Model.}
        
    } GROUP BY ?label
    LIMIT 1
    `;

    return prefixes + query
}

function taskTypeAlgorithmQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?algoID; separator="|") AS ?algoIDs)  (GROUP_CONCAT(DISTINCT ?algoLabel; separator="|") AS ?algoLabels) 
    WHERE {
        OPTIONAL {<${searchTerm}> skos:prefLabel ?label.}
        
        OPTIONAL {?paperID mlso:hasTaskType <${searchTerm}>;
                            rdf:type mlso:ScientificWork;
                            mlso:hasRelatedImplementation ?implID.
                ?implID mls:implements ?algoID.
                ?algoID rdfs:label ?algoLabel.}
        
    } GROUP BY ?label
    LIMIT 1
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

function algorithmMetadataQuery(searchTerm) {

    query = `
    SELECT ?label ?description ?source ?repoSource (GROUP_CONCAT(DISTINCT ?altLabel; separator="|") AS ?altLabels)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL {<${searchTerm}> mlso:hasAlgorithmType ?algoTypeID.
                ?algoTypeID skos:altLabel ?altLabel.}
        
        OPTIONAL {<${searchTerm}> mlso:hasAlgorithmType ?algoTypeID.
                ?algoTypeID skos:definition ?description.}
        
        OPTIONAL {<${searchTerm}> mlso:hasAlgorithmType ?algoTypeID.
                ?algoTypeID dcterms:source ?source.}
        
        OPTIONAL {<${searchTerm}> mlso:hasAlgorithmType ?algoTypeID.
                ?algoTypeID rdfs:seeAlso ?repoSource.}
        
    } GROUP BY ?label ?description ?source ?repoSource
    LIMIT 1
    `;

    return prefixes + query
}

function algorithmPublicationQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?paperLabel; separator="|") AS ?paperLabels)  (GROUP_CONCAT(DISTINCT ?paperSource; separator="|") AS ?paperSources)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL {?implID mls:implements <${searchTerm}>.
                ?paperID mlso:hasRelatedImplementation ?implID;
                        rdfs:label ?paperLabel;
                        dcterms:source ?paperSource.
                FILTER(CONTAINS(STR(?paperSource),"paperswithcode"))}
        
    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

function algorithmModelQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?modelID; separator="|") AS ?modelIDs)  (GROUP_CONCAT(DISTINCT ?modelLabel; separator="|") AS ?modelLabels)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL {?implID mls:implements <${searchTerm}>.
                ?runID mls:executes ?implID;
                        mls:hasOutput ?modelID.
                ?modelID rdf:type mls:Model;
                        rdfs:label ?modelLabel.}
        
    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

function algorithmSoftwareQuery(searchTerm) {

    query = `
    SELECT ?label  (GROUP_CONCAT(DISTINCT ?softwareLabel; separator="|") AS ?softwareLabels) (GROUP_CONCAT(DISTINCT ?softwareSource; separator="|") AS ?softwareSources)  
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL {?implID mls:implements <${searchTerm}>.
                ?paperID mlso:hasRelatedImplementation ?implID;
                        mlso:hasRelatedSoftware ?softwareID.
                ?softwareID rdfs:label ?softwareLabel;
                            schema:codeRepository ?softwareSource.}
        
    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

function algorithmTaskQuery(searchTerm) {

    query = `
    SELECT ?label  (GROUP_CONCAT(DISTINCT ?taskTypeLabel; separator="|") AS ?taskTypeLabels)
    (GROUP_CONCAT(DISTINCT ?taskTypeID; separator="|") AS ?taskTypeIDs) 
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL {?implID mls:implements <${searchTerm}>.
                ?paperID mlso:hasRelatedImplementation ?implID;
                        mlso:hasTaskType ?taskTypeID.
                ?taskTypeID skos:prefLabel ?taskTypeLabel.}
        
    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

function implementationSearchQuery(searchTerm) {

    query = `
    SELECT ?entity ?label ?description {
        ?search a luc-index:implementation2_index ;
            luc:query "name:${searchTerm}" ;
            luc:entities ?entity .
        ?entity dcterms:title ?label;
        
        OPTIONAL {?entity dcterms:description ?description.}
    } LIMIT ${searchLimit}
    `;

    return prefixes + query
}

function implementationMetadataQuery(searchTerm) {

    query = `
    SELECT ?label ?description ?source ?date (GROUP_CONCAT(DISTINCT ?hpLabel; separator="|") AS ?hpLabels) ?datasetLabel  ?datasetSource (GROUP_CONCAT(DISTINCT ?softwareReq; separator="|") AS ?softwareReqs)
    WHERE {
        <${searchTerm}> dcterms:title ?label.
        
        OPTIONAL {<${searchTerm}> dcterms:description ?description.}
        OPTIONAL {<${searchTerm}> prov:atLocation ?source.}
        OPTIONAL {<${searchTerm}> dcterms:issued ?date.}
        OPTIONAL {<${searchTerm}> mls:hasHyperParameter ?hpID.
                ?hpID dcterms:title ?hpLabel.}
        OPTIONAL {?datasetID mlso:hasRelatedImplementation <${searchTerm}>;
                            rdfs:label ?datasetLabel;
                            dcat:landingPage ?datasetSource.}
        OPTIONAL {<${searchTerm}> mls:hasPart ?softwareID.
                ?softwareID rdf:type sdo:Software;
                            sdo:softwareRequirements ?softwareReq. }
        
    } GROUP BY  ?label ?description ?source ?date ?datasetLabel ?datasetSource
    LIMIT 1
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

function publicationMetadataQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?source; separator="|") AS ?sources) (GROUP_CONCAT(DISTINCT ?creatorLabel; separator="|") AS ?creatorLabels) ?date ?arxivID ?description (GROUP_CONCAT(DISTINCT ?tag; separator="|") AS ?tags)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL{<${searchTerm}> dcterms:source ?source.}
        OPTIONAL{<${searchTerm}> dcterms:creator ?creatorID.
                ?creatorID rdfs:label ?creatorLabel.}
        OPTIONAL{<${searchTerm}> dcterms:issued ?date.}
        OPTIONAL{<${searchTerm}> fabio:hasArXivId ?arxivID.}
        OPTIONAL{<${searchTerm}> fabio:abstract ?description.}
        OPTIONAL{<${searchTerm}> dcat:keyword ?tag.}
        
        
    } GROUP BY ?label ?date ?arxivID ?description
    LIMIT 1
    `;

    return prefixes + query
}

function publicationModelQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?modelID; separator="|") AS ?modelIDs) (GROUP_CONCAT(DISTINCT ?modelLabel; separator="|") AS ?modelLabels)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL{<${searchTerm}> mlso:hasRelatedImplementation ?implID.
            ?runID mls:executes ?implID;
                   mls:hasOutput ?modelID.
            ?modelID rdf:type mls:Model;
                     rdfs:label ?modelLabel.}

    } GROUP BY ?label
    LIMIT 1
    `;

    return prefixes + query
}

function publicationSoftwareQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?softwareSource; separator="|") AS ?softwareSources)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL {<${searchTerm}> mlso:hasRelatedSoftware ?softwareID.
            ?softwareID schema:codeRepository ?softwareSource.}
                
        
    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

function publicationTaskQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?taskTypeLabel; separator="|") AS ?taskTypeLabels)
    (GROUP_CONCAT(DISTINCT ?taskTypeID; separator="|") AS ?taskTypeIDs)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL {<${searchTerm}> mlso:hasTaskType ?taskTypeID.
                ?taskTypeID skos:prefLabel ?taskTypeLabel.}
                
        
    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

function publicationAlgorithmQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?algoLabel; separator="|") AS ?algoLabels)
    (GROUP_CONCAT(DISTINCT ?algoID; separator="|") AS ?algoIDs)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        
        OPTIONAL{<${searchTerm}> mlso:hasRelatedImplementation ?implID.
                ?implID mls:implements ?algoID.
            ?algoID rdfs:label ?algoLabel.}
                
        
    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}

function publicationDatasetQuery(searchTerm) {

    query = `
    SELECT ?label (GROUP_CONCAT(DISTINCT ?datasetLabel; separator="|") AS ?datasetLabels) (GROUP_CONCAT(DISTINCT ?datasetSource; separator="|") AS ?datasetSources)
    (GROUP_CONCAT(DISTINCT ?datasetID; separator="|") AS ?datasetIDs)
    WHERE {
        <${searchTerm}> rdfs:label ?label.
        OPTIONAL{?datasetID mlso:hasScientificReference <${searchTerm}>;
                            rdfs:label ?datasetLabel;
                            dcat:landingPage ?datasetSource.}
                
    } GROUP BY ?label 
    LIMIT 1
    `;

    return prefixes + query
}





    

