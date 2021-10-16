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

// Search city Start
function formSubmitHandler(event) {
    event.preventDefault();
    var currentCity = cityInputField
    .value
    .trim();

    // check to see if any city was entered
    if (currentCity) {
        // check to see if searched city was searched before
        if (citiesArray.indexOf(currentCity)=== -1) {
            //if not in localStorage push the array and save
            citiesArray.push(currentCity);
            cityDisplayed.innerHTML = currentCity;
            localStorage.setItem("cities", JSON.stringify(citiesArray));
            // create a new button to search city
            var newBtn = document.createElement("button");
            newBtn.classList = "btn btn-outline-primary btn-lg btn-block city-btn";
            newBtn.setAttribute("id", "city-" + currentCity)
            newBtn.innerHTML = currentCity;
            // append it to history
            previousSearches.appendChild(newBtn);
            newBtn.setAttribute("value", currentCity);
            newBtn.onclick = function (event) {
                var city = $(this).attr("value"); // after setting the attribute, use jQuery to target attribute
                // call function to show the weather
                displayCurrentWeather(city);
                displayForecast(city);
                showForecast();
            }
        };
        // clear search form
        cityInputField.value = "";
        // call function to show the weather
        displayCurrentWeather(currentCity);
        displayForecast(currentCity);
        showForecast();
    } else {
        alert('Please enter a city name');
    }
};
// Call function on click
searchField.addEventListener("submit", formSubmitHandler);
// City search End

// Render search history Start
function searchHistory() {
    for (let i = 0; i < citiesArray.length; i++) {
        var newBtn = document.createElement("button");
        previousSearches.appendChild(newBtn);
        newBtn.classList = "btn btn-outline-primary btn-lg btn-block city-btn";
        newBtn.setAttribute("id", "city-" + citiesArray[i])
        newBtn.innerHTML = citiesArray[i];
        // call function to render weather for the click btn
        newBtn.onclick = function (event) {
            var city = event.target.textContent;
            displayCurrentWeather(city);
            displayForecast(city);
            showForecast();
        }
    }
};
// Render search history End

// Clear history Start
clearHistory.addEventListener('click', function() {
    var accept = confirm('Search History will be cleared! Do you want to proceed?');
    if (accept === true) {
        localStorage.clear();
        window.location.reload();
    }
});
// Clear history End

// Create Dates and times across the page Start
function displayDate() {
    // header
    var todayDate = moment().format('dddd, MMMM Do');
    var todayEl = $('#current-date');
    todayEl.text(todayDate);
    // today
    var currentHour = moment().format('h:mm A');
    var todayDiv = $('#currentDay');
    todayDiv.text(currentHour);
    // 5 day forecast
    var fiveDay1 = moment().add(1, 'day').format('l');
    var forecastDate1 = $('#date1');
    forecastDate1.test(fiveDay1);

    var fiveDay2 = moment().add(2, 'day').format('l')
    var forecastDate2 = $('#date2');
    forecastDate2.test(fiveDay2);

    var fiveDay3 = moment().add(3, 'day').format('l')
    var forecastDate3 = $('#date3');
    forecastDate3.test(fiveDay3);

    var fiveDay4 = moment().add(4, 'day').format('l')
    var forecastDate4 = $('#date4');
    forecastDate4.test(fiveDay4);
    
    var fiveDay5 = moment().add(5, 'day').format('l')
    var forecastDate5 = $('#date5');
    forecastDate5.test(fiveDay5);
};
// Create dates and times across page End
