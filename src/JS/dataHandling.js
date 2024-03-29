
var currentLoadedDashboard = null;
var availablePlannings = null;// available plannings if logged in 

// generates a JSON object based on a dashboard


function saveDashboard(date){
    // called when press submit of the calendar

    // let dateObj = myCalender.value;
    // let dateString = dateConverterObj(dateObj);


    let dateString = date;

    // TODO add date to JSOn object
    let output = {};
    output.categories = [];
    output.date = dateString;

    let taskHolders = document.getElementsByClassName("taskPlaceHolder");

    for(let i = 0 ; i < taskHolders.length; i++){

        output.categories.push(saveTasks(taskHolders[i]));
        
    }
    console.log(JSON.stringify(output));


    var xmlRequest = new XMLHttpRequest();
    xmlRequest.open("post","/planning", true);
    xmlRequest.setRequestHeader('content-type', 'application/json');

    xmlRequest.onreadystatechange = function(){// TODO investigate but never triggered as we do not send response seemingly
        if (xmlRequest.readyState == 4 && xmlRequest.status == 200) { // succesfull
            alert(xmlRequest.responseText);
           
        }
    }

    xmlRequest.send(JSON.stringify(output));
}



function logout(){

    var xmlRequest = new XMLHttpRequest();
    xmlRequest.open("post","/logout", true);
    xmlRequest.setRequestHeader('content-type', 'text/plain');

    xmlRequest.onreadystatechange = function(){
        if (xmlRequest.readyState == 4 && xmlRequest.status == 200) { // succesfull

            location.reload(true);// refresh page
        }
    }
    xmlRequest.send();

}




function getPlannings(refreshCalendar){

    var xmlRequest = new XMLHttpRequest();

    xmlRequest.onreadystatechange = function(){
        if (xmlRequest.readyState == 4 && xmlRequest.status == 200) { // succesfull

            // plannings are received
    

            let jsonData = JSON.parse(xmlRequest.responseText);

            availablePlannings = jsonData;

            if(refreshCalendar == true){
                console.log("calling refresh");
                colorCalendarDelayed();
            }


            //[{"date":"2022-08-01"},{"date":"2022-08-06"}] response text
    
        }
    }

    xmlRequest.open("get","/plannings", true);
    xmlRequest.send();

}


// function called in onclick of links with date calls loadDashboard
function getPlanning(date){


    var xmlRequest = new XMLHttpRequest();

    xmlRequest.onreadystatechange = function(){
        if (xmlRequest.readyState == 4 && xmlRequest.status == 200) { // succesfull

            // plannings are received
    
            let jsonData = JSON.parse(xmlRequest.responseText);

            // when received loadDahsboard


            // setCurrentDashboard
            setCurrentlyLoaded(date);
            loadDashboard(jsonData);

           
    
        }
    }

    xmlRequest.open("get","/plannings/" + date, true);
    xmlRequest.send();

}


function deletePlanning(date){

    var xmlRequest = new XMLHttpRequest();

    xmlRequest.onreadystatechange = function(){
        if (xmlRequest.readyState == 4 && xmlRequest.status == 200) { // succesfull

            // plannings are received
    
            alert("deleted");
            // when done
            colorCalendarDelayed();
           
    
        }
    }

    xmlRequest.open("post","/plannings/" + date, true);
    xmlRequest.send();

}

//TODO finish
function saveTasks(taskPlaceHolder){

    let jsonTasks = {};

    jsonTasks.tasks = [];

    let tasks = taskPlaceHolder.children;

    //TODO later investigate but we can replace by querySelector

    for(let i = 0; i < tasks.length; i++){

        if(tasks[i].classList.contains("categoryTitle")){
            // saving the title of the category

            let catName = tasks[i].textContent;
            jsonTasks.categoryName = catName.slice(0,-1); // remove text of cross (last char)

        }

        if(tasks[i].classList.contains("task")){

            let jsonTask = {};
            let content = tasks[i].querySelector(".font");
            let note = tasks[i].getAttribute("data-note");

            jsonTask.taskDescription = content.textContent;
            jsonTask.note = note;
            jsonTasks.tasks.push(jsonTask);

        }
    }

    return jsonTasks;
}


//TODO replace loadDashboard
function loadDashboard(dashboardData){
    // will be given a date as input and then fetch the dashboard from backend


    // clear dashboard first

    clearDashboard();
    // set current dashboard to date

    let data = dashboardData;
    let map = new Map();// map catId -> categoryContainer

    Object.entries(data.categories).forEach((catObj)=>{// iterate over each category


        var containerID = catObj[1].categoryID;// categoryID to attach the tasks
        var container = createContainer(catObj[1].categoryName);

        //TODO fix this  (DATA is represented differently than before ex: from backend :)

        map.set(containerID, container);

    })


    Object.entries(data.tasks).forEach((taskList)=>{// tasks


        Object.entries(taskList[1]).forEach((task) =>{


            createTask(map.get(task[1].categoryId) , task[1].title, task[1].description);

        })
        
    })

}


