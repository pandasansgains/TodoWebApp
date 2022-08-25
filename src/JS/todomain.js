/*eslint-env es6*/

// TODO

// Start with the login page 
// Make a dummy data. fill it in the database and make the load buttton to load a planning
// Make a save planning function ( should e able to specify for a date)
// Make login form and database for it 
// Make export planning
// FIX css bug to have the form display where i want ( center and on top of other stuff)
// Figure out how to make a proper note box 

// do we want to keep track of categories this way ?
// we would like it to store the descriptions
// It would be a problem when dragging and dropping tasks as they would be changing so also change the category 
//data when moving the element around
// It would be useful for 
// -> organising and making some filters on tasks
// -> would be easy to implment but need to keep track of dragged tasks in which container it is appended
// -> would be useful to retrieve the note and other data
// or we could approach the problem storing all the data within the div there seem to be a solution like data-* = 
// The data would be saved according to a day and a user and we will just overwrite. this way when draggin and dropping it would not 
//be that big of an issue  

var categories = [];

var currentTask = null; // current task being edited ( description or other ) from the popup menu


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

//returns the container that it created
function createContainer(categoryName){

    //create a taskPlaceHolder

    var div = document.createElement("div");
    div.classList.add("grid-item");

    var ul = document.createElement("ul");
    ul.classList.add("taskPlaceHolder");
    initContainer(ul);// set the dragover listeners

    // create a span

    var span = document.createElement("SPAN");
    span.classList.add("categoryTitle")
    var text = document.createTextNode(categoryName);
    span.appendChild(text);


    var closeButton = document.createElement('button');// adding closeButton
    closeButton.classList.add('close');



    closeButton.onclick = function(){
        deleteCategory(this);
    }

    span.appendChild(closeButton);
    ul.appendChild(span);
   
    

    var input = document.createElement("INPUT");
    input.setAttribute("type","text");

    //input.setAttribute('maxlength',42);


    input.classList.add("taskInputField");
    input.setAttribute("placeholder","Enter Task");

    // call createTask with note = null 
    input.onkeyup = function(event){
        let text = this.value;

        if(event.key == "Enter"){
        
            if( text != ""){

                createTask(this.nextElementSibling, text, "");
                // this.nextElementSibling is the container ( we are in the input field so UL is sibling)
            }
            input.value = "";// reset to placeholder 
        } 
    }


    div.appendChild(input);
    div.appendChild(ul);
    var wrapper = document.getElementById("TaskListWrapper");
    wrapper.appendChild(div);

    return ul;


}

// create the function this way and also calll it in createContainer
function createTask(container, taskName, note){

    var listElem = document.createElement('li');
    listElem.classList.add('draggable');
    listElem.classList.add('task');
    listElem.setAttribute('draggable',true);
    initDraggable(listElem); // set the dragging classnames when dragged
    listElem.ondblclick = function(){
        showForm(listElem);
    }


    var closeButton = document.createElement('button');// adding closeButton
    closeButton.classList.add('close');
    closeButton.onclick = function(){
        deleteElem(this);
    }



    var span = document.createElement('span');
    span.classList.add('font');
    span.innerHTML = taskName;
 

    listElem.appendChild(span);
    listElem.appendChild(closeButton);

    if(note === null){
        listElem.setAttribute("data-note", "");
    }
    else{
        listElem.setAttribute("data-note", note);

    }


    // we are in the grid-item next element sibling is UL taskplaceholder
    container.appendChild(listElem);
    //input.value = "";// reset to placeholder 

}
//called in the input field at the top
function createCategory(event){

    let input = document.getElementById("catInputField");
    let text = input.value;

    event.preventDefault;

        if(event.key == "Enter"){
        
            if( text != ""){
                
                createContainer(text);
                input.value = "";
            }
        } 
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
    
// deletes this.parent 
function deleteElem(elem){
    
    var element = elem;
    element.parentNode.parentNode.removeChild(element.parentNode);

}

function deleteCategory(elem){

    var element = elem;
    element.parentNode.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode.parentNode);

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
            initDraggable();
        }
    } 
}

// function called in onclick of links with date calls loadDashboard
function loadPlanningFront(){


    console.log(myCalender.value);

    if(myCalender.value!== null){



        let dateString = dateConverterObj(myCalender.value);
        getPlanning(dateString);// call to backend

        // let currentDashb

    }

}


// function called in onclick of links with date calls deleteDashboard
function deletePlanningFront(){

    console.log(myCalender.value);

    if(myCalender.value!== null){

        let dateString =dateConverterObj(myCalender.value);
        deletePlanning(dateString);// call to backend to delete
        // update available plannings
        getPlannings(true);// update available plannings

    }

}


// function called in onclick of links with date calls deleteDashboard
function savePlanningFront(){

    console.log(myCalender.value);

    if(myCalender.value!== null){

        let dateString = dateConverterObj(myCalender.value);
        saveDashboard(dateString);
        // update available plannings
        getPlannings(true);// update available plannings

    }

}




function displayClock(){
    var refresh=1000; // Refresh rate in milli seconds
    var mytime=setTimeout('displayClockTime()',refresh)
}

function displayClockTime(){
    
    
    var x = new Date()

    document.getElementById('Date').innerHTML =  x.getDate() + "/" +  (x.getMonth()+1) + "/" + x.getFullYear();
    document.getElementById('Time').innerHTML = x.getHours() + "h " + x.getMinutes() +"m ";
    displayClock();
    
}

function colorElem(elem, color){
    elem.style.backgroundColor = color;
}

function setNote(){

    let textAreaValue = document.getElementById("popupNote").value;

    currentTask.setAttribute('data-note', textAreaValue);

}


function clearDashboard(){
    document.getElementById("TaskListWrapper").innerHTML ="";
}

function setCurrentlyLoaded(date){
    // get element and set it's value to date

    document.getElementById("currentDashboard").innerHTML = date;


}






displayClockTime();







