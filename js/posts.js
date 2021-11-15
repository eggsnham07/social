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
import { child, ref, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";
import { db } from "./app.js";
import * as md from "./markdown.js";
export function loadAllPosts(element) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            get(child(ref(db), "posts")).then((sn) => {
                if (sn.exists()) {
                    sn.val().forEach((post) => {
                        const postDiv = document.createElement("div");
                        postDiv.className = "post";
                        postDiv.innerHTML = `<h3 style="text-align: left">${post.author}</h3>
                    <h1 style="text-align:center">${post.title}</h1>
                    <br><br>
                    <a style="text-align:center" href="/posts?view=${post.author.replace(/\s/gm, '%20')}:${post.title.replace(/\s/gm, '%20')}">Read</a>`;
                        element.appendChild(postDiv);
                    });
                }
                else {
                    reject("No posts found 😥");
                }
            });
        });
    });
}
export function loadNewPosts() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
export function loadPost(element, author, postTitle) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            get(child(ref(db), `posts`)).then((sn) => {
                if (sn.exists()) {
                    var count = -1;
                    var isFound = false;
                    sn.val().forEach((post) => {
                        count++;
                        const found = `${post.author}:${post.title}`;
                        const req = `${author}:${postTitle}`;
                        if (found == req) {
                            isFound = true;
                            const postDiv = document.createElement("div");
                            postDiv.className = "post";
                            postDiv.innerHTML = `<h3 style="text-align: left">${post.author}</h3>
                        <h1 style="text-align:center">${post.title}</h1>
                        <br><br>
                        <div>${md.parse(post.content)}</div>`;
                            element.appendChild(postDiv);
                        }
                        if (isFound == false && count == sn.val().length) {
                            reject("Could not find post 😥");
                        }
                    });
                }
                else {
                    reject("Could not find post 😥");
                }
            });
        });
    });
}
