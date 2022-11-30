
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

let dbUser ////firestore 
let authUser ///auth 
let type 
let accountsList

const map = L.map('map').setView([33.396600, 44.356579], 9); //leaflet basic map
let apiKey = 'pk.eyJ1IjoiYWxmcmVkMjAxNiIsImEiOiJja2RoMHkyd2wwdnZjMnJ0MTJwbnVmeng5In0.E4QbAFjiWLY8k3AFhDtErA'
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
maxZoom: 18,
id: 'mapbox/streets-v11',
tileSize: 512,
zoomOffset: -1,
accessToken: apiKey,
}).addTo(map);
L.Control.geocoder().addTo(map);

// auth
// one time register 
// createUserWithEmailAndPassword(bygreenAuth, 'admin@gmail.com', 'adminadmin').then(cred=>{
//     console.log('admin created')
// })


//////signin
signinbtn.addEventListener('click', (ev)=>{
    // send 
    if(ev.target.parentElement.querySelector('.em').value.length > 0 && ev.target.parentElement.querySelector('.pw').value.length > 0){
        signInWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value ,ev.target.parentElement.querySelector(".pw").value).then().catch(err=>{
            console.log(err.message)
            document.querySelector('#errors').textContent = err.message
            document.querySelector('#errors').style.display = 'block'
            setTimeout(() => {
                document.querySelector('#errors').style.display = 'none'
            }, 10000);
        })
    }else{
        document.querySelector('#errors').textContent = 'insert data'
        document.querySelector('#errors').style.display = 'block'
        setTimeout(() => {
            document.querySelector('#errors').style.display = 'none'
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


////////the required labels
////getting icon; icon is special object not just an image; to remove
//the function instead

    let greenPin = L.icon({
        iconUrl: "./imgs/greenPin.png",
        shadowSize: [50, 64], // size of the shadow
        shadowAnchor: [4, 62], // the same for the shadow
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -30] 
    });
    let redPin = L.icon({
        iconUrl: "./imgs/redPin.png",
        shadowSize: [50, 64], // size of the shadow
        shadowAnchor: [4, 62], // the same for the shadow
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -30] 
    });
    
function makePin(typeOfPin){
            return L.icon({
                iconUrl: `./imgs/${typeOfPin}.png`,
                shadowSize: [50, 64], // size of the shadow
                shadowAnchor: [4, 62], // the same for the shadow
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [0, -30] 
            })
        }


//////////ui-js
////authstate
document.querySelector(".auth").addEventListener("click", (e)=>{
    e.target.classList.toggle('on')
    if(e.target.classList.contains('on')){
        document.querySelector(".authstate").style.display = 'block'
    }else{
        document.querySelector(".authstate").style.display = 'none'
    }
})

//footer display 
document.querySelector('#footer-di').addEventListener('click', (ev)=>{
            ev.target.classList.toggle('on')
            console.log(ev.target)
            if(ev.target.classList.contains('on')){
                document.querySelector("footer").style.display = 'block'
            }else{
            document.querySelector("footer").style.display = 'none'
        }
})

// controllers
document.querySelector('#maketeam').addEventListener("click", (ev)=>{
    ev.target.classList.toggle('on')
    if(ev.target.classList.contains("on")){
        document.querySelector('#maketeamForm').style.display = 'block'
    }else{
        document.querySelector('#maketeamForm').style.display = 'none'
    }
})
document.querySelector('#displayAddShop').addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    if(ev.target.classList.contains('on')){
        document.querySelector("#makeShop").style.display = 'block'
    }else{
        document.querySelector("#makeShop").style.display = 'none'
    }
})
document.querySelector('#addShopCoords').addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
})

