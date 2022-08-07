
var lastSavedPlan = {"categories":[{"tasks":[{"taskDescription":"Buy lemons","note":null},{"taskDescription":"Buy thyme","note":null},{"taskDescription":"Buy toilet paper","note":null}],"categoryName":"groceries"},{"tasks":[{"taskDescription":"Study CSS","note":"Study it this way"},{"taskDescription":"Study HTML","note":null},{"taskDescription":"Study JS","note":null}],"categoryName":"school"},{"tasks":[{"taskDescription":"BJJ","note":"Don't forget water"},{"taskDescription":"Volleyball","note":"Don't forget towel"}],"categoryName":"sports"}]};


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
    xmlRequest.send(JSON.stringify(output));

    // 

    // TODO save it to backend . For now save in lastSavedPlan
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