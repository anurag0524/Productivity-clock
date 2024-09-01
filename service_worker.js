let defaultSeconds = 2 * 60;
let seconds = defaultSeconds;
let timerIsRunning = false;

chrome.alarms.onAlarm.addListener((alarm) => {
  if (seconds > 0) {
    seconds--;

    let badgeText;
    if (seconds >= 60) {
      badgeText = Math.floor(seconds / 60) + "M";
    } else {
      badgeText = seconds + "s";
    }

    chrome.action.setBadgeText(
      {
        text: badgeText,
      },
      () => {}
    );

    if (seconds < 60) {
      chrome.action.setBadgeBackgroundColor({ color: "red" }, () => {});
    }
  }

  if (seconds <= 0) {
    clearAlarm("productivity-clock");
    createNotification(
      "Great job so far! How about a short break to recharge? You’ve earned it!"
    );
    chrome.contextMenus.update("start-timer", {
      title: "Start timer",
      contexts: ["all"],
    });
    chrome.action.setBadgeText(
      {
        text: "",
      },
      () => {}
    );
    chrome.action.setBadgeBackgroundColor({ color: "yellow" }, () => {});
    timerIsRunning = false;
    seconds = defaultSeconds; // Reset the timer
  }
});

function createAlarm(name) {
  chrome.alarms.create(name, {
    periodInMinutes: 1 / 60, // Set alarm for every second
  });
}

function clearAlarm(name) {
  chrome.alarms.clear(name, (wasCleared) => {
    console.log("Alarm cleared:", wasCleared);
  });
}

function createNotification(message) {
  const opt = {
    type: "basic",
    title: "Productivity Clock",
    message: message,
    iconUrl: "images/clock-3-128.png",
  };

  chrome.notifications.create(opt);
}

chrome.contextMenus.create({
  id: "start-timer",
  title: "Start timer",
  contexts: ["all"],
});

chrome.contextMenus.create({
  id: "reset-timer",
  title: "Reset timer",
  contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  switch (info.menuItemId) {
    case "start-timer":
      if (timerIsRunning) {
        clearAlarm("productivity-clock");
        createNotification("Your timer has paused");
        chrome.contextMenus.update("start-timer", {
          title: "Resume timer",
          contexts: ["all"],
        });
        timerIsRunning = false;
        chrome.action.setBadgeText(
          {
            text: "||",
          },
          () => {}
        );
        chrome.action.setBadgeBackgroundColor({ color: "yellow" }, () => {});
      } else {
        createNotification("Your timer has started");
        timerIsRunning = true;
        createAlarm("productivity-clock");
        chrome.contextMenus.update("start-timer", {
          title: "Pause timer",
          contexts: ["all"],
        });
        chrome.action.setBadgeBackgroundColor({ color: "green" }, () => {});
      }
      break;

    case "reset-timer":
      clearAlarm("productivity-clock");
      seconds = defaultSeconds; // Reset to default timer duration
      timerIsRunning = false;
      chrome.contextMenus.update("start-timer", {
        title: "Start timer",
        contexts: ["all"],
      });
      createNotification("Timer has been reset to 25 minutes");
      chrome.action.setBadgeText(
        {
          text: "",
        },
        () => {}
      );
      break;

    default:
      break;
  }
});

chrome.action.setBadgeBackgroundColor({ color: "red" }, () => {});
