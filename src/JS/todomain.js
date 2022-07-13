/*eslint-env es6*/

//TODO when text to long list element should still contain the text
//TODO style Done taskList

//TODO add button to put it into done for 
//TODO add day and time on top
//TODO add a timer we can launch and attach a task
//TODO make delimited placeholder for the containers
//TODO style input box
//TODO add time button that adds a time to a task -> If time is added we will have a timeline and then the time of the task will appear on the timeline
// cannot understand why they don't get duplicated as can';t find function that removes from container when finished 





function initDraggables(){
    
    var draggables =  document.querySelectorAll(".draggable");
    
   // var containers = document.querySelectorAll(".container");

    
    draggables.forEach(draggable => {
    
    draggable.addEventListener('dragstart', () => { // triggered when we start to drag a list tag
        
        draggable.classList.add('dragging')
        
        //console.log("dragging");
    })
    
    
    
    draggable.addEventListener('dragend', () => { // triggered when we stop dragging
        
        draggable.classList.remove('dragging')
        
    })
    
})
}

function initContainers(){
    
    
    //var container = document.getElementById("taskPlaceHolder");
    
    //var containers = document.getElementsByClassName("taskContainer");
    
    var containers = document.querySelectorAll(".taskContainer,.grid-item");
    
    // init grid items as container
    
    
    
    
    Array.from(containers).forEach(container => {
         container.addEventListener('dragover', e =>{
             
             
        const afterElement = getDragAfterElement(container, e.clientY); // passing container and mouse 
             
        const draggable = document.querySelector('.dragging');
        e.preventDefault();
             
        if(container.id == "doneTaskPlaceHolder"){
                
                draggable.classList.remove("content");
                draggable.classList.add("done");
        }
             
             
        if(container.id == "taskPlaceHolder"){
                
                draggable.classList.remove("done");
                draggable.classList.add("content");
                
        }    
             
////             
//        if(container.classList.contains("grid-item")){
//                
//               container.classList.add("color-grid-item");
//               container.classList.remove("grid-item");
//               
//                
//        }        
             
        if(afterElement == null){
            
            container.appendChild(draggable); // appends at end of container, used to pass elements of list between containers
            
        }
        else{
        
            container.insertBefore(draggable,afterElement);
        }
         })
    
         
        
    })
                       
}

function getDragAfterElement(container, y){
    
    
    
   const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]// select all draggable that we are not currently dragging
   
   
   return draggableElements.reduce((closest, child)=> {// takes a function and a second parameter 
       
       const box = child.getBoundingClientRect();
       
       const offset = y - box.top - box.height / 2;
       
       if(offset < 0 && offset > closest.offset){
           
          // console.log({offset : offset, element: child})
           
           return {offset : offset, element: child}
       }
       else{
           //console.log(closest)
           return closest;
       }
       
       
   }, { offset: Number.NEGATIVE_INFINITY}).element;// giving big offset
    
    
}

function setTimeForm(listElem) {
    
    
    var div = document.createElement("div");
    div.classList.add("popup");
    document.getElementsByClassName("body").appendChild(div);
    
    document.getElementById("popupForm").style.display = "block";
}
     
function closeTheForm() {
    
  document.getElementById("popupForm").style.display = "none";
    
}
    
function setBackground(id, color){
    
    document.getElementById(id).style.backgroundColor = color;
    
}

// deletes this.parent 
function deleteElem(elem){
    
    var element = elem;
    element.parentNode.parentNode.removeChild(element.parentNode);
    initDraggables();

}

function processInput(event){
    
    let input = document.getElementById("contentHolder");
    let text = input.value;
    
    if(event.key == "Enter"){
        
        if( text != ""){
            
            var listElem = document.createElement('li');
            listElem.classList.add('draggable');
            listElem.setAttribute('draggable',true);
            
            listElem.innerHTML ="<span class = 'content'>" +text + "</span>  <button class='delete' onclick='deleteElem(this)'>Delete</button>";
            
            document.getElementById("taskPlaceHolder").appendChild(listElem);
            
            
            
            input.value = "";// reset to placeholder 
            initDraggables();
        }
    } 
}

function displayClock(){
    var refresh=1000; // Refresh rate in milli seconds
    var mytime=setTimeout('displayClockTime()',refresh)
}

function displayClockTime(){
    
    
    var x = new Date()
    document.getElementById('Date').innerHTML = x.getMonth() + "/" + x.getDate() + "/" + x.getYear();
    document.getElementById('Time').innerHTML = x.getHours() + "h " + x.getMinutes() +"m " +x.getSeconds() +"s";
    displayClock();
    
}


initContainers();
initDraggables();
displayClockTime();







