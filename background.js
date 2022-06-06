chrome.action.onClicked.addListener((tab) => {
    if (tab.url == 'https://dex.plutus.it/dashboard/pluton') {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['rewards.js']
        });
    } else if (tab.url == 'https://dex.plutus.it/dashboard/statements') {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['statement.js']
        });
    } 
});