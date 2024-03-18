# MLSeascape

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) 

<br>

MLSeascape is a web application that provides an abstraction layer for discovering ML metadata
from online platforms, leveraging knowledge graphs. It serves diverse ML components and is able
to demonstrate their properties and relationships between them, as well as to
provide the original sources they are found. The metadata are retrieved from [MLSea-KG](http://w3id.org/mlsea), the largest publicly availble knowledge graph of machine learning metadata to date. 

MLSeascape currently serves metadata from:
- [OpenML](https://www.openml.org)
- [Kaggle](https://www.kaggle.com)
- [Papers with Code](https://paperswithcode.com)

<br><br>

# Web Interface

MLSeascape allows users to search for different types of ML artifacts including: 
- Datasets 
- Models 
- Software 
- Tasks 
- Algorithms 
- Implementations 
- Publications  

<br><br>

Users first select the type of ML artifact (e.g., datasets) they are interested to search for and input a related keyword.

![Error loading the image!](/img/home-page.png) 
<br><br>

MLSeascape then presents potential matches for their search input in the MLSea-KG.

![Error loading the image!](/img/search-results.png) 

<br><br>

When the users select one of the matches, they are led to a new page that presents all generic metadata about their choice (e.g., date published, creators, description, original source) as well as related ML entities (e.g., similar datasets, related software, related ML tasks, publications) for the corresponding artifact.

![Error loading the image!](/img/dataset-page.png) 

<br><br>

# Contact 

Ioannis Dasoulas: ioannis.dasoulas@kuleuven.be 

Anastasia Dimou: anastasia.dimou@kuleuven.be


