///////////////////////////////////////////////////////////////////////
////setting up 

const map = L.map('map').setView([33.396600, 44.356579], 9); //leaflet basic map

        ////////the required labels
        let uncon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });

        ////getting icon; icon is special object not just an image
        let conFinished = L.icon({
            iconUrl: "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-green.png?raw=true",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30] 

        });
        let conUnfinished = L.icon({
            iconUrl: "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-red.png?raw=true",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30] 

        });

        let nextCampPin = L.icon({
            iconUrl: "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-yellow.png?raw=true",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30] 
        });





/////data containers and main elements 

let currentCoords
let currentId
let message = document.querySelector("#message")
let m
let currentM
let currentMm
let currentPin


let pathObjects = []
let pathList 

let control

/////getting data; fetch confirmed; finished, unifinished 
////display data; red and green labels and imgs; based on the ????

// map.scrollWheelZoom.disable();


window.onload = async ()=>{

    //////get api key 
    let rApiKey = await fetch("/map-api-key")
    let apiKey = await rApiKey.json()
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: apiKey.apiKey
}).addTo(map);

control = L.Control.geocoder().addTo(map);

    //////get con-finished; use green pin, before imgs, after imgs 

    let confi= await fetch("/con-finished")
    let pconfi= await confi.json()
    console.log(pconfi)
    pconfi[0]?insertLocs(pconfi, conFinished, true):null

    /////get con-unfinished; use red pin, current imgs

    let conun= await fetch("/con-unfinished")
    let pconun = await conun.json()
    console.log(pconun)
    pconun[0]?insertLocs(pconun, conUnfinished, false ):null

    /////get con-unfinished; use red pin, current imgs

    ////get the routes 
        ///fetching data; 
        let d = await fetch("/confirmed")
        pathList = await d.json()
        document.querySelector("#displaylines").removeAttribute("disabled")
        console.log(pathList)
}

function displayLines (pd){
    console.log("get routes; ", pd)
    
    Object.values(pd).forEach(e=>console.log(e.path))

    ///deploy them; store
    Object.values(pd).forEach(e => {

        let obje 

        if(typeof e.path[0]!="number"){

            console.log(e.path)
            obje = L.polyline(e.path, {
                // color: "red",
            }).addTo(map)
            // oldObjects.push(pathId) //dont need old objects
            // pathob.addEventListener("click", (e) => console.log(e.target))
        } else { ////labels part 
            console.log("....label....")

            obje = L.circle(e.path, {
                fillColor: '#3388FF',
                fillOpacity: 0.8,
                radius: 100
            }).addTo(map)
        }

        pathObjects.push(obje)
        obje.addEventListener("mouseover", (e)=>{
            pathObjects.forEach(e=>{e.setStyle({color: "#3388FF", fillColor: "#3388FF"})})
            let i = e.target
            map.removeLayer(e.target)
            i.addTo(map)
            pathObjects.push(i)
            i.setStyle({color:"rgb(223, 39, 39)", fillColor: "rgb(223, 39, 39)"})
        })
        obje.addEventListener("click", (e)=>{
            pathObjects.forEach(e=>{e.setStyle({color: "#3388FF", fillColor: "#3388FF"})})
            let i = e.target
            map.removeLayer(e.target)
            i.addTo(map)
            pathObjects.push(i)
            i.setStyle({color:"rgb(223, 39, 39)", fillColor: "rgb(223, 39, 39)"})
        })
    })


    
}
function hideLines(pd){
    pd.forEach(e=>{
        map.removeLayer(e)
    })
}


// let suggetstMakeLinesBtn = document.createElement("a")
// suggetstMakeLinesBtn.textContent = "اضافة مسارات"
// suggetstMakeLinesBtn.classList.add("suggest")
// suggetstMakeLinesBtn.setAttribute("href", "https://coaster-route-polyline.herokuapp.com")
// suggetstMakeLinesBtn.setAttribute("href", "https://coaster-route-polyline.herokuapp.com")

