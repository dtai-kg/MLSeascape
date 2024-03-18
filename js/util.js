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