// display users or teams ranking 
document.querySelector('#displayUsersRanking').addEventListener('click', (ev)=>{
    ev.target.classList = 'on'
    document.querySelector('#displayteamsRanking').classList= ''
    
    document.querySelector('#usersRanking').style.display = 'block'
    document.querySelector('#teamsRanking').style.display = 'none'
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

// specific display 
document.addEventListener('click', (ev)=>{
    console.log(ev.target)
    // pin profile; 
    if (ev.target.classList.contains('leaflet-marker-icon') || ev.target.classList.contains('displayLog')){
        document.querySelector("#profile").style.zIndex = "1100"

        document.querySelector("#profile").style.display = 'block'
        document.querySelector("#profile").style.pointerEvents = "all"
    }else{
        document.querySelector("#profile").style.zIndex = "1"

        document.querySelector("#profile").style.display = 'none'
        document.querySelector("#profile").style.pointerEvents = "none"

    }

// suggested names div
    if(ev.target.classList.contains('names') || ev.target.classList.contains('suggestedAccounts') || ev.target.classList.contains('suggestedAccount')){
        console.log('to display suggested')
        // display the box
        ev.target.parentElement.querySelector('.suggestedAccounts').style.display = 'block'
    }else{
        // hide the ?? box
        document.querySelectorAll('.suggestedAccounts').forEach(e=>e.style.display = 'none')
    }
})






//////ui-js-data
// routes; deploying functions
    let routesObjects = []
    let hoveredRoute
    let hoveredPoint1
    let hoveredPoint2
//////button that shows the lines 
document.querySelector("#displaylines").addEventListener("click", (e)=>{
    console.log(e.target.classList)

    e.target.classList.toggle("add")
    if(e.target.classList.contains("add")){
        e.target.textContent = "اخفاء المسارات"
        e.target.style.background = "#ff2a2a"
        displayLines(routes)
        // e.target.parentElement.append(suggetstMakeLinesBtn)
        document.querySelector(".suggest").style.display = "block"
    }else{
        hideLines(routesObjects)
        e.target.textContent = "النقل العام"
        e.target.style.background = "#27f060"

        // e.target.parentElement.lastElementChild.remove()
        document.querySelector(".suggest").style.display = "none"

    }
})
document.querySelector('#displayPins').addEventListener("click", (ev)=>{
    ev.target.classList.toggle("on")
    if(ev.target.classList.contains("on")){
        // display con pin
        console.log("to display pins")
        insertPins(redPins, 'red', true)
        insertPins(greenPins, 'green', true)
    }else{
        // hide con pin
        hidePins(conPinsList)
    }
})




// account searching, suggested accounts 
document.querySelectorAll('.names').forEach(search=>{
    search.addEventListener('keyup', ev=>{
        let basicRes = ev.target.value.split(',')
        

        if (basicRes[basicRes.length-1][0] == '@'){
            console.log('key is @')

            let nameToFilter = basicRes[basicRes.length-1].slice(1)
            // get the value in split , 
            console.log(basicRes)
            let result = accountsList.filter(account=>{
                return nameToFilter == account.userName.slice(0, basicRes[basicRes.length-1].length-1)
            })

                let resultElements = `${result.map(res=>`
                <span class="account suggestedAccount">
                <h6> ${res.type}</h6>
                    <h4 class="userName"> @${res.userName}  </h4>
                    <img class="accountImg" style="background-image: url('${res.img}');">
                </span>
                `)}`
                

            console.log(result, accountsList, ev.target.value)
            ev.target.parentElement.querySelector('.suggestedAccounts').innerHTML = resultElements.replaceAll(',','')

            document.querySelectorAll('.suggestedAccount').forEach(sugAcc=>{
                sugAcc.addEventListener('click', ev=>{
                    console.log(basicRes,'fire account auto', ev.target.querySelector('.userName').textContent)

                    basicRes[basicRes.length-1] = ev.target.querySelector('.userName').textContent
                    
                    ev.target.parentElement.parentElement.querySelector('input').value = basicRes.toString()
                    ev.target.parentElement.parentElement.querySelector('input').focus()
                })
            })

        }

    })
})

/////////public line; stuff 
function displayLines (pd){

    // make route object, link the doc data, addeventlistener (click and hover)
    console.log("get routes; ", pd)

    // new method; 
    Object.values(pd).forEach(e=>{
        let routeObject = L.polyline(e.path).bindPopup(e.name).addTo(map)

        e.point1?hoveredPoint1= L.circle(e.path[0],{radius: 300}).addTo(map):null
        e.point2?hoveredPoint2 = L.circle(e.path[e.path.length-1],{radius: 300}).addTo(map):null 
        
        routeObject.id = e.id
        routeObject.point1 = e.point1
        routeObject.point2 = e.point2
        routesObjects.push(routeObject)
        hoveredPoint1?routesObjects.push(hoveredPoint1):null
        hoveredPoint2?routesObjects.push(hoveredPoint2):null
    

        routeObject.addEventListener('mouseover',(route)=>{

            // new method
            routesObjects.forEach(e=>{e.setStyle({color: "#3388FF", opacity: .6})})

            hoveredRoute?map.removeLayer(hoveredRoute):null
            hoveredPoint1?map.removeLayer(hoveredPoint1):null
            hoveredPoint2?map.removeLayer(hoveredPoint2):null


            // required????
            hoveredRoute = L.polyline(route.target._latlngs, {color:"#28a84c", opacity: 1,interactive: false}).addTo(map)
            route.target.point1?hoveredPoint1 = L.circle(route.target._latlngs[0],{radius:300 ,color:"#28a84c", opacity: 1,interactive: false}).addTo(map):null

            route.target.point2?hoveredPoint2 = L.circle(route.target._latlngs[route.target._latlngs.length-1], {radius:300, color:"#28a84c", opacity: 1,interactive: false}).addTo(map):null

        })
    })
}
function hideLines(pd){
    pd.forEach(e=>{
        map.removeLayer(e)
    })
    hoveredRoute?map.removeLayer(hoveredRoute):null
    hoveredPoint1?map.removeLayer(hoveredPoint1):null
    hoveredPoint2?map.removeLayer(hoveredPoint2):null
}

function hidePins(pinsObjects){
    console.log(pinsObjects)
    pinsObjects.forEach(pinObject=>{
        map.removeLayer(pinObject)
    })
}


// ranking; insert accounts to leader board; 
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
    <div class="account">
        <img class="accountImg" style="background-image: url('${account.img}');">
        <h3 class="accountUsername ranked">${account.userName}</h3>
    </div>

    <h3 class="red">${account.red[0]?account.red.length:0}</h3>
    <h3 class="green">${account.green[0]?account.green.length:0}</h3>
    <h3 class="makingGreen">not yet</h3>
    <h3 class="makingGreen">${(account.red[0]?account.red.length:0)+(account.green[0]?account.green.length:0)}</h3>
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
    <h3 class="makingGreen">${(account.red[0]?account.red.length:0)+(account.green[0]?account.green.length:0)}</h3>
</div>
    `}
        })}`

    console.log('intended order',intendedOrder)
    document.querySelector('#usersRanking').innerHTML = orderedUserElements.replaceAll(',', '')
    document.querySelector('#teamsRanking').innerHTML = orderedteamElements.replaceAll(',', '')
}
// on click to call and on load to call with default; total, de
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



// restructure functions
let redPinsObjects = []
let greenPinsObjects = []
let conPinsList = []
let pinsList = []
let prevMarker 

function insertPins (dataList, type, confirmed){

    //new method; check if red or green then sub check if next or premade 
    dataList.forEach(pin=>{
        console.log(pin)
        let icon 
        let names = document.createElement('div')

    if(type == 'red'){

                // names 
                let name
                pin.next?name = accountsList.filter(account =>account.userName == pin.next.by)[0]:name = accountsList.filter(account =>'@'+ account.userName == pin.names[0])[0]

                if(name){
                console.log(name)
                    
                    // if account 
                    let span = document.createElement('div')
                    span.classList.add("account", 'contr')
                    let h3 = document.createElement('h3')
                    h3.classList.add("userName")
                    h3.textContent = '@' + name.userName
                    let img = document.createElement('img')
                    img.classList.add('accountImg')
                    img.style.backgroundImage = `url('${name.img}')`
                    span.append(h3, img)
                    names.append(span)
                    // names = document.createElement('div')
                    console.log(names)

                }else{
                    // no account 
                    names = document.createElement('h3')
                    names.classList.add('contrName')
                    names.textContent=pin.names
                }

                icon = makePin('redPin')


                // should be exist only for confirmed 
                if(pin.next){

                    // names.textContent = pin.next.by

                        // settting time objects; 
                        // let intendedDate = {}
                        let intendedDate = {
                            year: pin.next.date.year,
                            month: pin.next.date.month,
                            day: pin.next.date.day,
                            hour: pin.next.date.hour, 
                            minute: pin.next.date.minute,
                            part: pin.next.date.part
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
                        console.log(intendedDate, currentDate, remainedDate)
                        // find the team account and make the object; remove the normal user ???
                        // inser the info 
                        let managedBy = document.createElement('div')


                        let coming = document.createElement('span')
                        coming.classList.add('comingCounter')
                        coming.textContent = pin.next.going.length
                        let comingBtn = document.createElement('button')
                        comingBtn.classList.add('coming', 'box', 'bycreate')
                        comingBtn.textContent = 'coming'
        
                        let div = document.createElement('div')
                        let newNames = document.createElement('div')
                        newNames.innerHTML = names
        
                        let intendedId = pin.id
        
                        comingBtn.addEventListener('click', (ev)=>{
                            ev.target.classList.toggle('on')
                            if(ev.target.classList.contains('on')){
                                ev.target.parentElement.querySelector('.comingCounter').textContent ++
                                updateDoc(doc(bygreenDb, 'tempRed', pin.id),{"next.going":arrayUnion(dbUser.userName)}).then(()=>console.log('sent'))
                            }else{
                                ev.target.parentElement.querySelector('.comingCounter').textContent --
                                updateDoc(doc(bygreenDb, 'tempRed', red.id),{"next.going":arrayRemove(dbUser.userName)}).then(()=>console.log('sent'))
        
                            }
                        })
        
                        let detials = `
                        <div class='timer'>
                        <p>${pin.next.info}</p>
                        <b>
                <p>${pin.next.date.month}m/${pin.next.date.day}d-${pin.next.date.hour}h:${pin.next.date.minute}min, ${pin.next.date.part} </p>
                <div style='color:red;'>الباقي:</div>
                <p style='color:red'> ${remainedDate.month}m/${remainedDate.day}d-${remainedDate.hour}h:${remainedDate.minute}min </b> </p>
                        </div>
                        `

                        let campDetials = document.createElement('div')
                        campDetials.innerHTML = detials
                        
                        names.append(comingBtn, coming,campDetials)

                        icon = makePin('yellowPin')
                        // icon = makePin(`${pin.next.by}yellowpin`)

                }
        
    }else if(type == 'green'){

        let contrTitle = document.createElement('b')
        contrTitle.textContent = 'المساهمين'
        let theteam = accountsList.filter(account=>'@'+ account.userName == pin.managedBy )
        if(theteam[0]){
            let teamElement = document.createElement('div')
            teamElement.classList.add('account', 'contr', 'teamContr')
            teamElement.innerHTML = `
            <h3 class="userName"> ${theteam[0].userName} </h3>
            <img class="accountImg" style="background-image:url('${theteam[0].img}');">
`
            theteam = teamElement
        }
        let contrNames = pin.names.map(name=>{
            let filtered = accountsList.filter(account=>'@'+account.userName == name)
            return `
            <span class='account contr'>
                <h3 class='userName'>${name}</h3>
                ${filtered[0]?`
                <img class="accountImg" style="background-image: url('${filtered[0].img}');">
                `:``}
            </span>
            `
        }).join('').toString()
        let contrs = document.createElement('div')
        contrs.innerHTML = contrNames

        icon = makePin('greenPin')
        if(!confirmed){


        icon = makePin('GreenPin')
        }

        names.append(contrTitle, theteam, contrs)


    }else if (type == 'redToGreen'){
        icon = makePin('redToGreenPin')
    }

    if(!confirmed){

        let confBtn = document.createElement('button')
        confBtn.classList.add('confirmBtn')
        confBtn.textContent = 'confirm'
        let delBtn = document.createElement('button')
        delBtn.classList.add('deleteBtn')
        delBtn.textContent = 'delete'
        let confirming = document.createElement('div')
        confirming.classList.add("confirming")
        confirming.append(confBtn, delBtn)
        names.append(confirming)

        
        confBtn.addEventListener('click', (ev)=>{
            //add to red delete from tempRed
            if(pin.redToGreen == 'false'){
                // add to green and update the redtogreen true
                pin.redToGreen=true
                addDoc(collection(bygreenDb, 'green'), pin).then(()=>{
                    console.log('added')
                    deleteDoc(doc(bygreenDb, (type == 'green'?'tempGreen':'tempRed'), pin.id)).then(()=>console.log('deleted'))
                })
                    return
            }

            addDoc(collection(bygreenDb, (type == 'green'?'green':'red')), pin).then(()=>{
                console.log('added')
                deleteDoc(doc(bygreenDb, (type == 'green'?'tempGreen':'tempRed'), pin.id)).then(()=>console.log('deleted'))
            })

            // delete from ui; 
            map.removeLayer(pinsList.filter(pin =>pin.id == currentId)[0])
        })

        delBtn.addEventListener('click', (ev)=>{
            //add to red delete from tempRed
            if(type == 'red'){
                deleteDoc(doc(bygreenDb, 'tempRed', pin.id)).then(()=>console.log('deleted'))

            }else if(type == 'green'){
                if(pin.redToGreen){
                    // edit it then add it to red (remove the green part)
                    let newCoords = {
                        lat: pin.coords.lat, 
                        lng: pin.coords.lng
                    }
                    console.log(pin)
                    addDoc(collection(bygreenDb, 'red'), {coords:newCoords, beforeImgs: pin.beforeImgs, names: [pin.names[0]], details: pin.details})
                    deleteDoc(doc(bygreenDb, 'tempGreen', pin.id)).then(()=>console.log('deleted'))

                }
                deleteDoc(doc(bygreenDb, 'tempGreen', pin.id)).then(()=>console.log('deleted'))
            }
                // deleteDoc(doc(bygreenDb, (type == 'green'?'tempGreen':'tempRed'), pin.id)).then(()=>console.log('deleted'))

            map.removeLayer(pinsList.filter(pin =>pin.id == currentId)[0])
        })


        type == 'green'?icon = makePin('tempGreenPin'):icon = makePin('tempRedPin')
        pin.redToGreen?icon = makePin('orangePin'):null
        }





                // pin
                // eventlistener 
                console.log(names)
                let pinObj = L.marker(pin.coords, {icon: icon}).bindPopup(names).addTo(map)


                let logImgs
                if(pin.log){
                    let logImgs = pin.log.map(logImg=>{
                        return `                    
                        <span class="loggedCamp">
                            <p>${logImg.date}</p>
                            <img src="${logImg.img}" alt="">
                        </span>`
                    }).join('').toString()
                    console.log(logImgs)
                    logImgs.replaceAll(',', '')
                }
                
                let afterImgsElements
                if(pin.afterImgs){
                    afterImgsElements = pin.afterImgs.map(img=>{
                        return `<img style='background-image:url("${img}")'>`
                    }).join('').toString()
                }
                    let beforeImgsElements = pin.beforeImgs.map(img=>{
                        return `<img style='background-image:url("${img}")'>`
                    }).join('').toString()
        
                    pinObj.id = pin.id
                    pinObj.beforeImgs = beforeImgsElements
                    pinObj.afterImgs = afterImgsElements
                    pinObj.details = pin.details
                    pinObj.date = pin.date
                    pinObj.logImgs = logImgs

                if(pin.next){
                        // change icon 
                        // pinObj.setIcon(L.icon({
                        //     iconUrl: `./imgs/${pin.next.by}yellowpin.png`,
                        //     shadowSize: [50, 64], // size of the shadow
                        //     shadowAnchor: [4, 62], // the same for the shadow
                        //     iconSize: [25, 41],
                        //     iconAnchor: [12, 41],
                        //     popupAnchor: [0, -30] 
                        // }))
                }

                pinObj.addEventListener('click', (ev)=>{
                    console.log(ev.target)
                        console.log(ev.target)
                        document.querySelector('#beforeImgs').innerHTML = ev.target.beforeImgs
                        document.querySelector('#afterImgs').innerHTML = ev.target.afterImgs
                
                        document.querySelector('#details').textContent = ev.target.details
                        document.querySelector('#date').textContent = ev.target.date
        
                        document.querySelector('#loggedContent').innerHTML = ev.target.logImgs
        
                        // document.querySelector('#sendLog').removeAttribute("disabled")
                        prevMarker?map.removeLayer(prevMarker):null
                        prevMarker = L.circle(ev.target._latlng, {radius: 800}).addTo(map)
        
                        currentId = ev.target.id
                })

                confirmed?conPinsList.push(pinObj):pinsList.push(pinObj)
                // pinsList.push(pinObj)
    })
}

// function insertPins (dataList, type, confirmed){

//     //new method; check if red or green then sub check if next or premade 
//     if(type == 'red'){
        
//         // loop over them; 
//         dataList.forEach(red=>{
//             // do shared stuff; 
//             // coords, imgs, names; make pin and link data with to be inserted onclick
//             let names
//             // edit; get one name; no need for loop and list 

//             if(red.next){
//                 names = accountsList.filter(account =>account.userName == red.next.by)

//                 console.log(red.next.by,names)
//                 names = `
//                 <a href=' http://${window.location.host+'/'+ red.next.by}/next '> <b style='color: blue;'> link </b> </a>
//                 <a href='http://${window.location.host+'/profile/'+ red.next.by}'>
//                 <span class="account contr teamContr">
//                     <h4 class="userName"> ${names[0].userName}</h4>
//                     <img class="accountImg" style="background-image: url('${names[0].img}');"></img>
//                 </span>
//                 </a>
//                 `

//             }else{
//                 let filtered = accountsList.filter(account=>'@'+account.userName == red.names)
            
//                 if(filtered[0]){
//                     console.log(filtered[0])
//                     names =  `
//                     <a href='http://${window.location.host+'/profile/'+ filtered[0].userName}'>
//                 <span class="account contr">
//                     <h4 class="userName">@${filtered[0].userName}</h4>
//                     ${filtered[0]?`<img class="accountImg" style="background-image: url('${filtered[0].img}');"></img>`:null}
                    
//                 </span>
//                 </a>
//                 `
                    
//                 }else{
//                     names = `<h4 class="contrName">${red.names[0]}</h4>`
//                 }
//             }

//     let pin = L.marker(red.coords, {
//         icon:redPin,
//         popupAnchor: [-10, -30]
//     }).bindPopup(`<div>${names}</div>`).addTo(map)
//     pin.id = red.id


//     // make the dom elements;

//     // new method
//     let beforeImgsElements = []
//     red.beforeImgs.forEach(img=>{
//         let imgEle = document.createElement('img')
//         imgEle.style.backgroundImage = `url('${img}')`
//         beforeImgsElements.push(imgEle)
//     })


//     // old method
//     // let beforeImgsElements = red.beforeImgs.map(img=>{
//     //     return `<img style='background-image:url("${img}")'>`
//     // })
//     // pin.beforeImgs = beforeImgsElements.join('').toString()

//     pin.addEventListener('click', (ev)=>{



//         // new method
//         document.querySelector('#beforeandafter').innerHTML = ``
//         let beforeImgsDiv = document.createElement('div')
//         beforeImgsDiv.setAttribute('id', 'beforeImgs')
        

//         let afterImgsDiv = document.createElement('div')
//         afterImgsDiv.setAttribute('id', 'afterImgs')
//         beforeImgsElements.forEach(imgDiv=>{
//             beforeImgsDiv.append(imgDiv)
//         })
//         document.querySelector('#beforeandafter').append(beforeImgsDiv, afterImgsDiv)
        
//         // old method
//         // document.querySelector('#beforeandafter').innerHTML = `
//         //     <div id="afterImgs">
//         //     </div>
//         //     <div id="beforeImgs">
//         //         ${ev.target.beforeImgs}
//         //     </div>
//         // `
//         // document.querySelector('#beforeImgs').innerHTML = ev.target.beforeImgs
//         // document.querySelector('#afterImgs').innerHTML = ''

//         document.querySelector('#details').textContent = ''
//         document.querySelector('#date').textContent = ''

//         console.log(ev.target)

//         //method; circle; 
//         prevMarker?map.removeLayer(prevMarker):null
//         prevMarker = L.circle(ev.target._latlng, {radius: 800 ,color: (red.next?'yellow':'red')}).addTo(map)
//         currentId = ev.target.id

//         //method; set property object to pin object; selected, normal


//         if(currentId){
//             document.querySelector('#sendRedToGreen').removeAttribute('disabled')
//             document.querySelector('#sendYellow').removeAttribute('disabled')
            
//         }else{
//             document.querySelector('#sendRedToGreen').setAttribute('disabled', true)
//             document.querySelector('#sendYellow').setAttribute('disabled', true)
//         }
//     })


//             // check if next 
//             if(red.next){

//                 // change icon 
//                 pin.setIcon(L.icon({
//                     iconUrl: `./imgs/${red.next.by}yellowpin.png`,
//                     shadowSize: [50, 64], // size of the shadow
//                     shadowAnchor: [4, 62], // the same for the shadow
//                     iconSize: [25, 41],
//                     iconAnchor: [12, 41],
//                     popupAnchor: [0, -30] 
//                 }))

//                 pin.addEventListener('click', ()=>{
//                 // change icon 

//                 })


//                 // settting time objects; 
//                 // let intendedDate = {}
//                 let intendedDate = {
//                     year: red.next.date.year,
//                     month: red.next.date.month,
//                     day: red.next.date.day,
//                     hour: red.next.date.hour, 
//                     minute: red.next.date.minute,
//                     part: red.next.date.part
//                 }

//                 var today = new Date();
//                 var dd = + String(today.getDate()).padStart(2, '0');
//                 var mm = + String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//                 var yyyy = today.getFullYear();

//                 let currentDate ={
//                     year: yyyy,
//                     month: mm,
//                     day: dd,
//                     hour: today.getHours(),
//                     minute: today.getMinutes()
//                 }

//                 intendedDate.part == 'pm'?intendedDate.hour = + intendedDate.hour + 12:null


//                 let remainedDay
//                 if(intendedDate.day >  currentDate.day ){
//                     remainedDay = intendedDate.day - currentDate.day
//                 }else{
//                     remainedDay = ( + intendedDate.day + 30) - currentDate.day
//                     intendedDate.month = intendedDate.month - 1
                    
//                 }

//                 let reaminedHour 
//                 if(intendedDate.hour > currentDate.hour){
//                     reaminedHour = intendedDate.hour - currentDate.hour
//                 }else{
//                     reaminedHour = ( + intendedDate.hour + 24) - currentDate.hour
//                     // intendedDate.day = intendedDate.day - 1
//                     remainedDay = remainedDay -1
//                 }

//                 let remainedMinute
//                 if(intendedDate.minute > currentDate.minute ){
//                     remainedMinute = intendedDate.minute - currentDate.minute
//                 }else{
//                     remainedMinute = (+ intendedDate.minute + 60) - currentDate.minute
//                     // intendedDate.hour = intendedDate.hour - 1
//                     reaminedHour = reaminedHour -1
//                 }





//                 let remainedDate = {
//                     year: intendedDate.year - currentDate.year,
//                     month: intendedDate.month - currentDate.month,
//                     day: reaminedHour == 24?remainedDay+1:remainedDay,
//                     hour: reaminedHour == 24?0:reaminedHour,
//                     minute:remainedMinute
//                 }
//                 // how to find the remained minutes to the intended time ???
//                 console.log(intendedDate, currentDate, remainedDate)
//                 // find the team account and make the object; remove the normal user ???
//                 // inser the info 
//                 let coming = document.createElement('span')
//                 coming.classList.add('comingCounter')
//                 coming.textContent = red.next.going.length
//                 // coming.innerHTML = `<span class='comingCounter'>0</span>`
//                 // let coming = `<span class='comingCounter'>0</span>`
//                 let comingBtn = document.createElement('button')
//                 dbUser?comingBtn.setAttribute('disabled', true):removeAttribute('disabled')
//                 comingBtn.classList.add('coming', 'box', 'bycreate')
//                 comingBtn.textContent = 'coming'
//                 if(red.next.going.includes(dbUser.userName)){
//                     comingBtn.classList.toggle('on')
//                 }
//                 // comingBtn.setAttribute('disabled', true)

//                 let div = document.createElement('div')
//                 let newNames = document.createElement('div')
//                 newNames.innerHTML = names

//                 let intendedId = red.id

//                 comingBtn.addEventListener('click', (ev)=>{
//                     ev.target.classList.toggle('on')
//                     if(ev.target.classList.contains('on')){
//                         ev.target.parentElement.querySelector('.comingCounter').textContent ++
//                         updateDoc(doc(bygreenDb, 'tempRed', red.id),{"next.going":arrayUnion(dbUser.userName)}).then(()=>console.log('sent'))
//                     }else{
//                         ev.target.parentElement.querySelector('.comingCounter').textContent --
//                         updateDoc(doc(bygreenDb, 'tempRed', red.id),{"next.going":arrayRemove(dbUser.userName)}).then(()=>console.log('sent'))

//                     }
//                 })

//                 let campDetials = document.createElement('div')
//                 let detials = `
//                 <div class='timer'>
//                 <p>${red.next.info}</p>
//                 <b>
//         <p>${red.next.date.month}m-${red.next.date.day}d-${red.next.date.hour}h:${red.next.date.minute}min, ${red.next.date.part} </p>
//         <div style='color:red;'>الوقت المتبقي:</div>
//         <p style='color:red'> ${remainedDate.month}m.${remainedDate.day}d.${remainedDate.hour}h.${remainedDate.minute}min </b> </p>
//                 </div>
//                 `

//                 campDetials.innerHTML = detials
//                 div.append(newNames,comingBtn, coming,campDetials)
//                 pin.bindPopup(div)
//             }else{
//                 // normal pin
//             }
//         })
//     }else if(type == 'green'){
//         //loop over list; 
//         // make pin content; names, before and after imgs,
//         // make pin function; onlick

//         dataList.forEach(green=>{
//             // general (both; normal and to green)


//             // by; team and names
//             let theteam = accountsList.filter(account=>'@'+ account.userName == green.managedBy )
//             green.names = green.names.map(name=>name.trim())
//             console.log(green.names)
//             let names= green.names.map(ee=>{
//                 console.log(ee, accountsList)
//                 // accountsList.forEach(account=>console.log('@'+account.userName,
//                 // ee.trim(), '@'+ account.userName === ee.trim()))
                
//                 let filtered = accountsList.filter(account=>('@'+ account.userName) == ee)
//                 console.log(filtered)
//                 if(filtered[0]){
//                     console.log(filtered[0])
//                     return `
//                     <a href='http://${window.location.host+'/profile/'+ filtered[0].userName}'>
//                 <span class="account contr">
//                     <h4 class="userName">${ee}</h4>
//                     ${filtered?`<img class="accountImg" style="background-image: url('${filtered[0].img}');"></img>`:null}
//                 </span>
//                 </a>
//                 `
                    
//                 }else{
//                     return `<h4 class="contrName">${ee}</h4>`
//                 }
//         }).join('').toString()


//         let by = `
//         <b>المساهمين ❤</b>

//         <div class=''> ${theteam[0]? `<div class="account contr teamContr">
//             <h3 class="userName"> ${theteam[0].userName} </h3>
//         <img class="accountImg" style="background-image:url('${theteam[0].img}');">
//         </div> <br>`:''}${names}</div>`
//         let logImgs

//         console.log(green.log)
//         if(green.log[0]){
//             logImgs = green.log.map(logImg=>{
//                 return `                    
//                 <span class="loggedCamp">
//                     <p>${logImg.date}</p>
//                     <img src="${logImg.img}" alt="">
//                 </span>`
//             }).join('').toString()
//             console.log(logImgs)
//             // logImgs.replaceAll(',', '')
//         }

//             let pin = L.marker(green.coords, {
//                 icon: greenPin,
//                 popupAnchor: [-10, -30]
//             }).bindPopup(`<div>${by}</div>`).addTo(map)
//             // make the dom elements;
//             let beforeImgsElements = green.beforeImgs.map(img=>{
//                 return `<img style='background-image:url("${img}")'>`
//             }).join('').toString()
//             let afterImgsElements = green.afterImgs.map(img=>{
//                 return `<img style='background-image:url("${img}")'>`
//             }).join('').toString()

//             pin.id = green.id
//             pin.beforeImgs = beforeImgsElements
//             pin.afterImgs = afterImgsElements
//             pin.details = green.details
//             pin.date = green.date
//             logImgs?pin.logImgs = logImgs:null

//             if(theteam[0]){
//                 pin.setIcon(L.icon({
//                     iconUrl: `./imgs/${green.managedBy.slice(1)}greenpin.png`,
//                     shadowSize: [50, 64], // size of the shadow
//                     shadowAnchor: [4, 62], // the same for the shadow
//                     iconSize: [25, 41],
//                     iconAnchor: [12, 41],
//                     popupAnchor: [0, -30] 
//                 }))
//             }


//             pin.addEventListener('click', (ev)=>{
//                 console.log(ev.target)

//                 document.querySelector('#beforeandafter').innerHTML = `
//                 <div id="beforeImgs">
//                     ${ev.target.beforeImgs}
//                 </div>
//                 <div id="afterImgs">
//                     ${ev.target.afterImgs}
//                 </div>
//             `
    
    

//                 // document.querySelector('#beforeImgs').innerHTML = ev.target.beforeImgs
//                 // document.querySelector('#afterImgs').innerHTML = ev.target.afterImgs
        
//                 document.querySelector('#details').textContent = ev.target.details
//                 document.querySelector('#date').textContent = ev.target.date

//                 document.querySelector('#loggedContent').innerHTML = ev.target.logImgs

//                 document.querySelector('#sendLog').removeAttribute("disabled")
//                 prevMarker?map.removeLayer(prevMarker):null
//                 prevMarker = L.circle(ev.target._latlng, {radius: 800 ,color: 'green'}).addTo(map)

//                 currentId = ev.target.id
//             })



//             if(green.redToGreen){
//                 // check the team; 
//                 // change icon 
//             }

//         })
//     }
// }

// get data 
// containers 
let currentId

let routes
let shops
let redPins
let greenPins

let tempRedPins
let tempGreenPins

window.onload = async ()=>{

    // may change onload to be here
await onAuthStateChanged(bygreenAuth, async (user)=>{
    console.log('authstatefun', dbUser)
    if(user){
        // registered
        console.log('from auth ', user)
        authUser = user
        user.getIdTokenResult().then(idTokenResult => {
            console.log('claims', idTokenResult.claims)
            type = idTokenResult.claims   ////no need ??
            // if admin
            if (idTokenResult.claims.admin){
                document.querySelectorAll('.adminEle').style.display = 'block'
            }
        })

        document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'none')
        document.querySelectorAll('.logged').forEach(e=>e.style.display = 'block')
    }else{
        /////not registered
        document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'block')
        document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
        dbUser = 'none'
    }

    //ranking 
        // if(accountsList){
        //     // console.log(accountsList, dbUser)
        //     ranking('total', 'de')
        // }
})

// basic to get 

    getDocs(collection(bygreenDb, 'routes')).then((data)=>{
        let docs = []
            data.docs.forEach(doc=>{
                docs.push({...doc.data(), id: doc.id})
            })
            routes = docs

            console.log('routes; ', routes)
        setTimeout(() => {
            document.querySelector("#displaylines").removeAttribute("disabled")
            document.querySelector('#displaylines').classList.toggle('add')
            document.querySelector('#displaylines').textContent = "اخفاء المسارات"
            document.querySelector('#displaylines').style.background = "#ff2a2a"
            displayLines(routes)
            document.querySelector(".suggest").style.display = "block"
        }, 1500);
        })

    getDocs(collection(bygreenDb, 'shop')).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                shops = docs
                console.log(docs)

                document.querySelector('#sendingDataMessage').style.display = 'none'
                document.querySelector('#displayShops').removeAttribute('disabled')
    })


    getDocs(collection(bygreenDb, 'users')).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                accountsList = docs
                console.log('accounts list; ', accountsList)

                // deploy data; 
                document.querySelector('#accountsCounter').textContent = accountsList.length
                dbUser?ranking('total', 'de'):null
        })

        // to fire it on auth get or to fire all when auth get; 
    getDocs(collection(bygreenDb, 'red')).then((data)=>{
        let docs = []
            data.docs.forEach(doc=>{
                docs.push({...doc.data(), id: doc.id})
            })
            redPins = docs
            console.log('red pins; ', redPins)
            // insertPins(redPins, 'red')

            document.querySelector('#redCounter').textContent = redPins.length
            document.querySelector('#contriCounter').textContent += redPins.length
        })

    getDocs(collection(bygreenDb, 'green')).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                greenPins = docs
                console.log('green pins; ', greenPins)

                // insertPins(greenPins, 'green')
                document.querySelector('#greenCounter').textContent = greenPins.length

                let contriCounter = 0
                greenPins.forEach(greenPin =>contriCounter += greenPin.names.length)
                document.querySelector('#contriCounter').textContent += contriCounter

        })

        // get temp red
    getDocs(collection(bygreenDb, 'tempRed')).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                tempRedPins = docs
                console.log('temp red pins; ', tempRedPins)
                document.querySelector('#tempRedCounter').textContent = tempRedPins.length

                insertPins(tempRedPins, 'red', false)
        })

        // get temp green 
    getDocs(collection(bygreenDb, 'tempGreen')).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
            tempGreenPins = docs
            console.log('temp green pins; ', tempGreenPins)

            document.querySelector('#tempGreenCounter').textContent = tempGreenPins.length

            insertPins(tempGreenPins, 'green', false)

                document.querySelector("#displayPins").removeAttribute('disabled')
                document.querySelector('#sendingDataMessage').style.display = 'none'
    })
}




