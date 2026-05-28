/**
 * Content script for PsyGenie Bot integration
 *
 * This script is injected into web pages to detect user interactions
 * and execute PsyGenie functionality. It monitors conversations and
 * provides psychological insights and communication assistance.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import HighlightPopup from '../../containers/HighlightPopup/HighlightPopup';

console.log('[PsyGenie] [Bot Content] [INFO] Loaded.');

const frameContext = {
  url: window.location.href,
  isIframe: window !== window.top,
  frameId: `frame_${Date.now()}_${Math.random()}`,
};

const container = document.createElement('div');
container.id = 'psygenie-highlight-container';
container.setAttribute('data-frame-id', frameContext.frameId);
container.style.position = 'fixed';
container.style.top = '0';
container.style.left = '0';
container.style.width = '100%';
container.style.height = '100%';
container.style.zIndex = '2147483640';
document.body.appendChild(container);

const root = createRoot(container);

function trimText(text, maxLength = 10000) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function displayBotButton(event, selectedText) {
  root.render(
    <React.StrictMode>
      <HighlightPopup
        name="Add Message"
        icon={<FontAwesomeIcon icon={faPlus} />}
        position={{
          x: event.clientX + window.scrollX,
          y: event.clientY + window.scrollY + 10,
        }}
        onClick={async () => {
          if (clearButtonTimeout) {
            clearTimeout(clearButtonTimeout);
          }
          clearButtonTimeout = setTimeout(clearSelectionAndButton, 5000); // clear after 5 seconds in case something fails.
          try {
            port.postMessage({
              type: 'PSYGENIE_ADD_MESSAGE_EVENT',
              message: trimText(selectedText, 1000),
            });
          } catch (error) {
            console.error('[PsyGenie] [Bot Content] [ERROR]', error);
          }
        }}
      />
    </React.StrictMode>
  );
}

function displayChannelMessageButton(event, selectedText, channel) {
  const channelDisplayName = channel?.channelName || 'Add to Channel';
  root.render(
    <React.StrictMode>
      <HighlightPopup
        name={`${channelDisplayName}`}
        icon={<FontAwesomeIcon icon={faArrowRight} />}
        position={{
          x: event.clientX + window.scrollX,
          y: event.clientY + window.scrollY + 10,
        }}
        onClick={async () => {
          if (clearButtonTimeout) {
            clearTimeout(clearButtonTimeout);
          }
          clearButtonTimeout = setTimeout(clearSelectionAndButton, 5000); // clear after 5 seconds in case something fails.
          try {
            port.postMessage({
              type: 'PSYGENIE_CHANNEL_MESSAGE_EVENT',
              message: trimText(selectedText),
            });
          } catch (error) {
            console.error('[PsyGenie] [Bot Content] [ERROR]', error);
          }
        }}
      />
    </React.StrictMode>
  );
}

function clearSelectionAndButton() {
  window.getSelection().removeAllRanges();
  root.render(null);
  clearButtonTimeout = null;
}

// Connect to extension
const port = chrome.runtime.connect({ name: 'psygenie-content' });
console.log('[PsyGenie] [Bot Content] [INFO] Connected to extension');

// Track timeouts
let clearButtonTimeout = null;

port.onMessage.addListener((response) => {
  console.log('[PsyGenie] [Bot Content] [INFO] Received message:', response);

  if (response.type === 'PSYGENIE_MESSAGE_ADDED' || response.type === 'PSYGENIE_CHANNEL_MESSAGE_ADDED') {
    clearSelectionAndButton();
  } else if (response.type === 'GET_SCREEN_RESPONSE' && response.text && response.event) {
    const responseFrameId = response.event.frameContext?.frameId;
    if (responseFrameId !== frameContext.frameId) {
      return;
    }

    if (response.screen === 'channels' && response.channel) {
      displayChannelMessageButton(response.event, response.text, response.channel);
    } else {
      displayBotButton(response.event, response.text);
    }
  }
});

document.addEventListener('mouseup', async (event) => {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText) {
    port.postMessage({
      type: 'OPEN_SIDE_PANEL',
    });
    const eventData = {
      type: event.type,
      screenX: event.screenX,
      screenY: event.screenY,
      clientX: event.clientX,
      clientY: event.clientY,
      frameContext: {
        frameId: frameContext.frameId,
        url: frameContext.url,
        isIframe: frameContext.isIframe,
      },
    };

    port.postMessage({
      type: 'GET_SCREEN',
      text: selectedText,
      event: eventData,
    });
  } else {
    root.render(null);
  }
});
