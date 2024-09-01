document.getElementById('setTimerBtn').addEventListener('click', () => {
    const minutes = document.getElementById('minutesInput').value;
    if (minutes && !isNaN(minutes) && minutes > 0) {
        chrome.storage.local.set({ timerDuration: parseInt(minutes) }, () => {
            document.getElementById('message').innerText = `Timer set to ${minutes} minutes.`;
            chrome.runtime.sendMessage({ action: "updateTimer", minutes: parseInt(minutes) });
        });
    } else {
        document.getElementById('message').innerText = "Please enter a valid number of minutes.";
    }
});
