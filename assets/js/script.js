/**
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment - 06 Weather Dashboard
 */

/**
 * Main jQuery entry call. Wrapped after the page load process has been completed and document can be manipulated safely.
 * It contains all functions available. These are my public keys for Bing and Open weather
 */
$(document).ready(function () {
	const openWeatherAPI = "bbc3d2f0a62f5953d89a98a20be48141";
	const bingApi = "AiWJmhnxfhdTKeo19xy2NrVRNuGJlN9DiTfsDFV0AbdyHZHjWLv8ru9SloAmYPbk";
	const aviationAPI = "bc62d3c507d8b552c56639324618f98b";

	var errorBlock = $("#errorBar").clone(); // Clone the error dismissable alert
	var newForecastBlock = $("#weatherTemplate").clone(); // Initial mechanism to create DOM - not successful
	newForecastBlock.removeAttr("hidden");

	var citiesHistory = []; // Declare empty array - this will hold the tasks
	var citiesCached = []; // Initialize array that will hold the cities weather cached
	var cityId = "";
	var latitude = "";
	var longitude = "";
	var selectedCity = "";
	var min = 1;
	var max = 100;

	function testingAPI(){
		// We are using template literals to build strings (backtick + ${variable}
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
		const geocodingEndpoint = `https://api.aviationstack.com/v1/flights?access_key=${aviationAPI}`;

		// Make an HTTP GET fetch request to the API
		// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
		fetch(geocodingEndpoint)
			.then(response => response.json())
			.then((data) => {
				console.log(data);
			})
			.catch((error) => {

				displayErrorMessage(error, "Aviation Stack"); // Display error message
				return false;
			});
	}

	/**
	 * This function will connect to the API, request information and process if everything is ok.
	 * Personal API: 313db44690e1bc1d83bcbf0de3ce1813
	 * API URL: https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid=313db44690e1bc1d83bcbf0de3ce1813
	 */
	function retrieveWeather() {

		// The forecast is built dynamically. Validate whether there are already forecast cards in the forecast section
		if ($("#weatherCards").children().length > 2) {
			$(".forecast").remove();
		}

		// Retrieve the city selected by the user.
		selectedCity = $("#searchWeather").val();
		if (selectedCity == "") {
			displayErrorMessage("Invalid selected city! you need to enter a city", "Loading process!"); // Display error message
			return false;
		}

		// We are using template literals to build strings (backtick + ${variable}
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
		const geocodingEndpoint = `https://dev.virtualearth.net/REST/v1/Locations?q=${selectedCity}&key=${bingApi}`;

		// Make an HTTP GET fetch request to the API
		// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
		fetch(geocodingEndpoint)
			.then(response => response.json())
			.then((data) => {
				// Extract the coordinates from the response
				const firstLocation = data.resourceSets[0].resources[0];
				latitude = firstLocation.point.coordinates[0];
				longitude = firstLocation.point.coordinates[1];

				retrieveCurrentWeather();
				retrieveForecastWeather(); // Call the forecast weather	

			})
			.catch((error) => {

				$("#searchWeather").val(""); // Clear city entered
				$("#data-weather").attr("hidden");
				displayErrorMessage(error, "Bing Virtual Earth"); // Display error message
				return false;
			});
	}

	/**
	 * This function will retrieve the current weather in the city selected. We could get 
	 * the information from the list as well. Change the url to api.openweathermap.bad.org to break
	 * the code.
	 */
	function retrieveCurrentWeather() {
		var currentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${openWeatherAPI}`;

		fetch(currentWeather)
			.then(response => {
				if (!response.ok) {
					displayErrorMessage("Open Weather Map", "Current Weather"); // Display error message
					return false; // Failed process
				}
				return response.json(); // Parse JSON response
			})
			.then(data => {

				// Format date to a simple and short date.
				// https://day.js.org/docs/en/display/format
				$("#cityCurrentWeather").text(selectedCity + " (" + dayjs().format("DD/MM/YYYY") + ")");

				$("#temperatureHeader").text(data.main.temp + " ℃");
				$("#windHeader").text(data.wind.speed + "m/h");
				$("#humidityHeader").text(data.main.humidity + "%");

				// Instantiate an instance of the weather icon; this icon has to change dynamically 
				// depending on the weather conditions
				var iconchange = $("#weathericon");

				// Call shared function to perform the validation of the weather and apply the correct icon
				changeWeatherIcon(data.weather[0], iconchange);

				cityId = data.id;
				return true; // Process completed
			})
			.catch(error => {
				$("#searchWeather").val(""); // Clear city entered
				displayErrorMessage(error, "Open Weather Map"); // Display error message
				return false;
			})
	}

	/**
	 * This function will retrieve the coordinates for the selected city using Bing Virtual Earth API for 
	 * Developers. If the process is correct then It will return the coordinates (latitude/longitude).
	 * Change the url to api.openweathermap.bad.org to break the code.
	 */
	function retrieveForecastWeather() {
		const forecastWeather = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${openWeatherAPI}`;

		var currentDate = dayjs().format("DD/MM/YYYY");
		var countForecast = 0;

		fetch(forecastWeather)
			.then(response => {
				if (!response.ok) {
					displayErrorMessage("Open Weather Map (Forecast)", "Retrieving Forecast Weather"); // Display error message
					return false; // Failed process
				}
				return response.json(); // Parse JSON response
			})
			.then(data => {
				// Retrieve the forecast list into an array. 
				const forecasts = data.list;

				$("#forecastSection").removeAttr("hidden");

				// Ref:JQuery - method is designed to make DOM looping constructs concise and less error-prone
				// https://api.jquery.com/each/
				forecasts.forEach(forecast => {

					// Format date to a simple and short date. This method is used several times here
					// https://day.js.org/docs/en/display/format
					var loopDate = dayjs(forecast.dt_txt).format("DD/MM/YYYY");

					// Make sure we are NOT showing information from the same day. The forecast is returned
					// in 3 hours lapses. This means that we have multiple records for each day.
					if (currentDate != loopDate && countForecast <= 4) {
						currentDate = dayjs(forecast.dt_txt).format("DD/MM/YYYY");
						countForecast++

						// Generate a random number within the range			  
						var randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

						// Once we have completed compiling information that will be applied the new element we
						// format the Element.
						newForecastBlock.attr("id", "forecast" + randomNum); // Change id to unique
						newForecastBlock.addClass("forecast");
						newForecastBlock.find(".mb-2").text(currentDate);
						newForecastBlock.find("#tempFor").text(forecast.main.temp + " ℃");
						newForecastBlock.find("#windFor").text(forecast.wind.speed + "m/h");
						newForecastBlock.find("#humidFor").text(forecast.main.humidity + "%");

						// Instantiate an instance of the weather icon; this icon has to change dynamically 
						// depending on the weather conditions
						var iconchange = newForecastBlock.find("#iconview")

						// Call shared function to perform the validation of the weather and apply the correct icon
						changeWeatherIcon(forecast.weather[0], iconchange);

						// Creates a clone of a response object, identical in every way, but stored in a different variable
						// https://developer.mozilla.org/en-US/docs/Web/API/Response/clone
						var insertElement = newForecastBlock.clone(); // Completed new Time Block now we clone it
						$("#weatherCards").append(insertElement); // Finally we insert new cloned
					}
				});

				// At this point we have already display all data including the forecast for selected city
				// Call function that will validate for new city and add to autocomplete
				saveLocalStorageInformation();

				// This removes the element from the DOM.
				// https://developer.mozilla.org/en-US/docs/Web/API/Element/remove
				$("#weatherTemplate").remove();

				return true; // Process completed

			})
			.catch(error => {
				$("#searchWeather").val(""); // Clear city entered
				displayErrorMessage(error, "Open Weather Map (Forecast)"); // Display error message
				return false; // Failed process
			});
	}

	/**
	 * This function will validate the weather conditions and set the appropriate weather icon. It adds
	 * not just the weather icon but also the color of the icon. For a sunny day it should be yellow and 
	 * for other days a gloomy color.
	 * @param {*} data - this is the object that contains the icon
	 * @param {*} node - json node that contains information about the weather
	 */
	function changeWeatherIcon(data, node) {
		node.removeClass("fa-sun text-warning");

		// Validate the type of weather and insert the proper icon
		if (data.description == "overcast clouds" || data.description == "few clouds" ||
			data.description == "broken clouds") {
			node.addClass("fa-cloud-sun text-cloudy"); // Insert classes
		} else if (data.description == "clear sky") {
			node.addClass("fa-sun text-warning"); // Insert classes
		} else if (data.description == "clear sky") {
			node.addClass("fa-cloud-rain text-cloudy"); // Insert classes
		} else {
			// Default icon; perhaps a description that escape my investigation.
			node.addClass("fa-sun text-warning"); // Insert classes
		}
	}

	/**
	 * This function will load the selected city weather. It will retrieve the id assigned to the button,
	 * search for this item in the Local Story array and retrieve the coordinates for the city. Finally it 
	 * will retrieve the weather.
	 */
	function retrieveCachedWeather() {

		// Retrieve the id from the selected element (button); this is used to 
		// find in the array for the corresponding array-record - from it we retrieve coordinates
		var cachedid = this.id;

		// Iterate through the cities array and search for the id		
		for (i = 0; i <= citiesCached.length; i++) {

			// Validate the array element/attribute (id) - store in global variables
			if ("cached" + citiesCached[i].id == cachedid) {
				latitude = citiesCached[i].latitude; // Retrieve City latitude
				longitude = citiesCached[i].longitude; // Retrieve City longitude
				selectedCity = citiesCached[i].city; // Retrieve City into global variable

				$("#searchWeather").val(selectedCity); // Display selected city

				// Once we have retrieved the required information we just bring the 
				// current weather and the 6 days forecast.
				retrieveWeather();
				return false;
			}
		}
	}

	/**
	 * This function will save the information into the Local Storage. It validates that item doesn't already
	 * exist and if it does then it updates data. The information is saved in the Local Storage only when the 
	 * city is new or in case of the cached cities if the city does not exist
	 */
	function saveLocalStorageInformation() {

		if (citiesHistory.indexOf(selectedCity) === -1) {

			// Add new object to the local storage
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
			citiesHistory.push(selectedCity);

			// Window: localStorage property - data has no expiration time
			// https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
			// https://www.w3schools.com/Js/js_json_stringify.asp
			localStorage.setItem("weatherSearch", JSON.stringify(citiesHistory));

			implementAutocomplete(); // Setup the auto complete
		}

		var response = searchData(); // Validate whether the city exists or not

		if (response === null) {

			// City was not found; need to add it. We also need to add the 
			// button.
			var addCity = {
				id: cityId,
				date: dayjs().format("DD/MM/YYYY"),
				latitude: latitude,
				longitude: longitude,
				city: selectedCity
			}

			// Push structured object into array
			citiesCached.push(addCity);
			localStorage.setItem("cachedWeather", JSON.stringify(citiesCached));

		}

		insertButton(selectedCity, cityId);

		if (citiesCached.length > 0) {
			$("#initialsection").attr("hidden", true);
			$("#data-weather").removeAttr("hidden");
		}

	}

	// This function will insert the button dynamically. I am using a different method when
	// creating new element. Instead of cloning I am creating the element using JQuery; assigning
	// different attributes, classes and text, to finally add into DOM
	// Object to create: <button id="searchcity" type="button" class="btn button-cached mb-2">Search</button>
	function insertButton(c, i) {
		// Create a new <button> element
		var newButton = $("<button></button>");
		var idString = "cached" + i;

		// The forecast is built dynamically. Validate whether there are already forecast cards in the forecast section
		if ($("#cachedData").children().length <= 8) {

			// Validate the button has not been already created
			if ($("#" + idString).length === 0) {

				// Set new element attributes and content
				newButton.attr("id", idString); // Assign a unique id
				newButton.attr("type", "button"); // Add the type of element 
				newButton.addClass("btn button-cached mb-2"); // Assign styling classes
				newButton.text(c); // Insert the City Name

				// Insert (append) the new element
				$("#cachedData").append(newButton);
			}
		}
	}

	/**
	 * This function will validate the task to save already exists; which means that we are
	 * updating the task. In case there is no records then it will return null.
	 * @returns index position or null
	 */
	function searchData() {
		if (citiesCached.length != 0) {
			for (i = 0; i <= citiesCached.length - 1; i++) {
				if (citiesCached[i].city == selectedCity) {
					return i;
				}
			}
		}
		return null;
	}

	/**
	 * This function will retrieve from the Local Storage the cities and searches history for the current Weather Dashboard
	 * We create a default array when application runs for the first time.
	 */
	function setupAutocomplete() {
		// Retrieve from local storage the Schedule Tasks and convert into object. We are
		// expecting an array
		// https://www.w3schools.com/Js/js_json_parse.asp
		// https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
		citiesHistory = JSON.parse(localStorage.getItem("weatherSearch"));

		// Validate whether citiesHistory array is null - add default list when empty 
		if (citiesHistory === null) {
			citiesHistory = ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Gatineau',
				'Quebec', 'Winnipeg', 'Hamilton', 'Kitchener', 'Cambridge', 'Waterloo'];
			// https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
			// https://www.w3schools.com/Js/js_json_stringify.asp
			localStorage.setItem("weatherSearch", JSON.stringify(citiesHistory));
		}

		implementAutocomplete(); // Setup the auto complete
	}

	/**
	 * The error alert is a dismissable alert element. When user dismisses the element it will no
	 * longer exists in the DOM. We need to validate whether it does exists or not, in case it does 
	 * not exists then we insert a clone
	 * @param {*} value 
	 */
	function displayErrorMessage(value, title) {

		// Validate error element exists under parent element
		if ($("#errorPosition").children().length == 0) {
			$("#errorPosition").append(errorBlock); // Insert new error cloned element
		}

		var messageLog = $("#errorString"); // Retrieve the error element object
		messageLog.text(title + " return an error :" + value); // Configure alert error message
		//document.body.children[1].children[0].children.errorBar
		messageLog.parent().removeAttr("hidden"); // Display element
	}

	/**
	 * This function will retrieve the cached cities from the Local Storage. This happens when the 
	 * document is loaded. Because we are using Local Storage it will create a new array on each machine
	 * site is opened.
	 */
	function setupCachedCities() {
		// Retrieve from local storage the Schedule Tasks and convert into object. We are
		// expecting an array
		// https://www.w3schools.com/Js/js_json_parse.asp
		// https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
		var oCacheCities = JSON.parse(localStorage.getItem("cachedWeather"));

		// Validate whether cached cities array is null. In case is null then we initialize it as an 
		// empty array
		if (oCacheCities === null) {

			// https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
			// https://www.w3schools.com/Js/js_json_stringify.asp
			localStorage.setItem("cachedWeather", JSON.stringify(citiesCached));

		} else {

			for (i = 0; i <= oCacheCities.length - 1; i++) {

				// Add task to public array - used in other processes.
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
				citiesCached.push(oCacheCities[i]); // Add tasks into array

				// Insert dynamic buttons for the cached cities
				insertButton(oCacheCities[i].city, oCacheCities[i].id)
			}

			if (oCacheCities.length > 0) {
				$("#initialsection").attr("hidden", true);
				$("#data-weather").removeAttr("hidden");
			}
		}

		// Setup current Cached weather for the first city found
		setupCurrentCachedWeather();
	}

	/**
	 * This function will load the current weather from the cached cities. It will load the
	 * very first city cached, setup local variables and interface and load the forecast information
	 */
	function setupCurrentCachedWeather() {

		if (citiesCached.length > 0) {

			// Retrieve from array the information stored in the Local Storage
			latitude = citiesCached[0].latitude // Store City latitude
			longitude = citiesCached[0].longitude // Store City longitude
			selectedCity = citiesCached[0].city // Store City name
			$("#searchWeather").val(selectedCity); // Display selected city

			// Once we have retrieved the required information we just bring the 
			// current weather and the 6 days forecast.
			retrieveWeather();
		}
	}

	// This function will implement the search city Autocomplete 
	function implementAutocomplete() {
		// Set up the autocomplete list into element
		$("#searchWeather").autocomplete({
			source: citiesHistory,
		});
	}

	// This function will clear the working are while typing the working area
	function clearWorkarea() {

		// The forecast is built dynamically. Validate whether there are already forecast cards in the forecast section
		if ($("#weatherCards").children().length > 2) {
			$(".forecast").remove();
		}

		$("#forecastSection").attr("hidden", true);
		$("#cityCurrentWeather").text("City here");
		$("#temperatureHeader").text("");
		$("#windHeader").text("");
		$("#humidityHeader").text("");
	}

	/**
	 * Initialize the page time-block elements, set their color and availability based in the time. We need t
	 * build the HTML from scratch using text strings. I had in mind to CLONE a template row and add it but
	 * it would not add; as the next row. Leave for later.
	 */
	function init() {

		setupAutocomplete(); // Initialize Autocomplete Local Storage
		setupCachedCities(); // Initialize Caches cites from Local Storage

		// Assign an event to handle the search button request
		$("#searchcity").on("click", retrieveWeather);

		// Assign an event to ALL buttons added dynamically into the DOM. These buttons originally
		// will NOT be there. To reset the array use the inspect to delete the LocalStorage
		$(".button-cached").on("click", retrieveCachedWeather);

		// Assign an event to Search Weather input box to clear the working area
		$("#searchWeather").on("keyup", clearWorkarea)

		testingAPI();
	}

	init();
});