//////button that shows the lines 
document.querySelector("#displaylines").addEventListener("click", (e)=>{
    console.log(e.target.classList)

    e.target.classList.toggle("add")
    if(e.target.classList.contains("add")){
        e.target.textContent = "اخفاء المسارات"
        e.target.style.background = "#ff2a2a"
        displayLines(pathList)
        // e.target.parentElement.append(suggetstMakeLinesBtn)
        document.querySelector(".suggest").style.display = "block"
    }else{
        hideLines(pathObjects)
        e.target.textContent = "  النقل العام"
        e.target.style.background = "#27f060"

        // e.target.parentElement.lastElementChild.remove()
        document.querySelector(".suggest").style.display = "none"

    }
})




/////insert data; make function to insert data 
let linkedList = []
let beforeImgsElements = []
let afterImgsElements = []

function insertLocs (dataList, pin, thirdOption){

    ////make marker, insert in map, insert in linkedlist; make the label functionality 
    ////make imgs, insert in containers (profile), insert in linkedlist
    ////insert id in linked list 

    dataList.forEach(e=>{

        let pBName = `<p> <img src="./Telegram-Logo.png" alt=""> ${e.bName}</p>`
        let pANames= e.aNames.map(ee=>{return "<p> <img src='./Telegram-Logo.png'>"+ee +"</p>"})
        pANames =  pANames.join("").replace(/,/g, '')
    

        // let m
        if(e.next == true){
                    // m = L.marker(e.coords, {
                    //     icon: nextCampPin, 
                    //     popupAnchor: [-10, -30] 
                    // }).bindPopup(`<h3> ❤المساهمين</h3>${pBName}<br>${pANames}<br><h2>التوقيت</h2><br>${e.campDate}`).addTo(map)


                    if(e.bName){
                        console.log( "bNames is: "+ pBName, e.bName)
                        m = L.marker(e.coords, {
                            icon: nextCampPin, 
                            popupAnchor: [-10, -30] 
                        }).bindPopup(`<h3> ❤المساهمين</h3>${pBName}<br>${pANames}`).addTo(map)

                    }else{
                        console.log( "bNames is: "+ pBName, e.bName)

                        m = L.marker(e.coords, {
                            icon: nextCampPin, 
                            popupAnchor: [-10, -30] 
                        }).bindPopup(`<h3> ❤المساهمين</h3>${pANames}`).addTo(map)
    
                    }

                    // console.log( "bNames is: "+ pBName, e.bName)

                    // m = L.marker(e.coords, {
                    //     icon: nextCampPin, 
                    //     popupAnchor: [-10, -30] 
                    // }).bindPopup(`<h3> ❤المساهمين</h3>${pANames}`).addTo(map)


        }else{
            m = L.marker(e.coords, {
                icon: pin
            }).addTo(map).bindPopup(`<h3> ❤المساهمين </h3>${pBName}<br>${pANames}`);
        }
        m.addEventListener("click", (e)=>{

            document.querySelector("#beforeImgs").innerHTML = ""
            // document.querySelector("#bContributers").innerHTML = "" 
            document.querySelector("#afterImgs").innerHTML = ""
            // document.querySelector("#aContributers").innerHTML = "" 
            // document.querySelector("#sendFinishing").setAttribute("disabled", true)

            linkedList.forEach(ee=>{
                if(ee.m == e.target){

                    //////third option 
                    ee.thirdOption?document.querySelector("#sendFinishing").setAttribute("disabled", true):document.querySelector("#sendFinishing").removeAttribute("disabled")


                    ////beforeImgs inserting; three imgs
                    console.log(ee)

                    ///////more info display; 
                    document.querySelector("#date").textContent = ""
                    document.querySelector("#details").textContent = ""
                    ee.dateOfPlanting?document.querySelector("#date").textContent = ee.dateOfPlanting:null
                    ee.moreDetails?document.querySelector("#details").textContent = ee.moreDetails:null

                    currentM = ee.m
                    currentId = ee.id

                    console.log(ee.beforeImgsElements)
                    ee.beforeImgsElements.forEach(i=>{
                        document.querySelector("#beforeImgs").append(i)
                    })
                    // for(let i = 0; i<3; i++){
                    //     document.querySelector("#beforeImgs").append(ee.beforeImgsElements[i])
                    // }

                    //////before contributers
                    // document.querySelector("#bContributers").innerHTML = `
                    // <div class="contri">
                    //     <h4 class="contributerName">${ee.bName}</h4>
                    // </div>`

                    /////after;
                    if(ee.afterImgsElements[0]){
                        ee.afterImgsElements.forEach(i=>{
                            document.querySelector("#afterImgs").append(i)
                        })

                        // for(let i = 0; i<3; i++){
                        //     document.querySelector("#afterImgs").append(ee.afterImgsElements[i])
                        // }
                    }else{
                        document.querySelector("#afterImgs").innerHTML = `<h1> قريبا </h1>`
                    }

                }
            })
        })

        beforeImgsElements = []
        e.beforeImgs.forEach(e=>{
            let img = document.createElement("img")
            img.style.backgroundImage = `url('${e}')`
            img.style.backgroundSize = "cover"
            img.style.backgroundPosition = "center"

            beforeImgsElements.push(img)
            
        })
        afterImgsElements = []

        if(e.afterImgs[0]){

            e.afterImgs.forEach(i=>{
                let img = document.createElement("img")
                img.style.backgroundImage = `url('${i}')`
                img.style.backgroundSize = "cover"
                img.style.backgroundPosition = "center"
                afterImgsElements.push(img)
            })

            // for(let i = 0; i<4; i++){
            //     let img = document.createElement("img")
            //     img.style.backgroundImage = `url('../${e.afterImgs[i]}')`
            //     img.style.backgroundSize = "cover"
            //     img.style.backgroundPosition = "center"
            //     afterImgsElements.push(img)
            // }
        }

        linkedList.push({m:m, beforeImgsElements: beforeImgsElements, id: e._id, afterImgsElements: afterImgsElements, bName: e.bName, aNames: e.aNames, thirdOption,dateOfPlanting:e.dateOfPlanting, moreDetails: e.moreDetails})
    })

}




