/**
 * 
 * @param {String} url 
 * @returns
 */
function getJSON(url) {
    return new Promise((resolve, reject) => {
        if(!url.endsWith(".json")) reject("Not a .JSON url");
        const req = new XMLHttpRequest()
        req.open("GET", url)

        req.onload = function() {
            if(req.status >= 200 && req.status < 400) {
                resolve(JSON.parse(req.responseText))
            }
        }
    })
}

document.onload = function() {
    const footer = document.createElement("footer")
    const info = document.createElement("p")
    getJSON("/package.json").then((data) => {
        info.innerHTML = `<code>V${data.version}</code>`
    })
    footer.className = "pageInfo"
    footer.appendChild(info)
    document.body.appendChild(footer)
}