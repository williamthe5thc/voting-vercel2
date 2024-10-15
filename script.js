// script.js
import { fetchData, showToast, CATEGORIES, saveToLocalStorage, getFromLocalStorage } from './client-utils.js';

let DISHES_PER_CATEGORY = {};

async function getSettings() {
  try {
    const settings = await fetchData('/api/get-settings');
    DISHES_PER_CATEGORY = settings.dishesPerCategory;
  } catch (error) {
    console.error('Error fetching settings:', error);
    showToast('Error loading settings. Using default values.', 'error');
    DISHES_PER_CATEGORY = CATEGORIES.reduce((acc, category) => {
      acc[category] = 5;
      return acc;
    }, {});
  }
}

async function loadCategoriesProgressively() {
  const categoriesContainer = document.getElementById('categories');
  categoriesContainer.innerHTML = '';
  for (let category of CATEGORIES) {
    try {
      await loadCategory(category, categoriesContainer);
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error loading category ${category}:`, error);
      showToast(`Failed to load category ${category}. Please refresh the page.`, 'error');
    }
  }
  setupVoting();
  loadVotesFromLocalStorage();
}

async function loadCategory(category, container) {
    try {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.innerHTML = `<h2>${category}</h2>`;
        
        const rankingsDiv = document.createElement('div');
        rankingsDiv.classList.add('rankings');
        
        ['1st', '2nd', '3rd'].forEach(rank => {
            const rankDiv = document.createElement('div');
            rankDiv.classList.add('rank');
            rankDiv.innerHTML = `<h3>${rank} Place</h3>`;
            
            const dishList = document.createElement('div');
            dishList.classList.add('dish-list');
            
            for (let dishIndex = 1; dishIndex <= DISHES_PER_CATEGORY[category]; dishIndex++) {
                const dishDiv = document.createElement('div');
                dishDiv.classList.add('dish');
                dishDiv.innerHTML = `
                    <input type="radio" id="${category}-${rank}-${dishIndex}" name="${category}-${rank}" value="Dish #${dishIndex}">
                    <label for="${category}-${rank}-${dishIndex}">Dish #${dishIndex}</label>
                `;
                dishList.appendChild(dishDiv);
            }
            
            rankDiv.appendChild(dishList);
            rankingsDiv.appendChild(rankDiv);
        });
        
        categoryDiv.appendChild(rankingsDiv);
        container.appendChild(categoryDiv);
    } catch (error) {
        console.error(`Error loading category ${category}:`, error);
        showToast(`Failed to load category ${category}`, 'error');
    }
}

function setupVoting() {
    console.log("Setting up voting...");
    const categories = document.querySelectorAll('.category');
    console.log(`Found ${categories.length} categories`);
    categories.forEach((category, index) => {
        console.log(`Setting up category ${index + 1}`);
        const radioButtons = category.querySelectorAll('input[type="radio"]');
        console.log(`Found ${radioButtons.length} radio buttons in category ${index + 1}`);
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                console.log(`Radio button changed: ${this.value} in category ${index + 1}`);
                
                // Get the category and rank from the radio button's name
                const [categoryName, rank] = this.name.split('-');
                
                // Uncheck this dish in other ranks of the same category
                ['1st', '2nd', '3rd'].forEach(otherRank => {
                    if (otherRank !== rank) {
                        const otherRadio = document.querySelector(`input[name="${categoryName}-${otherRank}"][value="${this.value}"]`);
                        if (otherRadio && otherRadio.checked) {
                            otherRadio.checked = false;
                            showToast(`Removed ${this.value} from ${otherRank} place in ${categoryName}`, 'info');
                        }
                    }
                });
                
                saveVotesToLocalStorage();
            });
        });
    });
}

function saveVotesToLocalStorage() {
    const votes = {};
    CATEGORIES.forEach(category => {
        votes[category] = {};
        ['1st', '2nd', '3rd'].forEach(rank => {
            const selectedDish = document.querySelector(`input[name="${category}-${rank}"]:checked`);
            if (selectedDish) {
                votes[category][rank] = selectedDish.value;
            }
        });
    });
    saveToLocalStorage('currentVotes', votes);
}

function loadVotesFromLocalStorage() {
    const votes = getFromLocalStorage('currentVotes');
    if (votes) {
        Object.entries(votes).forEach(([category, rankings]) => {
            Object.entries(rankings).forEach(([rank, dish]) => {
                const radioButton = document.querySelector(`input[name="${category}-${rank}"][value="${dish}"]`);
                if (radioButton) {
                    radioButton.checked = true;
                }
            });
        });
    }
}

document.getElementById('votingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log("Form submission started");
    const votes = JSON.parse(localStorage.getItem('currentVotes') || '{}');
    console.log("Votes retrieved from local storage:", votes);
    
    // Change button text to "Voting..."
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.textContent = 'Voting...';
    submitButton.disabled = true;
    
    try {
        console.log("Sending votes to Google Apps Script...");
        const response = await fetch('https://script.google.com/macros/s/AKfycbzQNZ3lBvJJ5bBU3N1k7ubPoaFauXOfCRjc2bbi3SKhQg-S5S7yg1Hn3BG-kjxkv22_/exec', {
            method: 'POST',
            mode: 'no-cors', // Important for cross-origin requests
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data=${encodeURIComponent(JSON.stringify(votes))}`,
        });
        
        console.log("Votes sent, response status:", response.status);
        
        // Since we're using no-cors, we can't access the response content
        // We'll assume success if we get here without an error
        showToast('Thank you for voting!', 'success');
        localStorage.setItem('submittedVotes', JSON.stringify(votes));
        localStorage.removeItem('currentVotes');
        
        // Update UI to reflect submitted votes
        document.querySelectorAll('.rank-btn.selected').forEach(btn => {
            btn.classList.add('submitted');
            btn.disabled = true;
        });
        
        // Update submit button
        submitButton.textContent = 'Votes Submitted';
        submitButton.disabled = true;
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to submit vote. Please try again.', 'error');
        // Reset submit button if there's an error
        submitButton.textContent = 'Cast Your Vote';
        submitButton.disabled = false;
    }
});

async function init() {
    console.log("Initializing");
    try {
        await getSettings();
        console.log("Settings loaded", DISHES_PER_CATEGORY);
        await loadCategoriesProgressively();
        console.log("Categories loaded");
    } catch (error) {
        console.error("Error in init:", error);
        showToast('Failed to initialize the voting system. Please refresh the page.', 'error');
    }
}

init().catch(error => {
    console.error("Unhandled error in init:", error);
    showToast('An unexpected error occurred. Please refresh the page.', 'error');
});