////display the controllers 
// document.querySelectorAll(".contr").forEach(e=>{
//     e.addEventListener("click", (ee)=>{
//         console.log([...document.querySelector(".form").children])
//         ([...document.querySelector(".form").children]).forEach(eee=>eee.style.display = 'none')
        
//         document.querySelector("#"+ ee.target.getAttribute("data-contr")).style.display = 'block'
//         console.log(document.querySelector("#"+ ee.target.getAttribute("data-contr")))
//     })
// })




/////adding loc; new method;

document.querySelectorAll(".addCoords").forEach(e=>{
    e.addEventListener("click", (ee)=>{
        ee.target.classList.toggle("red")
        ee.target.getAttribute("id") == "addUnconUnfinishedCoords"?currentPin = conUnfinished:currentPin=conFinished
    })
})
map.addEventListener('click', function (ev) {
    currentMm?map.removeLayer(currentMm):null


    console.log(ev.target)


    if(document.querySelector("#addUnconUnfinishedCoords").classList.contains("red") || document.querySelector("#addUnconFinishedCoords").classList.contains("red")){
        let latlng = map.mouseEventToLatLng(ev.originalEvent);
        let i = [latlng.lat, latlng.lng]
        currentMm = L.marker(i, {
            icon: currentPin
        }).addTo(map);
        m = currentMm
        currentCoords = i    
    }
});

let currentContr

