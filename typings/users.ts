//@ts-ignore
import {  createUserWithEmailAndPassword,  signInWithEmailAndPassword, onAuthStateChanged,  updateProfile, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js"
//@ts-ignore
import { set, child, ref, get} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js"

import { auth, db } from "./app.js"
import { User } from "./types.js"

export const createUser = function(username:string, email:string, password:string) {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((cred:User) => {
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
                    uid: user.uid,
                    photoURL: user.photoURL
                })
            } else {
                reject("Not Loggedin!")
            }
        })
    })
}

//@ts-ignore
export async function getCurrentUser() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user:User) => {
            if(user) {
                get(child(ref(db), `users/${user.uid}`)).then((data:any) => {
                    resolve({
                        name: user.displayName,
                        email: user.email,
                        uid: user.uid,
                        photoURL: user.photoURL,
                        data: data.val()
                    })
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
                        set(ref(db, `users/${cred.user.uid}`), {
                            username: localStorage.getItem("user-info"),
                            email: email,
                            officialDev: false
                        }).then(() => {
                            localStorage.setItem("needsUpdate", "false")
                            resolve("Logged in and setup user!")
                        })
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
            if(user) resolve(true)
            else resolve(false)
        })
    })
}

//@ts-ignore
window.signOutUser = function() {
    signOut(auth)
    location.reload()
}