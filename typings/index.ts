import { packageJson } from "./types"

async function getJSON(url:string): Promise<Object> {
    return new Promise<Object>((resolve, reject) => {
        if(!url.endsWith(".json")) reject("Not a .JSON url");
        const req = new XMLHttpRequest()
        req.open("GET", url)

        req.onload = function() {
            if(req.status >= 200 && req.status < 400) {
                resolve(JSON.parse(req.responseText))
            } else {
                reject(`Fetch ${url} failed`)
            }
        }

        req.send()
    })
}

const footer = document.createElement("footer")
const info = document.createElement("p")

//@ts-ignore
getJSON(`/package.json`).then((data:packageJson) => {
    info.innerHTML = `<code>V${data.version}</code><a style="float:right;margin-right:20px;" target="_blank" href="${data.repository}">View on GitHub</a>`
    footer.className = "pageInfo"
    footer.appendChild(info)
    document.body.appendChild(footer)
}).catch((err) => console.error(err))