//////the searching and profile index
document.addEventListener("click", (e)=>{

    //////display the controllers 
    // if(e.target.getAttribute('data-contr')){
    //     console.log("clicking on contr element")
    //     document.querySelectorAll(".contr").forEach(ee=>{
    //         ee.style.display = 'none'
    //     })
    //     currentContr = document.querySelector("#" + e.target.getAttribute("data-contr"))
    //     // e.target.style.display = 'block'
    //     currentContr.style.display = 'block'
    // }else if(currentMm){
    //     currentContr.style.display = 'block'
    // }
    // else{
    //     document.querySelectorAll(".contr").forEach(ee=>{
    //         ee.style.display = 'none'
    //     })
    // }


    //////display the details
    if(e.target.classList.contains("mdetails")){
        // console.log(document.querySelector("footer"))
        // console.log([...document.querySelector('footer').children])

        document.querySelector("#shadeScreen").style.display = 'block'
        Object.values(([...document.querySelector('footer').children])).forEach(e=>e.style.display='block')
    }else{
        document.querySelector("#shadeScreen").style.display = 'none'
        Object.values(([...document.querySelector('footer').children])).forEach(e=>e.style.display='none')
    }

    console.log(e.target)

    if (!e.target.classList.contains('leaflet-marker-icon')){
        document.querySelector("#profile").style.zIndex = "1"
        document.querySelector("#profile").style.pointerEvents = "none"

    }else{
        document.querySelector("#profile").style.zIndex = "1002"
        document.querySelector("#profile").style.pointerEvents = "all"
    }

})


document.querySelectorAll(".addbtn").forEach(i=>{
    i.addEventListener("click", (e)=>{
        e.target.classList.toggle("onbtn")
        if(e.target.classList.contains("onbtn")){
            document.querySelector("#" + e.target.getAttribute("data-contr")).style.display = 'block'
        }else{
            document.querySelector("#" + e.target.getAttribute("data-contr")).style.display = 'none'
        }
    })
})




//////////////////////translate 
// document.querySelector("#en").addEventListener("click", (e)=>{
//     if(e.target.textContent == "en"){

//         // document.querySelector("#projectName").textContent = "treeing"

//         document.querySelector("#beforeandafter").innerHTML = `
//         <div id="beforeImgs">
//         <h2>before</h2>
//         <img alt="">
//         <img alt="">
//         <img alt="">
//     </div>

//     <div id="afterImgs">
//         <h2>after</h2>
//         <img alt="">
//         <img alt="">
//         <img alt="">
//     </div>
// `
// document.querySelector("#displayLines").innerHTML = `
// <button id="displaylines" style="font-size: 1.5rem;" disa bled="true"> display public transportation routes </button>
// <a href="https://coaster-route-polyline.herokuapp.com" target="_blank" class="suggest">add route</a>
// `
// document.querySelector(".form").innerHTML = `
// <div id="addUnfinished">
// <h4>Add a place that needs planting </h4>
// <button class="addCoords" id="addUnconUnfinishedCoords">select place</button>
// <label for="addBImgs">add place images</label>
// <input type="file" id="addBImgs" name="addBImgs" class="addBImgs" multiple>
// <input type="text" class="names" placeholder="name or tele userName">

// <button class="send" id="sendUnfinished">send</button>
// </div>

// <div id="addFinished">
// <h4>add planted place </h4>
// <button class="addCoords" id="addUnconFinishedCoords">select place</button>
// <label for="addAAImgs">after</label>
// <input type="file" id="addAAImgs" name="addAAImgs" class="addAImgs" multiple>

// <label for="addBBImgs">before</label>
// <input type="file" id="addBBImgs" name="addBBImgs" class="addBImgs" multiple>

// <input type="text" class="names" placeholder="tele userName, name, name">

// <input type="text" placeholder="more info; type and nuber, ..." class="moreDetails">
// <input type="date" class="dateOfPlanting">


// <button class="send" id="sendFinished">send</button>
// </div>

// <div id="makeFinished">
// <h4>plant the selected place </h4>
// <span></span>
// <label for="addAImgs">after</label>
// <input type="file" id="addAImgs" name="addAImgs" class="addAImgs" multiple>
// <input type="text" class="names" placeholder="name, userName,
// name, userName">

// <input type="text" placeholder="more info; type and number of plants, ..." class="moreDetails">
// <input type="date" class="dateOfPlanting">

