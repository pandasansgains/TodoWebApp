function openSaveForm(){

    //form to chose date when we save 
    // give error for saving when not logged in
    
    document.getElementById("savePopup").style.display = "block";

}

function showForm(listelem) { // timeForm for task elements

    var div = document.getElementById("popupTask");
    var form = document.getElementById("popupForm");
    var textArea = document.getElementById("popupNote");
    var taskNameForm = document.getElementById("taskName");

    var taskName = listelem.querySelector('.font').innerHTML;// accessing name of the task
    var noteData = listelem.getAttribute('data-note');// data of the note

    // we need to set a ref to the listElem we clicked

    document.getElementById("popupNote").value = noteData;// setting the value of the note to the one of this task

    taskNameForm.innerHTML = taskName;

    div.style.display = "block";
    textArea.style.display = "block";


    console.log(textArea.value);

    if(textArea.value === ""){

        let text = "";

        for(let i = 0; i < 18; i++ ){// amount of visible lines until next /n

            text += "\n";
        }
        textArea.value = text;
    }

    currentTask = listelem;// setting reference to currentTask for the submit of the note
}
  
function closeNoteForm() {
    console.log("called");
    
    var div = document.getElementById("popupTask");

    var taskNameForm = document.getElementById("taskName");

    // we need to set a ref to the listElem we clicked
    taskNameForm.innerHTML = "";

    div.style.display ="none";

    currentTask = null;// setting reference to currentTask  
    
}

function closeTheForm(button){

   
    form = button.parentElement;
    div = form.parentElement;

    console.log(div);
    div.style.display = "none";


}