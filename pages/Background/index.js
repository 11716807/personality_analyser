// On extension install, open side panel
chrome.runtime.onInstalled.addListener(() => {
  console.log('[PsyGenie] [Background] [INFO] Extension installed');
  chrome.sidePanel.setOptions({
    enabled: true,
  });
});

let ports = {};

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'psygenie-content') {
    // Generate unique ID for content script ports for each injected content scripts
    const portId = `psygenie-content-${Date.now()}-${Math.random()}`;
    ports[portId] = port;
  } else {
    ports[port.name] = port;
  }

  port.onDisconnect.addListener(() => {
    Object.entries(ports).forEach(([id, p]) => {
      if (p === port) {
        delete ports[id];
      }
    });
  });

  port.onMessage.addListener((message) => {
    if (message.type === 'OPEN_SIDE_PANEL') {
      chrome.windows.getCurrent((window) => {
        chrome.sidePanel.open({ windowId: window.id });
      });
    }
    if (message.type === 'GET_SCREEN') {
      if (ports['home']) {
        ports['home'].postMessage({
          type: 'GET_SCREEN',
          data: {
            text: message.text,
            event: message.event,
          },
        });
      } else {
        Object.entries(ports).forEach(([name, targetPort]) => {
          if (name.startsWith('psygenie-content')) {
            targetPort.postMessage({
              type: 'GET_SCREEN_RESPONSE',
              text: message.text,
              event: message.event,
              screen: 'bot',
            });
          }
        });
      }
    } else if (message.type === 'GET_SCREEN_RESPONSE') {
      Object.entries(ports).forEach(([name, targetPort]) => {
        if (name.startsWith('psygenie-content')) {
          targetPort.postMessage({
            type: message.type,
            text: message.data.text,
            event: message.data.event,
            screen: message.screen,
            channel: message.channel,
          });
        }
      });
    } else if (message.type === 'PSYGENIE_CHANNEL_MESSAGE_EVENT') {
      // Open side panel
      chrome.windows.getCurrent((window) => {
        chrome.sidePanel.open({ windowId: window.id }).then(() => {
          // Forward message to assistant panel
          if (ports['assistant-panel']) {
            console.log('[PsyGenie] [Background] [DEBUG] Forwarding message to assistant panel');
            ports['assistant-panel'].postMessage(message);
          }

          // Send success response back to content script
          port.postMessage({ type: 'PSYGENIE_CHANNEL_MESSAGE_ADDED' });
        });
      });
    } else if (message.type === 'PSYGENIE_ADD_MESSAGE_EVENT') {
      // Open side panel
      chrome.windows.getCurrent((window) => {
        chrome.sidePanel.open({ windowId: window.id }).then(() => {
          // First delay for panel opening animation
          setTimeout(() => {
            // Send message to home component to switch to bot screen
            if (ports['home']) {
              ports['home'].postMessage({ type: 'SWITCH_TO_BOT_SCREEN' });

              // Second delay for bot view to render
              setTimeout(() => {
                // Forward message to bot panel after bot view is ready
                if (ports['bot-panel']) {
                  console.log('[PsyGenie] [Background] [DEBUG] Forwarding message to bot panel');
                  ports['bot-panel'].postMessage(message);
                }

                // Send success response back to content script
                port.postMessage({ type: 'PSYGENIE_MESSAGE_ADDED' });
              }, 500); // 500ms delay for bot view to render
            }
          }, 500); // 500ms delay for panel opening animation
        });
      });
    }
  });

  port.onDisconnect.addListener(() => {
    console.log('[PsyGenie] [Background] [INFO] Port disconnected:', port.name);
    delete ports[port.name];
  });
});

// Add this to keep service worker alive
const keepAlive = () => {
  chrome.runtime.getPlatformInfo(() => {});
  setTimeout(keepAlive, 20000);
};
keepAlive();

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});
