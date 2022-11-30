

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js"

import { getFirestore, onSnapshot,
	collection, doc, getDocs, getDoc,
	addDoc, deleteDoc, setDoc,
	query, where, orderBy, serverTimestamp,
	updateDoc, arrayUnion, arrayRemove, DocumentReference} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";

import {getStorage, ref, uploadBytes, getDownloadURL, listAll, list, deleteObject } from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-storage.js'

// Initialize 

const bygreenConfig = {
    apiKey: "AIzaSyDqK1z4fd7lO9g2ISbf-NNROMd7xpxcahc",
    authDomain: "bygreen-453c9.firebaseapp.com",
    projectId: "bygreen-453c9",
    storageBucket: "bygreen-453c9.appspot.com",
    messagingSenderId: "19954598250",
    appId: "1:19954598250:web:ba57c792bdf65dbc18a513",
    measurementId: "G-265TN8HGKX"};

const bygreen = initializeApp(bygreenConfig, 'bygreen');
const bygreenDb = getFirestore(bygreen)
const bygreenAuth = getAuth(bygreen)
const bygreenStorage = getStorage(bygreen)



/////////auth 
let errDiv = document.querySelector('#errors')

let type 
let dbUser ////firestore 
let authUser ///auth 
let accountsList = []

// may change onload to be here
onAuthStateChanged(bygreenAuth, async (user)=>{
    console.log('authstatefun', dbUser)
    if(user){
        console.log('from auth ', user)
        authUser = user
        user.getIdTokenResult().then(idTokenResult => {
            console.log('claims', idTokenResult.claims)
            type = idTokenResult.claims
            // if team 
            if (idTokenResult.claims.team){
                document.querySelectorAll('.teamEle').forEach(teamEle=>{
                    teamEle.style.display = 'block'
                })
                // document.querySelector('.addYellow').style.display = 'block'
            }
        })
        let dbUserDoc = await getDoc(doc(bygreenDb, 'users', user.uid))
        dbUser = dbUserDoc.data()

        if(dbUser){
        dbUser.id = dbUserDoc.id

            ////registered
            document.querySelectorAll('.logged').forEach(e=>{e.style.display = 'block'})
            document.querySelectorAll('.makeprofile').forEach(e=>e.style.display = 'none')
            document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'none')

            ///insert the basic info; 
            document.querySelector('.minicuserimg').style.backgroundImage = `url('${dbUser.img}')`
            document.querySelector(".minicuserusername").textContent = '@'+ dbUser.userName
            document.querySelector('.cuserimg').style.backgroundImage = `url('${dbUser.img}')`
            document.querySelector(".cuserusername").textContent = '@'+ dbUser.userName
            document.querySelector(".cusername").textContent = dbUser.name
            document.querySelector(".cuserbio").textContent = dbUser.bio

            // the sm; 
            if(dbUser.sm.fb){
                document.querySelector("#cuserFb").href =  `https://facebook.com/`+dbUser.sm.fb
                document.querySelector("#cuserFbImg").style.filter = `saturate(1)`
            }
            if(dbUser.sm.inst){
                document.querySelector("#cuserInst").href =  `https://instagram.com/`+dbUser.sm.inst
                document.querySelector("#cuserInstImg").style.filter = `saturate(1)`
            }
            if(dbUser.sm.tel){
                document.querySelector("#cuserTel").href =  `https://telegram.com/`+dbUser.sm.tel
                document.querySelector("#cuserTelImg").style.filter = `saturate(1)`
            }


            document.querySelector(".redPin").querySelector('span').textContent = dbUser.red.length
            document.querySelector(".greenPin").querySelector('span').textContent += dbUser.green.length
            // loop over the green pins and check if the pin do contain the
            //of the current account; if so add one and so ...
            document.querySelector(".yellowPin").querySelector('span').textContent += dbUser.yellow.length

    ///////check if owner
    if(dbUser.userName == profile){
        document.querySelectorAll('.owner').forEach(owner=>{
            owner.style.display = 'block'
        })
    }

        }else{
            /////half registered; make profile
            document.querySelectorAll('.makeprofile').forEach(e=>e.style.display = 'block')
            document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
            document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'none')
        }
        
    }else{
        /////not registered
        document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'block')
        document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
        document.querySelectorAll('.makeprofile').forEach(e=>e.style.display = 'none')

        dbUser = 'none'
    }
})
///////register 
document.querySelector('#registerbtn').addEventListener('click', (ev)=>{
    // check if valid data
    if(ev.target.parentElement.querySelector(".em").value.length > 0 &&ev.target.parentElement.querySelector(".em").value.length < 20 && ev.target.parentElement.querySelector(".pw").value.length > 6){
    // send 
        createUserWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value, ev.target.parentElement.querySelector(".pw").value).then(cred=>{
            console.log(cred)
        }).catch(err=>{
            console.log(err.message)
            errDiv.textContent = err.message
            errDiv.style.display = 'block'
            setTimeout(() => {
                errDiv.style.display = 'none'
            }, 10000);
        })
    }else{
        errDiv.textContent = 'not valid em or pw'
        errDiv.style.display = 'block'
        setTimeout(() => {
            errDiv.style.display = 'none'
        }, 10000);
    }
    // empty 
    document.querySelector('#registerUsername').value = ''
    document.querySelector('#registerPassword').value = ''
})
//////signin
signinbtn.addEventListener('click', (ev)=>{
    // send 
    if(ev.target.parentElement.querySelector('.em').value.length > 0 && ev.target.parentElement.querySelector('.pw').value.length > 0){
        signInWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value ,ev.target.parentElement.querySelector(".pw").value).then().catch(err=>{
            console.log(err.message)
            errDiv.textContent = err.message
            errDiv.style.display = 'block'
            setTimeout(() => {
                errDiv.style.display = 'none'
            }, 10000);
        })
    }else{
        errDiv.textContent = 'insert data'
        errDiv.style.display = 'block'
        setTimeout(() => {
            errDiv.style.display = 'none'
        }, 10000);
    }
    // empty 
    ev.target.parentElement.querySelector(".em").value = ''
    ev.target.parentElement.querySelector(".pw").value = ''
})
//////signout 
signoutbtn.addEventListener('click', ()=>{
    signOut(bygreenAuth, (result)=>{console.log('signed out', result)})
})
// sign with google  
const provider = new GoogleAuthProvider()
bygoogle.addEventListener('click', ()=>{
    signInWithPopup(bygreenAuth, provider).then((cred)=>console.log('signed with google', cred))
})
//////make profile; 
document.querySelector('#makeprofilebtn').addEventListener('click', async (ev)=>{
    //////////set user in the users collection user current user uid 
    let q = query(collection(bygreenDb, 'users'), where('username', '==', ev.target.parentElement.querySelector('#username').value))
    let foundDoc = await getDocs(q)
    let found

    foundDoc.forEach(e=>{
        found = doc.data()
        console.log(doc.id, doc.data())
    })
    console.log(foundDoc, found)
    if(!found){
        console.log('no taken')

        let fileRef = ref(bygreenStorage, '/userimgs/' + new Date().toISOString().replace(/:/g, '-') +document.querySelector("#userimg").files[0].name.replaceAll(" ","") )

            uploadBytes(fileRef, document.querySelector("#userimg").files[0]).then(res=>{
                getDownloadURL(res.ref).then(url=>{
                    console.log(url)
                    let imgUrl = url

        ///addDoc; add document to a collection; 
        setDoc(doc(bygreenDb, 'users', authUser.uid), {
            userName: ev.target.parentElement.querySelector('#username').value,
            name: ev.target.parentElement.querySelector('#name').value,
            bio: ev.target.parentElement.querySelector('#bio').value,
            img: imgUrl,
            red: [],
            green: [],
            yellow:[],
            type: 'user'
        }).then(()=>{window.location.reload();}) 
        
        })
    })



        // setDoc(doc(publicLinedb, 'users', currentUser.uid), {name: ev.target.querySelector('username').value})
    }else{
        //////////make messaga section to display errors 
        console.log('username already taken')
    }

})



