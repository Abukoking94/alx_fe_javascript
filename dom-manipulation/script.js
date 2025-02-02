// Array to store quotes with text and category
const quotes = [
  {
    text: "The best way to predict the future is to invent it.",
    category: "Motivation",
  },
  {
    text: "Do what you can, with what you have, where you are.",
    category: "Inspiration",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    category: "Success",
  },
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>${randomQuote.text} <strong>(${randomQuote.category})</strong></p>`;
}

// Function to add a new quote dynamically
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document
    .getElementById("newQuoteCategory")
    .value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  // Add the new quote to the array
  quotes.push({ text: quoteText, category: quoteCategory });

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Display the newly added quote immediately
  showRandomQuote();
}

// Attach event listener to the button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Show an initial random quote on page load
showRandomQuote();
