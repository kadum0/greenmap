

/////////////////initializing; 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
// import { initializeApp } from "./firebase-app.js";

import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js"

import { getFirestore, onSnapshot,
	collection, doc, getDocs, getDoc,
	addDoc, deleteDoc, setDoc,
	query, where, orderBy, serverTimestamp,
	updateDoc, arrayUnion, arrayRemove, DocumentReference, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";

import {getStorage, ref, uploadBytes, getDownloadURL, listAll, list, deleteObject } from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-storage.js'

const bygreenConfig = {
    apiKey: "AIzaSyDqK1z4fd7lO9g2ISbf-NNROMd7xpxcahc",
    authDomain: "bygreen-453c9.firebaseapp.com",
    projectId: "bygreen-453c9",
    storageBucket: "bygreen-453c9.appspot.com",
    messagingSenderId: "19954598250",
    appId: "1:19954598250:web:ba57c792bdf65dbc18a513",
    measurementId: "G-265TN8HGKX"
};

const bygreen = initializeApp(bygreenConfig, 'bygreen');
const bygreenDb = getFirestore(bygreen)
const bygreenAuth = getAuth(bygreen)
const bygreenStorage = getStorage(bygreen)

// let darkerGreenColor = '#27F060'
let greenColor = "#68F690"
let darkerGreenColor = '#21C24F'

let blueColor = '#3388FF'
let darkerBlueColor = '#075FDA'

let dbUser ////firestore 
let authUser ///auth 
// let type 
let accountsList = []


///////////////////getting-sending (auth)
///////register 
document.querySelector('#registerBtn').addEventListener('click', (ev)=>{
    // check if valid data

    // send 
    if(ev.target.parentElement.querySelector(".em").value.length > 0 &&ev.target.parentElement.querySelector(".em").value.length < 20 && ev.target.parentElement.querySelector(".pw").value.length > 0){

        console.log('make account')
        document.querySelector('#greenMessage').style.display = 'block'
        createUserWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value, ev.target.parentElement.querySelector(".pw").value).then(cred=>{
            console.log(cred)
            setTimeout(() => {
                document.querySelector('#greenMessage').style.display = 'none'
            }, 2000);
        }).catch(err=>{
            console.log(err.message)
            document.querySelector('#errors').textContent = err.message
            document.querySelector('#errors').style.display = 'block'
            setTimeout(() => {
                document.querySelector('#errors').style.display = 'none'
            }, 10000);
        })
    }else{

    }
    // empty 
    document.querySelector('#registerUsername').value = ''
    document.querySelector('#registerPassword').value = ''
})

//////signin
document.querySelector('#signinBtn').addEventListener('click', (ev)=>{
    console.log('to sign in')
    console.log(ev.target.parentElement)
    // console.log('click signin', document.querySelector('#signinUsername').value.length)
    // console.log(document.querySelector('#signinUsername').value.length >0)

    // send 
    if(document.querySelector('#signinUsername').value.length > 0 && document.querySelector('#signinPassword').value.length > 0){
        document.querySelector('#greenMessage').style.display = 'block'
        console.log('make account')
        signInWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value ,ev.target.parentElement.querySelector(".pw").value).then(()=>{
            setTimeout(() => {
                document.querySelector('#greenMessage').style.display = 'none'
            }, 2000);
    
    
        })
    }else{

    }
    // empty 
    ev.target.parentElement.querySelector(".em").value = ''
    ev.target.parentElement.querySelector(".pw").value = ''
})

//////signout 
document.querySelector('#signoutBtn').addEventListener('click', ()=>{
    signOut(bygreenAuth, (result)=>{console.log(result); location.reload();})
})
document.querySelector('#halfLoggedSignoutBtn').addEventListener('click', ()=>{
    signOut(bygreenAuth, (result)=>{console.log(result); location.reload()})
})

// sign with google  
document.querySelector('#byGoogle').addEventListener('click', ()=>{
    signInWithPopup(bygreenAuth, provider).then((cred)=>console.log(cred))
})

//////make profile; 
document.querySelector('#makeProfileBtn').addEventListener('click', async (ev)=>{
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

        let fileRef = ref(bygreenStorage, '/user-imgs/' + new Date().toISOString().replace(/:/g, '-') +document.querySelector("#userImg").files[0].name.replaceAll(" ","") )

            uploadBytes(fileRef, document.querySelector("#userImg").files[0]).then(res=>{
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
            addedRoutes: [], 
            votes: [],
            type: 'user'
        }).then(()=>{window.location.reload();}) 
        })
    })


    // setDoc(doc(bygreenDb, 'users', currentUser.uid), {name: ev.target.querySelector('username').value})
    
}else{
        //////////make messaga section to display errors 
        console.log('username already taken')
    }

})

////////setting main objects
////setting the map 
const map = L.map('map', { zoomControl: false }).setView([33.396600, 44.356579], 9); //leaflet basic map
let apiKey = 'pk.eyJ1IjoiYWxmcmVkMjAxNiIsImEiOiJja2RoMHkyd2wwdnZjMnJ0MTJwbnVmeng5In0.E4QbAFjiWLY8k3AFhDtErA'
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
maxZoom: 18,
id: 'mapbox/streets-v11',
tileSize: 512,
zoomOffset: -1,
accessToken: apiKey,
}).addTo(map);
L.Control.geocoder().addTo(map);


        ////////the required labels
        /// /getting icon; icon is special object not just an image; to remove
      //the function instead
        let greenPin = L.icon({
            iconUrl: "./imgs/green-pin-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [30, 40],
            iconAnchor: [13, 40],
            popupAnchor: [0, -30] 
        });
        let redPin = L.icon({
            iconUrl: "./imgs/red-pin-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [30, 40],
            iconAnchor: [13, 40],
            // iconAnchor: [3, 30],
            popupAnchor: [0, -30] 
        });
        let shopIcon= L.icon({
            iconUrl: "./imgs/shop-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            // iconSize: [30, 30],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30] 
        });
        let sindibad = L.icon({
            iconUrl: "./imgs/general/sindibad-basic-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [70, 60],
            iconAnchor: [26, 26],
            popupAnchor: [0, 0] 

        });


        // delete ?
        function makePin(typeOfPin){
            return L.icon({
                iconUrl: `./imgs/${typeOfPin}.png`,
                shadowSize: [50, 64], // size of the shadow
                shadowAnchor: [4, 62], // the same for the shadow
                iconSize: [30, 30],
                iconAnchor: [12, 41],
                popupAnchor: [0, -30] 
            })
        }


    //////////////////ui-js

    // find me
