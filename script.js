(() => {
  const canvas = document.getElementById('chatCanvas');
  const ctx = canvas.getContext('2d');
  const categoryDropdown = document.getElementById('categoryDropdown');
  const currentCategorySpan = document.getElementById('currentCategory');
  const suggestionBar = document.getElementById('suggestionBar');
  const scrollLeftBtn = document.getElementById('scrollLeft');
  const scrollRightBtn = document.getElementById('scrollRight');
  const inputBox = document.getElementById('inputCanvas');
  const sendBtn = document.getElementById('sendBtn');

  const chatWidth = canvas.width;
  const chatHeight = canvas.height;
  const bubbleMaxWidth = chatWidth * 0.75;
  const lineHeight = 22;
  const bubbleRadius = 16;
  const paddingH = 12;
  const paddingV = 8;

  let messages = [];
  let scrollOffset = 0;
  let currentCategory = 'whatsapp';

  const faqData = {
    whatsapp: {
      "how to send a photo": "Open chat → 📎 → Gallery → Pick photo → Send.",
      "how to make a voice call": "Open chat → Phone icon → Call.",
      "how to create a group": "3-dots → New Group → Add participants → Create.",
      "how to delete a message": "Long press message → Delete → Choose option.",
      "how to backup chats": "Settings → Chats → Chat backup → Backup now."
    },
    gpay: {
      "how to link bank account": "GPay → Profile → Add Bank → Verify with OTP.",
      "how to scan qr & pay": "Open GPay → Scan & Pay → Camera → Enter amount → Pay.",
      "how to check transaction history": "GPay → See all payment activity.",
      "how to request money": "GPay → Contact → Request → Enter amount → Request.",
      "how to add money to wallet": "Gpay → Add Money → Enter amount → Pay."
    },
    maps: {
      "how to search a location": "Maps → Search bar → Enter location → Tap result.",
      "how to start navigation": "Maps → Directions → Start.",
      "how to download offline maps": "Maps → Profile → Offline Maps → Select area → Download.",
      "how to share location": "Maps → Profile → Location sharing → Share.",
      "how to check traffic updates": "Maps → Traffic layer → View live updates."
    },
    phone: {
      "how to install an app": "Play Store → Search App → Install → Open.",
      "how to update an app": "Play Store → My Apps → Update.",
      "how to take a screenshot": "Press Power + Volume Down.",
      "how to clear cache": "Settings → Storage → Cached data → Clear.",
      "how to restart the phone": "Power button → Restart."
    },
    email: {
      "how to compose & send email": "Gmail → Compose → Recipient → Subject → Message → Send.",
      "how to attach files": "Compose → Paperclip → Choose file → Attach.",
      "how to add signature": "Gmail Settings → Signature → Add → Save.",
      "how to create folders/labels": "Gmail Settings → Labels → Create new.",
      "how to block spam": "Open email → 3-dot menu → Block → Mark as spam."
    },
    security: {
      "how to enable 2fa": "App Settings → Security → 2FA → Enable → Verify.",
      "how to create strong password": "Use 12+ chars → UPPER, lower, numbers, symbols.",
      "how to identify scam links": "Avoid unknown links. Look for HTTPS, trusted domains.",
      "how to backup phone data": "Settings → Backup & Restore → Backup now.",
      "how to update software": "Settings → System → Software Update → Check & Install."
    },
    paytm: {
      "how to add money to wallet": "Paytm → Add Money → Enter amount → Choose payment method → Add.",
      "how to send money": "Paytm → To Mobile/UPI → Enter details → Enter amount → Pay.",
      "how to check balance": "Paytm → Passbook/Balance → View wallet balance.",
      "how to pay bills": "Paytm → Bill Payments → Select biller → Enter details → Pay.",
      "how to view transaction history": "Paytm → Passbook → All Transactions."
    }
  };

  function wrapText(text, maxWidth) {
    const words = text.split(' ');
    let lines = [], currentLine = '';
    ctx.font = '16px Segoe UI';
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i] + ' ';
      const width = ctx.measureText(testLine).width;
      if (width > maxWidth && currentLine) {
        lines.push(currentLine.trim());
        currentLine = words[i] + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());
    return lines;
  }

  function addMessage(text, sender) {
    const msg = {
      text,
      sender,
      alpha: 0,
      lines: wrapText(text, bubbleMaxWidth - paddingH * 2),
      bubbleHeight: 0,
      bubbleWidth: 0
    };
    msg.bubbleHeight = msg.lines.length * lineHeight + paddingV * 2;
    msg.lines.forEach(line => {
      const lineWidth = ctx.measureText(line).width;
      if (lineWidth > msg.bubbleWidth) msg.bubbleWidth = lineWidth;
    });
    msg.bubbleWidth += paddingH * 2;
    messages.push(msg);
    scrollToBottom();
  }

  function scrollToBottom() {
    let totalHeight = 10;
    messages.forEach(m => {
      totalHeight += m.bubbleHeight + 12;
    });
    if (totalHeight > chatHeight) scrollOffset = totalHeight - chatHeight + 10;
    else scrollOffset = 0;
  }

  function drawMessages() {
    ctx.clearRect(0, 0, chatWidth, chatHeight);
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, chatWidth, chatHeight);

    ctx.font = '16px Segoe UI';
    ctx.textBaseline = 'top';
    let y = 10 - scrollOffset;

    messages.forEach(msg => {
      if (msg.alpha < 1) msg.alpha += 0.05;
      const x = msg.sender === 'bot' ? 10 : chatWidth - msg.bubbleWidth - 10;
      drawBubble(x, y, msg.bubbleWidth, msg.bubbleHeight, msg.sender === 'bot', msg.alpha);
      ctx.fillStyle = `rgba(255,255,255,${msg.alpha})`;
      msg.lines.forEach((line, i) => {
        ctx.fillText(line, x + paddingH, y + paddingV + i * lineHeight);
      });
      y += msg.bubbleHeight + 12;
    });
  }

  function drawBubble(x, y, w, h, isBot, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = isBot ? '#2a3942' : '#005c4b';
    ctx.beginPath();
    ctx.moveTo(x + bubbleRadius, y);
    ctx.lineTo(x + w - bubbleRadius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + bubbleRadius);
    ctx.lineTo(x + w, y + h - bubbleRadius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - bubbleRadius, y + h);
    ctx.lineTo(x + bubbleRadius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - bubbleRadius);
    ctx.lineTo(x, y + bubbleRadius);
    ctx.quadraticCurveTo(x, y, x + bubbleRadius, y);
    ctx.fill();
    ctx.restore();
  }

  function handleSuggestionClick(text) {
    addMessage(text, 'user');
    setTimeout(() => {
      const answer = faqData[currentCategory][text] || "I don't have that info, bitch.";
      addMessage(answer, 'bot');
    }, 500);
  }

  function populateCategoryDropdown() {
    categoryDropdown.innerHTML = '';
    Object.keys(faqData).forEach(cat => {
      const btn = document.createElement('button');
      btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      btn.classList.toggle('active', cat === currentCategory);
      btn.addEventListener('click', () => {
        if (currentCategory === cat) return;
        currentCategory = cat;
        currentCategorySpan.textContent = btn.textContent;
        updateCategoryButtons();
        clearChat();
        populateSuggestions();
      });
      categoryDropdown.appendChild(btn);
    });
  }

  function updateCategoryButtons() {
    Array.from(categoryDropdown.children).forEach(btn => {
      btn.classList.toggle('active', btn.textContent.toLowerCase() === currentCategory);
    });
  }

  function clearChat() {
    messages = [];
    scrollOffset = 0;
    addMessage(
  "👋 Welcome to " + currentCategorySpan.textContent +
  " FAQ Section! Tap a question below to get started, or you can also ask me for a fun fact, quote, thought, riddle, joke or even ask about me!", 
  'bot'
);
// ...existing code...
  }

  function populateSuggestions() {
    suggestionBar.innerHTML = '';
    const keys = Object.keys(faqData[currentCategory]);
    keys.forEach(q => {
      const btn = document.createElement('div');
      btn.textContent = q;
      btn.className = 'suggestionBtn';
      btn.addEventListener('click', () => handleSuggestionClick(q));
      suggestionBar.appendChild(btn);
    });
  }

  scrollLeftBtn.addEventListener('click', () => {
    categoryDropdown.scrollBy({ left: -120, behavior: 'smooth' });
  });

  scrollRightBtn.addEventListener('click', () => {
    categoryDropdown.scrollBy({ left: 120, behavior: 'smooth' });
  });

  populateCategoryDropdown();
  clearChat();
  populateSuggestions();

  function loop() {
    drawMessages();
    requestAnimationFrame(loop);
  }
  loop();

