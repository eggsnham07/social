var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getCurrentUser } from "./users.js";
import { loadPostData as loadPD, loadAllPostsData as loadAPD } from "./posts.js";
export class CacheSystem {
    constructor(use = sessionStorage) {
        //@ts-ignore
        this.use = { postCache: [], userdata: null, cacheDate: new Date().getDay() };
        if (use.postCache != undefined)
            this.use.postCache = JSON.parse(use.postCache);
        if (this.use.postCache.length == 0) {
            console.log("Creating post cache...");
            loadAPD().then((posts) => {
                this.use.postCache = posts;
                if (this.use.postCache.length > 1)
                    location.reload();
            });
        }
        if (use.userdata != undefined)
            this.use.userdata = JSON.parse(use.userdata);
        if (use.cacheDate != undefined)
            this.use.cacheDate = use.cacheDate;
        window.addEventListener("beforeunload", (_) => __awaiter(this, void 0, void 0, function* () {
            use.postCache = JSON.stringify(this.use.postCache);
            use.userdata = JSON.stringify(this.use.userdata);
        }));
        //@ts-ignore
        if (globalThis.cacheInstance != undefined) {
            console.log("Using already defined cache instance");
            return globalThis.cacheInstance;
        }
        //@ts-ignore
        else {
            console.log("CacheSystem loaded");
            globalThis.cacheInstance = this;
        }
    }
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.use.userdata == undefined || this.use.cacheDate != new Date().getDay()) {
                    try {
                        getCurrentUser().then(user => { this.cacheUser(user); resolve(user); });
                    }
                    catch (_e) {
                        reject(_e);
                    }
                }
                else {
                    console.log("Loaded user from cache");
                    resolve(this.use.userdata);
                }
            });
        });
    }
    getPost(title, forceNoCache = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (forceNoCache || this.use.postCache == undefined || this.use.cacheDate != new Date().getDay()) {
                    loadPD(title).then(post => {
                        this.cachePost(post);
                        resolve(post);
                    });
                }
                else {
                    var f = false;
                    this.use.postCache.forEach((post) => {
                        if (post.title == title) {
                            console.log("Loaded post from cache");
                            resolve(post);
                            f = true;
                            return;
                        }
                    });
                    if (!f) {
                        this.getPost(title, true).then(post => {
                            resolve(post);
                        });
                    }
                }
            });
        });
    }
    cacheUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.use.userdata = userData;
        });
    }
    cachePost(postData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.use.postCache.push(postData);
        });
    }
}
