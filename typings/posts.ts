//@ts-ignore
import { ref, child, set, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js"
//@ts-ignore
import { db } from "/js/app.js"
//@ts-ignore
import * as md from "/js/markdown.js"

export async function loadAllPosts() {
    get(child(ref(db), `posts`)).then((sn:any) => {
        if(!sn.exists()) {
            //@ts-ignore
document.getElementById("posts").innerHTML = "<h3 style='text-align:center;'>No posts to show... 😟</h3>"
            return
        }

        var template = ""

        const req = new XMLHttpRequest()
        req.open("GET", `${location.protocol}//${location.href.split("/")[2]}/templates/post.html`)
        req.send()
        req.onload = function() {
            template = req.responseText
            sn.val().forEach((post:any) => {
                //@ts-ignore
document.getElementById("posts").innerHTML += template
                    .replace(/{{author}}/gm, post.author)
                    .replace(/{{title}}/gm, post.title)
                    .replace(/{{post-slug}}/gm, `${post.author}:${post.title.replace(/\s/gm, "%20")}`)
            })
        }
    })
}

export async function loadPost(postname:string) {
    get(child(ref(db), "posts")).then((sn:any) => {
        if(!sn.exists()) {
            //@ts-ignore
document.getElementById("posts").innerHTML = "<h3 style='text-align:center;'>No posts to show... 😟</h3>"
            return;
        }

        var template = ""

        const req = new XMLHttpRequest()
        req.open("GET", `${location.protocol}//${location.href.split("/")[2]}/templates/full-post.html`)
        req.send()
        req.onload = function() {
            template = req.responseText
            sn.val().forEach((post:any) => {
                const found = `${post.author}:${post.title}`
                if(found == postname) {
                    //@ts-ignore
document.getElementById("posts").innerHTML = template
                    .replace(/{{author}}/gm, post.author)
                    .replace(/{{title}}/gm, post.title)
                    .replace(/{{content}}/gm, `${md.parse(post.content)}`)
                }
            })
        }
    })
}

export async function loadNewPosts() {
    get(child(ref(db), "posts")).then((sn:any) => {
        if(!sn.exists()) {
            //@ts-ignore
            document.getElementById("posts").innerHTML = "<h3 style='text-align:center;'>No posts to show... 😟</h3>"
            return;
        }

        var template = ""
        var count = 0

        const req = new XMLHttpRequest()
        req.open("GET", `${location.protocol}//${location.href.split("/")[2]}/templates/post.html`)
        req.send()
        req.onload = function() {
            template = req.responseText
            sn.val().forEach((post:any) => {
                count++
                //@ts-ignore
                document.getElementById("posts").innerHTML += template
                    .replace(/{{author}}/gm, post.author)
                    .replace(/{{title}}/gm, post.title)
                    .replace(/{{post-slug}}/gm, `${post.author}:${post.title.replace(/\s/gm, "%20")}`)
                if(count >= 5) {
                    return
                }
            })
        }
    })
}

export async function createPost(title:string, body:string, author:string) {
    const newPost = [
        {
            author: author,
            title: title,
            content: body
        }
    ]
    get(child(ref(db), "posts")).then((sn:any) => {
        if(sn.exists()) {
            const total = newPost.concat(sn.val())
            console.log(total)
            set(child(ref(db), "posts"), total)
        }
    })
}