// <button class="send" id="sendFinishing" disabled="true">ارسال</button>
// </div>
// `
// document.querySelector("footer").innerHTML = `
// <div class="features">
// <span class="black"></span>
// <h2>website features; goal and use </h2>
// <div> <img src="./لقطة الشاشة 2022-06-23 185255.png" alt=""> confirm the progress in planting campaigns</div>
// <div> <img src="./لقطة الشاشة 2022-06-23 185458.png" alt=""><img src="./marker-icon-2x-green.png"
//         alt=""><img src="./marker-icon-2x-red.png" alt=""> add pins </div>
// <div>
// <img src="./marker-icon-2x-green.png" alt="">
// <img src="./download-removebg-preview.png" alt="">
// <img src="./لقطة الشاشة 2022-06-23 185510.png" alt="">
// <img src="./marker-icon-2x-red.png" alt=""> planting the selected place </div>
// </div>
// <div id="info">
// <div class="achievements">
//     <span class="green"></span>
//     <h2>project results</h2>
//     <li>planted <img src="./marker-icon-2x-green.png" alt=""><b>1</b></li>
//     <li>need planting <img src="./marker-icon-2x-red.png" alt=""> <b>2</b></li>
//     <li>number of contributers; ???</li>
//     <img src="./284807325_340145658273227_1050030653915922194_n.jpg" alt="">
// </div>
// <div class="contact">
//     <span class="red"></span>
//     <h2>contact us</h2>
//     <a href="https://www.instagram.com/kadum_0/"><img
//             src="./instagram-round-icon-vector-instagram-round-multicolor-icon-white-background-134391805.jpg"
//             alt=""></a>
//     <a href="t.me/kadum0">
//         <img src="./telegram-logo.png" alt="">
//     </a>
//     <!-- <p>facebook</p> -->
//     <p>email; kadom1230@gmail.com</p>
// </div>
// </div>

// <div class="additionalInfo">
// <ul>
//     <li><img src="../marker-icon-2x-green.png">planted</li>
//     <li><img src="../marker-icon-2x-red.png">need planting</li>
//     <li><img src="../marker-icon-2x-yellow.png">next campaign place</li>
//     <li>After adding a place (pin) on the map, this place is not added directly to the map; but do require confirming from the admin side (planting volunteer teams) </li>
//     <li> @name = telegram username</li>
//     <li> the after planting photos have to be in the same angle of the before treeing photos; for the admin to make that both are the same place </li>
//     <li class="redli">
//     This site is a platform: means based on two parties: users and admins,
//     The user sends the data and the admin has the authority to authenticate or delete
//     that Data, the admin is often a volunteer team, has a relationship or experience with the service
//     Who is coming to settle it on the site: Any volunteer team that wants to register as an admin can contact us to get it             
// </li>

// </ul>
// </div>
// `
//         e.target.textContent = "ar"
//     }else{

//         document.querySelector("#beforeandafter").innerHTML = `
//         <div id="beforeImgs">
//         <h2>قبل</h2>
//         <img alt="">
//         <img alt="">
//         <img alt="">
//     </div>

//     <div id="afterImgs">
//         <h2>بعد</h2>
//         <img alt="">
//         <img alt="">
//         <img alt="">
//     </div>
// `
// document.querySelector("#displayLines").innerHTML = `
// <button id="displaylines" style="font-size: 1.5rem;" disa bled="true"> اظهار المسارات النقل العام (كيات و
//     كوسترات) </button>
// <a href="https://coaster-route-polyline.herokuapp.com" target="_blank" class="suggest">اضافة مسارات</a>
// `
// document.querySelector(".form").innerHTML = `
// <div id="addUnfinished">
// <h4>اضافة مكان يحتاج الى زراعة </h4>
// <button class="addCoords" id="addUnconUnfinishedCoords">تحديد مكان</button>
// <label for="addBImgs">اضافة صور للمكان</label>
// <input type="file" id="addBImgs" name="addBImgs" class="addBImgs" multiple>
// <input type="text" class="names" placeholder="name or tele userName">

// <button class="send" id="sendUnfinished">ارسال</button>
// </div>

