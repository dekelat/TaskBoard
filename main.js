// Disable option to choose past dates
let today = new Date().toISOString().split('T')[0];
document.getElementById("dueDate").setAttribute('min', today);

let tasksList = new Array();
loadNotes();

function onSave() {
    let description = document.getElementById("taskDescription").value;
    let dueDate = document.getElementById("dueDate").value;
    let dueTime = document.getElementById("dueTime").value;
    let id = new Date().valueOf();

    let newTask = {
        id: id,
        description: description,
        dueDate: dueDate,
        dueTime: dueTime
    };

    try {
        validateTaskInput(newTask);
        tasksList.push(newTask);
        displayNote(newTask);
        saveNoteToModel();
        initializeNewTaskFields();
    }
    catch (e) {
        onFailedValidation(e);
    }
}

function validateTaskInput(newTask) {
    if (newTask.description == "") {
        document.getElementById("taskDescription").style.border = "red solid 5px";
        throw new Error("Please fill task description");
    }
    if (newTask.dueDate == "") {
        document.getElementById("dueDate").style.backgroundColor = "red";
        throw new Error("Please choose a due date");
    }
}

// Create a new note on the board with the task's details
function displayNote(task) {
    let newNote = document.createElement("div");
    newNote.classList.add("note");
    newNote.classList.add("fade-in");
    newNote.id = task.id;

    // Create delete Button
    let deleteButton = document.createElement("button");
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-times");
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", onDelete);
    deleteButton.append(deleteIcon);

    let taskDescription = document.createElement("p");
    taskDescription.classList.add("task");
    taskDescription.innerHTML = task.description;

    let dueTo = document.createElement("p");
    dueTo.innerHTML = task.dueDate;

    if (task.dueTime != "") {
        dueTo.innerHTML += "<br>" + task.dueTime;
    }

    newNote.append(deleteButton);
    newNote.append(taskDescription);
    newNote.append(dueTo);

    document.getElementById("notesSection").append(newNote);
}

function saveNoteToModel() {
    localStorage.setItem("notes", JSON.stringify(tasksList));
}

function initializeNewTaskFields() {
    let errorMessage = document.getElementById("errorMessage");
    errorMessage.classList.add("hide");

    let taskDescription = document.getElementById("taskDescription");
    taskDescription.style.border = "none";
    taskDescription.value = "";

    let date = document.getElementById("dueDate");
    date.style.backgroundColor = "white";
    date.value = "";

    document.getElementById("dueTime").value = "";
}

function onFailedValidation(e) {
    console.error(e);
    let errorMessage = document.getElementById("errorMessage");
    errorMessage.innerHTML = "<strong>Error! </strong>" + e.message;
    errorMessage.classList.remove("hide");
}

function onClear() {
    initializeNewTaskFields();
}

function loadNotes() {
    if (localStorage.getItem("notes") != null) {
        tasksList = JSON.parse(localStorage.getItem("notes"));

        for (let index = 0; index < tasksList.length; index++) {
            displayNote(tasksList[index]);
        }
    }
}

function onDelete(eventDetails) {
    let noteToDelete = eventDetails.currentTarget.parentElement;
    let notesSection = document.getElementById("notesSection");
    deleteTaskFromModel(noteToDelete.id);
    notesSection.removeChild(noteToDelete);
}

function deleteTaskFromModel(taskId) {
    for (let index = 0; index < tasksList.length; index++) {
        if (tasksList[index].id == taskId) {
            tasksList.splice(index, 1);
            saveNoteToModel();
            return;
        }
    }
}