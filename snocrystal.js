/* 
***********SnoJS v4************
**********Snocrystal***********
*********License: MIT**********
***(c) 2024 The Guyot Project**
*/

function random(max) {
    return Math.floor(Math.random() * max);
}
function toggle(name){
  if(name){return false;}else{return true;}
}
// Query for all dom elements, store in elements[]
const getElms = () =>{
    var z;
    var arr = []
    z= document.getElementsByTagName("*");
    for(i=0;i<z.length;i++){
        arr.push(z[i]);
    }
    return arr;
};
const elements = getElms();

// Collect all elements with react attribute, store in reval[]
const parseReval = () => {
    var hasReval;
    var revals = [];
    for(i=0;i<elements.length;i++){
        hasReval = elements[i].getAttribute("react")
        // oldTxt stores the original innerHTML of the attribute
        // pre & post will store anything before and after {{ }}
        if(hasReval != null){
            revals.push({"elem":elements[i],"oldTxt":elements[i].innerHTML,"pre":"","post":""});
        }
        else{
            if(elements[i].getAttribute("lint") != null){
            revals.push({"elem":elements[i],"oldTxt":elements[i].innerHTML,"pre":"","post":""});
            }
        }
    }
    return revals;
}
const reval = parseReval();

// Cycle through all reval[] replace variables inside {{ }} with data.varName,
// Evaluate inside {{ }} stich pre + eval({{ }}) + post together
const renderReval = () =>{
    if(reval.length > 0){
        for(i=0;i<reval.length;i++){
            // trueTxt is the value with var convertred into data[Object.keys(data)[index]]
            let trueTxt = reval[i].oldTxt;
            for(q=0;q<Object.keys(data).length;q++){
                if(trueTxt.includes(Object.keys(data)[q])){
                trueTxt = trueTxt.replace(Object.keys(data)[q],`data[Object.keys(data)[${q}]]`);
                }
            }
            let pre = trueTxt.split("{");
            let post = trueTxt.split("}");
            reval[i].pre = pre[0]
            reval[i].post = post[post.length-1]
            trueTxt = pre[pre.length-1].split("}")[0];
            // Once fully converted set to innerHTML (oldTxt never changes)
            reval[i].elem.innerHTML = pre[0]+eval(trueTxt)+post[post.length-1]
        }
    }
}

// Find and store any emelent with for attribute in fors[]
const parseFors = () =>{
    let hasFor;
    let fors = [];
    for(i=0;i<elements.length;i++){
        hasFor = elements[i].getAttribute("for");
        if(hasFor != null){
            fors.push({elem:elements[i],attr:hasFor})
        }
    }
    return fors;
};
const fors = parseFors();

// For each fors[] use given array and template to render
const renderFors = () =>{
    let rendered = []
    for(i=0;i<fors.length;i++){
        // Clears container of previously rendered fors
        fors[i].elem.innerHTML = ''
        // enewItem stores the complete list of rendered items. <li>hi</li><li>bye</li>...
        let newItem = "";
        let itemType = fors[i].elem.getAttribute("item");
        // arr stores the array that the user provides in the for=""
        let arr = fors[i].attr; // when accesing use data[arr]
        for(q=0;q<data[arr].length;q++){
            newItem += itemType.replaceAll("{{item}}",data[arr][q]).replaceAll("{{i}}",q);
        }
        fors[i].elem.innerHTML = newItem;
    }
};
/*
    Meaningful comments end here
*/
        
const renderIfs = () =>{
    // If reactor
    if(ifs.length > 0){
        // loop both the object and the ifs to check for equality
        for(i=0;i<ifs.length;i++){
            // replace stuff
            let trueAttr = ifs[i].attr
            for(q=0;q<Object.keys(data).length;q++){
                if(trueAttr.includes(Object.keys(data)[q])){
                    trueAttr = trueAttr.replace(Object.keys(data)[q],`data[Object.keys(data)[${q}]]`);
                }
            }
            if(eval(trueAttr)){
                ifs[i].elem.style.display = "";
            }else{
                ifs[i].elem.style.display = "none";
            }
        }
    }
}

const $render = () =>{
    renderReval();
    renderIfs();
    renderFors();
}
    
