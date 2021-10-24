var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//@ts-ignore
import { ref, child, set, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";
//@ts-ignore
import { db } from "/js/app.js";
//@ts-ignore
import * as md from "/js/markdown.js";
export function loadAllPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        get(child(ref(db), `posts`)).then((sn) => {
            if (!sn.exists()) {
                //@ts-ignore
                document.getElementById("posts").innerHTML = "<h3 style='text-align:center;'>No posts to show... 😟</h3>";
                return;
            }
            var template = "";
            const req = new XMLHttpRequest();
            req.open("GET", `${location.protocol}//${location.href.split("/")[2]}/templates/post.html`);
            req.send();
            req.onload = function () {
                template = req.responseText;
                sn.val().forEach((post) => {
                    //@ts-ignore
                    document.getElementById("posts").innerHTML += template
                        .replace(/{{author}}/gm, post.author)
                        .replace(/{{title}}/gm, post.title)
                        .replace(/{{post-slug}}/gm, `${post.author}:${post.title.replace(/\s/gm, "%20")}`);
                });
            };
        });
    });
}
export function loadPost(postname) {
    return __awaiter(this, void 0, void 0, function* () {
        get(child(ref(db), "posts")).then((sn) => {
            if (!sn.exists()) {
                //@ts-ignore
                document.getElementById("posts").innerHTML = "<h3 style='text-align:center;'>No posts to show... 😟</h3>";
                return;
            }
            var template = "";
            const req = new XMLHttpRequest();
            req.open("GET", `${location.protocol}//${location.href.split("/")[2]}/templates/full-post.html`);
            req.send();
            req.onload = function () {
                template = req.responseText;
                sn.val().forEach((post) => {
                    const found = `${post.author}:${post.title}`;
                    if (found == postname) {
                        //@ts-ignore
                        document.getElementById("posts").innerHTML = template
                            .replace(/{{author}}/gm, post.author)
                            .replace(/{{title}}/gm, post.title)
                            .replace(/{{content}}/gm, `${md.parse(post.content)}`);
                    }
                });
            };
        });
    });
}
export function loadNewPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        get(child(ref(db), "posts")).then((sn) => {
            if (!sn.exists()) {
                //@ts-ignore
                document.getElementById("posts").innerHTML = "<h3 style='text-align:center;'>No posts to show... 😟</h3>";
                return;
            }
            var template = "";
            var count = 0;
            const req = new XMLHttpRequest();
            req.open("GET", `${location.protocol}//${location.href.split("/")[2]}/templates/post.html`);
            req.send();
            req.onload = function () {
                template = req.responseText;
                sn.val().forEach((post) => {
                    count++;
                    //@ts-ignore
                    document.getElementById("posts").innerHTML += template
                        .replace(/{{author}}/gm, post.author)
                        .replace(/{{title}}/gm, post.title)
                        .replace(/{{post-slug}}/gm, `${post.author}:${post.title.replace(/\s/gm, "%20")}`);
                    if (count >= 5) {
                        return;
                    }
                });
            };
        });
    });
}
export function createPost(title, body, author) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPost = [
            {
                author: author,
                title: title,
                content: body
            }
        ];
        get(child(ref(db), "posts")).then((sn) => {
            if (sn.exists()) {
                const total = newPost.concat(sn.val());
                console.log(total);
                set(child(ref(db), "posts"), total);
            }
        });
    });
}
