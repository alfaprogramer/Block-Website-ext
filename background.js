chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedSites: [] });
  updateBlockedSitesRules([]);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockedSites) {
    updateBlockedSitesRules(changes.blockedSites.newValue);
  }
});

function updateBlockedSitesRules(blockedSites) {
  console.log("Updating rules with blocked sites: ", blockedSites);

  const rules = blockedSites.map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: "redirect", redirect: { extensionPath: `/blocked.html?targetUrl=${site.url}` } },
    condition: { urlFilter: `*://${site.url}/*`, resourceTypes: ["main_frame"] }
  }));

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: Array.from({ length: 1000 }, (_, index) => index + 1),
    addRules: rules
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error updating rules: ", chrome.runtime.lastError);
    } else {
      console.log("Rules updated successfully");
      chrome.declarativeNetRequest.getDynamicRules((rules) => {
        console.log("Current dynamic rules: ", rules);
      });
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "unblockSite") {
    chrome.storage.sync.get(['blockedSites'], (result) => {
      const blockedSites = result.blockedSites || [];
      const updatedSites = blockedSites.filter(site => site.url !== message.url);
      chrome.storage.sync.set({ blockedSites: updatedSites }, () => {
        updateBlockedSitesRules(updatedSites);
        sendResponse({ success: true });
      });
    });
    return true; // Will respond asynchronously
  }
});
