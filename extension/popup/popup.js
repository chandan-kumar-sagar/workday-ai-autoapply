document
  .getElementById('startBtn')
  .addEventListener('click', async () => {
    const [tab] =
      await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

    chrome.tabs.sendMessage(tab.id, {
      action: 'START_AUTOFILL',
    });
  });