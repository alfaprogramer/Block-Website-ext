document.getElementById('submitBtn').addEventListener('click', () => {
  const password = document.getElementById('passwordInput').value.trim();
  const urlParams = new URLSearchParams(window.location.search);
  const targetUrl = urlParams.get('targetUrl');

  chrome.storage.sync.get(['blockedSites'], (result) => {
    const site = result.blockedSites.find(site => targetUrl.includes(site.url));
    if (site && site.password === password) {
      chrome.runtime.sendMessage({ action: "unblockSite", url: site.url }, (response) => {
        if (response.success) {
          // Delay to ensure the rule is removed before navigating
          setTimeout(() => {
            window.location.href = `https://${site.url}`;
          }, 500);
        } else {
          alert('Error unblocking site');
        }
      });
    } else {
      alert('Incorrect password');
    }
  });
});
