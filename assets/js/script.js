// global variables
var cityInputField = document.getElementById('city-input');
var previousSearches = document.getElementById('history');
var clearHistory = document.getElementById('clear');
var cityDisplayed = document.getElementById('current-city-displayed');
var searchField = document.getElementById('search-form');
var currentCityTemp = document.getElementById('current-city-temp');
var currentCityHumidity = document.getElementById('current-city-humidity');
var currentCityWind = document.getElementById('current-city-wind');
var currentCityUV = document.getElementById('current-city-uv');
var currentCityIcon = document.getElementById('weather-icon');
var currentWeatherCondition = document.getElementById('weather-condition');
var citiesArray = JSON.parse(localStorage.getItem('cities')) || [];
var apiKey = '82779e5fe53a4fa9c43d478dfdbebc25';