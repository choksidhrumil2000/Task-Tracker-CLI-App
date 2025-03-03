const readline = require('readline');
// const data = require('./myData.js');
const fs = require("fs");

let data = fs.readFileSync("myData.json");
let myJsonData = JSON.parse(data);

const STATUS = {
    "TODO":"to-do",
    "INPROGRESS":"in-progress",
    "DONE":"done"
}

const COMMANDS = [
    "add",
    "update",
    "delete",
    "mark-in-progress",
    "mark-done",
    "list",
    "clear",
];

let id = 1;
let command = "exit";
let args = [];
let askAgain = false;

// const arguments = process.argv;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// rl.question('Command: ', (input) => {
//     if(isCommandValid(input)){
//         command = input;
//     }else{
//         command = "invalid command";
//     }
//     rl.close();
// });
// while(command !== "exit"){
        
//         rl.question('Command: ', (input) => {
//             if(isCommandValid(input)){
//                 command = input;
//             }else{
//                 command = "invalid Command";   
//             }
//         rl.close();
//         });   

// }

(function loop() {
  rl.question("command: ", (cmd) => {
    const isValid = isCommandValid(cmd);
    if(isValid){
        if(cmd !== 'exit'){
            askAgain = true;
        }else{
            askAgain = false;
            rl.close()
            return;
        }

        switch(args[1]){
            case "add": addItem(args[2]);break;
            case "update": updateItem(args[2], args[3]); break;
            case "delete":deleteItem(args[2]);break;
            case "mark-in-progress":markInProgress(args[2]);break;
            case "mark-done":markDone(args[2]);break;
            case "list":listItems(args[2]);break;
            case "clear":clearData();break;
        }
        if (askAgain) loop();
        // else rl.close();
    }
  });
})();


function isCommandValid(cmd) {
    args = cmd.split(" ");
    if(!cmd && (args[0] !== "exit" && args[0] !== "task-cli") ||(args[1] && !COMMANDS.includes(args[1]))){
        console.log("invalid Command!!");
        return false;
    }
    return true;
}



function getId(){
    if(myJsonData.length === 0){
        id = 1;
    }else{
        id = myJsonData[myJsonData.length-1].id+1;
    }
    return id;
}

function addItem(item) {
    let obj = {
        id:getId(),
        description:item,
        status:STATUS.TODO,
        createdAt:new Date(),
        updatedAt:new Date(),
    }
    
    myJsonData.push(obj);
    writeDataInFile(myJsonData);
    
    // data.push(obj);
    // console.log(data);
    console.log(`Task Added Successfully ID:${id}`);
    // getId()++;   
}

function giveIndex(id) {
    return myJsonData.findIndex((item)=>item.id === parseInt(id));
}

function updateItem(id,item) {
    let idx = giveIndex(id);
    if(idx === -1){
        console.log("Task Not Found!!");
        return;
    }
    myJsonData[idx].description = item;
    myJsonData[idx].updatedAt = new Date();
    writeDataInFile(myJsonData);

    console.log(`Task Updated Successfully,ID:${id}`);
}

function deleteItem(id) {
    let idx = giveIndex(id);
    if(idx === -1){
        console.log("Task Not Found!!");
        return;
    }
    myJsonData.splice(idx,1);

    writeDataInFile(myJsonData);

    console.log(`Task Deleted Successfully,ID:${id}`);
}

function markInProgress(id) {
    let idx = giveIndex(id);
    if(idx === -1){
        console.log("Task Not Found!!");
        return ;
    }
    myJsonData[idx].status = STATUS.INPROGRESS;
    writeDataInFile(myJsonData);
    console.log(`Task marked as MarkInProgress Successfully,ID:${id}`);
}

function markDone(id) {
    let idx = giveIndex(id);
    if(idx === -1){
        console.log("Task Not Found!!");
        return ;
    }
    myJsonData[idx].status = STATUS.DONE;
    writeDataInFile(myJsonData);
    console.log(`Task marked as Done Successfully,ID:${id}`);
}

function listItems(fil) {
    let tmp_data = [];
    // console.log(fil);
    if(fil !== undefined){
        tmp_data = myJsonData.filter((item)=>item.status === fil);
    }else{
        tmp_data = myJsonData;
    }
    console.log(tmp_data);
}

function writeDataInFile(jsonObj){
    let data = JSON.stringify(jsonObj);
    fs.writeFile("myData.json", data, (err) => {
        // Error checking
        if (err) throw err;
        // console.log("New data added");
    });
}

function clearData(){
    myJsonData = [];
    writeDataInFile(myJsonData);
    console.log("Data Cleared Successfully");

}
