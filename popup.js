document.getElementById('blockBtn').addEventListener('click', () => {
  const url = document.getElementById('urlInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();

  if (url && password) {
    chrome.storage.sync.get(['blockedSites'], (result) => {
      const blockedSites = result.blockedSites || [];
      blockedSites.push({ url, password });
      chrome.storage.sync.set({ blockedSites }, () => {
        console.log('Blocked sites updated:', blockedSites);
        updateBlockedSitesList();
        // Clear input fields after blocking
        document.getElementById('urlInput').value = '';
        document.getElementById('passwordInput').value = '';
        // Reload all tabs
        chrome.tabs.query({}, function(tabs) {
          tabs.forEach(tab => {
            chrome.tabs.reload(tab.id);
          });
        });
      });
    });
  }
});

document.getElementById('showBtn').addEventListener('click', () => {
  updateBlockedSitesList();
});

function updateBlockedSitesList() {
  chrome.storage.sync.get(['blockedSites'], (result) => {
    const blockedSites = result.blockedSites || [];
    const blockedSitesList = document.getElementById('blockedSitesList');
    blockedSitesList.innerHTML = '';

    blockedSites.forEach(site => {
      const listItem = document.createElement('li');
      listItem.textContent = site.url;
      blockedSitesList.appendChild(listItem);
    });
  });
}

// Initial call to populate the list
updateBlockedSitesList();
