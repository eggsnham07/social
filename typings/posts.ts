//@ts-ignore
import { set, child, ref, get} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js"

import { Post } from "./types.js"
import { db } from "./app.js"
import * as md from "./markdown.js"

export async function loadAllPosts(element:HTMLElement) {
    return new Promise((resolve, reject) => {
        get(child(ref(db), "posts")).then((sn:any) => {
            if(sn.exists()) {
                sn.val().forEach((post:Post) => {
                    const postDiv = document.createElement("div")

                    postDiv.className = "post"
                    postDiv.innerHTML = `<h3 style="text-align: left">${post.author}</h3>
                    <h1 style="text-align:center">${post.title}</h1>
                    <br><br>
                    <a style="text-align:center" href="/posts?view=${post.author.replace(/\s/gm, '%20')}:${post.title.replace(/\s/gm, '%20')}">Read</a>`

                    element.appendChild(postDiv)
                })
            } else {
                reject("No posts found 😥")
            }
        })
    })
}

export async function loadNewPosts() {

}

export async function loadPost(element:HTMLElement, author:string, postTitle:string) {
    return new Promise((resolve, reject) => {
        get(child(ref(db), `posts`)).then((sn:any) => {
            if(sn.exists()) {
                var count = -1
                var isFound = false

                sn.val().forEach((post:Post) => {
                    count++
                    const found = `${post.author}:${post.title}`
                    const req = `${author}:${postTitle}`

                    if(found == req) {
                        isFound = true

                        const postDiv = document.createElement("div")

                        postDiv.className = "post"
                        postDiv.innerHTML = `<h3 style="text-align: left">${post.author}</h3>
                        <h1 style="text-align:center">${post.title}</h1>
                        <br><br>
                        <div>${md.parse(post.content)}</div>`
    
                        element.appendChild(postDiv)                        
                    }

                    if(isFound == false && count == sn.val().length) {
                        reject("Could not find post 😥")
                    }
                })
            } else {
                reject("Could not find post 😥")
            }
        })
    })
}