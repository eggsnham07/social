import { packageJson } from "./types";
import { CacheSystem } from "./cache.js";

//@ts-ignore
window.cacheSystem = new CacheSystem();

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

document.addEventListener("DOMContentLoaded", (e) => {
    switch(localStorage.getItem("mode")) {
        case "dark":
            //@ts-ignore
            window.toggleTheme()
            break
        default:
            break
    }

    //@ts-ignore
    window.toggleTheme()

    console.log(localStorage.getItem("mode"))
})

//@ts-ignore
getJSON(`/package.json`).then((data:packageJson) => {

    info.innerHTML = `<code>V${data.version}</code><a style="float:right;margin-right:20px;" target="_blank" href="${data.repository}">View on GitHub</a>
    <a style="float:right;margin-right:20px" href="javascript:toggleTheme()">Toggle Theme</a>`
    footer.className = "pageInfo"
    footer.appendChild(info)
    document.body.appendChild(footer)
}).catch((err) => console.error(err))

//@ts-ignore
window.toggleTheme = function() {
    if(document.getElementsByTagName("html")[0].getAttribute("theme") == "") {
        document.getElementsByTagName("html")[0].setAttribute("theme", "dark-mode")
        localStorage.setItem("mode", "dark")
    } else {
        document.getElementsByTagName("html")[0].setAttribute("theme", "")
        localStorage.setItem("mode", "light")
    }
}