async function handleSend() {
  const text = inputBox.value.trim();
  if (!text) return;
  inputBox.value = '';
  addMessage(text, 'user');

  setTimeout(async () => {
    let answer = faqData[currentCategory]?.[text.toLowerCase()];

    if (answer) {
      addMessage(answer, 'bot');
    } else {
      // Try local fallback first
      const localFallback = getChatGPTResponse(text);

      // Log fallback (optional, can remove after testing)
      console.log('Local fallback:', localFallback);

      if (localFallback.includes("Hmm...")) {
        // Fallback doesn't know → try API
        addMessage("🤖 Thinking...", 'bot');
        const realAnswer = await getChatGPTResponseReal(text);
        messages.pop(); // Remove "Thinking..."
        addMessage(realAnswer, 'bot');
      } else {
        addMessage(localFallback, 'bot');
      }
    }
  }, 500);
}


  sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleSend();
  });

  inputBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  });

})();

function getChatGPTResponse(userInput) {
  const input = userInput.toLowerCase();

  // Greetings
  if (
    input.includes('hello') ||
    input.includes('hi') ||
    input.includes('good morning') ||
    input.includes('good evening') ||
    input.includes('hey')
  ) {
    return "Hello! 👋 How can I help you today?";
  }

  // Riddles
  if (input.includes('riddle') || input.includes('brain teaser')) {
    return "What has keys but can't open locks? A piano! 🎹";
  }
  if (input.includes('teaser')) {
    return "I have cities, but no houses. I have mountains, but no trees. What am I? (A map!)";
  }

  // Fun facts
  if (input.includes('fun fact') || input.includes('interesting fact') || input.includes('random fact')) {
    return "Did you know? Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs!";
  }
  if (input.includes('science fact')) {
    return "A bolt of lightning contains enough energy to toast 100,000 slices of bread!";
  }

  // Quotations/Thoughts
  if (input.includes('quote') || input.includes('inspirational thought')) {
    return "“The only way to do great work is to love what you do.” – Steve Jobs";
  }
  if (input.includes('thought')) {
    return "“The best time to plant a tree was 20 years ago. The second best time is now.” – Chinese Proverb";
  }   
  if (input.includes('quote about success')) {
    return "“Success is not the key to happiness. Happiness is the key to success.” – Albert Schweitzer";
  }
  if (input.includes('quote about happiness')) {
    return "“Happiness is not something ready made. It comes from your own actions.” – Dalai Lama";
  }

  // Jokes
  if (input.includes('joke') || input.includes('make me laugh')) {
    return "Why don’t skeletons fight each other? Because they don’t have the guts! 🤣";
  }

  // Weather
  if (input.includes('weather')) {
    return "I'm not connected to live weather data, but always a good day to chat with me! ☀️☁️🌧️";
  }

  // Who are you
  if (input.includes('who are you') || input.includes('about you')) {
    return "I'm your best Companion DigiBot Pro, here to answer questions and make your day. 💻🤖";
  }

  // Tongue twister
  if (input.includes('tongue twister')) {
    return "Try this: She sells seashells by the seashore!";
  }

  // Capital of France
  if (input.includes('capital of france')) {
    return "The capital of France is Paris! 🇫🇷";
  }

  // Age of Earth
  if (input.includes('how old is the earth')) {
    return "The Earth is about 4.54 billion years old!";
  }

  // Favorite color
  if (input.includes('favorite color')) {
    return "I like all colors, but green is pretty cool! 💚";
  }


  if (input.includes('fact')) {
    return "Monkey's tail has a brain of its own! 🐒 And octopus has three hearts";
  }

  // Meaning of life
  if (input.includes('meaning of life')) {
    return "42. Or maybe just to be happy and help others! 😉";

  }
  if (
  input.includes('bye') ||
  input.includes('goodbye') ||
  input.includes('see you') ||
  input.includes('see ya') ||
  input.includes('later')
) {
  return "Goodbye! 👋 Have a great day. Come back anytime if you need help or just want to chat!";
}
  if (input.includes('thank you') || input.includes('thanks')) {
  return "You’re welcome! 😊 I’m here to help anytime. If you have more questions, just ask!";
}
  // Unknown input
  return "Hmm... that’s an interesting one! 🤔 Let me think about it... I might not know everything yet!";
}

async function getChatGPTResponseReal(userInput) {
  const apiKey = 'sk-XXXXXXXXXXXXXXXXXXXXXXX'; // your API KEY
  const url = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are DigiBot Pro, a helpful, friendly chatbot." },
      { role: "user", content: userInput }
    ],
    max_tokens: 150,
    temperature: 0.7
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });

    const data = await response.json();
    if (data && data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      return "Hmm, I couldn’t get an answer right now. Please try again later.";
    }
  } catch (error) {
    console.error(error);
    return "Oops! Something went wrong connecting to my brain. 🤖💥";
  }
}
