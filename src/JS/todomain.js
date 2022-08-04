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

    var button = document.createElement('span');// adding closeButton
    button.classList.add('closeButtonCategory');
    button.innerHTML= "&times;"
    button.onclick =function(){

        deleteCategory(this);
    }

    span.appendChild(button);
    ul.appendChild(span);
   
    

    var input = document.createElement("INPUT");
    input.setAttribute("type","text");

    //input.setAttribute('maxlength',42);


    input.classList.add("taskInputField");
    input.setAttribute("placeholder","Enter Task");

    input.onkeyup = function(event){

        let text = this.value;

        if(event.key == "Enter"){
        
            if( text != ""){

                var listElem = document.createElement('li');
                listElem.classList.add('draggable');
                listElem.classList.add('task');
                listElem.setAttribute('draggable',true);
                initDraggable(listElem); // set the dragging classnames when dragged
                listElem.ondblclick = function(){
                    showForm(listElem);
                }


                var button = document.createElement('span');
                button.classList.add('closeButton');
                button.innerHTML= "&times;"
                button.onclick =function(){

                    deleteElem(this);
                }
                


                var span = document.createElement('span');
                span.classList.add('content');
                span.innerHTML = text;
             

                listElem.appendChild(span);
                listElem.appendChild(button);

                // we are in the grid-item next element sibling is UL taskplaceholder
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

// generates a JSON object based on a dashboard
function saveDashboard(){

    let output = {};
    output.categories = [];

    let taskHolders = document.getElementsByClassName("taskPlaceHolder");

    for(let i = 0 ; i < taskHolders.length; i++){

        output.categories.push(saveTasks(taskHolders[i]));
        
    }

    console.log(JSON.stringify(output));
    
}

//TODO finish
function saveTasks(taskPlaceHolder){

    let jsonTasks = {};

    jsonTasks.tasks = [];

    let tasks = taskPlaceHolder.children;

    for(let i = 0; i < tasks.length; i++){

        if(tasks[i].classList.contains("categoryTitle")){
            // saving the title of the category

            let catName = tasks[i].textContent;
            jsonTasks.categoryName = catName.slice(0,-1); // remove text of cross (last char)

        }

        if(tasks[i].classList.contains("task")){

            let jsonTask = {};
            let content = tasks[i].querySelector(".content");
            let note = tasks[i].getAttribute("data-note");

            jsonTask.taskDescription = content.textContent;
            jsonTask.note = note;
            jsonTasks.tasks.push(jsonTask);

        }
    }

    return jsonTasks;
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
    document.getElementById('Time').innerHTML = x.getHours() + "h " + x.getMinutes() +"m ";
    displayClock();
    
}

function colorElem(elem, color){
    elem.style.backgroundColor = color;
}


function showForm(listelem) { // timeForm for task elements

    var div = document.getElementById("popupTask");
    var form = document.getElementById("popupForm");
    var textArea = document.getElementById("popupNote");
    var taskNameForm = document.getElementById("taskName");

    var taskName = listelem.querySelector('.content').innerHTML;// accessing name of the task
    var noteData = listelem.getAttribute('data-note');// data of the note

    // we need to set a ref to the listElem we clicked

    document.getElementById("popupNote").value = noteData;// setting the value of the note to the one of this task

    taskNameForm.innerHTML = taskName;

    div.style.display = "block";
    form.style.display = "block";
    textArea.style.display = "block";

    currentTask = listelem;// setting reference to currentTask for the submit of the note
}
  
function closeTheForm() {
    
    var div = document.getElementById("popupTask");
    var form = document.getElementById("popupForm");
    var textArea = document.getElementById("popupNote");
    var taskNameForm = document.getElementById("taskName");

    // we need to set a ref to the listElem we clicked

    taskNameForm.innerHTML = "";
    div.style.display = "none";
    form.style.display = "none";
    textArea.style.display = "none";

    currentTask = null;// setting reference to currentTask  
    
}

function setNote(){

    let textAreaValue = document.getElementById("popupNote").value;

    currentTask.setAttribute('data-note', textAreaValue);

}







displayClockTime();







