chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedUrls: [] });
  updateBlockedSitesRules([]);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockedUrls) {
    updateBlockedSitesRules(changes.blockedUrls.newValue);
  }
});

function updateBlockedSitesRules(blockedUrls) {
  const rules = blockedUrls.map((url, index) => ({
    "id": index + 1,
    "priority": 1,
    "action": { "type": "block" },
    "condition": { "urlFilter": `*://${url}/*`, "resourceTypes": ["main_frame"] }
  }));
  
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: blockedUrls.map((_, index) => index + 1),
    addRules: rules
  });
}
