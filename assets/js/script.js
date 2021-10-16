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

// Current weather Start
function displayCurrentWeather(currentCity) {
    // display city as a header on current weather area
    cityDisplayed.innerHTML = currentCity;
    // fetch first data from weather api
    fetch('https://api.openweathermap.org/data/2.5/weather?q='
    + currentCity
    + '&appid='
    + apiKey
    + '&units=imperial'
    )
    // check if a known city was entered
    .then(function (weatherResponse) {
        if (weatherResponse.ok) {
            weatherResponse.json().then(function (weatherResponse) {
                // fetch the uv data
                fetch (
                    'https://api.openweathermap.org/data/2.5/uvi?appid='
                    + apiKey
                    + '&lat='
                    + weatherResponse.coord.lat
                    + '&lon='
                    + weatherResponse.coord.lon 
                )
                    .then(function (response ) {
                        return response.json();
                    })
                    .then(function (response) {
                        // create variables for each data value needed
                        var uvIndex = response.value
                        var temperatureValue = Math.round(weatherResponse.main.feels_like);
                        var humidityValue = weatherResponse.main.humidity;
                        var windSpeedValue = weatherResponse.wind.speed;
                        var uvIndexValue = JSON.stringify(uvIndex);
                        var weatherIcon = weatherResponse.weather[0].icon;
                        var currentWeatherCondition = weatherResponse.weather[0].icon;
                        var iconUrl = "http://openweathermap.org/img/wn" + weatherIcon + "@2x.png";
                        // Append current weather values to span elements w/in thecureent weather area 
                        currentWeatherCond.textContent = currentWeatherCondition.toUpperCase();
                        currentCityTemp.textContent = temperatureValue;
                        currentyCityHumidity.textContent = humidityValue;
                        currentCityWind.textContent = windSpeedValue;
                        currentCityUV.textContent = uvIndexValue; // remember that data is provided only for 12pm
                        // change the color of UV index
                        if (uvIndexValue < 3) {
                            currentCityUV.setAttribute("class", "badge badge-success")
                        } else if (uvIndexValue > 7) {
                            currentCityUV.setAttribute("class", "badge badge-danger")
                        } else if (uvIndexValue >= 3 && uvIndexValue <= 7) {
                            currentCityUV.setAttribute("class", "badge badge-warning")
                        };
                        currentCityIcon.setAttribute("src", iconUrl);
                        cityDisplayed.innerHTML = currentCity;
                    })
            })
        } else {
            alert("Error: City not Found!")
        }
    })
}
// Current weather End

// 5 day forecast Start
function displayForecast(currentCity) {
    // fetch forecast data
    fetch('https://api.openweathermap.org/data/2.5/forecast?q='
    + currentCity
    + '&appid='
    + apiKey
    + '&units=imperial'
)
    .then(function (forecastResponse) {
        if (forecastResponse.ok) {
            forecastResponse.json().then(function (forecastResponse) {
              // initalize an array to save the data needed
              var dates = [];
              // itterate thru weather api data and choose what we need
              for (let i = 0; i < forecastResponse.list.length; i++) {
                  // create a variable to use only the data as of 3pm
                  var certainTimeData = forecastResponse.list[i]["dt_txt"].split(" ")[1].split(":")[0] == 15;
                  if (certainTimeData) {
                      // populate w/weather data from this object
                      dates.push(forecastResponse.list[i]);
                  }
              };
              console.log(dates); 

            // go thru newly created array of certainTimeData and render the info in forecast cards 
              for (let i = 0; i < dates.length; i++) {
                  var cardData = document.getElementsByClassName("forecast-temp");
                  cardData[i].innerHTML = Math.round(dates[i].main.temp) + "&#8457";
                  //humidity
                  var cardHumidity = document.getElementsByClassName("forecast-humidity");
                  cardHumidity[i].innerHTML = dates[i].main.humidity + "%";
                  // icons
                  var cardIcon = document.getElementsByClassName("forecast-icon");
                  var cardIconId = "http://openweathermap.org/img/w/"
                        + cardIconId
                        + ".png";
                    cardIcon[i].setAttribute("src", cardIconUrl);     
              }
            })
        } else {
            return;
        }
    })
};
// 5 day forecast End

// show the weather forecast
function showForecast() {
    document.getElementById("forecast-container").style.display = "inline-block";
};

// call functions to reload or open the page
searchHistory();
displayDate();