let myLoc 
let myPin
let watchID
    findMe.addEventListener('click', (ev)=>{
            ev.target.classList.toggle('on')
            if(ev.target.classList.contains('on')){
                // add marker and circle
        
                console.log("find me ...", navigator.geolocation)
                // internet based; 
                // no need to check and cant check 
        
                // get into the locatoin
                navigator.geolocation.getCurrentPosition(pos=>{
                    map.flyTo([pos.coords.latitude, pos.coords.longitude], 12)
                })
            
                watchID = navigator.geolocation.watchPosition((pos)=>{
                    console.log('watching; ',pos.coords.latitude, pos.coords.longitude)
                    
                    myPin?map.removeLayer(myPin):null
                    myLoc?map.removeLayer(myLoc):null
            
                    myPin = L.marker([pos.coords.latitude, pos.coords.longitude], {icon: sindibad}).addTo(map)
                    myLoc = L.circle([pos.coords.latitude, pos.coords.longitude], {color: darkerBlueColor, radius: 100}).addTo(map)
                    
                    localStorage.setItem('clientLoc', [pos.coords.latitude, pos.coords.longitude])
        
                    // map.flyTo([pos.coords.latitude, pos.coords.longitude], 16)
                    // setView([pos.coords.latitude, pos.coords.longitude])
        
                }, (err)=>{
                    console.log("gps not enabled")
                    document.querySelector('#redMessage').textContent = 'gps not enabled, enable it'
                    document.querySelector('#redMessage').style.display = 'block'
        
                    setTimeout(() => {
                        document.querySelector('#redMessage').style.display = 'none'
                    }, 2000);
                    // document.querySelector('#redMessage').textContent = 'enable gps'
        
                //     if(navigator.onLine){
        
                //         console.log('online')
        
                //         fetch('https://ipapi.co/json/')
                //         .then(res=>res.json())
                //         .then(data=>{
                //             console.log('got online loc;', data)
                //             map.flyTo([data.latitude, data.longitude], 12)
                //             myPin = L.marker([data.latitude, data.longitude], {icon: sindibad}).addTo(map)
                //             myLoc = L.circle([data.latitude, data.longitude], {color: darkerBlueColor, radius: 100}).addTo(map)
        
                //             localStorage.setItem('clientLoc', [data.latitude, data.longitude])
                
                //             console.log(myPin, myLoc)
                //         })
        
                //         document.querySelector('#redMessage').textContent = 'enable gps for more accurate results'
                //         document.querySelector('#redMessage').style.display = 'block'
                //         setTimeout(() => {
                //             document.querySelector('#redMessage').style.display = 'none'
                //         }, 2000);
        
                // // no permisson case
                //     }else{
                //         document.querySelector('#redMessage').textContent = 'no gps and no internet connection'
                //     document.querySelector('#redMessage').style.display = 'block'
                //     setTimeout(() => {
                //         document.querySelector('#redMessage').style.display = 'none'
                        
                //     }, 3000);
            
                // // give the previous saved location
                // // if(myLat && myLon){
                // //     console.log('geolocation is enabled')
                // //     map.flyTo([myLat, myLon], 16)
                // // }
                //     }
        
            })
        
            }else{
                // remove marker and circle, and stop watching 
                navigator.geolocation.clearWatch(watchID);
                map.removeLayer(myLoc)
                map.removeLayer(myPin)
            }
    })

//////////onclick display; 
//controllers 
document.querySelector('#controllersDi').addEventListener('click', (ev)=>{
    ev.target.classList.toggle("on")
    if(ev.target.classList.contains('on')){
        document.querySelector('#displayControllers').style.display='flex'
    }else{
        document.querySelector('#displayControllers').style.display='none'
    }
})
document.querySelectorAll(".addBtn").forEach(i=>{
    i.addEventListener("click", (e)=>{
        // console.log(e.target)
        e.target.classList.toggle('on')
        if(e.target.classList.contains("on")){
            document.querySelector("#" + e.target.getAttribute("data-contr")).style.display = 'block'
        }else{
            document.querySelector("#" + e.target.getAttribute("data-contr")).style.display = 'none'
        }
    })
})
document.querySelector("#miniProfileDi").addEventListener("click", (ev)=>{
    ev.target.classList.toggle('on')
    if(ev.target.classList.contains('on')){
        document.querySelector("#miniProfile").style.display = 'block'
    }else{
        document.querySelector("#miniProfile").style.display = 'none'
    }
})

// map
document.addEventListener('click', (ev)=>{
    // console.log(ev.target)
    console.log(ev.target)

    ///////////display profile when click on pin
    // !ev.target.classList.contains('displayLog')
    if (ev.target.classList.contains('leaflet-marker-icon') || ev.target.classList.contains('displayLog') || ev.target.classList.contains('campImg')){
        document.querySelector("#pinProfile").style.zIndex = "1100"

        document.querySelector("#pinProfile").style.display = 'block'
        document.querySelector("#pinProfile").style.pointerEvents = "all"
    }else{
        document.querySelector("#pinProfile").style.zIndex = "1"

        document.querySelector("#pinProfile").style.display = 'none'
        document.querySelector("#pinProfile").style.pointerEvents = "none"

    }

    if(ev.target.classList.contains('names') || ev.target.classList.contains('suggestedAccounts') ){
        // console.log('to display suggested')
        // display the box
        ev.target.parentElement.querySelector('.suggestedAccounts').style.display = 'block'
    }else{
        // hide the ?? box
        document.querySelectorAll('.suggestedAccounts').forEach(e=>e.style.display = 'none')
    }
})

// display users or teams ranking 
document.querySelector('#displayUsersRanking').addEventListener('click', (ev)=>{
    ev.target.classList = 'on'
    document.querySelector('#displayteamsRanking').classList= ''
    
    document.querySelector('#usersRanking').style.display = 'block'
    document.querySelector('#temasRanking').style.display = 'none'
})
document.querySelector('#displayteamsRanking').addEventListener('click', (ev)=>{
    ev.target.classList = 'on'
    document.querySelector('#displayUsersRanking').classList= ''
    
    document.querySelector('#teamsRanking').style.display = 'block'
    document.querySelector('#usersRanking').style.display = 'none'
})

//display log; 
document.querySelector('#displayLog').addEventListener('click', (ev)=>{
    ev.target.classList.toggle("on")
    if(ev.target.classList.contains('on')){
        document.querySelector('#log').style.display = 'block'
    }else{
        document.querySelector('#log').style.display = 'none'
    }
})
document.querySelector('#asideDi').addEventListener('click', (ev)=>{
    ev.target.classList.toggle('red')
    ev.target.classList.contains('red')?document.querySelector('aside').style.display = 'flex':document.querySelector('aside').style.display = 'none'
})

/////translate 
document.querySelector('#translateToEn').addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    if(ev.target.classList.contains('on')){
        document.querySelectorAll('.en').forEach((enElement)=>enElement.style.display='block')
        document.querySelectorAll('.ar').forEach((arELement)=>arELement.style.display='none')
        ev.target.textContent = 'ar'
    }else{
        document.querySelectorAll('.en').forEach((enElement)=>enElement.style.display='none')
        document.querySelectorAll('.ar').forEach((arELement)=>arELement.style.display='block')
        ev.target.textContent = 'en'
    }
})

///////////////////////ui-js-data
//public line routes
    let routesObjects = []
    let hoveredRoute
    let hoveredstart
    let hoveredend
document.querySelector("#displaylines").addEventListener("click", (e)=>{
    // console.log(e.target.classList)

    e.target.classList.toggle("on")
    if(e.target.classList.contains("on")){
        e.target.textContent = "اخفاء المسارات"
        // e.target.style.background = "#ff2a2a"
        displayLines(routes)
        // e.target.parentElement.append(suggetstMakeLinesBtn)
        document.querySelector("#suggestaddingline").style.display = "block"
    }else{
        hideLines(routesObjects)
        e.target.textContent = "النقل العام"
        // e.target.style.background = "#27f060"

        // e.target.parentElement.lastElementChild.remove()
        document.querySelector("#suggestaddingline").style.display = "none"
    }
})
function displayLines (pd){

    // make route object, link the doc data, addeventlistener (click and hover)
    // new method; 
    Object.values(pd).forEach(e=>{
        let routeObject = L.polyline(e.path, {color: darkerGreenColor}).bindPopup(e.name?e.name:'لم يتم اضافة اسم').addTo(map)

        e.start?hoveredstart= L.circle(e.path[0],{radius: 300, color: darkerGreenColor}).addTo(map):null
        e.end?hoveredend = L.circle(e.path[e.path.length-1],{radius: 300, color: darkerGreenColor}).addTo(map):null 
        
        routeObject.id = e.id
        routeObject.start = e.start
        routeObject.end = e.end
        routesObjects.push(routeObject)
        hoveredstart?routesObjects.push(hoveredstart):null
        hoveredend?routesObjects.push(hoveredend):null
    

        routeObject.addEventListener('mouseover',(route)=>{

            // new method
            routesObjects.forEach(e=>{e.setStyle({color: darkerGreenColor, opacity: .5})})

            hoveredRoute?map.removeLayer(hoveredRoute):null
            hoveredstart?map.removeLayer(hoveredstart):null
            hoveredend?map.removeLayer(hoveredend):null


            // required????
            hoveredRoute = L.polyline(route.target._latlngs, {color:blueColor, opacity: 1,interactive: false}).addTo(map)
            route.target.start?hoveredstart = L.circle(route.target._latlngs[0],{radius:300 ,color:blueColor, opacity: 1,interactive: false}).addTo(map):null

            route.target.end?hoveredend = L.circle(route.target._latlngs[route.target._latlngs.length-1], {radius:300, color:blueColor, opacity: 1,interactive: false}).addTo(map):null
        })
    })
}
function hideLines(pd){
    pd.forEach(e=>{
        map.removeLayer(e)
    })
    hoveredRoute?map.removeLayer(hoveredRoute):null
    hoveredstart?map.removeLayer(hoveredstart):null
    hoveredend?map.removeLayer(hoveredend):null
}