// <div id="addFinished">
// <h4>اضافة مكان تم زراعته </h4>
// <button class="addCoords" id="addUnconFinishedCoords">تحديد مكان</button>
// <label for="addAAImgs">بعد</label>
// <input type="file" id="addAAImgs" name="addAAImgs" class="addAImgs" multiple>

// <label for="addBBImgs">قبل</label>
// <input type="file" id="addBBImgs" name="addBBImgs" class="addBImgs" multiple>

// <input type="text" class="names" placeholder="tele userName, name, name">

// <input type="text" placeholder="تفاصيل اضافية: نوع و عدد النباتات, ..." class="moreDetails">
// <input type="date" class="dateOfPlanting">


// <button class="send" id="sendFinished">ارسال</button>
// </div>

// <div id="makeFinished">
// <h4>زراعة المكان المحدد </h4>
// <span></span>
// <label for="addAImgs">بعد</label>
// <input type="file" id="addAImgs" name="addAImgs" class="addAImgs" multiple>
// <input type="text" class="names" placeholder="name, userName,
// name, userName">

// <input type="text" placeholder="تفاصيل اضافية: نوع و عدد النباتات, ..." class="moreDetails">
// <input type="date" class="dateOfPlanting">

// <button class="send" id="sendFinishing" disabled="true">ارسال</button>
// </div>
// `
// document.querySelector("footer").innerHTML = `
// <div class="features">
// <span class="black"></span>
// <h2>مميزات الموقع: الغرض و الاستخدام </h2>
// <div> <img src="./لقطة الشاشة 2022-06-23 185255.png" alt=""> توثيق
//     حملات التشجير المنتهية و القادمة</div>
// <div> <img src="./لقطة الشاشة 2022-06-23 185458.png" alt=""><img src="./marker-icon-2x-green.png"
//         alt=""><img src="./marker-icon-2x-red.png" alt=""> اضافة
//     علامات </div>
// <div>
// <img src="./marker-icon-2x-green.png" alt="">
// <img src="./download-removebg-preview.png" alt="">
// <img src="./لقطة الشاشة 2022-06-23 185510.png" alt="">
// <img src="./marker-icon-2x-red.png" alt=""> زراعة
//     مكان محدد </div>
// </div>
// <div id="info">
// <div class="achievements">
//     <span class="green"></span>
//     <h2>نتائج المشروع</h2>
//     <li>تم زراعتها <img src="./marker-icon-2x-green.png" alt=""><b>1</b></li>
//     <li>تحتاج الى زراعة <img src="./marker-icon-2x-red.png" alt=""> <b>2</b></li>
//     <li>عدد المساهمين: ؟؟</li>
//     <img src="./284807325_340145658273227_1050030653915922194_n.jpg" alt="">
// </div>
// <div class="contact">
//     <span class="red"></span>
//     <h2>تواصل معنا</h2>
//     <a href="https://www.instagram.com/kadum_0/"><img
//             src="./instagram-round-icon-vector-instagram-round-multicolor-icon-white-background-134391805.jpg"
//             alt=""></a>
//     <a href="t.me/kadum0">
//         <img src="./telegram-logo.png" alt="">
//     </a>
//     <!-- <p>facebook</p> -->
//     <p>email; kadom1230@gmail.com</p>
// </div>
// </div>

// <div class="additionalInfo">
// <ul>
//     <li><img src="../marker-icon-2x-green.png">تم زراعته</li>
//     <li><img src="../marker-icon-2x-red.png">يحتاج الى زراعة</li>
//     <li><img src="../marker-icon-2x-yellow.png">مكان الحملة القادمة</li>
//     <li>*بعد اضافة مكان و ارساله مع الصور فان هذا المكان لا يوضع على الخريطة مباشرة, بل يتم ارساله الى ادمن
//         (فريق
//         التشجير) ليقوم بتوثيقه و اضافته على الخريطة</li>
//     <li> @name = telegram username
//     </li>
//     <li>صور بعد التشجير يجب ان تكون بنفس زوايا صور قبل التشجير للتأكد ان
//         هذا نفس المكان
//     </li>
//     <li class="redli">
//     الموقع هاذ هو منصة: يعني بي طرفين: المستخدمين و الادمنز,
//     المستخدم يرسل البيانات و الادمن عندة صلاحية توثيق او حذف
//     البيانات, الادمن غالبا يكون فريق تطوعي الة علاقة او خبرة بالخدمة
//     اللي جاي يسويها الموقع: فأي فريق تطوعي يريد يسجل كأدمن يكدر
//     يتواصل ويانة للحصول
// </li>

