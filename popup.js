document.getElementById('blockBtn').addEventListener('click', () => {
    const urlInput = document.getElementById('urlInput').value;
    if (urlInput) {
      chrome.storage.sync.get(['blockedUrls'], (result) => {
        const blockedUrls = result.blockedUrls || [];
        blockedUrls.push(urlInput);
        chrome.storage.sync.set({ blockedUrls });
        document.getElementById('urlInput').value = '';
        showBlockedSites(blockedUrls);
      });
    }
  });
  
  document.getElementById('showBtn').addEventListener('click', () => {
    chrome.storage.sync.get(['blockedUrls'], (result) => {
      showBlockedSites(result.blockedUrls || []);
    });
  });
  
  function showBlockedSites(blockedUrls) {
    const list = document.getElementById('blockedSitesList');
    list.innerHTML = '';
    blockedUrls.forEach((url) => {
      const li = document.createElement('li');
      li.textContent = url;
      list.appendChild(li);
    });
  }
  