// function createContextMenus (){
    
// }
let seconds = 0;

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(++seconds);
});

function createAlarm(name) {
  chrome.alarms.create(
    name,
    {
      periodInMinutes: 1 / 60,
    },
  );
}



chrome.contextMenus.create({
    id: "start-timer",
    title: "Start timer",
    contexts: ["all"]
});
chrome.contextMenus.create({
    id: "reset-timer",
    title: "Reset timer",
    contexts: ["all"]
});
chrome.contextMenus.onClicked.addListener(function(info, tab){
    switch (info.menuItemId) {
      case "start-timer":
        createAlarm("productivity-clock");
            break;

      default:
        break;
    }
});

// chrome.runtime.onInstalled.addListener(function(details){
//     if(details.reason == "install"){
//         createContextMenus();
//     }  
    // else if(details.reason == "update"){
    //     //call a function to handle an update
    // }
// });