//account searching 
let basicRes
document.querySelectorAll('.names').forEach(search=>{

    search.addEventListener('keyup', ev=>{
        basicRes = ev.target.value.split(',')
        // console.log(basicRes)

        if (basicRes[basicRes.length-1][0] == '@'){
            // console.log('key is @')
            ev.target.parentElement.querySelector('.suggestedAccounts').style.display = 'block'

            let nameToFilter = basicRes[basicRes.length-1].slice(1)
            // get the value in split , 
            // console.log(basicRes)
            let result = accountsList.filter(account=>{
                return nameToFilter == account.userName.slice(0, basicRes[basicRes.length-1].length-1)
            })

                let resultElements = `${result.map(res=>`
                <span class="account suggestedAccount">
                    <h4 class="userName">@${res.userName}</h4>
                    <img class="accountImg" style="background-image: url('${res.img}');">
                </span>
                `)}`
                

            // console.log(result, accountsList, ev.target.value)
            ev.target.parentElement.querySelector('.suggestedAccounts').innerHTML = resultElements.replaceAll(',','')

            document.querySelectorAll('.suggestedAccount').forEach(sugAcc=>{
                sugAcc.addEventListener('click', ev=>{

                    // console.log(basicRes,'fire account auto', ev.target.querySelector('.userName').textContent)

                    basicRes[basicRes.length-1] = ev.target.querySelector('.userName').textContent
                    
                    ev.target.parentElement.parentElement.querySelector('input').value = basicRes.toString()
                    ev.target.parentElement.parentElement.querySelector('input').focus()
                    // console.log(ev.target.parentElement)
                    ev.target.parentElement.style.display = 'none'
                })
            })

        }

    })
})

//ranking 
totalSorting.addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    ev.target.classList.contains('on')?ranking('total', 'ac'):ranking('total', 'de')
})
redPinSorting.addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    ev.target.classList.contains('on')?ranking('red', 'ac'):ranking('red', 'de')
})
greenPinSorting.addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    ev.target.classList.contains('on')?ranking('green', 'ac'):ranking('green', 'de')
})
redToGreenSorting.addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    ev.target.classList.contains('on')?ranking('redToGreen', 'ac'):ranking('redToGreen', 'de')
})
function ranking(based, order){

        // restructure the accounts array
    //label the current account to be green 

    let intendedOrder = []
    let orderedUserElements
    let orderedteamElements

    if(based == 'total'){
        if(order == 'de'){
            // decending order 
            intendedOrder = accountsList.sort((a, b) => { return (b.green.length+b.red.length)-(a.green.length +a.red.length)}) 
        }else{
            //acending order 
            intendedOrder = accountsList.sort((a, b) => { return (a.green.length +a.red.length)-(b.green.length+b.red.length)})
        }
    }else if(based == 'red'){
        if(order == 'de'){
            intendedOrder = accountsList.sort((a,b)=>{return b.red.length - a.red.length})
        }else{
            intendedOrder = accountsList.sort((a,b)=>{return a.red.length - b.red.length})
        }

    }else if(based == 'green'){
        if(order == 'de'){
            intendedOrder = accountsList.sort((a,b)=>{return b.green.length - a.green.length})
        }else{
            intendedOrder = accountsList.sort((a,b)=>{return a.green.length - b.green.length})
        }

    }else if(based == 'redToGreen'){
        if(order == 'de'){
            intendedOrder = accountsList.sort((a,b)=>{return b.redToGreen.length - a.redToGreen.length})
        }else{
            intendedOrder = accountsList.sort((a,b)=>{return a.redToGreen.length - b.redToGreen.length})
        }


    }

    // make the dom
    let currentUserName 
    dbUser?currentUserName=dbUser.userName:null

    let userCounter= 1
    orderedUserElements = `${intendedOrder.map((account, index)=>{
        if(account.type == 'user'){return`
<div class="rankedAccount" ${account.userName == currentUserName?'id="#me" style="background-color: #29D659"':''}>
    <span class="ranking">${userCounter++}</span>
        <a href=' http://${window.location.host+'/profile/'+ account.userName} '> <b style='color: white'> 
    <div class="account">
        <img class="accountImg" style="background-image: url('${account.img}');">
        <h3 class="accountUsername ranked">${account.userName}</h3>
    </div>
        
        </b> </a>


    <h3 class="red">${account.red[0]?account.red.length:0}</h3>
    <h3 class="green">${account.green[0]?account.green.length:0}</h3>
    <h3 class="makingGreen">-</h3>
    <h3 class="total">${(account.red[0]?account.red.length:0)+(account.green[0]?account.green.length:0)}</h3>
</div>
    `}
})}`


        let teamCounter = 1
    orderedteamElements = `${intendedOrder.map((account, index)=>{
        if(account.type == 'team'){return`
<div class="rankedAccount" ${account.userName == currentUserName?'style="background-color: #29D659"':''}>
    <span class="ranking">${teamCounter++}</span>
    <div class="account">
        <img class="accountImg" style="background-image: url('${account.img}');">
        <h3 class="accountUsername ranked">${account.userName}</h3>
    </div>

    <h3 class="red">${account.red[0]?account.red.length:0}</h3>
    <h3 class="green">${account.green[0]?account.green.length:0}</h3>
    <h3 class="makingGreen">not yet</h3>
    <h3 class="total">${(account.red[0]?account.red.length:0)+(account.green[0]?account.green.length:0)}</h3>
</div>
    `}
        })}`

    // console.log('intended order',intendedOrder)
    document.querySelector('#usersRanking').innerHTML = orderedUserElements.replaceAll(',', '')
    document.querySelector('#teamsRanking').innerHTML = orderedteamElements.replaceAll(',', '')
}

//leaflet zoom
map.on('zoomend', function () {
    // let currentZoom = map.getZoom();
    console.log('current zoom;',map.getZoom()  , map.getBounds())
    routesObjects.forEach(route=>{
    if(map.getZoom() == 10){
        route.setStyle({weight: 5})
    }else if(map.getZoom() == 11){
        route.setStyle({weight: 10})
    }else if(map.getZoom() == 12){
        route.setStyle({weight: 15})
    }else if(map.getZoom() == 13){
        route.setStyle({weight: 20})
    }else if(map.getZoom() == 14){
        route.setStyle({weight: 25})
    }
    })
})

//////shops 
document.querySelector('#displayShops').addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    if(ev.target.classList.contains('on')){
        insertShops(shops)
    }else{
        hideShops()
    }
})
let shopsObjects = []
function insertShops(dataList){
    dataList.forEach(shop=>{
        // console.log(shop)
        // on toggle imgs; make imgs then insert it on toggle
        let imgs = shop.imgs.map(img=>`<img class='shopImg' style='background-image:url("${img}")'>`).join('').toString()
        let shopObject = L.marker(shop.coords, {icon: shopIcon}).bindPopup(`<p>${shop.info}</p>`).addTo(map)

        shopObject.addEventListener('click', (ev)=>{
            document.querySelector('#beforeandafter').innerHTML = `<div> ${imgs} </div> `
            document.querySelector('#details').textContent = ''
            document.querySelector('#date').textContent = ''

            document.querySelector('#loggedContent').innerHTML = ''
        })
        shopsObjects.push(shopObject)
    })
}
function hideShops(){
    shopsObjects.forEach(shp=>{
        map.removeLayer(shp)
    })
}