//////ui-js; display 
document.querySelector(".auth").addEventListener("click", (e)=>{
    e.target.classList.toggle('on')
    if(e.target.classList.contains('on')){
        document.querySelector(".authstate").style.display = 'block'
    }else{
        document.querySelector(".authstate").style.display = 'none'
    }
})
document.querySelector('#displayEdit').addEventListener("click", (ev)=>{
    ev.target.classList.toggle('on')
    if(ev.target.classList.contains("on")){
        document.querySelector('#edit').style.display = 'inline'
    }else{
        document.querySelector('#edit').style.display = 'none'
    }
})


//////ui-js-data



///////getting data; 
// restructure data; 

let profile = window.location.href.split('/')[window.location.href.split('/').length-2]
let profileInfo

window.onload = async ()=>{

    //get the account data; 

    //server method 
    profile = window.location.href.split('/')[window.location.href.split('/').length-2]
    console.log(window.location.href)

    await getDocs(collection(bygreenDb, 'users')).then((data)=>{
    let docs = []
        data.docs.forEach(doc=>{
            docs.push({...doc.data(), id: doc.id})
        })
        accountsList = docs
        document.querySelector('#accountsCounter').textContent = docs.length
        // document.querySelector('#routesCounter').textContent = docs.length

        console.log(docs)
    })
    // makeAccount()

    // to delete
    profile = 'omar'

    profileInfo = accountsList.filter(account =>account.userName == profile)[0]
    console.log(profileInfo)
    if(profileInfo){
        // info;
        document.querySelector('#profileImg').style.backgroundImage = `url('${profileInfo.img}')`
        document.querySelector('#profileUserName').textContent = profileInfo.userName
        document.querySelector('#profileName').textContent = profileInfo.name
        document.querySelector('#profileBio').textContent = profileInfo.bio
        document.querySelector('#profileType').textContent = profileInfo.type

        /////insert the intended account data; 
        // publicline
        document.querySelector("#addedRoutesCounter").textContent = profileInfo.addedRoutes.length
        document.querySelector("#votedCounter").textContent = profileInfo.votes.length

        // bygreen
        document.querySelector("#redPinsCounter").textContent = profileInfo.red.length
        document.querySelector("#greenPinsCounter").textContent = profileInfo.green.length
        document.querySelector("#yellowPinsCounter").textContent = profileInfo.yellow.length
    }


    await getDocs(collection(bygreenDb, 'green')).then((data)=>{
        let docs = []
            data.docs.forEach(doc=>{
                docs.push({...doc.data(), id: doc.id})
            })
            document.querySelector('#greenCounter').textContent = docs.length
        })
    await getDocs(collection(bygreenDb, 'red')).then((data)=>{
    let docs = []
        data.docs.forEach(doc=>{
            docs.push({...doc.data(), id: doc.id})
        })
        document.querySelector('#redCounter').textContent = docs.length
        document.querySelector('#yellowCounter').textContent = docs.filter(pin=>pin.next).length
    })
    await getDocs(collection(bygreenDb, 'routes')).then((data)=>{
        let docs = []
            data.docs.forEach(doc=>{
                docs.push({...doc.data(), id: doc.id})
            })
            document.querySelector('#routesCounter').textContent = docs.length
            // document.querySelector('#votesCounter').textContent = 
            // console.log(docs)
        })
    
}



