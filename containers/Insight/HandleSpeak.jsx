const speakNativeSSML = (ssml, selectedVoice, lang) => {
  try {
    const ssmlUtterance = new SpeechSynthesisUtterance();
    ssmlUtterance.voice = selectedVoice;
    ssmlUtterance.lang = lang;
    console.log('Using native SSML support with voice : ', ssmlUtterance.voice);
    ssmlUtterance.text = ssml;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(ssmlUtterance);
    return true;
  } catch (e) {
    console.log('Native SSML support test failed:', e);
    return false;
  }
};

const tryParseSSMLAndSpeak = (ssml, selectedVoice, lang) => {
  console.log('Parsing SSML');
  const parser = new DOMParser();
  const doc = parser.parseFromString(ssml, 'text/xml');
  const textContent = doc.documentElement.textContent.trim();
  const utterance = new SpeechSynthesisUtterance(textContent);
  utterance.voice = selectedVoice;
  utterance.lang = lang;

  try {
    const prosodyElement = doc.querySelector('prosody');
    if (prosodyElement) {
      const rate = prosodyElement.getAttribute('rate');
      const pitch = prosodyElement.getAttribute('pitch');
      // Convert SSML rate to number
      if (rate) {
        switch (rate) {
          case 'x-slow':
            utterance.rate = 0.5;
            break;
          case 'slow':
            utterance.rate = 0.7;
            break;
          case 'medium':
            utterance.rate = 1.0;
            break;
          case 'fast':
            utterance.rate = 1.3;
            break;
          case 'x-fast':
            utterance.rate = 1.5;
            break;
          default:
            if (rate.endsWith('%')) {
              utterance.rate = parseFloat(rate) / 100;
            }
        }
      }
      // Convert SSML pitch to number
      if (pitch) {
        switch (pitch) {
          case 'x-low':
            utterance.pitch = 0.5;
            break;
          case 'low':
            utterance.pitch = 0.7;
            break;
          case 'medium':
            utterance.pitch = 1.0;
            break;
          case 'high':
            utterance.pitch = 1.3;
            break;
          case 'x-high':
            utterance.pitch = 1.5;
            break;
          default:
            if (pitch.endsWith('%')) {
              utterance.pitch = parseFloat(pitch) / 100;
            }
        }
      }
    }
  } catch (e) {
    console.log('Error parsing SSML attributes:', e);
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

const handleSpeak = (ssml, lang) => {
  if (!ssml) return;
  // lang = lang || 'en-US';
  lang = 'en-US';

  const voices = window.speechSynthesis.getVoices();
  const selectedVoice =
    voices.find((voice) => voice.lang === lang) || // exact match with region
    (!lang.includes('-') && voices.find((voice) => voice.lang.startsWith(lang + '-'))) || // match any region if lang has no region
    voices.find((voice) => voice.lang === 'en-US') || // fallback to en-US
    voices[0]; // whatever first voice available

  // Try native SSML first, fallback to parsing if it fails
  if (!speakNativeSSML(ssml, selectedVoice, lang)) {
    tryParseSSMLAndSpeak(ssml, selectedVoice, lang);
  }
};

export default handleSpeak;
