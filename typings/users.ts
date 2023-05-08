//@ts-ignore
import {  createUserWithEmailAndPassword,  signInWithEmailAndPassword, onAuthStateChanged,  updateProfile, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js"
import { auth } from "./app.js";
import { User } from "./types";

export const createUser = function(username:string, email:string, password:string) {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((cred:any) => {
                localStorage.setItem("needsUpdate", "true")
                localStorage.setItem("user-info", username.replace(/Official Developer/gm, ''))
                resolve("User created! Go to <a href='/login/'>login</a>")
            }).catch((err:Error) => {
                reject(err.message)
            })
    })
}

//@ts-ignore
window.getCurrentUser = function() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user:User) => {
            if(user) {
                resolve({
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid
                })
            } else {
                reject("Not Loggedin!")
            }
        })
    })
}

//@ts-ignore
export async function getCurrentUser(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
        onAuthStateChanged(auth, (user:User) => {
            if(user) {
                resolve({
                    //@ts-ignore
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    photoURL: user.photoURL
                })
            } else {
                reject("Not Loggedin!")
            }
        })
    })
}

export async function updateUser(object:User) {
    return new Promise((resolve, reject) => {
        updateProfile(auth.currentUser, {
            displayName: object.displayName,
            email: object.email,
            photoURL: object.photoURL
        }).then(() => {
            resolve(true)
        }).catch((error:string) => {
            reject(error)
        })
    })
}

//@ts-ignore
window.signInUser = function(email, password) {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((cred:any) => {
                if(localStorage.getItem("needsUpdate") == "true") {
                    updateProfile(auth.currentUser, {
                        displayName: localStorage.getItem("user-info")
                    }).then(() => {
                        localStorage.setItem("needsUpdate", "false")
                        resolve("Logged in and setup user!")
                    })
                } else {
                    resolve("Logged in with email: " + email)
                }
            }).catch((err:Error) => {
                reject(err.message)
            })
    })
}

//@ts-ignore
window.isSignedIn = async function() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user:User) => {
            if(user) resolve(true);
            else resolve(false);
        })
    })
}

document.body.onload = function() {
    //@ts-ignore
    window.isSignedIn().then(isLoggedin => {
        if(document.getElementById("links") != null) {
            if(isLoggedin) {
                onAuthStateChanged(auth, (user:User) => {
                    if(user == null) {
                        //@ts-ignore
                        document.getElementById("links").innerHTML += "<span style='color:#33333300;'>--</span><a style='float:left;margin-left:20px;' href='/login/'>Login</a>";
                        return;
                    };
                    console.log("Logged in as ", user.displayName)
                    //@ts-ignore
                    document.getElementById("links").innerHTML += `<span style='color:#33333300;'>--</span>
                    <a style="float:left;margin-left:20px" href='javascript:window.signOutUser()'>Logout</a>
                    <img style="margin-bottom:-10px;" width="40px" height="40px" src="${user.photoURL || 'https://git.eggsnham.com/favicon.png'}"> <a href="/user/">${user.displayName}</a> 
                    <a style='float:right;margin-right:40px' href='/posts/create'>Create a post</a>`
                })
            } else {
                //@ts-ignore
                document.getElementById("links").innerHTML += "<span style='color:#33333300;'>--</span><a style='float:left;margin-left:20px;' href='/login/'>Login</a>";
            }
        }
    });
}

//@ts-ignore
window.signOutUser = function() {
    signOut(auth);
    //@ts-ignore
    window.cacheSystem.use.userdata = null;
    location.reload()
}