
var lastSavedPlan = {"categories":[{"categoryName":"c1","categoryID":1,"dashboardId":1},{"categoryName":"c2","categoryID":2,"dashboardId":1},{"categoryName":"c3","categoryID":3,"dashboardId":1}],"tasks":[[{"description":"note 1\n","title":"t1","categoryId":1},{"description":"note 2","title":"t2","categoryId":1}],[{"description":"","title":"t1","categoryId":2},{"description":"","title":"t2","categoryId":2}],[]]};


// generates a JSON object based on a dashboard


function saveDashboard(){

    let datePicker = document.getElementById("selectDate");
    let date = datePicker.value;
    // TODO add date to JSOn object
    let output = {};
    output.categories = [];
    output.date = date;

    let taskHolders = document.getElementsByClassName("taskPlaceHolder");

    for(let i = 0 ; i < taskHolders.length; i++){

        output.categories.push(saveTasks(taskHolders[i]));
        
    }
    console.log(JSON.stringify(output));
    lastSavedPlan = JSON.stringify(output);// set it so we can try and laod the dashboard



    var xmlRequest = new XMLHttpRequest();
    xmlRequest.open("post","/planning", true);
    xmlRequest.setRequestHeader('content-type', 'application/json');

    xmlRequest.onreadystatechange = function(){
        if (xmlRequest.readyState == 4 && xmlRequest.status == 200) { // succesfull
            alert(xmlRequest.responseText);
        }
    }

    // TODO change to output after when done testing
    xmlRequest.send(JSON.stringify(output));

    // 

    // TODO save it to backend . For now save in lastSavedPlan
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

// placeHolder is the div that holds all the potential plannings in format dd/... ( dropdown-content)
function getPlannings(placeHolder){

    var xmlRequest = new XMLHttpRequest();

    xmlRequest.onreadystatechange = function(){
        if (xmlRequest.readyState == 4 && xmlRequest.status == 200) { // succesfull

            // plannings are received
    

            let jsonData = JSON.parse(xmlRequest.responseText);

            generateDropDown(jsonData, placeHolder);

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
            loadDashboard(jsonData);

           
    
        }
    }

    xmlRequest.open("get","/plannings/" + date, true);
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
            let content = tasks[i].querySelector(".content");
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


    let data = dashboardData;


    let map = new Map();// map catId -> categoryContainer

    Object.entries(data.categories).forEach((catObj)=>{// iterate over each category

        console.log(catObj);

        var containerID = catObj[1].categoryID;// categoryID to attach the tasks
        var container = createContainer(catObj[1].categoryName);

        //TODO fix this  (DATA is represented differently than before ex: from backend :)

        map.set(containerID, container);

    })


    Object.entries(data.tasks).forEach((taskList)=>{// tasks

        console.log(taskList);

        Object.entries(taskList[1]).forEach((task) =>{

            console.log(task[1]);

            createTask(map.get(task[1].categoryId) , task[1].title, task[1].description);

        })
        
    })

}


