/*eslint-env es6*/

// TODO

// Start with the login page 
// Make a dummy data. fill it in the database and make the load buttton to load a planning
// Make a save planning function ( should e able to specify for a date)
// Make login form and database for it 
// Make export planning

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

            //console.log(tasks[i].textContent);

            jsonTasks.categoryName = tasks[i].textContent; // should be the content of the span within


        }



        if(tasks[i].classList.contains("task")){

            let jsonTask = {};

            console.log(tasks[i]);
            console.log(tasks[i].children);

            let content = tasks[i].children;
            

            for(let j = 0 ; j < content.length; j++){

                console.log(content[j].classList);

                if(content[j].classList.contains("content")){

                    jsonTask.taskDescription = content[j].textContent;
                    jsonTasks.tasks.push(jsonTask);
        

                }

            }
        }
    }

    console.log(JSON.stringify(jsonTasks));
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
    document.getElementById('Time').innerHTML = x.getHours() + "h " + x.getMinutes() +"m " +x.getSeconds() +"s";
    displayClock();
    
}

function colorElem(elem, color){
    elem.style.backgroundColor = color;
}


function showForm(listelem) { // timeForm for task elements

    var div = document.getElementById("popupTask");
    var form = document.getElementById("popupForm");
    var textArea = document.getElementById("popupNote");

    div.style.display = "block";
    form.style.display = "block";
    textArea.style.display = "block";
  
}
  
function closeTheForm() {
    
  document.getElementById("popupForm").style.display = "none";
    
}







displayClockTime();