/////////sending; 
/////prepare; collecting data; complex data recieving
let currentCoords
let addedPin


map.addEventListener('click', function (ev) {
    addedPin?map.removeLayer(addedPin):null

    if(document.querySelector('#addShopCoords').classList.contains("on")){
        let latlng = map.mouseEventToLatLng(ev.originalEvent);

        console.log(latlng)
        addedPin = L.marker(latlng).addTo(map);
        // m = addedPin
        currentCoords = latlng
    }
});

document.querySelector('#sendShop').addEventListener('click', (ev)=>{
    console.log('sending shop')
    document.querySelector('#sendingDataMessage').style.display = 'block'
    document.querySelector('#sendingDataMessage').textContent = 'sending data...'

    let shopInfo = document.querySelector('#shopInfo').value
    let files = document.querySelector('#addShopImgs').files
    let imgUrls = []
    let counterToSend = 0


for (var i = 0; i < files.length; i++) {

    console.log(files[i]);
    let fileRef = ref(bygreenStorage, '/shop/' + new Date().toISOString().replace(/:/g, '-') +files[i].name.replaceAll(" ","") )

    uploadBytes(fileRef, files[i]).then(res=>{
        getDownloadURL(res.ref).then(url=>{
            console.log(url)
            imgUrls.push(url)
            counterToSend ++

            console.log(counterToSend,files.length )

        if(counterToSend == files.length){
            // make and send (add doc)
            ///addDoc; add document to a collection; 
            let newCoords = {lat: currentCoords.lat,lng: currentCoords.lng}

            addDoc(collection(bygreenDb, 'shop'), {
            coords: newCoords,
            info: shopInfo,
            imgs: imgUrls,
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

})
document.querySelector('#sendteam').addEventListener('click', ()=>{
    
    console.log(document.querySelector('#teamUserName').value)
    console.log(accountsList.filter(account=>'@'+account.userName == document.querySelector('#teamUserName').value.trim()))
    // to send the username or the id ???
    fetch("/maketeam", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({userName: document.querySelector('#teamUserName').value,
        id: accountsList.filter(account=>'@'+account.userName == document.querySelector('#teamUserName').value.trim())[0].id
    })
    }).then(res => {
        console.log("Request complete! response:", res);
    })
})

window.addEventListener('click', ()=>{
    console.log()
})