// sending

document.querySelector('#sendProfileEdit').addEventListener('click', (ev)=>{
    // check if valid 

    if(document.querySelector('#newUserName').value){
        console.log('to send new username ', dbUser.id, document.querySelector('#newUserName').value)
        // sending alarm
        document.querySelector('.message').style.display = 'block'
        document.querySelector('.message').style.textContent = 'sending ...'
        updateDoc(doc(bygreenDb, 'users', dbUser.id), {userName: document.querySelector('#newUserName').value}).then(data=>{
            document.querySelector('.message').style.textContent = 'sent'
            
            setTimeout(() => {
            document.querySelector('.message').style.display = 'none'
            }, 1000);
        })
    }
    if(document.querySelector('#newName').value){
        console.log('to send new username ', dbUser.id, document.querySelector('#newName').value)
        // sending alarm
        document.querySelector('.message').style.display = 'block'
        document.querySelector('.message').style.textContent = 'sending ...'
        updateDoc(doc(bygreenDb, 'users', dbUser.id), {name: document.querySelector('#newName').value}).then(data=>{
            document.querySelector('.message').style.textContent = 'sent'
            
            setTimeout(() => {
            document.querySelector('.message').style.display = 'none'
            }, 1000);
        })
    }
    if(document.querySelector('#newBio').value){
        console.log('to send new username ', dbUser.id, document.querySelector('#newBio').value)
        // sending alarm
        document.querySelector('.message').style.display = 'block'
        document.querySelector('.message').style.textContent = 'sending ...'
        updateDoc(doc(bygreenDb, 'users', dbUser.id), {bio: document.querySelector('#newBio').value}).then(data=>{
            document.querySelector('.message').style.textContent = 'sent'
            
            setTimeout(() => {
            document.querySelector('.message').style.display = 'none'
            }, 1000);
        })
    }
    if(document.querySelector('#newProfileImg').files[0]){
        console.log('to send new username ', dbUser.id, document.querySelector('#newProfileImg').files)
        // sending alarm
        document.querySelector('.message').style.display = 'block'
        document.querySelector('.message').style.textContent = 'sending ...'
        //send img then get url; 

        let fileRef = ref(bygreenStorage, '/userimgs/' + new Date().toISOString().replace(/:/g, '-') +document.querySelector("#newProfileImg").files[0].name.replaceAll(" ","") )

        uploadBytes(fileRef, document.querySelector("#newProfileImg").files[0]).then(res=>{
            getDownloadURL(res.ref).then(url=>{
                console.log(url)
                console.log('old url', dbUser.img)
                let imgUrl = url

                // delete old img
                deleteObject(ref(bygreenStorage, 'usersimgs/'+ dbUser.img)).then(data=>console.log('img deleted'))

            updateDoc(doc(bygreenDb, 'users', dbUser.id), {img: url}).then(data=>{
                document.querySelector('.message').style.textContent = 'sent'
                
                setTimeout(() => {
                document.querySelector('.message').style.display = 'none'
                }, 1000);
            })
        })



                })

    }
    if(document.querySelector('#newInst').value){
        console.log('to send new username ', dbUser.id, document.querySelector('#newInst').value)
        // sending alarm
        document.querySelector('.message').style.display = 'block'
        document.querySelector('.message').style.textContent = 'sending ...'
        updateDoc(doc(bygreenDb, 'users', dbUser.id), {'sm.inst': document.querySelector('#newInst').value}).then(data=>{
            document.querySelector('.message').style.textContent = 'sent'
            
            setTimeout(() => {
            document.querySelector('.message').style.display = 'none'
            }, 1000);
        })
    }
    if(document.querySelector('#newFb').value){
        console.log('to send new username ', dbUser.id, document.querySelector('#newFb').value)
        // sending alarm
        document.querySelector('.message').style.display = 'block'
        document.querySelector('.message').style.textContent = 'sending ...'
        updateDoc(doc(bygreenDb, 'users', dbUser.id), {'sm.fb': document.querySelector('#newFb').value}).then(data=>{
            document.querySelector('.message').style.textContent = 'sent'
            
            setTimeout(() => {
            document.querySelector('.message').style.display = 'none'
            }, 1000);
        })
    }
    if(document.querySelector('#newTel').value){
        console.log('to send new username ', dbUser.id, document.querySelector('#newTel').value)
        // sending alarm
        document.querySelector('.message').style.display = 'block'
        document.querySelector('.message').style.textContent = 'sending ...'
        updateDoc(doc(bygreenDb, 'users', dbUser.id), {'sm.tel': document.querySelector('#newTel').value}).then(data=>{
            document.querySelector('.message').style.textContent = 'sent'
            
            setTimeout(() => {
            document.querySelector('.message').style.display = 'none'
            }, 1000);
        })
    }


    // send
    
})


