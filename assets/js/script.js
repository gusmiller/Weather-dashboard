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
	var tasksRegistry = []; // Declare empty array - this will hold the tasks
	var startingTime = 9; // Scheduler starting time
	var endingTime = 19; // Scheduler ending time

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
			"schedulerTasks",
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
	 * This function will retrieve from the Local Storage the tasks assigned to the current Work Day Scheduler.
	 * The function returns a populates -or empty, array that may contain the tasks stored.
	 */
	function retrieveData() {

		// Retrieve from local storage the Schedule Tasks and convert into object. We are 
		// expecting an array
		// https://www.w3schools.com/Js/js_json_parse.asp
		// https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
		var tasks = JSON.parse(localStorage.getItem("schedulerTasks"));

		if (tasks !== null) {
			// Validate whether we have a single item or an array of objects
			if (
				// Prototypes are the mechanism by which JavaScript objects inherit features from one another.
				// It helps me determine the type of object
				// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes
				Object.prototype.toString.call(tasks) !==
				"[object Array]"
			) {
				// Push task into array for further use
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
				tasksRegistry.push(tasks); // Initialize the tasks array
			} else {
				for (i = 0; i <= tasks.length - 1; i++) {
					// Add task to public array - used in other processes.
					// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
					tasksRegistry.push(tasks[i]); // Add tasks into array

					// Using JQuery children we access textares and add task retrieve from local storage
					// https://api.jquery.com/children/
					$("#" + tasks[i].key)
						.children("textarea")
						.val(tasks[i].task);
				}
			}
		}
	}

	/**
	 * This function will iterate through the sections in the scheduler and validate current time is being
	 * properly handled. As time runs the hours change and application needs to refresh its state. This could cause some
	 * performance issues but it is ok for now.
	 */
	function validateCurrent() {

		// This will retrieve the current hour and format it using DayJs library.
		// https://day.js.org/docs/en/display/format
		var currentHour = dayjs().format("HH"); 
		var $parent = $("#timeBlockArea");

		// Iterate through all elements in the timeBlockArea. I had  used a selector like this $(#timeBlockA > Section)
		// but I did not have the accessibility I was hoping for. This method works fine
		$parent.children().each(function () {
			if (this.id != "newTime04") {
				// Avoid this element -it is hidden.

				var selectTimeBlock = $("#" + this.id); // Build the id in string
				var text = selectTimeBlock.children().eq(0).text(); // Grab the time from children element

				// This function arses the string argument and returns an integer
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
				var hour = parseInt(text.replace(":00", "")); // Remove the minutes format and convert into integer

				// Reset color by removing classes that define the color of the timeBlock
				// https://www.geeksforgeeks.org/how-to-add-or-remove-class-in-jquery/
				selectTimeBlock.removeClass(
					"past present future nonworking"
				); // Get rid of classes

				// Re-assign the classes based on the time criteria; some hours are non-working hours, past, current
				// and future hours. Note: requirement does not ask for non-working hours, but I put them for higher
				// visualization of the day
				if (+currentHour == hour) {
					selectTimeBlock.addClass("present");
					disableItem = "";
				} else if (
					hour > +currentHour &&
					hour <= endingTime - 1
				) {
					selectTimeBlock.addClass("future");
					disableItem = "";
				} else {
					selectTimeBlock.addClass("past");
				}
			}
		});
	}

	/**
	 * Initialize the page time-block elements, set their color and availability based in the time. We need t
	 * build the HTML from scratch using text strings. I had in mind to CLONE a template row and add it but
	 * it would not add; as the next row. Leave for later.
	 */
	function init() {

		// This will retrieve the current hour and format it using DayJs library.
		// https://day.js.org/docs/en/display/format
		var currentHour = dayjs().format("HH"); 

		// Iterate through the hours that would be included in the scheduler. We are using non-working hours
		// only to demonstrate that we can handle them. This runs automatically when document is ready and it
		// will start a timer to refresh when the current hour changes.
		for (var hour = startingTime; hour < endingTime; hour++) {

			// Add leading zeros to the hour. Build time.
			var formattedHour = addLeadingZero(hour); 
			var time = formattedHour + ":00";
			var newTimeFormatted = "newTime" + formattedHour;

			// Work on disabling items and setting up the colors of the time blocks. Note: this will have to be
			// executed once loaded but then it should trigger every hour.
			var disableItem = " disabled";
			var statusTimeColor = "past";

			if (+currentHour == hour) {
				statusTimeColor = "present";
				disableItem = "";
			} else if (hour > +currentHour && hour <= endingTime - 1) {
				statusTimeColor = "future";
				disableItem = "";
			} else {
				//Uncomment next line to enable data entry on all past timeBlocks. For testing purposes.
				//disableItem = "";
			}

			// Build HTML code using string and concatenating variables; slick but not the way I would
			// like it. Line #62 contains the clone I had in mind, but was not implemented. Kept code for
			// future implementations.
			var htmlCode =
				'<section id="' + newTimeFormatted + '" class="row time-block ' + statusTimeColor + '">' +
					'<div class="col-2 col-md-1 hour text-center py-3">' + time + "</div>" +
					'<textarea class="col-8 col-md-10" rows="3" ' + disableItem + "> </textarea>" +
					'<button type="button" class="btn saveBtn col-2 col-md-1" aria-label="save"' + disableItem + ">" +
						'<i class="fas fa-save" aria-hidden="true"></i>' + 
					"</button>" +
				"</section>";

			// Inserting before the anchor for the order of time
			// https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
			$(htmlCode).insertBefore("#anchor"); 
		}

		// Using DayJs library we display the date on hero section
		// https://day.js.org/docs/en/display/format
		$("#currentDay").text(dayjs().format("MMMM DD, YYYY"));

		// Set an interval of 60 seconds to run this function
		// https://developer.mozilla.org/en-US/docs/Web/API/setInterval
		setInterval(validateCurrent, 60 * 1000);
		retrieveData(); // This will call the function that retrieves data from LocalStorage

		$("button").on("click", saveInformation);
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
