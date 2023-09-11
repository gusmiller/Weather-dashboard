/**
 * Carleton Bootcamp - 2023
 * Copyright 2023 Gustavo Miller
 * Licensed under MIT
 * Assignment - 05 Work Day Scheduler
 */

/**
 * Main jQuery entry call. Wrapped after the page load process has been completed and document can be manipulated safely.
 * It contains all functions available.
 */
$(document).ready(function () {
	const openWeatherAPI = "bbc3d2f0a62f5953d89a98a20be48141";
	const bingApi = "AiWJmhnxfhdTKeo19xy2NrVRNuGJlN9DiTfsDFV0AbdyHZHjWLv8ru9SloAmYPbk";

	var tasksRegistry = []; // Declare empty array - this will hold the tasks
	var latitude = "";
	var longitude = "";
	var selectedCity = "";

	/**
	 * This function will connect to the API, request information and process if everything is ok.
	 * Personal API: 313db44690e1bc1d83bcbf0de3ce1813
	 * API URL: https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=313db44690e1bc1d83bcbf0de3ce1813
	 */
	function searchInformation() {

		// Retrieve the city selected by the user.
		selectedCity = $("#searchWeather").val();
		const geocodingEndpoint = `https://dev.virtualearth.net/REST/v1/Locations?q=${selectedCity}&key=${bingApi}`;

		// Make an HTTP GET fetch request to the API
		fetch(geocodingEndpoint)
			.then((response) => response.json())
			.then((data) => {
				// Extract the coordinates from the response
				const firstLocation = data.resourceSets[0].resources[0];
				latitude = firstLocation.point.coordinates[0];
				longitude = firstLocation.point.coordinates[1];

				currentWeatherCity(); // call the current weather information
				getForecastData(); // Call the forecast weather
			})
			.catch((error) => {
				console.error("Error:", error);
				return false;
			});
	}

	/**
	 * This function will retrieve the current weather in the city selected. We could get 
	 * the information from the list as well.
	 */
	function currentWeatherCity() {
		const currentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherAPI}`;

		fetch(currentWeather)
			.then(response => response.json())
			.then(data => {

				// Format date to a simple and short date.
				// https://day.js.org/docs/en/display/format
				$("#cityCurrentWeather").text(selectedCity + " (" + dayjs().format("DD/MM/YYYY") + ")");

				$("#temperatureHeader").text(data.main.temp);
				$("#windHeader").text(data.wind.speed);
				$("#humidityHeader").text(data.main.humidity);

			})
			.catch(error => {
				console.error('Error:', error);
			})
	}

	/**
	 * This function will retrieve the coordinates for the selected city using Bing Virtual Earth API for 
	 * Developers. If the process is correct then It will return the coordinates (latitude/longitude)
	 * @param {*} city 
	 */
	function getForecastData(city) {
		const forecasWeather = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherAPI}`;
		const openWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${openWeatherAPI}`;
		const forecastEndpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openWeatherAPI}&units=metric`;

		fetch(forecasWeather)
			.then(response => response.json())
			.then(data => {
				// Extract and process the forecast data
				const forecast = data.list;

				forecast.foreach(forecast => {
					const date = forecast.dt_txt;
					console.log(dayjs(forecasts.dt_txt).format("DD/MM/YYYY"), forecasts.main.temp, forecasts.main.humidity);
				})
			})
			.catch(error => {
				console.error('Error:', error);
			});

	}

	/**
	 * This function will save the information into the Local Storage. It validates that item doesn't already
	 * exist and if it does then it updates data. We do the search using the timeBlock id, which acts as a
	 * primary key
	 */
	function saveInformation() {
		var timeBlock = $(this).parent(); // Retrieve from the button the parent element -to retrieve key

		// Build score object. Retrieve time-Block Primary ID key and the textarea value
		var data = {
			key: timeBlock.attr("id"),
			task: timeBlock.children("textarea").val(),
		};

		// Attempt to find the key in array
		var index = searchData(data.key);

		if (index == null) {
			// Add new object to the local storage
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
			tasksRegistry.push(data);
		} else {
			tasksRegistry[index].task = data.task;
		}

		// Window: localStorage property - data has no expiration time
		// https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
		// https://www.w3schools.com/Js/js_json_stringify.asp
		localStorage.setItem(
			"weatherSearch",
			JSON.stringify(tasksRegistry)
		);
	}

	/**
	 * This function will validate the task to save already exists; which means that we are
	 * updating the task. In case there is no records then it will return null.
	 * @param {*} key
	 * @returns index position or null
	 */
	function searchData(key) {
		if (tasksRegistry.length != 0) {
			for (i = 0; i <= tasksRegistry.length - 1; i++) {
				if (tasksRegistry[i].key == key) {
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
	function retrieveData() {
		// Retrieve from local storage the Schedule Tasks and convert into object. We are
		// expecting an array
		// https://www.w3schools.com/Js/js_json_parse.asp
		// https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
		var autoComplete = JSON.parse(
			localStorage.getItem("weatherSearch")
		);

		// Validate whether autocomplete array is null - add default list when empty 
		if (autoComplete === null) {
			autoComplete = ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Gatineau',
				'Quebec', 'Winnipeg', 'Hamilton', 'Kitchener', 'Cambridge', 'Waterloo'];
			// https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
			// https://www.w3schools.com/Js/js_json_stringify.asp
			localStorage.setItem("weatherSearch", JSON.stringify(autoComplete));
		}

		// Set up the autocomplete list into element
		$("#searchWeather").autocomplete({
			source: autoComplete,
		});
	}

	/**
	 * Initialize the page time-block elements, set their color and availability based in the time. We need t
	 * build the HTML from scratch using text strings. I had in mind to CLONE a template row and add it but
	 * it would not add; as the next row. Leave for later.
	 */
	function init() {

		retrieveData(); // This will call the function that retrieves data from LocalStorage
		$("#searchcity").on("click", searchInformation);
	}

	/**
	 * This function receives the hour being processed, then adds a leading zero and returns the results. This could
	 * have been implemented in the calling function, but we want to demonstrate that we can use out-side resources.
	 * @param {*} num
	 * @returns
	 */
	function addLeadingZero(num) {
		return num < 10 ? "0" + num : num;
	}

	init();
});
