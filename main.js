const readline = require('readline');
const data = require('./myData.js');

const STATUS = {
    "TODO":"TODO",
    "INPROGRESS":"INPROGRESS",
    "DONE":"DONE"
}

const COMMANDS = [
    "add",
    "update",
    "delete",
    "mark-in-progress",
    "mark-done",
    "list",
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
            case "add": add(args[2]);break;
        }
        if (askAgain) loop();
        // else rl.close();
    }
  });
})();


function isCommandValid(cmd) {
    args = cmd.split(" ");
    if(args[0] !== "exit" && args[0] !== "task-cli" ||(args[1] && !COMMANDS.includes(args[1]))){
        console.log("invalid Command!!");
        return false;
    }
    return true;
}



function getId(){
    return id;
}

function add(item) {
    let obj = {
        id:getId(),
        description:item,
        status:STATUS.TODO,
        createdAt:new Date(),
        updatedAt:new Date(),
    }
    
    data.push(obj);
    console.log(`Task Added Successfully ID:${id}`);
    console.log(data);
    id++;   
}
