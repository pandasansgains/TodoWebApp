
var lastSavedPlan = {"categories":[{"tasks":[{"taskDescription":"task1","note":"note 1"},{"taskDescription":"task2","note":""}],"categoryName":"Cat1"},{"tasks":[{"taskDescription":"nnn","note":"no text"}],"categoryName":"cat2"}],"date":"2022-08-31"};


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

function loadDashboard(jsonTasks){
    // will be given a date as input and then fetch the dashboard from backend


    console.log(lastSavedPlan);

    let data = lastSavedPlan;

    Object.entries(data.categories).forEach((catObj)=>{// iterate over each category

        console.log(catObj);
        var container = createContainer(catObj[1].categoryName);

        Object.entries(catObj[1].tasks).forEach((taskObj)=>{


            //console.log(container);

            console.log(taskObj[1].note)

            createTask(container, taskObj[1].taskDescription, taskObj[1].note);

        })

    })

}


