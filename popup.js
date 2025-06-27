const noteArea = document.getElementById('note');
const clearBtn = document.getElementById('clear');
const darkToggle = document.getElementById('darkToggle');
const quoteText = document.getElementById('quoteText');

// Predefined motivational quotes
const quotes = [
  "Believe in yourself and all that you are.",
  "Every day is a second chance.",
  "You are capable of amazing things.",
  "Push yourself, because no one else is going to do it for you.",
  "Dream it. Wish it. Do it.",
  "Start where you are. Use what you have. Do what you can.",
  "The best way to get started is to quit talking and begin doing."
];

// Load quote of the day (same for the day)
function showDailyQuote() {
  const today = new Date().toDateString(); // E.g., "Fri Jun 27 2025"
  chrome.storage.local.get(['quoteDate', 'quote'], data => {
    if (data.quoteDate === today && data.quote) {
      quoteText.textContent = data.quote;
    } else {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      chrome.storage.local.set({ quoteDate: today, quote: randomQuote });
      quoteText.textContent = randomQuote;
    }
  });
}

// Extract domain from current tab
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// Load and save note per domain
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  const domain = getDomain(tabs[0].url);
  if (!domain) return;

  // Load saved note
  chrome.storage.local.get([domain], data => {
    noteArea.value = data[domain] || '';
  });

  // Auto-save note
  noteArea.addEventListener('input', () => {
    const note = noteArea.value;
    chrome.storage.local.set({ [domain]: note });
  });

  // Clear note
  clearBtn.addEventListener('click', () => {
    noteArea.value = '';
    chrome.storage.local.remove(domain);
  });
});

// Dark mode toggle
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  chrome.storage.local.set({ darkMode: document.body.classList.contains('dark-mode') });
});

// Load dark mode preference
chrome.storage.local.get('darkMode', data => {
  if (data.darkMode) {
    document.body.classList.add('dark-mode');
  }
});

// Load motivational quote
showDailyQuote();
