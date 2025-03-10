//Imports..................
const readline = require('readline');
const fs = require("fs");

//CONSTANTS...............
const STATUS = {
    "TODO": "to-do",
    "IN_PROGRESS": "in-progress",
    "DONE": "done"
}

const COMMANDS = [
    "add-task",
    "update-task",
    "delete-task",
    "mark-in-progress",
    "mark-done",
    "list",
    "clear",
];

//GLOBAL VARIABLES................
let args = [];
let askAgain = true;

let myJsonData = [];

//Initial Setup......................................
InitialSetup();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function InitialSetup() {
    if (fs.existsSync('myData.json')) {
        let data = await fs.readFileSync("myData.json");
        myJsonData = JSON.parse(data);
        myJsonData.sort((a, b) => a.id - b.id);
    } else {
        await fs.writeFileSync('myData.json', '[]');
        myJsonData = [];
    }
}

//Main Function Where Whole App Resides...................................................
(function loop() {
    rl.question("command: ", (cmd) => {
        let isValid = isCommandValid(cmd);
        if (isValid) {
            if (cmd !== 'exit') {
                askAgain = true;
            } else {
                askAgain = false;
                rl.close()
                return;
            }
            //For Help Command..................................
            if (args[0] === 'help') {
                showCommandsList();
            }
            //Functionalities.............................................
            switch (args[1]) {
                case "add-task": addItem(giveTask(args, 2)); break;
                case "update-task": updateItem(args[2], giveTask(args, 3)); break;
                case "delete-task": deleteItem(args[2]); break;
                case "mark-in-progress": markInProgress(args[2]); break;
                case "mark-done": markDone(args[2]); break;
                case "list": listItems(args[2]); break;
                case "clear": clearData(); break;
            }

        }
        if (askAgain) loop();
    });
})();


//Gives Whole Task.....................................................
function giveTask(args, idx) {
    let str = '';
    for (let i = idx; i < args.length; i++) {
        for (let j = 0; j < args[i].length; j++) {
            str += args[i][j];
        }
        if ((i + 1) < args.length) str += ' ';
    }
    return str;
}

//Show Command List......................................................
function showCommandsList() {
    let str =
        `-------------------------------------------------------------------------------
| ==>exit - For Exiting the Program                                             |
| ==>task-cli - By using this you can start to use following functionalities    |
| -->add-task - You can add task.                                               |
|        - example: "task-cli add-task <task-description>"                      |   
| -->update-task - You can Update Particular Task.                              | 
|           - example: "task-cli update-task <id> <task-description>"           |
| -->delete-task - You can delete a Particular Task.                            |
|           - example: "task-cli delete-task <id>"                              |
| -->mark-in-progress - You can Mark a Task In Progress.                        |
|                     - example: "task-cli mark-in-progress <id>"               |
| -->mark-done - You can mark Done a particular Task.                           |
|              - example: "task-cli mark-done <id>"                             | 
| -->list - You can List Items and List With Status Filter                      |
|         - example: "task-cli list <status-filter-if-any>"                     |
| -->clear - You can Clear all the data or reset all the Data                   |
|          -example: "task-cli clear"                                           |
---------------------------------------------------------------------------------`;
    console.log(str);
}

//Check if Command is valid or Not...........................
function isCommandValid(cmd) {
    if (cmd === "") {
        console.log("Please Write Command!! or write 'help'");
        return true;
    }
    args = cmd.split(" ");

    for (let i = 0; i < args.length; i++) {
        if (i === 2) break;
        args[i] = args[i].toLowerCase();
    }

    if ((cmd !== "" && (args[0] !== "exit" && args[0] !== "task-cli" && args[0] !== 'help'))) {
        console.log("invalid Command!!");
        return false;
    } else if (args[0] === 'task-cli') {
        if (!args[1]) {
            console.log("Use Help so that you can utilize this command!!");
            return false;
        } else if ((args[1] && !COMMANDS.includes(args[1]))) {
            console.log("use help command to use correct functionality!!");
            return false;
        }
    } else if ((args[0] === 'help' || args[0] === 'exit') && (args[1])) {
        console.log("Invalid Arguments!!! No Arguments needed in this commands!!!");
        return false;
    }
    return true;
}

//Returns the id needed for CRUD OPS..........................
function getLastId() {
    let idd = 0;
    if (myJsonData.length === 0) {
        idd = 0;
    } else {
        idd = myJsonData[myJsonData.length - 1].id;
    }
    return idd;
}