document.querySelector('#exitPreview').addEventListener('click', (ev)=>{
    console.log(ev.target)
    ev.target.parentElement.style.display = 'none'
})

document.querySelector('#nextImgPreview').addEventListener('click', (ev)=>{
    document.querySelector('#beforeImgs').children.forEach(chil=>{
        if(child.style.backgroundImage == `url('${document.querySelector('#previewCampImg').src}')`){
            console.log(child)
            // console.log(Array.prototype.indexOf.call(children, children[1]))
        }
    })
})



/////////////////////////////////getting data 
////////////restructure data

//////pins 
let prevMarker 
function insertPins (generalPin){
    console.log(generalPin)
    //new method; check if red or green then sub check if next or premade 

    if(!generalPin.afterImgs){
        
        // loop over them; 
            // do shageneralPin stuff; 
            // coords, imgs, names; make generalPin and link data with to be inserted onclick
            let names
            // edit; get one name; no need for loop and list 

            if(generalPin.next){
                names = accountsList.filter(account =>account.userName == generalPin.next.by)

                // console.log(generalPin.next.by,names)
                names = `
                <a href=' http://${window.location.host+'/'+ generalPin.next.by}/next '> <b style='color: blue;'> http://${window.location.host+'/'+ generalPin.next.by}/next </b> </a>
                <a href='http://${window.location.host+'/profile/'+ generalPin.next.by}'>
                <span class="account contr teamContr">
                    <h4 class="userName"> ${names[0]?names[0].userName:'unknown'}</h4>
                    <img class="accountImg" style="background-image: url('${names[0]?names[0].img:null}');"></img>
                </span>
                </a>
                `

            }else{
                let filtered = accountsList.filter(account=>'@'+account.userName == generalPin.names)
            
                if(filtered[0]){
                    // console.log(filtered[0])
                    names =  `
                    <a href='http://${window.location.host+'/profile/'+ filtered[0].userName}'>
                <span class="account contr">
                    <h4 class="userName">@${filtered[0].userName}</h4>
                    ${filtered[0]?`<img class="accountImg" style="background-image: url('${filtered[0].img}');"></img>`:null}
                    
                </span>
                </a>
                `
                    
                }else{
                    names = `<h4 class="contrName">${generalPin.names[0]}</h4>`
                }
            }

    let pin = L.marker(generalPin.coords, {
        icon:redPin,
        popupAnchor: [-10, -30]
    }).bindPopup(`<div>${names}</div>`).addTo(map)
    pin.id = generalPin.id


    // make the dom elements;

    // new method
    let beforeImgsElements = []
    // generalPin.beforeImgsElements = []

    generalPin.beforeImgs.forEach(img=>{
        let imgLink = document.createElement('div')
        imgLink.style.height = '100%'
        imgLink.style.width = '100%'
        imgLink.classList.add('campImg')
        imgLink.style.backgroundImage = `url('${img}')`
        imgLink.addEventListener('click',(ev)=>{
            console.log(ev.target)
            document.querySelector('#previewCampImgCont').style.display = 'block'
            document.querySelector('#previewCampImg').setAttribute('src', img)
        })

        // let imgEle = document.createElement('img')
        // imgEle.classList.add('campImg')
        // imgEle.style.height = '100%'
        // imgEle.style.width = '100%'
        // imgEle.style.backgroundImage = `url('${img}')`
        // imgEle.addEventListener('load', (ev)=>console.log('img is; ', ev.target))
        // imgEle.addEventListener('click', (ev)=>{
        //     console.log(ev.target)
        //     // document.querySelector('#previewCampImgCont').style.display = 'block'
        //     // document.querySelector('#previewImg').setAttribute('src', img)
        // })
        // imgLink.append(imgEle)
        beforeImgsElements.push(imgLink)
        // document.querySelector('#beforeImgs').append(imgLink)
        // beforeImgsElements.push(imgEle)
    })
    pin.beforeImgs = beforeImgsElements




    // old method
    // let beforeImgsElements = generalPin.beforeImgs.map(img=>{
    //     return `<img style='background-image:url("${img}")'>`
    // })
    // pin.beforeImgs = beforeImgsElements.join('').toString()

    pin.addEventListener('click', (ev)=>{

        // new method
        // document.querySelector('#beforeandafter').innerHTML = ``
        // let beforeImgsDiv = document.createElement('div')
        // beforeImgsDiv.setAttribute('id', 'beforeImgs')
        // beforeImgsDiv.addEventListener('click', (ev)=>console.log(ev.target))
        

        // beforeImgsElements.forEach(imgElement=>{
        //     console.log(imgElement)
        //     // imgElement.addEventListener('click', (ev)=>{
        //     //     console.log(ev.target)
        //     //     document.querySelector('#previewCampImgCont').style.display = 'block'
        //     //     document.querySelector('#previewImg').setAttribute('src', img)
        //     // })
        // // imgElement.addEventListener('load', ()=>{
        // //     })
        // })


        // let afterImgsDiv = document.createElement('div')
        // afterImgsDiv.setAttribute('id', 'afterImgs')
        // beforeImgsElements.forEach(imgDiv=>{
        //     beforeImgsDiv.append(imgDiv)
        // })

        

        // document.querySelector('#beforeandafter').append(beforeImgsDiv, afterImgsDiv)

        // beforeImgsDiv.addEventListener('click', ev=>{
        //     console.log(ev.target.tagName == 'IMG', ev.target)
        // })

        // old method
        // document.querySelector('#beforeandafter').innerHTML = `
        //     <div id="afterImgs">
        //     </div>
        //     <div id="beforeImgs">
        //         ${ev.target.beforeImgs}
        //     </div>
        // `
        document.querySelector('#beforeImgs').innerHTML = ''
        ev.target.beforeImgs.forEach(element=>{
            document.querySelector('#beforeImgs').append(element)
        })

        // beforeImgsElements.forEach(element=>{
        //     document.querySelector('#beforeImgs').append(element)
        // })
        document.querySelector('#afterImgs').innerHTML = ''

        document.querySelector('#details').textContent = ''
        document.querySelector('#date').textContent = ''

        // console.log(ev.target)

        //method; circle; 
        prevMarker?map.removeLayer(prevMarker):null
        prevMarker = L.circle(ev.target._latlng, {radius: 800 ,color: (generalPin.next?'yellow':'red')}).addTo(map)
        currentId = ev.target.id

        //method; set property object to pin object; selected, normal

        if(currentId){
            document.querySelector('#sendRedToGreen').removeAttribute('disabled')
            document.querySelector('#sendYellow').removeAttribute('disabled')
        }else{
            document.querySelector('#sendRedToGreen').setAttribute('disabled', true)
            document.querySelector('#sendYellow').setAttribute('disabled', true)
        }
    })


            // check if next 
            if(generalPin.next){

                // change icon 
                pin.setIcon(L.icon({
                    iconUrl: `./imgs/teams-icons/${generalPin.next.by}-next-icon.png`,
                    shadowSize: [50, 64], // size of the shadow
                    shadowAnchor: [4, 62], // the same for the shadow
                    iconSize: [30, 30],
                    iconAnchor: [12, 41],
                    popupAnchor: [0, -30] 
                }))

                pin.addEventListener('click', ()=>{
                // change icon 

                })


                // settting time objects; 
                // let intendedDate = {}
                let intendedDate = {
                    year: generalPin.next.date.year,
                    month: generalPin.next.date.month,
                    day: generalPin.next.date.day,
                    hour: generalPin.next.date.hour, 
                    minute: generalPin.next.date.minute,
                    part: generalPin.next.date.part
                }

                var today = new Date();
                var dd = + String(today.getDate()).padStart(2, '0');
                var mm = + String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();

                let currentDate ={
                    year: yyyy,
                    month: mm,
                    day: dd,
                    hour: today.getHours(),
                    minute: today.getMinutes()
                }

                intendedDate.part == 'pm'?intendedDate.hour = + intendedDate.hour + 12:null


                let remainedDay
                if(intendedDate.day >  currentDate.day ){
                    remainedDay = intendedDate.day - currentDate.day
                }else{
                    remainedDay = ( + intendedDate.day + 30) - currentDate.day
                    intendedDate.month = intendedDate.month - 1
                    
                }

                let reaminedHour 
                if(intendedDate.hour > currentDate.hour){
                    reaminedHour = intendedDate.hour - currentDate.hour
                }else{
                    reaminedHour = ( + intendedDate.hour + 24) - currentDate.hour
                    // intendedDate.day = intendedDate.day - 1
                    remainedDay = remainedDay -1
                }

                let remainedMinute
                if(intendedDate.minute > currentDate.minute ){
                    remainedMinute = intendedDate.minute - currentDate.minute
                }else{
                    remainedMinute = (+ intendedDate.minute + 60) - currentDate.minute
                    // intendedDate.hour = intendedDate.hour - 1
                    reaminedHour = reaminedHour -1
                }





                let remainedDate = {
                    year: intendedDate.year - currentDate.year,
                    month: intendedDate.month - currentDate.month,
                    day: reaminedHour == 24?remainedDay+1:remainedDay,
                    hour: reaminedHour == 24?0:reaminedHour,
                    minute:remainedMinute
                }
                // how to find the remained minutes to the intended time ???
                // console.log(intendedDate, currentDate, remainedDate)
                // find the team account and make the object; remove the normal user ???
                // inser the info 
                let coming = document.createElement('span')
                coming.classList.add('comingCounter')
                coming.textContent = generalPin.next.going.length
                // coming.innerHTML = `<span class='comingCounter'>0</span>`
                // let coming = `<span class='comingCounter'>0</span>`
                let comingBtn = document.createElement('button')
                dbUser?comingBtn.setAttribute('disabled', true):comingBtn.removeAttribute('disabled')
                comingBtn.classList.add('coming', 'box', 'bycreate')
                comingBtn.textContent = 'coming'
                if(dbUser){
                    generalPin.next.going.includes(dbUser)?comingBtn.classList.toggle('on'):null
                }
                // if(generalPin.next.going.includes(dbUser.userName)){
                //     comingBtn.classList.toggle('on')
                // }
                // comingBtn.setAttribute('disabled', true)

                let div = document.createElement('div')
                let newNames = document.createElement('div')
                newNames.innerHTML = names

                let intendedId = generalPin.id

                comingBtn.addEventListener('click', (ev)=>{
                    ev.target.classList.toggle('on')
                    if(ev.target.classList.contains('on')){
                        ev.target.parentElement.querySelector('.comingCounter').textContent ++
                        // updateDoc(doc(bygreenDb, 'tempRed', red.id),{"next.going":arrayUnion(dbUser.userName)}).then(()=>console.log('sent'))
                    }else{
                        ev.target.parentElement.querySelector('.comingCounter').textContent --
                        // updateDoc(doc(bygreenDb, 'tempRed', red.id),{"next.going":arrayRemove(dbUser.userName)}).then(()=>console.log('sent'))

                    }
                })

                let campDetials = document.createElement('div')
                let detials = `
                <div class='timer'>
                <p>${generalPin.next.info}</p>
                <b>
        <p>${generalPin.next.date.month}m-${generalPin.next.date.day}d-${generalPin.next.date.hour}h:${generalPin.next.date.minute}min, ${generalPin.next.date.part} </p>
        <div style='color:red;'>الوقت المتبقي:</div>
        <p style='color:red'> ${remainedDate.month}m.${remainedDate.day}d.${remainedDate.hour}h.${remainedDate.minute}min </b> </p>
                </div>
                `

                campDetials.innerHTML = detials
                div.append(newNames,comingBtn, coming,campDetials)
                pin.bindPopup(div)
            }else{
                // normal pin
            }
    }else{
        //loop over list; 
        // make pin content; names, before and after imgs,
        // make pin function; onlick
            // general (both; normal and to green)


            // by; team and names
            let theteam = accountsList.filter(account=>'@'+ account.userName == generalPin.managedBy )
            generalPin.names = generalPin.names.map(name=>name.trim())
            // console.log(generalPin.names)
            let names= generalPin.names.map(ee=>{
                // console.log(ee, accountsList)
                // ee.trim(), '@'+ account.userName === ee.trim()))
                
                let filtered = accountsList.filter(account=>('@'+ account.userName) == ee)
                // console.log(filtered)
                if(filtered[0]){
                    // console.log(filtered[0])
                    return `
                    <a href='http://${window.location.host+'/profile/'+ filtered[0].userName}'>
                <span class="account contr">
                    <h4 class="userName">${ee}</h4>
                    ${filtered?`<img class="accountImg" style="background-image: url('${filtered[0].img}');"></img>`:null}
                </span>
                </a>
                `
                    
                }else{
                    return `<h4 class="contrName">${ee}</h4>`
                }
        }).join('').toString()


        let by = `
        <b>المساهمين ❤</b>

        <div class=''> ${theteam[0]? `<div class="account contr teamContr">
            <h3 class="userName"> ${theteam[0].userName} </h3>
        <img class="accountImg" style="background-image:url('${theteam[0].img}');">
        </div> <br>`:''}${names}</div>`
        let logImgs

        // console.log(generalPin.log)
        if(generalPin.log[0]){
            logImgs = generalPin.log.map(logImg=>{
                return `                    
                <span class="loggedCamp">
                    <p>${logImg.date}</p>
                    <img src="${logImg.img}" alt="">
                </span>`
            }).join('').toString()
            // console.log(logImgs)
            // logImgs.replaceAll(',', '')
        }

            let pin = L.marker(generalPin.coords, {
                icon: greenPin,
                popupAnchor: [-10, -30]
            }).bindPopup(`<div>${by}</div>`).addTo(map)
            // make the dom elements;

            let beforeImgsElements = []

            generalPin.beforeImgs.forEach(img=>{
                let imgLink = document.createElement('div')
                imgLink.style.height = '100%'
                imgLink.style.width = '100%'
                imgLink.classList.add('campImg')
                imgLink.style.backgroundImage = `url('${img}')`
                imgLink.addEventListener('click',(ev)=>{
                    console.log(ev.target)
                    document.querySelector('#previewCampImgCont').style.display = 'block'
                    document.querySelector('#previewCampImg').setAttribute('src', img)
                })
                beforeImgsElements.push(imgLink)
                // document.querySelector('#beforeImgs').append(imgLink)
            })

            let afterImgsElements = []
            generalPin.afterImgs.forEach(img=>{
                let imgLink = document.createElement('div')
                imgLink.style.height = '100%'
                imgLink.style.width = '100%'
                imgLink.classList.add('campImg')
                imgLink.style.backgroundImage = `url('${img}')`
                imgLink.addEventListener('click',(ev)=>{
                    console.log(ev.target)
                    document.querySelector('#previewCampImgCont').style.display = 'block'
                    document.querySelector('#previewCampImg').setAttribute('src', img)
                })
                afterImgsElements.push(imgLink)
                // document.querySelector('#afterImgs').append(imgLink)
            })
        
        

            // let afterImgsElements = generalPin.afterImgs.map(img=>{
            //     return `<img style='background-image:url("${img}")'>`
            // }).join('').toString()

            pin.id = generalPin.id
            pin.beforeImgs = beforeImgsElements
            pin.afterImgs = afterImgsElements
            pin.details = generalPin.details
            pin.date = generalPin.date
            logImgs?pin.logImgs = logImgs:null

            if(theteam[0]){
                pin.setIcon(L.icon({
                    iconUrl: `./imgs/${generalPin.managedBy.slice(1)}greenpin.png`,
                    shadowSize: [50, 64], // size of the shadow
                    shadowAnchor: [4, 62], // the same for the shadow
                    iconSize: [30, 30],
                    iconAnchor: [12, 41],
                    popupAnchor: [0, -30] 
                }))
            }


            pin.addEventListener('click', (ev)=>{

                document.querySelector('#beforeImgs').innerHTML = ''
                ev.target.beforeImgs.forEach(element=>{
                    document.querySelector('#beforeImgs').append(element)
                })

                document.querySelector('#afterImgs').innerHTML = ''
                ev.target.afterImgs.forEach(element=>{
                    document.querySelector('#afterImgs').append(element)
                })

                document.querySelector('#details').textContent = ev.target.details
                document.querySelector('#date').textContent = ev.target.date

                document.querySelector('#loggedContent').innerHTML = ev.target.logImgs

                document.querySelector('#sendLog').removeAttribute("disabled")
                prevMarker?map.removeLayer(prevMarker):null
                prevMarker = L.circle(ev.target._latlng, {radius: 800 ,color: 'green'}).addTo(map)

                currentId = ev.target.id
            })

            if(generalPin.redToGreen){
                // check the team; 
                // change icon 
            }

    }
}



