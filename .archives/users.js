import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged, 
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js"

import { auth } from "/js/app.js"

export const createUser = function(username, email, password) {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((cred) => {
                localStorage.setItem("needsUpdate", true)
                localStorage.setItem("user-info", username.replace(/Official Developer/gm, ''))
                resolve("User created!")
            }).catch((err) => {
                reject(err.message)
            })
    })
}

window.getCurrentUser = function() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                resolve({
                    name: user.displayName,
                    email: user.email
                })
            } 
        })
    })
}

window.signInUser = function(email, password) {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((cred) => {
                if(localStorage.getItem("needsUpdate") == "true") {
                    updateProfile(auth.currentUser, {
                        displayName: localStorage.getItem("user-info")
                    }).then(() => {
                        localStorage.setItem("needsUpdate", false)
                        resolve("Logged in and setup user!")
                    })
                } else {
                    resolve("Logged in with email: " + email)
                }
            }).catch((err) => {
                reject(err.message)
            })
    })
}

window.isSignedIn = async function() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if(user) resolve(true)
            else resolve(false)
        })
    })
}

document.body.onload = function() {
    window.isSignedIn().then(isLoggedin => {
        if(document.getElementById("links") != null) {
            if(isLoggedin) {
                onAuthStateChanged(auth, (user) => {
                    console.log("Logged in as ", user.displayName)
                    document.getElementById("links").innerHTML += "<span style='color:#33333300;'>--</span><a href='javascript:window.signOutUser()'>Logout</a> <a style='float:right;margin-right:40px' href='/posts/create'>Create a post</a>"
                })
            } else {
                document.getElementById("links").innerHTML += "<span style='color:#33333300;'>--</span><a href='/login/'>Login</a>"
            }
        }
    })
}

window.signOutUser = function() {
    signOut(auth)
    location.reload()
}