// Mark the data tag and push jsonified vars to array
const parseData = () =>{
    var hasDataTag, jsonified;
    var possible = false;
    for(i=0;i<elements.length;i++){
        hasDataTag = elements[i].getAttribute("data");
        if(hasDataTag != null){
            possible = true;
            // hasDataTag = JSON.parse(hasDataTag);
            // let test = eval(hasDataTag);
            // let neww = JSON.parse(test);
            // alert(hasDataTag)
            let data = hasDataTag;
            data = "()=>{ return "+data+";}"
            let okay = eval(data)
            return okay();
        }
    }
    if(!possible){
        hasDataTag = '{undef:"undefined"}';
        return hasDataTag;
    }
};
const data = parseData();
    
const parseScreen = () =>{
    var hasEither;
    var screens = [];
    for(i=0;i<elements.length;i++){
        hasEither = elements[i].getAttribute("computer");
        // computer first mobile second
        if(hasEither != null){
            screens.push({elem:elements[i],attr:"computer"})
        }else if(elements[i].getAttribute("mobile") != null){
            screens.push({elem:elements[i],attr:"mobile"})
        }
    }
    return screens;
};
const screens = parseScreen();

const renderScreens = () =>{
    for(i=0;i<screens.length;i++){
        if(screens[i].attr == "mobile"){
            if(window.innerWidth <= 600){
                screens[i].elem.style.display="block";
            }else{
                screens[i].elem.style.display="none";
            }
        }    
        if(screens[i].attr == "computer"){
            if(window.innerWidth >= 600){
                screens[i].elem.style.display="block";
            }else{
                screens[i].elem.style.display="none";
            }
        }
    }
}
    
const parseIf = () =>{
    var hasIf;
    var ifs = [];
    for(i=0;i<elements.length;i++){
        // Check for React attr
        hasIf = elements[i].getAttribute("if");
        if(hasIf != null){
            // Dont push data of React attr, only elem
            ifs.push({"elem":elements[i],"attr":hasIf,"computed":undefined,"pre":"","post":""});
        }
    }
    return ifs;
};
const ifs = parseIf();
    
const exe = () => {
    var hasExe;
    for(i=0;i<elements.length;i++){
        hasExe = elements[i].getAttribute("eval");
        if(hasExe != null){
            for(q=0;q<Object.keys(data).length;q++){
                if(hasExe.includes(Object.keys(data)[q])){
                hasExe = hasExe.replace(Object.keys(data)[q], `data[Object.keys(data)[${q}]]`);
            }
        }
        eval(hasExe)
        }
    }
    $render();
};exe();
    
const allowInclReturn = (elem,hasIncl) =>{
    // This function only exists because when i return the other one it doesnt allow more than 1 incl
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
        if (this.status == 200) {elem.innerHTML = this.responseText;}
        }
    }      
    xhttp.open("GET", hasIncl, true);
    xhttp.send();
    return;
}

const parseIncl = () =>{   
    let hasIncl;
    for(i=0;i<elements.length;i++){
        hasIncl = elements[i].getAttribute("incl");
        elem = elements[i]
        if(hasIncl != null){
            allowInclReturn(elem,hasIncl);
        }
    }
};parseIncl();
    
    
const parseBind = () =>{
    let hasBind;
    let binds = []
    for(i=0;i<elements.length;i++){
        hasBind = elements[i].getAttribute("bind")
        if(hasBind!=null){
            for(q=0;q<Object.keys(data).length;q++){
                if(hasBind.includes(Object.keys(data)[q])){
                binds.push({elem:elements[i],attr:hasBind})
                }
            }
        }
    }
    return binds;
};
const bound = parseBind();

    const renderBinds = () =>{
    let fix;
    for(i=0;i<bound.length;i++){
        bound[i].elem.addEventListener('input',function(evt){
        setTimeout(()=>{
            fix = bound[i].attr;
            data[fix] = bound[i].elem.value;
            $render()
        },0)
        })
    }
};renderBinds();
    
const $ = (change) =>{
    let update = change;
    // this is the new click and in script tag modification function
    for(let i=0;i<Object.keys(data).length;i++){
        if(update.includes(Object.keys(data)[i])){
            update = update.replaceAll(Object.keys(data)[i],`data.${Object.keys(data)[i]}`);
        }
    }
    eval(update);
    $render();
};
    
    
    
window.main = function(){
    requestAnimationFrame( main );
    renderScreens();
};main();
    
$render();
