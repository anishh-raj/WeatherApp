// JavaScript for the weather app logic

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to all the necessary DOM elements
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');
    const weatherDisplay = document.getElementById('weather-display');
    const weatherDetails = document.getElementById('weather-details');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const cityName = document.getElementById('city-name');
    const weatherIcon = document.getElementById('weather-icon');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const weatherDescription = document.getElementById('weather-description');

    // IMPORTANT: Get your free API key from OpenWeatherMap.
    // 1. Go to https://openweathermap.org/
    // 2. Create an account.
    // 3. Navigate to the "API keys" tab in your profile.
    // 4. Copy your default API key and paste it here.
    const API_KEY = "3164ea934557ea3289fa6b19d8722d36"; // Replace with your actual key

    // Base URL for the OpenWeatherMap API
    const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

    // Function to display messages (loading, errors)
    function showMessage(text, isError = false) {
        weatherDisplay.classList.remove('hidden');
        messageBox.classList.remove('hidden');
        messageText.textContent = text;
        weatherDetails.classList.add('hidden');
        if (isError) {
            messageText.classList.remove('text-gray-600');
            messageText.classList.add('text-red-500');
        } else {
            messageText.classList.remove('text-red-500');
            messageText.classList.add('text-gray-600');
        }
    }

    // Function to display weather data
    function showWeatherData(data) {
        // Ensure data is valid before proceeding
        if (!data || !data.main || !data.weather || data.weather.length === 0) {
            showMessage("Unable to retrieve weather data.", true);
            return;
        }

        // Show the weather display section and hide the message box
        weatherDisplay.classList.remove('hidden');
        weatherDetails.classList.remove('hidden');
        messageBox.classList.add('hidden');

        // Extract data from the API response
        const name = data.name;
        const temp = Math.round(data.main.temp);
        const humid = data.main.humidity;
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Update the DOM with the weather data
        cityName.textContent = name;
        temperature.textContent = temp;
        humidity.textContent = humid;
        weatherDescription.textContent = description;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
    }

    // Function to fetch weather data from the API
    async function getWeatherData(city) {
        if (!city) {
            showMessage("Please enter a city name.", true);
            return;
        }
        
        // Show a loading message
        showMessage("Getting weather data...");

        // Construct the API URL
        const url = `${API_BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            // Handle different response statuses
            if (response.ok) {
                showWeatherData(data);
            } else if (response.status === 404) {
                showMessage("City not found. Please try again.", true);
            } else if (response.status === 401) {
                showMessage("Invalid API Key. Please check your key in the code.", true);
            } else {
                showMessage(`Error: ${data.message}`, true);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            showMessage("An error occurred. Please check your internet connection.", true);
        }
    }

    // Event listener for the search button click
    searchButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        } else {
            showMessage("Please enter a city name.", true);
        }
    });

    // Event listener for the "Enter" key press on the input field
    cityInput.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            searchButton.click();
        }
    });
    
    // Initial message on page load
    showMessage("Enter a city to see the weather.");
});