// </ul>
// </div>
// `


//         e.target.textContent = "en"
//     }
// })

////send data 


document.querySelectorAll(".send").forEach(ee=>{

    ee.onclick= async (e)=>{
        console.log(currentCoords)
        console.log(e.target.parentElement.children)
    
        //////check if exist then empty them 
    
        let children = e.target.parentElement.children
    
        let aChildren = [...children]
        aChildren.forEach(e=>console.log(e))
        console.log(currentId)
    
    
    
        if((currentCoords || currentId) && children[3].files[0] && children[3].files[1] && children[3].files[2]){
    
            message.innerHTML = ""
            // console.log(children[3].files)
            let fd = new FormData()
    
            /////coords 
            e.target.getAttribute("id") == "sendUnfinished" || e.target.getAttribute("id") == "sendFinished"?fd.append("coords", currentCoords):fd.append("id", currentId)
    
            /////imgs 
            if(aChildren.find(e=>e.getAttribute("class") == "addBImgs")){
                console.log("found b img", aChildren.find(e=>e.getAttribute("class") == "addBImgs").files)
                for (let i of aChildren.find(e=>e.getAttribute("class") == "addBImgs").files) {
                    fd.append(`bImgs`, i);
                }
                }
            if(aChildren.find(e=>e.getAttribute("class") == "addAImgs")){
                console.log("found a img", aChildren.find(e=>e.getAttribute("class") == "addAImgs").files)
                for (let i of aChildren.find(e=>e.getAttribute("class") == "addAImgs").files) {
                    fd.append(`aImgs`, i);
                }
                }
    
            /////names 
            fd.append("names", aChildren.find(e=>e.getAttribute("class") == "names").value)

            /////more details; 
            if(aChildren.find(e=>e.getAttribute("class") == "moreDetails")){
                fd.append("moreDetails", aChildren.find(e=>e.getAttribute("class") == "moreDetails").value)
                fd.append("dateOfPlanting", aChildren.find(e=>e.getAttribute("class") == "dateOfPlanting").value)
            }
    
            console.log(fd)
    

            ///send 
            if(e.target.getAttribute("id")=="sendUnfinished"){
                console.log("sending")
                await fetch("/uncon-unfinished", {
                    method: "POST", 
                    body: fd
                })
            }else if(e.target.getAttribute("id")=="sendFinished"){
                await fetch("/uncon-finished", {
                    method: "POST", 
                    body: fd
                })
            }else if (e.target.getAttribute("id")=="sendFinishing"){
                await fetch("/make-finishing", {
                    method: "POST", 
                    body: fd
                })
            }

            
            ////empty 
        ////empty 
        aChildren.find(e=>e.getAttribute("class") == "names").value = ""
        if(aChildren.find(e=>e.getAttribute("class") == "addAImgs")){aChildren.find(e=>e.getAttribute("class") == "addAImgs").files = null}
        if(aChildren.find(e=>e.getAttribute("class") == "addBImgs")){aChildren.find(e=>e.getAttribute("class") == "addBImgs").files = null}
        

        m?map.removeLayer(m):null
        currentCoords = ""
        currentId = ""

        if(aChildren.find(e=>e.getAttribute("class") == "moreDetails")){
            aChildren.find(e=>e.getAttribute("class") == "moreDetails"). value = ""
            aChildren.find(e=>e.getAttribute("class") == "dateOfPlanting").value = ""
        }

        }else{
            message.innerHTML = "fill the rest input"
        }
    }
    })
    