/////////////get data 

// containers 
let redPins
let currentPin
let currentId
let routes
let greenPins
let pins = []
let shops 

await onAuthStateChanged(bygreenAuth, async (user)=>{
    document.querySelector("#greenMessage").style.display = 'block'

    // console.log('authstatefun', dbUser)
    if(user){
        // console.log('from auth ', user)
        authUser = user
        user.getIdTokenResult().then(idTokenResult => {
            // console.log('claims', idTokenResult.claims)
            type = idTokenResult.claims
            // if team 
            if (idTokenResult.claims.team){
                document.querySelectorAll('.teamEle').forEach(teamEle=>{
                    teamEle.style.display = 'inline-block'
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
            // document.querySelector(".minicuserusername").textContent = '@'+ dbUser.userName
            document.querySelector('.cuserimg').style.backgroundImage = `url('${dbUser.img}')`
            document.querySelector(".cuserusername").textContent = '@'+ dbUser.userName
            document.querySelector(".cusername").textContent = dbUser.name
            document.querySelector(".cuserbio").textContent = dbUser.bio
            document.querySelector("#profileLink").href = window.location.host+'/'+ dbUser.userName

            document.querySelector(".redPin").querySelector('span').textContent = dbUser.red.length
            document.querySelector(".greenPin").querySelector('span').textContent += dbUser.green.length
            // loop over the green pins and check if the pin do contain the
            //of the current account; if so add one and so ...
            document.querySelector(".yellowPin").querySelector('span').textContent += dbUser.yellow.length


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
        if(accountsList){
            ranking('total', 'de')
        }

    getDocs(collection(bygreenDb, 'users')).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                accountsList = docs

                // localstorage 
                navigator.onLine?localStorage.setItem('users', JSON.stringify(accountsList)):accountsList = JSON.parse(localStorage.getItem("users") || "[]")
                console.log(accountsList, navigator.onLine)
                // console.log(docs)
                document.querySelector('#accountsCounter').textContent = accountsList.length



    // getDocs(collection(bygreenDb, 'red')).then((data)=>{
    //         console.log(data)
    //         let docs = []
    //             data.docs.forEach(doc=>{
    //                 docs.push({...doc.data(), id: doc.id})
    //             })
    //             redPins = docs
    //             console.log(redPins)

    //             // localstorage 
    //             navigator.onLine?localStorage.setItem('redpins', JSON.stringify(redPins)):redPins= JSON.parse(localStorage.getItem("redpins") || "[]")


    //             // navigator.onLine?localStorage.setItem('redpins', JSON.stringify(redPins)):redPins = JSON.parse(localStorage.getItem("redpins") || "[]")

    //             // console.log(docs)
    //             insertPins(redPins, 'red')
    //             // console.log(document.querySelector('#yellowCounter').textContent)
    //             // redPins.forEach(redPin=>{
    //             //     if(redPin.next){
                        
    //             //     }
    //             // })
    //             redPins.forEach(redPin =>redPin.next?document.querySelectorAll('.nextPinsCounter').forEach(nextCounter=>nextCounter.textContent++):document.querySelector('#redCounter').textContent ++)

    //                 // check the url; if have next
    // // console.log(window.location.href.split('/'))
    // // console.log(window.location.hostname)
    // if(window.location.href.split('/').includes("next")){

    //     // list method; 
    //     let theteam = window.location.href.split('/')[window.location.href.split('/').length-3]
    //     let theteamObj= accountsList.filter(account=>account.userName== theteam)
    //     // console.log( theteamObj)
    //     let theCamp = redPins.filter(pin=>pin.id == theteamObj[0].yellow[0])
    //     // console.log(theCamp)
    //     map.flyTo({lat: theCamp[0].coords.lat, lng: theCamp[0].coords.lng}, 16)
    // }

    //     })

    // getDocs(collection(bygreenDb, 'green')).then((data)=>{
    //     let docs = []
    //         data.docs.forEach(doc=>{
    //             docs.push({...doc.data(), id: doc.id})
    //         })
    //         greenPins = docs
    //         // console.log(docs)

    //             // localstorage 
    //             navigator.onLine?localStorage.setItem('greenpins', JSON.stringify(greenPins)):greenPins = JSON.parse(localStorage.getItem("greenpins") || "[]")

    //         insertPins(greenPins, 'green')
    //         document.querySelector('#greenCounter').textContent = greenPins.length

    //         let contriCounter = 0
    //         greenPins.forEach(greenPin =>contriCounter += greenPin.names.length)
    //         document.querySelector('#contriCounter').textContent = contriCounter

    //         document.querySelector('#sendingDataMessage').style.display = 'none'
    //     })


    getDocs(collection(bygreenDb, 'pins')).then((data)=>{
        let docs = []
            data.docs.forEach(doc=>{
                docs.push({...doc.data(), id: doc.id})
            })
            pins = docs
            // console.log(docs)

                // localstorage 
                navigator.onLine?localStorage.setItem('pins', JSON.stringify(pins)):pins = JSON.parse(localStorage.getItem("pins") || "[]")

                pins.forEach(pin=>insertPins(pin))

            // insertPins(greenPins, 'green')
            // document.querySelector('#greenCounter').textContent = greenPins.length

            // let contriCounter = 0
            // greenPins.forEach(greenPin =>contriCounter += greenPin.names.length)
            // document.querySelector('#contriCounter').textContent = contriCounter

            document.querySelector('#greenMessage').style.display = 'none'
        })



        if(dbUser){
            ranking('total', 'de')
        }

        }).catch(err=>{
            accountsList = JSON.parse(localStorage.getItem("users") || "[]")

            console.log("grabage internet connection")
            document.querySelector("#redMessage").textContent = 'garbage internet connection'
            document.querySelector("#redMessage").style.display = 'block'
            setTimeout(() => {
                document.querySelector("#redMessage").style.display = 'none'
                
            }, 2000);
    
        })
    getDocs(collection(bygreenDb, 'routes')).then((data)=>{
        let docs = []
            data.docs.forEach(doc=>{
                docs.push({...doc.data(), id: doc.id})
            })
            routes = docs

            // localstorage 
            navigator.onLine?localStorage.setItem('routes', JSON.stringify(routes)):routes = JSON.parse(localStorage.getItem("routes") || "[]")


            // console.log(routes)
        setTimeout(() => {
            document.querySelector('#displaylines').classList.toggle('on')
            document.querySelector('#displaylines').textContent = "اخفاء المسارات"
            // document.querySelector('#displaylines').style.background = "#181818"

            displayLines(routes)
            document.querySelector("#suggestaddingline").style.display = "block"
                
        }, 1500);
        }).catch(err=>{
            routes = JSON.parse(localStorage.getItem("routes") || "[]")

            console.log("grabage internet connection")
            document.querySelector("#redMessage").textContent = 'garbage internet connection'
            document.querySelector("#redMessage").style.display = 'block'
            setTimeout(() => {
                document.querySelector("#redMessage").style.display = 'none'
                
            }, 2000);
    
        })

        document.querySelector("#displaylines").removeAttribute("disabled")

        // get shops; 
        getDocs(collection(bygreenDb, 'shop')).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                shops = docs
                // console.log('shops', shops)

                // localstorage 
                navigator.onLine?localStorage.setItem('shops', JSON.stringify(shops)):shops = JSON.parse(localStorage.getItem("shops") || "[]")

                // console.log(docs)

                // insertPins(greenPins, 'green')
                // document.querySelector('#greenCounter').textContent = greenPins.length

                document.querySelector('#greenMessage').style.display = 'none'
                document.querySelector('#displayShops').removeAttribute('disabled')
        }).catch(err=>{
        shops = JSON.parse(localStorage.getItem("shops") || "[]")

        console.log("grabage internet connection")
        document.querySelector("#redMessage").textContent = 'garbage internet connection'
        document.querySelector("#redMessage").style.display = 'block'
        setTimeout(() => {
            document.querySelector("#redMessage").style.display = 'none'
            
        }, 2000);

    })
})

/////////////////////////////////////////////sending; 
/////prepare; collecting data; complex data recieving

document.querySelectorAll(".addCoords").forEach(e=>{
    e.addEventListener("click", (ee)=>{
        ee.target.classList.toggle("on")

        ///???
        ee.target.getAttribute("id") == "addRedCoords"?currentPin = redPin:currentPin=greenPin
    })
})

//////add pins 
let currentCoords
let addedPin
map.addEventListener('click', function (ev) {
    addedPin?map.removeLayer(addedPin):null

    if(document.querySelector('#addRedCoords').classList.contains("on")||document.querySelector('#addGreenCoords').classList.contains("on")){
        let latlng = map.mouseEventToLatLng(ev.originalEvent);

        // console.log(latlng)
        addedPin = L.marker(latlng, {
            icon: currentPin
        }).addTo(map);
        // m = addedPin
        currentCoords = latlng
    }
});

//////add log
document.querySelector('#addToLog').addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    if(ev.target.classList.contains('on')){
        document.querySelector("#addLog").style.display= 'block'
    }else{
        document.querySelector("#addLog").style.display= 'none'
    }
})


