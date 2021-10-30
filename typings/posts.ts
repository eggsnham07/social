//@ts-ignore
import { ref, child, set, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js"
//@ts-ignore
import { db } from "/js/app.js"
//@ts-ignore
import * as md from "/js/markdown.js"
//@ts-ignore
import { getCurrentUser } from "/js/users.js"

import { Post } from "./types"

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
            sn.val().forEach((post:Post) => {
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
            var count = 0
            var isFound = false

            sn.val().forEach((post:Post) => {
                count++

                const found = `${post.author}:${post.title}`
                if(found == postname) {

                    getCurrentUser().then((user:any) => {
                        if(user.name != post.author) {
                            //@ts-ignore
                            document.getElementById("posts").innerHTML = template
                                .replace(/<h3 style="float:right"><a href="(.*?)">Edit<\/a><\/h3>/gm, '')
                                .replace(/{{author}}/gm, post.author)
                                .replace(/{{title}}/gm, post.title)
                                .replace(/{{content}}/gm, `${md.parse(post.content)}`)
                                .replace(/{{post-slug}}/gm, `${post.author}:${post.title.replace(/ /gm, "%20")}`)
                        }
                        else if(user.name == post.author) {
                            //@ts-ignore
                            document.getElementById("posts").innerHTML = template
                                .replace(/{{author}}/gm, post.author)
                                .replace(/{{title}}/gm, post.title)
                                .replace(/{{content}}/gm, `${md.parse(post.content)}`)
                                .replace(/{{post-slug}}/gm, `${post.author}:${post.title.replace(/ /gm, "%20")}`)
                        }
                        isFound = true
                    }).catch((err:string) => {
                        //@ts-ignore
                        document.getElementById("posts").innerHTML = template
                            .replace(/<h3 style="float:right"><a href="(.*?)">Edit<\/a><\/h3>/gm, '')
                            .replace(/{{author}}/gm, post.author)
                            .replace(/{{title}}/gm, post.title)
                            .replace(/{{content}}/gm, `${md.parse(post.content)}`)
                            .replace(/{{post-slug}}/gm, `${post.author}:${post.title.replace(/ /gm, "%20")}`)
                    })
                }

                else if(found != postname && count == sn.val().length && isFound == false) 
                    //@ts-ignore
                    document.getElementById("posts")?.innerHTML = `<h3 style='text-align:center;'>No posts found... 😟</h3>`
            })
        }
    })
}

export async function loadNewPosts() {
    get(child(ref(db), "posts")).then((sn:any) => {
        if(!sn.exists()) {
            var mo = ""
            //@ts-ignore
            window.getCurrentUser().then(user => {
                //@ts-ignore
                document.getElementById("posts").style.textAlign = "center"

                if(user.name) mo = "<a style='text-align:center;' href='/posts/create'>Make one!</a>"
                //@ts-ignore
                document.getElementById("posts").innerHTML = `<h3 style='text-align:center;'>No posts to show... 😟</h3>${mo}`
                return;
            }).catch((err:string) => {
                //@ts-ignore
                document.getElementById("posts").innerHTML = `<h3 style='text-align:center;'>No posts to show... 😟</h3>`
            })
        } else {

            var template = ""
            var count = 0

            const req = new XMLHttpRequest()
            req.open("GET", `${location.protocol}//${location.href.split("/")[2]}/templates/post.html`)
            req.send()
            req.onload = function() {
                template = req.responseText
                sn.val().forEach((post:Post) => {
                    count++
                    if(count <= 2) {
                        //@ts-ignore
                        document.getElementById("posts").innerHTML += template
                            .replace(/{{author}}/gm, post.author)
                            .replace(/{{title}}/gm, post.title)
                            .replace(/{{post-slug}}/gm, `${post.author}:${post.title.replace(/\s/gm, "%20")}`)
                    }
                    else if(count >= 2) {
                        return
                    }
                })
            }
        }
    })
}

export async function createPost(title:string, body:string, author:string) {
    return new Promise((resolve, reject) => {
        const newPost = [
            {
                author: author,
                title: title,
                content: body
            }
        ]
        try {
            get(child(ref(db), "posts")).then((sn:any) => {
                const total = newPost.concat(sn.val())
                console.log(total)
                set(child(ref(db), "posts"), total)
                resolve(void(0))
            })
        } catch(error) {
            reject(error)
        }
    })
}

export async function updatePost(oldTitle:string, title:string, body:string, author:string) {
    return new Promise((resolve, reject) => {
        get(child(ref(db), "posts")).then((sn:any) => {
            if(!sn.exists()) {
                console.log("<h3 style='text-align:center;'>Could not find post... 😟</h3>")
                return;
            }

            var count = 0
            var isFound = false

            sn.val().forEach((post:Post) => {
                count++

                const found = `${post.author}:${post.title}`
                if(found == `${author}:${oldTitle}`) {
                    set(child(ref(db), `posts/${count-1}`), {
                        author: author,
                        content: body,
                        title: title
                    })
                    isFound = true
                    resolve(200)
                }

                else if(found != `${author}:${oldTitle}` && count == sn.val().length && isFound == false) {      
                    alert(`Could not edit post... 😟`)
                    reject(404)
                }
            })
        })
    })
}

//@ts-ignore
window.loadPostData = async function(author:string, title:string) {
    return new Promise((resolve, reject) => {
        get(child(ref(db), "posts")).then((sn:any) => {
            if(!sn.exists()) {
                console.log("<h3 style='text-align:center;'>Could not find post... 😟</h3>")
                return;
            }

            var count = 0
            var isFound = false

            sn.val().forEach((post:Post) => {
                count++

                const found = `${post.author}:${post.title}`
                if(found == `${author}:${title}`) {
                    resolve({
                        title: post.title,
                        content: post.content,
                        author: post.author
                    })
                    isFound = true
                }

                else if(found != `${author}:${title}` && count == sn.val().length && isFound == false) {      
                    console.log(`Could not find post... 😟`)
                    reject(404)
                }
            })
        })
    })
}