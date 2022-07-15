/*eslint-env es6*/



//TODO call createContainer on buttonPress


function initContainer(container){

    container.addEventListener('dragover', e =>{
        const afterElement = getDragAfterElement(container, e.clientY); // passing container and mouse 
             
        const draggable = document.querySelector('.dragging');
        e.preventDefault();
      
             
        if(afterElement == null){
            
            container.appendChild(draggable); // appends at end of container, used to pass elements of list between containers
            
        }
        else{
        
            container.insertBefore(draggable,afterElement);
        }
    })

}

function initDraggable(element){

    
    element.addEventListener('dragstart', () => { // triggered when we start to drag a list tag
        
        element.classList.add('dragging')
    
    })
    
    element.addEventListener('dragend', () => { // triggered when we stop dragging
        
        element.classList.remove('dragging')
        
    })

}

function createContainer(categoryName){

    //create a taskPlaceHolder

    var div = document.createElement("div");
    div.classList.add("grid-item");// TODO style the grid-tiem

    var ul = document.createElement("ul");
    ul.classList.add(categoryName);
    ul.classList.add("taskPlaceHolder");
    initContainer(ul);// set the dragover listeners

    var input = document.createElement("INPUT");
    input.setAttribute("type","text");
    input.classList.add(categoryName);
    input.setAttribute("placeholder","Enter Task");

    input.onkeyup = function(event){

        let text = this.value;

        if(event.key == "Enter"){
        
            if( text != ""){

                var listElem = document.createElement('li');
                listElem.classList.add('draggable');
                listElem.setAttribute('draggable',true);
                initDraggable(listElem); // set the dragging classnames when dragged

                // TODO create this dynamically
                listElem.innerHTML ="<span class = 'content'>" + text + "</span>  <button class='delete' onclick='deleteElem(this)'>Delete</button>";
                
                this.nextElementSibling.appendChild(listElem);
                input.value = "";// reset to placeholder 
            }
        } 

    }


    div.appendChild(input);
    div.appendChild(ul);
    var wrapper = document.getElementById("TaskListWrapper");
    wrapper.appendChild(div);


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



function setTimeForm(listElem) { // timeForm for task elements
    
    var div = document.createElement("div");
    div.classList.add("popup");
    document.getElementsByClassName("body").appendChild(div);
    
    document.getElementById("popupForm").style.display = "block";
}

     
function closeTheForm() {
    
  document.getElementById("popupForm").style.display = "none";
    
}

    
function setBackground(id, color){// sets background of given id element to color
    
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

function generateTaskHolder(){

}


displayClockTime();