/////////////send data
// send log
document.querySelector('#sendLog').addEventListener("click", ()=>{
    // restructure

    // console.log(document.querySelector('#addToLogImg').files)
    let logImg= document.querySelector('#addToLogImg').files[0]
    // console.log(logImg)
    document.querySelector('#sendingDataMessage').style.display = 'block'

    document.querySelector('#sendingDataMessage').textContent = 'sending'

    uploadBytes(ref(bygreenStorage, '/log/' + new Date().toISOString().replace(/:/g, '-') +logImg.name.replaceAll(" ","") ), logImg).then(res=>{
        getDownloadURL(res.ref).then(url=>{
            // console.log(document.querySelector('#addToLogDate').value, url, currentId)
            // send log
            // updateDoc(doc(bygreenDb, 'tempGreen', currentId), {log: arrayUnion({date: document.querySelector('#addToLogDate').value, img: url})} ).then(()=>console.log("sent"))

            // confirm send
                document.querySelector('#sendingDataMessage').textContent = 'sent'
                setTimeout(() => {
                    document.querySelector('#sendingDataMessage').style.display = 'none'
                }, 1000);
                
    })
    })

    // send

})

// send pin 
document.querySelectorAll(".send").forEach(sendBtn=>{

    sendBtn.onclick= async (e)=>{
        //////check if exist then empty them 
        let children = e.target.parentElement.children
        // console.log(children)

        // check if there is a coords and files 
        if((currentCoords || currentId) && children[3].files?children[3].files[0]:true && children[3].files?children[3].files[1]:true && children[3].files?children[3].files[2]:true){
            // message.innerHTML = ""

        if(e.target.getAttribute('id')=='sendRed'){
            // coords, bimgs, take name if wanted, 
            // console.log('to send')
            document.querySelector('#sendingDataMessage').style.display = 'block'
            document.querySelector('#sendingDataMessage').textContent = 'sending data...'

        /////store img; make ref, send img; get img link; send object with the link

        let names
    dbUser?names = '@'+dbUser.userName:names = 'unknown'
    let files = e.target.parentElement.querySelector('.addBImgs').files
    // e.target.parentElement.querySelector('#insertMyUserName').checked?names=dbUser.userName:names='good
    // person'

let imgUrls =[]
let counterToSend = 0
for (var i = 0; i < files.length; i++) {

    // console.log(files[i]);
    let fileRef = ref(bygreenStorage, '/before/' + new Date().toISOString().replace(/:/g, '-') +files[i].name.replaceAll(" ","") )

    uploadBytes(fileRef, files[i]).then(res=>{
        getDownloadURL(res.ref).then(url=>{
            // console.log(url)
            imgUrls.push(url)
            counterToSend ++

            // console.log(counterToSend,e.target.parentElement.querySelector('.addBImgs').files.length )

        if(counterToSend == e.target.parentElement.querySelector('.addBImgs').files.length){
            // make and send (add doc)
            ///addDoc; add document to a collection; 
            // console.log(currentCoords,imgUrls,names,new Date)
            let newCoords = {lat: currentCoords.lat,lng: currentCoords.lng}

            addDoc(collection(bygreenDb, 'temPins'), {
            coords: newCoords,
            beforeImgs: imgUrls,
            names:[names],
            date: new Date().getFullYear()+'-'+String(new Date().getMonth() + 1).padStart(2, '0')+'-'+String(new Date().getDate()).padStart(2, '0')
            }).then((docData)=>{

                // to be recored for the user based on the choice
                // console.log(docData, docData.id)
                // updateDoc(doc(bygreenDb, 'users', authUser.uid), {red: arrayUnion(docData.id)}).then(()=>console.log('recorded'))

                // confirm send
                document.querySelector('#sendingDataMessage').textContent = 'sent'
                setTimeout(() => {
                    document.querySelector('#sendingDataMessage').style.display = 'none'
                }, 1000);
                
                // document.querySelector('#insertMyUsername')?
            }) 
        }
    })
    })
}



// sending green pin; 
            }else if(e.target.getAttribute('id')=='sendGreen'){
            // coords, bimgs, aimgs, names, details
            // console.log('to send')
            document.querySelector('#sendingDataMessage').style.display = 'block'
            document.querySelector('#sendingDataMessage').textContent = 'sending data...'

        /////store img; make ref, send img; get img link; send object with the link


        let beforeImgUrls =[]
        let counterToSend = 0


        // let names = dbUser.userName
        let bFiles = e.target.parentElement.querySelector('.addBImgs').files
        // e.target.parentElement.querySelector('#insertMyUserName').checked?names=dbUser.userName:names='good
        // person'

        for (var i = 0; i < bFiles.length; i++) {

            // console.log(bFiles[i]);
            let fileRef = ref(bygreenStorage, '/before/' + new Date().toISOString().replace(/:/g, '-') +bFiles[i].name.replaceAll(" ","") )

            uploadBytes(fileRef, bFiles[i]).then(res=>{
                getDownloadURL(res.ref).then(url=>{
                    // console.log(url)
                    beforeImgUrls.push(url)
                    counterToSend ++


                if(counterToSend == bFiles.length){

                    ////to start the next loop; 
                    let afterImgsUrls = []
                    let counterToSend = 0

                    let aFiles = e.target.parentElement.querySelector('.addAImgs').files


                    for (var i = 0; i < aFiles.length; i++) {

                        // console.log(aFiles[i]);
                        let fileRef = ref(bygreenStorage, '/after/' + new Date().toISOString().replace(/:/g, '-') +aFiles[i].name.replaceAll(" ","") )
                            
                        uploadBytes(fileRef, aFiles[i]).then(res=>{
                            getDownloadURL(res.ref).then(url=>{
                                // console.log(url)
                                afterImgsUrls.push(url)
                                counterToSend ++

                    if(counterToSend == aFiles.length){
                    let names = e.target.parentElement.querySelector('.names').value.split(',')
                    // console.log(names)

                    // make and send (add doc)
                    ///addDoc; add document to a collection; 
                    let managed ='unkown'
                    // dbUser?dbUser.type == 'team':'@'+dbUser.userName:'':null
                    if(dbUser){dbUser.type == 'team'?managed = "@"+dbUser.userName:''}

                    let newCoords = {lat: currentCoords.lat,lng: currentCoords.lng}

                    addDoc(collection(bygreenDb, 'temPins'), {
                    coords: newCoords,
                    beforeImgs: beforeImgUrls,
                    afterImgs:afterImgsUrls,
                    names:names,
                    managedBy:managed,
                    redToGreen: false,
                    log: [],
                    date: new Date().getFullYear()+'-'+String(new Date().getMonth() + 1).padStart(2, '0')+'-'+String(new Date().getDate()).padStart(2, '0'),
                    details: e.target.parentElement.querySelector('.moreDetails').value
                    }).then((docData)=>{
                        // console.log(docData, docData.id)

                        //loop over the names; filter the duplicated and insert to them
                        let unNames = [...new Set(names)]
                        unNames.forEach(name=>{

                            if(accountsList.filter(account =>account.userName == name)){
                                name = name.replace('@','')
                                // updateDoc(doc(bygreenDb, 'users', name), {green: arrayUnion(docData.id)}).then(()=>console.log('recorded'))
                                
                        
                    }
                })
                                    // confirm send
                        document.querySelector('#sendingDataMessage').textContent = 'sent'
                        setTimeout(() => {
                            document.querySelector('#sendingDataMessage').style.display = 'none'
                        }, 1000);



                // document.querySelector('#insertMyUsername')?
            }) 
            }
            }) })}            
        }
    })
    })
}

            }else if(e.target.getAttribute('id')=='sendRedToGreen'){

                document.querySelector('#sendingDataMessage').style.display = 'block'
                document.querySelector('#sendingDataMessage').textContent = 'sending data...'
    
                // take the id; get the related red pin; delete red; make new
                // green; with redToGreen true, and to be inserted in the temp
                // red; to be seen by the admin to confirm it (to be in the
                // green collection) or delete it to make it red again

                // console.log('sending making green')
                // get the names and imgs 
                // loop over the imgs and inert them; then get the urls
                // then make and add the document 
                // then record the points to the intended accounts

                // no need that i already have the full object 
                // let redToGreenDoc = await getDoc(doc(bygreenDb, 'tempRed', currentId)); 
                // let redToGreen = redToGreenDoc.data()
                let redToGreen = redPins.filter(green=>green.id == currentId)[0]

                // console.log(redPins ,redToGreen, redToGreen)
                let names = e.target.parentElement.querySelector('.names').value.split(',')
                let afterImgsUrls = []
                let beforeImgsUrlsToDelete = redToGreen.beforeImgs
                
                let counterToSend = 0
                let aFiles = e.target.parentElement.querySelector('.addAImgs').files
                
                for (var i = 0; i < aFiles.length; i++) {

                    // console.log(aFiles[i]);
                    let fileRef = ref(bygreenStorage, '/after/' + new Date().toISOString().replace(/:/g, '-') +aFiles[i].name.replaceAll(" ","") )
                        
                    uploadBytes(fileRef, aFiles[i]).then(res=>{
                        getDownloadURL(res.ref).then(url=>{
                            // console.log(url)
                            afterImgsUrls.push(url)
                            counterToSend ++
                

                if(counterToSend == aFiles.length){
                // names.push(redToGreen.names[0])
                // console.log(names, redToGreen.names)

                // let beforeImgs = redToGreen.beforeImgUrls
                // make and send (add doc)
                ///addDoc; add document to a collection; 
                // let newCoords = {lat: currentCoords.lat,lng: currentCoords.lng}

                addDoc(collection(bygreenDb, 'temPins'), {
                coords: redToGreen.coords,
                beforeImgs: redToGreen.beforeImgs,
                afterImgs:afterImgsUrls,
                names: names,
                date: new Date().getFullYear()+'-'+String(new Date().getMonth() + 1).padStart(2, '0')+'-'+String(new Date().getDate()).padStart(2, '0'),
                details: e.target.parentElement.querySelector('.moreDetails').value,
                redToGreen: true
                }).then((docData)=>{
                    // console.log(docData, docData.id)

                    //loop over the names; filter the duplicated and insert to them
                    let unNames = [...new Set(names)]
                    // console.log(unNames)
                    unNames.forEach(name=>{

                        if(accountsList.filter(account =>account.userName == name)){
                            name = name.replace('@','')
                            // updateDoc(doc(bygreenDb, 'users', name), {toGreen: arrayUnion(docData.id)}).then(()=>console.log('recorded'))

                        }
            })

            // deleteDoc(doc(bygreenDb, 'red', currentId)).then(()=>console.log('doc deleted'))
            

            // confirm send
                    document.querySelector('#sendingDataMessage').textContent = 'sent'
                    setTimeout(() => {
                        document.querySelector('#sendingDataMessage').style.display = 'none'
                    }, 1000);


            // document.querySelector('#insertMyUsername')?
        }) 
        }
        }) })}


            } 
            
            // if team 
            if(e.target.getAttribute('id')=='sendYellow'){
                // date, more info
                // console.log(document.querySelector('#nextCampDate').value,document.querySelector('#nextCampInfo').value)

                document.querySelector('#sendingDataMessage').style.display = 'block'
                document.querySelector('#sendingDataMessage').textContent = 'sending data...'

                let toBeDate = {
                    year: document.querySelector('#nextCampDate').value.split('-')[0],
                    month: document.querySelector('#nextCampDate').value.split('-')[1],
                    day: document.querySelector('#nextCampDate').value.split('-')[2],
                    hour: document.querySelector('#nextCampHour').value,
                    minute: document.querySelector('#nextCampMinute').value,
                    part: document.querySelector('#part').value
                }
                // console.log(toBeDate)
                // info, going, by, date
                updateDoc(doc(bygreenDb,'pin', currentId), {'next.info': document.querySelector('#nextCampInfo').value,'next.going':[dbUser.userName], 'next.by': dbUser.userName,'next.date': toBeDate }).then(()=>{

                    updateDoc(doc(bygreenDb, 'users', dbUser.uid), {yellow: arrayUnion(currentId)})
                    // display the yellow pin link; 
                    document.querySelector('#yellowPinLink').innerHTML = `<a href='${dbUser.userName}/next'> ${dbUser.userName}/next </a>`
                    // console.log('sent')
                    document.querySelector('#sendingDataMessage').textContent = 'sent'
                    setTimeout(() => {
                        document.querySelector('#sendingDataMessage').style.display = 'none'
                    }, 1000);
                    
        })
            }

        }else{

            errorMessage.style.display = 'block'
            errorMessage.textContent= "fill the rest input"

            setTimeout(() => {
                errorMessage.style.display = 'none'
                // errorMessage.textContent= "fill the rest input"
                    
            }, 1000);
        }
    }
})

// check 
window.addEventListener('click', ()=>{
    // console.log()
})
