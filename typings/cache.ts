import { getCurrentUser } from "./users.js";
import { loadPostData as loadPD, loadAllPostsData as loadAPD } from "./posts.js";
import { User, Post } from "./types.js";

type UseType = {
    userdata: User;
    postCache: Array<Post>;
    cacheDate: Number
}

export class CacheSystem {
    //@ts-ignore
    use:UseType = {postCache:[], userdata:null, cacheDate: new Date().getDay()};

    constructor(use=sessionStorage) {
        if(use.postCache != undefined) this.use.postCache = JSON.parse(use.postCache);
        if(this.use.postCache.length == 0) {
            console.log("Creating post cache...")
            //@ts-ignore
            loadAPD().then((posts:Array<Post>) => {
                this.use.postCache = posts;
                location.reload();
            }) 
        }
        if(use.userdata != undefined) this.use.userdata = JSON.parse(use.userdata);
        if(use.cacheDate != undefined) this.use.cacheDate = use.cacheDate;
        window.addEventListener("beforeunload", async _ => {
            //@ts-ignore
            if(globalThis.delete_cache) return;
            use.postCache = JSON.stringify(this.use.postCache);
            use.userdata = JSON.stringify(this.use.userdata);
        })

        //@ts-ignore
        if(globalThis.cacheInstance != undefined) {console.log("Using already defined cache instance"); return globalThis.cacheInstance;}
        //@ts-ignore
        else {console.log("CacheSystem loaded");globalThis.cacheInstance = this;}
    }

    async getUser(): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            if(this.use.userdata == undefined || this.use.cacheDate != new Date().getDay()) {
                getCurrentUser().then(user => {this.cacheUser(user); resolve(user);}).catch(_ => {reject("Nope")});
            } else {
                console.log("Loaded user from cache");
                resolve(this.use.userdata);
            }
        })
    }

    async getPost(title:string, forceNoCache:boolean=false): Promise<Post> {
        return new Promise<Post>((resolve, reject) => {
            if(forceNoCache || this.use.postCache == undefined || this.use.cacheDate != new Date().getDay()) {
                //@ts-ignore
                loadPD(title).then(post => {
                    this.cachePost(post);
                    resolve(post);
                })
            } else {
                var f = false;
                this.use.postCache.forEach((post:Post) => {
                    if(post.title == title) {
                        console.log("Loaded post from cache");
                        resolve(post);
                        f = true;
                        return;
                    }
                })
                if(!f) {
                    this.getPost(title, true).then(post => {
                        resolve(post);
                    })
                }
            }
        })
    }

    async cacheUser(userData:User) {
        this.use.userdata = userData;
    }

    async cachePost(postData:Post) {
        this.use.postCache.push(postData);
    }
}