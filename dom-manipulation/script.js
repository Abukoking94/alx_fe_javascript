const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API
const LOCAL_STORAGE_KEY = "quotes";
const SYNC_INTERVAL = 10000; // Sync every 10 seconds

// Load quotes from local storage
let quotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [
  {
    text: "The best way to predict the future is to invent it.",
    category: "Motivation",
    id: 1,
  },
  {
    text: "Do what you can, with what you have, where you are.",
    category: "Inspiration",
    id: 2,
  },
];

const lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

// Function to populate the category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map((quote) => quote.category))];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = lastSelectedCategory;
}

// Function to filter and display a random quote
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  displayRandomQuote(filteredQuotes);
}

// Function to display a random quote
function displayRandomQuote(filteredQuotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `<p>${randomQuote.text} <strong>(${randomQuote.category})</strong></p>`;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document
    .getElementById("newQuoteCategory")
    .value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory, id: Date.now() };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  syncWithServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

// Function to sync with the server
async function syncWithServer(newQuote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(newQuote),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error syncing with server:", error);
  }
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();

    if (serverQuotes.length > 0) {
      mergeQuotes(serverQuotes);
    }
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Function to merge quotes (conflict resolution)
function mergeQuotes(serverQuotes) {
  let updated = false;

  serverQuotes.forEach((serverQuote) => {
    if (!quotes.find((q) => q.text === serverQuote.text)) {
      quotes.push({
        text: serverQuote.text,
        category: "Unknown",
        id: serverQuote.id,
      });
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("New quotes synced from the server.");
  }
}

// Periodic sync with the server
setInterval(fetchQuotesFromServer, SYNC_INTERVAL);

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", filterQuotes);

// Initialize UI
populateCategories();
filterQuotes();