//Adds The Item to the File as well as in current memory.......................
function addItem(item) {
    if (!item) {
        console.log("Please, Add task you want to add!!!");
        return;
    }
    let idNo = getLastId();
    let obj = {
        id: (++idNo),
        description: (`${item}`),
        status: STATUS.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    myJsonData.push(obj);
    try {
        writeDataInFile(myJsonData);
    } catch (e) {
        //reversing the Action...................
        console.log("cannot Update Data in Particular FIle");
        myJsonData.pop();
    }

    console.log(`Task Added Successfully ID:${idNo}`);
}

//Gives the Index of Particular Task.....................
function giveIndex(idNo) {
    return myJsonData.findIndex((item) => item.id === parseInt(idNo));
}

//Updates the particular Item in File as well as current memory................................
function updateItem(idNo, item) {
    if (!idNo) {
        console.log("Please mention id of task!!");
        return;
    } else if (!parseInt(idNo)) {
        console.log("Something's Wrong with IDNO");
        return;
    }
    if (!item) {
        console.log("Please, Add task you want to Update!!!");
        return;
    }
    let idx = giveIndex(idNo);
    if (idx === -1) {
        console.log("Task Not Found!!");
        return;
    }
    let oldDescription = myJsonData[idx].description;
    let lastUpdated = myJsonData[idx].updatedAt;

    myJsonData[idx].description = item;
    myJsonData[idx].updatedAt = new Date();

    try {
        writeDataInFile(myJsonData);
    } catch (e) {
        //reversing the Action....................
        console.log("cannot Update Data in Particular FIle");
        myJsonData[idx].description = oldDescription;
        myJsonData[idx].updatedAt = lastUpdated;
    }
    console.log(`Task Updated Successfully,ID:${idNo}`);
}

//Deletes the Particular Item in Data............................
function deleteItem(idNo) {
    if (!idNo) {
        console.log("Please Mention ID which You want to delete!!!");
        return;
    } else if (!parseInt(idNo)) {
        console.log("SOmething's Wrong with IDNO");
        return;
    }
    let idx = giveIndex(idNo);
    if (idx === -1) {
        console.log("Task Not Found!!");
        return;
    }
    let oldItem = myJsonData.slice(idx, idx + 1);
    myJsonData.splice(idx, 1);

    try {
        writeDataInFile(myJsonData);
    } catch (e) {
        //reversing the Action....................
        console.log("cannot Update Data in Particular FIle");
        myJsonData.push(oldItem);
        myJsonData.sort((a,b)=>a.id-b.id);
    }

    console.log(`Task Deleted Successfully,ID:${idNo}`);
}

// Marks in Progress a particular Task.............................
function markInProgress(idNo) {
    if (!idNo) {
        console.log("Mention id of task which you want to mark!!!");
        return;
    } else if (!parseInt(idNo)) {
        console.log("SOmething's Wrong with IDNO");
        return;
    }
    let idx = giveIndex(idNo);
    if (idx === -1) {
        console.log("Task Not Found!!");
        return;
    }
    let oldStatus = myJsonData[idx].status;
    myJsonData[idx].status = STATUS.IN_PROGRESS;
    try {
        writeDataInFile(myJsonData);
    } catch (e) {
        //reversing the Action....................
        console.log("cannot Update Data in Particular FIle");
        myJsonData[idx].status = oldStatus;
    }
    console.log(`Task marked as InProgress Successfully,ID:${idNo}`);
}

//Marks Done a Particular Task.......................................
function markDone(idNo) {
    if (!idNo) {
        console.log("Mention id Which You want to mark!!");
        return;
    } else if (!parseInt(idNo)) {
        console.log("SOmething's Wrong with IDNO");
        return;
    }
    let idx = giveIndex(idNo);
    if (idx === -1) {
        console.log("Task Not Found!!");
        return;
    }
    let oldStatus = myJsonData[idx].status;
    myJsonData[idx].status = STATUS.DONE;
    try {
        writeDataInFile(myJsonData);
    } catch (e) {
        //reversing the Action....................
        console.log("cannot Update Data in Particular FIle");
        myJsonData[idx].status = oldStatus;
    }
    console.log(`Task marked as Done Successfully,ID:${idNo}`);
}

//List Items if it has a filter or not.................................
function listItems(fil) {
    let tmp_data = [];

    if (fil !== undefined) {
        if (checkIfFilValid(fil)) {
            tmp_data = myJsonData.filter((item) => item.status === fil);
        } else {
            console.log("Filter is Not Valid!!!");
            return;
        }
    } else {
        tmp_data = myJsonData;
    }

    console.log(tmp_data);
}

//Check if Filter is Valid or not....................................
function checkIfFilValid(fil) {
    let vals = Object.values(STATUS);
    if (vals.includes(fil))
        return true;
    return false;
}

//Write a Data to File....................................
function writeDataInFile(jsonObj) {
    let data = JSON.stringify(jsonObj);
    // await new Promise((resolve,reject)=>{
    fs.writeFileSync("myData.json", data);
    // });
}

//Clears All the Data to Particular FIle.....................
function clearData() {
    let oldData = myJsonData;
    myJsonData = [];
    try {
        writeDataInFile(myJsonData);
    } catch (e) {
        //reversing the Action....................
        console.log("cannot Update Data in Particular FIle");
        myJsonData = oldData;
    }
    console.log("Data Cleared Successfully");
}
