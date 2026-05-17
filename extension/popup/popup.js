document.addEventListener('DOMContentLoaded', async () => {
  const backendInput = document.getElementById('backendUrlInput');
  const saveBtn = document.getElementById('saveBtn');
  const startBtn = document.getElementById('startBtn');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  // Load saved custom backend URL
  const data = await chrome.storage.local.get('customBackendUrl');
  const activeUrl = data.customBackendUrl || 'https://workday-ai-autoapply.onrender.com';
  backendInput.value = data.customBackendUrl || '';

  // Ping backend to check status
  async function checkConnection(url) {
    statusDot.className = 'status-dot';
    statusDot.style.backgroundColor = '#eab308'; // Amber for checking
    statusDot.style.boxShadow = '0 0 8px #eab308';
    statusText.innerText = 'Connecting...';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const resJson = await response.json();
        if (resJson && resJson.message === 'Workday AI Auto Apply API') {
          statusDot.className = 'status-dot connected';
          statusDot.style.backgroundColor = ''; // Use CSS default success color
          statusDot.style.boxShadow = '';
          statusText.innerText = 'Connected';
          return;
        }
      }
      throw new Error('Invalid response');
    } catch (e) {
      statusDot.className = 'status-dot';
      statusDot.style.backgroundColor = '#ef4444'; // Red for offline
      statusDot.style.boxShadow = '0 0 8px #ef4444';
      statusText.innerText = 'Offline';
    }
  }

  // Initial connection check on opening popup
  checkConnection(activeUrl);

  // Save backend URL
  saveBtn.addEventListener('click', async () => {
    let url = backendInput.value.trim();
    if (url && url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    
    // Save to chrome storage
    await chrome.storage.local.set({ customBackendUrl: url });
    
    // Verify connection immediately
    checkConnection(url || 'https://workday-ai-autoapply.onrender.com');
  });

  // Start autofill triggered from popup button
  startBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'START_AUTOFILL',
      });
    }
  });
});