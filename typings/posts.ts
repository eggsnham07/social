//@ts-ignore
import { collection, getDocs, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { Post, SnapShot, User } from "./types.js"
import { CacheSystem } from "./cache.js"
import * as md from "./markdown.js"
import { db } from "./app.js"

const cache = new CacheSystem();

export async function loadAllPosts() {
    console.log(db);
    var snap = await getDocs(collection(db, "prod"));
    snap.forEach((doc:any) => {
        if(doc.id == "posts") {
            var collection = doc.data().collection;

            if(collection.length <= 0) {
                //@ts-ignore
                document.getElementById("posts").innerHTML = "<h3 style='text-align:center;'>No posts to show... 😟</h3>";
                return;
            }

            cache.use.postCache = collection;

            var template = "";

            const req = new XMLHttpRequest()
            req.open("GET", `${location.protocol}//${location.href.split("/")[2]}/templates/post.html`)
            req.send();
            req.onload = function() {
                template = req.responseText;

                for(const post of collection) {
                    //@ts-ignore
                    document.getElementById("posts").innerHTML += template
                    .replace(/{{author}}/gm, post.author)
                    .replace(/{{title}}/gm, post.title)
                    .replace(/{{post-slug}}/gm, `${post.author}:${post.title.replace(/\s/gm, "%20")}`);
                }
            }
        }
    });
}

export async function loadPost(postname:string) {
    var template = "";

    const req = new XMLHttpRequest()
    req.open("GET", `${location.protocol}//${location.href.split("/")[2]}/templates/full-post.html`);
    req.send();
    req.onload = async function() {
        template = req.responseText;
        cache.getPost(postname.split(":")[1]).then((post:Post) => {
            cache.getUser().then((user:any) => {
                if(user.name == post.author) {
                    //@ts-ignore
                    document.getElementById("posts").innerHTML = template
                        .replace(/{{author}}/gm, post.author)
                        .replace(/{{title}}/gm, post.title)
                        .replace(/{{content}}/gm, `${md.parse(post.content)}`)
                        .replace(/{{post-slug}}/gm, `${post.author}:${post.title.replace(/ /gm, "%20")}`);
                }
                else {
                    //@ts-ignore
                    document.getElementById("posts").innerHTML = template
                        .replace(/<h3 style="float:right"><a href="(.*?)">Edit<\/a><\/h3>/gm, '')
                        .replace(/{{author}}/gm, `${post.author}`)
                        .replace(/{{title}}/gm, post.title)
                        .replace(/{{content}}/gm, `${md.parse(post.content)}`)
                        .replace(/{{post-slug}}/gm, `${post.author}:${post.title.replace(/ /gm, "%20")}`)
                };
            }).catch((_) => {
                //@ts-ignore
                document.getElementById("posts").innerHTML = template
                    .replace(/<h3 style="float:right"><a href="(.*?)">Edit<\/a><\/h3>/gm, '')
                    .replace(/{{author}}/gm, post.author)
                    .replace(/{{title}}/gm, post.title)
                    .replace(/{{content}}/gm, `${md.parse(post.content)}`)
                    .replace(/{{post-slug}}/gm, `${post.author}:${post.title.replace(/ /gm, "%20")}`);
            })
        
        })
    }
}


export async function loadNewPosts() {
    var template = ""
    var count = 0

    const req = new XMLHttpRequest()
    req.open("GET", `${location.protocol}//${location.href.split("/")[2]}/templates/post.html`)
    req.send()
    req.onload = function() {
        template = req.responseText
        cache.use.postCache.forEach((post:Post) => {
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

export async function createPost(title:string, body:string, author:string) {
    return new Promise(async(resolve, reject) => {
        const newPost:Array<Post> = [
            {
                author: `${author}`,
                title: title,
                content: `${body}`
            }
        ]
        try {
            var fc;
            const dru = await getDocs(collection(db, "prod"));
            dru.forEach(async(d:any) => {
                if(d.id == "posts") {
                    var c = d.data().collection;
                    const total = newPost.concat(c);
                    cache.cachePost(newPost[0]);
                    await setDoc(doc(db, "prod", "posts"), {
                        collection: total
                    })
                    resolve(null);
                }
                /*
                const total = newPost.concat(sn.val());
                cache.cachePost(newPost[0]);
                const docRef = await addDoc(collection(db, "prod"), {
                    posts: {
                        collection: total
                    }
                })
                */
            })
        } catch(error) {
            reject(error)
        }
    })
}

export async function updatePost(oldTitle:string, title:string, body:string, author:string) {
    return new Promise((resolve, reject) => {
        //if(!sn.exists()) {
        //    console.log("<h3 style='text-align:center;'>Could not find post... 😟</h3>")
        //    return;
        //}
        getDocs(collection(db, "prod")).then((d:any) => {
            d.forEach((c:any) => {
                if(c.id == "posts") {
                    var count = 0
                    var isFound = false
                    var col = c.data().collection;

                    col.forEach(async (post:Post) => {
                        count++

                        const found = `${post.author}:${post.title}`
                        if(found == `${author}:${oldTitle}`) {
                            col.splice(col.indexOf(post), 1);
                            console.debug(col.indexOf(post));
                            await setDoc(doc(db, "prod", "posts"), {collection: col});
                            await createPost(title, body, author);
                            resolve(200);
                        }

                        else if(found != `${author}:${oldTitle}` && count == c.data().collection.length && isFound == false) {      
                            alert(`Could not edit post... 😟`)
                            reject(404)
                        }
                    })
                }
            })
        })
    })
}


export async function loadPostData(title:string): Promise<Post> {
    return new Promise<Post>(async (resolve, reject) => {
        try {
            const docRef = await getDoc(doc(db, "prod", "posts"));
            const col:Array<Post> = docRef.data().collection;
            var f = false;
            var c = 0;
            for(const p of col) {
                console.debug(p, title, p.title == title);
                c++;
                if(p.title == title) {
                    f = true;
                    resolve(p);
                }
                if(p == col[col.length] && !f) reject(404);
            }
            
            if(c == col.length && !f) reject(404);
        } catch(_e) {reject(_e);}
    })
}
export async function loadAllPostsData(): Promise<Array<Post>> {
    return new Promise<Array<Post>>(async (resolve) => {
        const d = (await getDoc(doc(db, "prod", "posts"))).data().collection;
        resolve(d);
    })
}

/*

//@ts-ignore
window.loadPostData = async function(author:string, title:string) {
    return new Promise((resolve, reject) => {
        get(child(ref(db), "posts")).then((sn:any) => {
            if(!sn.exists()) {
                reject("<h3 style='text-align:center;'>Could not find post... 😟</h3>");
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
*/