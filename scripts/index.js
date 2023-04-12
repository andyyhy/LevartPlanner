// ==============================================
// ============ Page Scoped Globals Here ========
// ==============================================
var itineraries = [];

var itinerary_name_to_index = {};

var current_itinerary_index = 0;

var itinerary_hash = {};

var id_increment = 0;

var dropdown_is_toggled = false;

var current_view = "default"

var supported_cities = ["paris", "shenzhen", "manchester", "cusco", "casablanca"]

var current_display_date = new Date();

var actualDate = new Date();

var CurTripStartDate;
var CurTripEndDate;


// Create an array of month names
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Create an array of day names
var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// ==============================================
// ============ Functional Code Here ============
// ==============================================


$(document).ready(function () {
    console.log
    clear_page();
    $(".itinerary_page").show();
    //$(".add_new_page").show();
    //$(".boxes").show();




    //make_default_itinerary();
    //load_calendar_view_page(current_itinerary_index);

    $('.calendar_view_page')

    $("#add_new_itinerary").click(load_add_new_itinerary_page);
    $("#home").click(load_itinerary_page);
    // event handler
    $("#dropdown_hotel1").click(load_add_hotel_page);
    $("#dropdown_flight1").click(load_add_flight_page);
    $("#dropdown_place1").click(load_add_place_page);
    $("#dropdown_restaurant1").click(load_add_restaurant_page);
    $("#dropdown_hotel2").click(load_add_hotel_page);
    $("#dropdown_flight2").click(load_add_flight_page);
    $("#dropdown_place2").click(load_add_place_page);
    $("#dropdown_restaurant2").click(load_add_restaurant_page);
    $("#dropdown_hotel3").click(load_add_hotel_page);
    $("#dropdown_flight3").click(load_add_flight_page);
    $("#dropdown_place3").click(load_add_place_page);
    $("#dropdown_restaurant3").click(load_add_restaurant_page);


    $('.default_view_btn').each(function () {
        $(this).on('click', function () {
            load_default_view_page(current_itinerary_index);
        });
    });

    $('.map_view_btn').each(function () {
        $(this).on('click', function () {
            load_map_view_page(current_itinerary_index);
        });
    });

    $('.calendar_view_btn').each(function () {
        $(this).on('click', function () {
            load_calendar_view_page(current_itinerary_index);
        });
    });

    // Add Event Listener to the calendar-header buttons
    $('#prev_month').on("click", function () {
        current_display_date.setMonth(current_display_date.getMonth() - 1);
        load_calendar_view_page(current_itinerary_index);
    });

    // Add Event Listener to the calendar-header buttons
    $('#next_month').on("click", function () {
        current_display_date.setMonth(current_display_date.getMonth() + 1);
        load_calendar_view_page(current_itinerary_index);
    });



    $('#add_trip_form').submit(function (event) {

        event.preventDefault(); // prevent form submission

        //Create new itinerary object
        var new_itinerary = {};

        var destination = $('input[type="text"]').val();
        var startDate = $('#start-date').val();
        var endDate = $('#end-date').val();

        CurTripStartDate = startDate;
        CurTripEndDate = endDate;

        if (endDate < startDate) {
            document.getElementById("error-message").style.display = "block";
            return false;
        } else {
            document.getElementById("error-message").style.display = "none";
        }


        //Fill with user input
        new_itinerary.destination = destination;
        new_itinerary.startDate = startDate;
        new_itinerary.endDate = endDate;
        new_itinerary.events = [];

        //Push to main itineraries array
        itineraries.push(new_itinerary);
        // debug
        console.log('Destination: ' + new_itinerary.destination);
        console.log('Start Date: ' + new_itinerary.startDate);
        console.log('End Date: ' + new_itinerary.endDate);
        console.log(itineraries);

        current_itinerary_index = itineraries.length - 1;

        var tempdate = new Date(new_itinerary.startDate.replace(/-/g, '\/'))

        current_display_date = tempdate;

        itinerary_hash[destination] = itineraries.length - 1;

        if (!supported_cities.includes(new_itinerary.destination.toLowerCase())) {
            new_itinerary.imgNum = (Math.floor(Math.random() * 5) + 1);
        }

        $('#add_trip_form')[0].reset();

        //Go to the current itinerary default view page
        load_default_view_page(itineraries.length - 1);
    });

    $('#hotel_form').submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting and reloading the page

        // Get the values from the form fields
        var hotelName = $('#hotel-name').val();
        var address = $('#hotel-address').val();
        var checkInDate = $('#check-in-date').val();
        var checkOutDate = $('#check-out-date').val();
        var confirmationCode = $('#hotel-confirmation-code').val();
        var hotelPhoneNumber = $('#hotel-phone-number').val();
        var note = $('#hotel-note').val();

        if (checkOutDate < checkInDate || checkInDate < CurTripStartDate || checkOutDate > CurTripEndDate) {
            document.getElementById("error-hotel").style.display = "block";
            return false;
        } else {
            document.getElementById("error-hotel").style.display = "none";
        }

        // Create a JavaScript object from the form values
        var hotel = {
            box_id: id_increment,
            box_type: "hotel",
            hotelName: hotelName,
            hotelAddress: address,
            startDate: checkInDate,
            endDate: checkOutDate,
            hotelConfirmationCode: confirmationCode,
            hotelPhoneNumber: hotelPhoneNumber,
            hotelNote: note
        };
        id_increment++;

        itineraries[current_itinerary_index].events.push(hotel);
        console.log(hotel); // Log the hotel object to the console for testing purposes
        $('#hotel_form')[0].reset();
        load_default_view_page(current_itinerary_index);

    });

    $('#flight_form').submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting and reloading the page

        // Get the values from the form fields
        var airlineName = $('#airline-name').val();
        var flightNumber = $('#flight-number').val();
        var departureAirport = $('#departure-airport').val();
        var arrivalAirport = $('#arrival-airport').val();
        var departureDate = $('#departure-date').val();
        var arrivalDate = $('#arrival-date').val();
        var departureTime = $('#departure-time').val();
        var arrivalTime = $('#arrival-time').val();
        var confirmationCode = $('#flight-confirmation-code').val();
        var note = $('#flight-note').val();

        console.log(confirmationCode);

        if (arrivalDate < departureDate || departureDate < CurTripStartDate || arrivalDate > CurTripEndDate) {
            document.getElementById("error-flight").style.display = "block";
            return false;
        } else {
            document.getElementById("error-flight").style.display = "none";
        }

        // Create a JavaScript object from the form values
        var flight = {
            box_id: id_increment,
            box_type: "flight",
            airlineName: airlineName,
            flightNumber: flightNumber,
            departureAirport: departureAirport,
            arrivalAirport: arrivalAirport,
            startDate: departureDate,
            endDate: arrivalDate,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            confirmationCode: confirmationCode,
            note: note
        };
        id_increment++;

        itineraries[current_itinerary_index].events.push(flight);

        console.log(flight); // Log the flight object to the console for testing purposes
        $('#flight_form')[0].reset();
        load_default_view_page(current_itinerary_index);

    });

    $('#restaurant_form').submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting and reloading the page

        // Get the values from the form fields
        var restaurant_name = $('#restaurant-name').val();
        var restaurant_address = $('#restaurant-address').val();
        var restaurant_phone_number = $('#restaurant-phone-number').val();
        var restaurant_date = $('#reservation-date').val();
        var restaurant_reservation_time = $('#reservation-time').val();
        var restaurant_note = $('#restaurant-note').val();

        if (restaurant_date < CurTripStartDate || restaurant_date > CurTripEndDate) {
            document.getElementById("error-res").style.display = "block";
            return false;
        } else {
            document.getElementById("error-res").style.display = "none";
        }

        // Create a JavaScript object from the form values
        var restaurant = {
            box_id: id_increment,
            box_type: "restaurant",
            restaurant_name: restaurant_name,
            restaurant_address: restaurant_address,
            restaurant_phone_number: restaurant_phone_number,
            startDate: restaurant_date,
            endDate: restaurant_date,
            restaurant_reservation_time: restaurant_reservation_time,
            note: restaurant_note
        };
        id_increment++;
        itineraries[current_itinerary_index].events.push(restaurant);

        console.log(restaurant); // Log the restaurant object to the console for testing purposes
        $('#restaurant_form')[0].reset();
        load_default_view_page(current_itinerary_index);

    });

    $('#place_form').submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting and reloading the page

        // Get the values from the form fields
        var placename = $('#place-name').val();
        var placeaddress = $('#place-address').val();
        var startTime = $('#start-time').val();
        var endTime = $('#end-time').val();
        var type = $('#place-type').val();
        var startdate = $('#place-date').val();
        var note = $('#place-note').val();

        if (startdate < CurTripStartDate || startdate > CurTripEndDate) {
            document.getElementById("error-place").style.display = "block";
            return false;
        } else {
            document.getElementById("error-place").style.display = "none";
        }

        // Create a JavaScript object from the form values
        var place = {
            box_id: id_increment,
            box_type: "place",
            placename: placename,
            placeaddress: placeaddress,
            startDate: startdate,
            endDate: startdate,
            startTime: startTime,
            endTime: endTime,
            placeType: type,
            note: note
        };
        id_increment++;
        itineraries[current_itinerary_index].events.push(place);

        console.log(place); // Log the place object to the console for testing purposes
        $('#place_form')[0].reset();
        load_default_view_page(current_itinerary_index);

    });
});

function load_itinerary_page() {
    clear_page();
    $(".itinerary_page").show();
    $('.itineraries_section_content').find('*').off();
    $(".itineraries_section_content").empty();

    if (itineraries.length != 0) {
        $("#start_page").text("");
        $("#start_page").css('margin-top', '0px');
    }
    else {
        $("#start_page").text("Start Creating Your Trip Today!");
        $("#start_page").css('margin-top', '200px');
    }

    for (itinerary of itineraries) {
        if ("imgNum" in itinerary) {
            var destination_img = "default" + itinerary.imgNum;
        }
        else {
            destination_img = itinerary.destination.toLowerCase();
        }
        var itineraryBoxHtml =
            '<div class="itinerary_box_wrapper">' +
            '<div class="box_text">' +
            '<div class="itinerary_box">' +
            '<img class="IMG" src="img/' + destination_img + '.jpg" alt="" style="width:100%;">' +
            '</div>' +
            '<div class="right_side">' +
            '<h2>' + itinerary.destination + '</h2>' +
            '<h5>' + itinerary.startDate + '--' + itinerary.endDate + '</h5>' +
            '<button class="view_detail_button' + '">View Details</button>' +
            '</div>' +
            '</div>' +
            '</div>';
        $('.itineraries_section_content').append(itineraryBoxHtml);
    }

    var all_view_buttons = document.querySelectorAll('.view_detail_button');
    all_view_buttons.forEach(button => {
        button.addEventListener('click', () => {
            var parentDiv = button.closest('.right_side');
            const h2Element = parentDiv.querySelector('h2');
            const h2Text = h2Element.textContent;
            for (var i = 0; i < itineraries.length; i++) {
                if (itineraries[i].destination == h2Text) {
                    var tempdate = new Date(itineraries[i].startDate.replace(/-/g, '\/'))
                    current_display_date = tempdate;
                    current_itinerary_index = i;
                    CurTripStartDate = itineraries[current_itinerary_index].startDate;
                    CurTripEndDate = itineraries[current_itinerary_index].endDate;
                    load_default_view_page(current_itinerary_index);
                    current_view = "default";
                    break;
                }
            }
        })
    })
}


function load_add_new_itinerary_page() {
    clear_page();
    $(".add_new_page").show();
}

function load_map_view_page(itinerary_index) {
    clear_page();
    $(".map_view_page").show();
    $("#map_view_content").empty();
    $(".trip_title").find('.add_to_trip_btn').off();
    $(".delete_trip").off();

    //Insert the destination title and date
    console.log(itinerary_index)
    $('.view_page_destination').text(itineraries[itinerary_index].destination);
    $('.view_page_date').text(itineraries[itinerary_index].startDate + "--" + itineraries[itinerary_index].endDate);

    reset_view_btn();
    $('.map_view_btn').css('background-color', '#A2BFBD');


    // Get references to the button and the dropdown menu
    var addToTripBtn = $(".add_to_trip_btn");
    var deleteTrip = $(".delete_trip");
    var dropdownMenu = $(".dropdown_content");

    if (dropdown_is_toggled) {
        dropdownMenu.toggle();
        dropdown_is_toggled = false
        addToTripBtn.css('background-color', '#425C5A');
    }

    // Attach a click event listener to the button
    addToTripBtn.on("click", function () {
        // Toggle the visibility of the dropdown menu
        dropdownMenu.toggle();
        if (dropdown_is_toggled) {
            dropdown_is_toggled = false;
            addToTripBtn.css('background-color', '#425C5A');
        }
        else {
            dropdown_is_toggled = true;
            addToTripBtn.css('background-color', '#A2BFBD');
        }
        console.log(dropdown_is_toggled);
    });


    var map_pic_str = "img/" + itineraries[itinerary_index].destination.toLowerCase() + "_map.jpg";

    var map_img = $('<img>').attr('src', map_pic_str);

    map_img.css({
        'max-width': '70%',
        'display': 'block',
        'margin': '20px auto'
    })

    $('#map_view_content').append(map_img);

    if (itineraries[itinerary_index].destination.length == 0) {
        $('#map_view_content').empty();
    }
    $(".delete_trip").click(function () {

        console.log(itineraries);
        itineraries.splice(itinerary_index, 1);

        console.log(itineraries);
        load_itinerary_page();

    });


}
function load_calendar_view_page(itinerary_index) {
    clear_page();
    $(".calendar_view_page").show();
    $(".calendar-table").empty();
    $(".trip_title").find('.add_to_trip_btn').off();
    $(".delete_trip").off();

    //Insert the destination title and date
    console.log(itinerary_index)
    $('.view_page_destination').text(itineraries[itinerary_index].destination);
    $('.view_page_date').text(itineraries[itinerary_index].startDate + "--" + itineraries[itinerary_index].endDate);

    reset_view_btn();
    $('.calendar_view_btn').css('background-color', '#A2BFBD');

    // Get references to the button and the dropdown menu
    var addToTripBtn = $(".add_to_trip_btn");
    var deleteTrip = $(".delete_trip");
    var dropdownMenu = $(".dropdown_content");

    if (dropdown_is_toggled) {
        dropdownMenu.toggle();
        dropdown_is_toggled = false
        addToTripBtn.css('background-color', '#425C5A');
    }

    // Attach a click event listener to the button
    addToTripBtn.on("click", function () {
        // Toggle the visibility of the dropdown menu
        dropdownMenu.toggle();

        if (dropdown_is_toggled) {
            dropdown_is_toggled = false;
            addToTripBtn.css('background-color', '#425C5A');

        }
        else {
            dropdown_is_toggled = true;
            addToTripBtn.css('background-color', '#A2BFBD');

        }
        console.log(dropdown_is_toggled);
    });

    //Generate Calendar HTML

    //Get itinerary dates
    var itinerary_start_date = new Date(itineraries[itinerary_index].startDate.replace(/-/g, '\/'));
    var itinerary_end_date = new Date(itineraries[itinerary_index].endDate.replace(/-/g, '\/'));

    console.log("itinerary start date: ", itinerary_start_date, itineraries[itinerary_index].startDate);
    console.log("itinerary end date: ", itinerary_end_date, itineraries[itinerary_index].endDate);

    // Get the year and month
    var year = current_display_date.getFullYear();
    var month = current_display_date.getMonth();


    //Update calendar header
    var month_year = $('.calendar-header h2');
    console.log(month_year);

    month_year.text(monthNames[month] + " " + year);

    // Create a table element
    var table = document.createElement("table");
    table.classList.add("calendar-table");

    // Create the table header
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Loop through the days of the week and create the header cells
    daysOfWeek.forEach(day => {
        var th = document.createElement("th");
        th.textContent = day;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    var tbody = document.createElement("tbody");

    // Get the number of days in the current month
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    console.log("days in month: ", daysInMonth)

    // Get the first day of the month
    var firstDayOfMonth = new Date(year, month, 1).getDay();
    console.log("first day of month: ", firstDayOfMonth)


    // Calculate the number of days from the previous month to display
    var daysFromPrevMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth;
    console.log("days from prev month: ", daysFromPrevMonth)
    var daysInPrevMonth = new Date(year, month, 0).getDate();
    console.log("days in prev month: ", daysInPrevMonth)

    // Create the rows and cells for the calendar
    let row = document.createElement("tr");

    console.log(itinerary_start_date.getDate());
    console.log(itinerary_end_date.getDate());

    // Loop through the cells to create the calendar
    for (let i = 0; i < 42; i++) {
        // Check if the current cell should display a day from the previous month
        if (i < daysFromPrevMonth) {
            var td = document.createElement("td");
            td.classList.add("prev-month");
            td.textContent = daysInPrevMonth - (daysFromPrevMonth - i) + 1;
            row.appendChild(td);
        }
        // Check if the current cell should display a day from the current month
        else if (i < daysInMonth + daysFromPrevMonth) {
            var day = i - daysFromPrevMonth + 1;
            var temp_date_obj = new Date(year, month, day)
            var td = document.createElement("td");
            td.textContent = day;
            console.log("start", itinerary_start_date.getMonth(), month, itinerary_start_date.getDate())
            console.log("end", itinerary_end_date.getMonth(), month, itinerary_end_date.getDate())

            console.log(day <= itinerary_end_date.getDate())
            // Add the "current-day" class to the cell if it is the current day
            if ((temp_date_obj >= itinerary_start_date) && (temp_date_obj <= itinerary_end_date)) {
                td.classList.add("itinerary-day");
                var scroll_div = document.createElement("div");
                scroll_div.classList.add("scroll-div");
                console.log(itineraries[itinerary_index].events)
                for (event_box of itineraries[itinerary_index].events) {
                    console.log(event_box)
                    var temp_start = new Date(event_box.startDate.replace(/-/g, '\/'));
                    var temp_end = new Date(event_box.endDate.replace(/-/g, '\/'));
                    if ((day >= temp_start.getDate() && day <= temp_end.getDate())) {
                        var event1 = document.createElement("span");
                        event1.classList.add("event");
                        if (event_box.box_type == "hotel") {
                            event1.textContent = event_box.hotelName;
                            console.log("here");
                        }
                        else if (event_box.box_type == "flight") {
                            event1.textContent = event_box.airlineName;
                        }

                        else if (event_box.box_type == "place") {
                            event1.textContent = event_box.placename;
                        }
                        else {
                            event1.textContent = event_box.restaurant_name;
                        }
                        scroll_div.appendChild(event1);
                    }
                }
                td.appendChild(scroll_div)
            }
            row.appendChild(td);
        }
        // Otherwise, the current cell should display a day from the next month
        else {
            var td = document.createElement("td");
            td.classList.add("next-month");
            td.textContent = i - (daysInMonth + daysFromPrevMonth) + 1;
            row.appendChild(td);
        }

        // If we've added 7 cells to the row, create a new row
        if (i % 7 === 6) {
            tbody.appendChild(row);
            row = document.createElement("tr");
        }
    }

    table.appendChild(tbody);

    // Add the table to the page
    var container = $('.calendar')

    console.log(container);
    container.append(table);

    $(".delete_trip").click(function () {

        console.log(itineraries);
        itineraries.splice(itinerary_index, 1);

        console.log(itineraries);
        load_itinerary_page();

    });


}

function load_default_view_page(itinerary_index) {
    clear_page();
    $(".default_view_page").show();
    $("#default_view_content").empty();
    $(".trip_title").find('.add_to_trip_btn').off();
    $(".delete_trip").off();

    //Insert the destination title and date
    console.log(itinerary_index)
    $('.view_page_destination').text(itineraries[itinerary_index].destination);
    $('.view_page_date').text(itineraries[itinerary_index].startDate + "--" + itineraries[itinerary_index].endDate);

    reset_view_btn();
    $('.default_view_btn').css('background-color', '#A2BFBD');

    //sort events
    itineraries[itinerary_index].events.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));

    // load all boxes
    loop_boxes(itinerary_index);

    // Get references to the button and the dropdown menu
    var addToTripBtn = $(".add_to_trip_btn");
    var deleteTrip = $(".delete_trip");
    var dropdownMenu = $(".dropdown_content");

    if (dropdown_is_toggled) {
        dropdownMenu.toggle();
        dropdown_is_toggled = false
        addToTripBtn.css('background-color', '#425C5A');
    }

    // Attach a click event listener to the button
    addToTripBtn.on("click", function () {
        // Toggle the visibility of the dropdown menu
        dropdownMenu.toggle();

        if (dropdown_is_toggled) {
            dropdown_is_toggled = false;
            addToTripBtn.css('background-color', '#425C5A');

        }
        else {
            dropdown_is_toggled = true;
            addToTripBtn.css('background-color', '#A2BFBD');

        }
        console.log(dropdown_is_toggled);
    });

    var all_delete_button = document.querySelectorAll('.delete-button');

    all_delete_button.forEach(button => {
        button.addEventListener('click', () => {
            var parentDiv = button.closest('.box');

            var box_id = parentDiv.id;

            for (var i = 0; i < itineraries[itinerary_index].events.length; i++) {
                if (itineraries[itinerary_index].events[i].box_id == box_id) {
                    itineraries[itinerary_index].events.splice(i, 1);
                }
            }

            parentDiv.remove();

            var trip_content_div = document.querySelector('#default_view_content');
            var h1Elements = trip_content_div.querySelectorAll("h1")
            h1Elements.forEach(h1Element => {
                const nextElement = h1Element.nextElementSibling;
                if (!nextElement) {
                    console.log(12222);
                    h1Element.remove();

                }
                else if (!nextElement.classList.contains('box')) {
                    console.log(122);
                    h1Element.remove();
                }
            });
        })
    });

    $(".delete_trip").click(function () {

        console.log(itineraries);
        itineraries.splice(itinerary_index, 1);

        console.log(itineraries);
        load_itinerary_page();

    });
    return;
}

function loop_boxes(itinerary_index) {
    //Go through the hotels array and list out all hotel info

    if (itineraries[itinerary_index].events.length != 0) {
        var cur_date = itineraries[itinerary_index].events[0].startDate;
        var dateHTML = "<h1>" + cur_date + "</h1>";
        $('#default_view_content').append(dateHTML);
    }
    for (var box of itineraries[itinerary_index].events) {
        if (cur_date != box.startDate) {
            cur_date = box.startDate;
            var dateHTML = "<h1>" + cur_date + "</h1>";
            $('#default_view_content').append(dateHTML);
        }

        if (box.box_type == "hotel") {
            var hotelHtml = '<div class="box" id="' + box.box_id + '">' +
                '<div class="box_header">' +
                '<h2>Hotel</h2>' +
                '<button class="delete-button">Delete</button>' +
                '</div>' +
                '<div class="description">' +
                '<p><span class="description_title">Hotel Name:</span> ' + box.hotelName + '</p>' +
                '<p><span class="description_title">Check in:</span> ' + box.startDate + '<p>' +
                '<p><span class="description_title">Check out:</span> ' + box.endDate + '</p>' +
                '<p><span class="description_title">Hotel Address:</span> ' + box.hotelAddress + '</p>' +
                '<p><span class="description_title">Hotel Phone #:</span> ' + box.hotelPhoneNumber + '</p>' +
                '<p><span class="description_title">Notes:</span> ' + box.hotelNote + '</p>' +
                '</div>' +
                '</div>';

            $('#default_view_content').append(hotelHtml);
        }
        else if (box.box_type == "flight") {
            var flightHtml = '<div class="box" id="' + box.box_id + '">' +
                '<div class="box_header">' +
                '<h2>Flight</h2>' +
                '<button class="delete-button">Delete</button>' +
                '</div>' +
                '<div class="description">' +
                '<p><span class="description_title">Route:</span> ' + box.departureAirport + ' --> ' + box.arrivalAirport + '</p>' +
                '<p><span class="description_title">Flight Time:</span> ' + box.departureTime + ' - ' + box.arrivalTime + '</p>' +
                '<p><span class="description_title">Airline:</span> ' + box.airlineName + '</p>' +
                '<p><span class="description_title">Flight #:</span> ' + box.flightNumber + '</p>' +
                '<p><span class="description_title">Confirmation Code:</span> ' + box.confirmationCode + '</p>' +
                '<p><span class="description_title">Note:</span> ' + box.note + '</p>' +
                '</div>' +
                '</div>';

            $('#default_view_content').append(flightHtml);
        }

        else if (box.box_type == "place") {
            var placeHtml = '<div class="box" id="' + box.box_id + '">' +
                '<div class="box_header">' +
                '<h2>' + box.placeType + '</h2>' +
                '<button class="delete-button">Delete</button>' +
                '</div>' +
                '<div class="description">' +
                '<p><span class="description_title">Name:</span> ' + box.placename + '</p>' +
                '<p><span class="description_title">Address:</span> ' + box.placeaddress + '</p>' +
                '<p><span class="description_title">Open Hours:</span> ' + box.startTime + '-' + box.endTime + '</p>' +
                '<p><span class="description_title">Note:</span> ' + box.note + '</p>' +
                '</div>' +
                '</div>';
            $('#default_view_content').append(placeHtml);
        }
        else {
            var restaurantHtml = '<div class="box" id="' + box.box_id + '">' +
                '<div class="box_header">' +
                '<h2>Restaurant</h2>' +
                '<button class="delete-button">Delete</button>' +
                '</div>' +
                '<div class="description">' +
                '<p><span class="description_title">Name:</span> ' + box.restaurant_name + '</p>' +
                '<p><span class="description_title">Address:</span> ' + box.restaurant_address + '</p>' +
                '<p><span class="description_title">Phone #:</span> ' + box.restaurant_phone_number + '</p>' +
                '<p><span class="description_title">Reservation Time:</span> ' + box.restaurant_reservation_time + '</p>' +
                '<p><span class="description_title">Note:</span> ' + box.note + '</p>' +
                '</div>' +
                '</div>';
            $('#default_view_content').append(restaurantHtml);
        }
    }
}

function load_add_hotel_page() {

    clear_page();
    $(".add_hotel").show();
    $("#hotel_form").find('.goback').off();
    $(".goback").click(function () {
        load_default_view_page(current_itinerary_index);
    });

    return;
}

function load_add_flight_page() {
    clear_page();
    $(".add_flight").show();
    $("#hotel_form").find('.goback').off();
    $(".goback").click(function () {
        load_default_view_page(current_itinerary_index);
    });

    return;
}

function load_add_place_page() {
    clear_page();
    $(".add_place").show();
    $("#hotel_form").find('.goback').off();
    $(".goback").click(function () {
        load_default_view_page(current_itinerary_index);
    });
    return;
}

function load_add_restaurant_page() {
    clear_page();
    $(".add_restaurant").show();
    $("#hotel_form").find('.goback').off();
    $(".goback").click(function () {
        load_default_view_page(current_itinerary_index);
    });
    return;
}


function clear_page() {
    $(".add_new_page").hide();
    $(".itinerary_page").hide();
    $(".default_view_page").hide();
    $(".map_view_page").hide();
    $(".calendar_view_page").hide();
    $(".add_hotel").hide();
    $(".add_flight").hide();
    $(".add_restaurant").hide();
    $(".add_place").hide();
}

function reset_view_btn() {
    $('.default_view_btn').css('background-color', '#425C5A');
    $('.map_view_btn').css('background-color', '#425C5A');
    $('.calendar_view_btn').css('background-color', '#425C5A');
}

//For testing
function make_default_itinerary() {
    //Create new itinerary object
    var new_itinerary = {};

    //Fill with user input
    new_itinerary.destination = "paris";
    new_itinerary.startDate = "2023-4-01";
    new_itinerary.endDate = "2023-4-15";
    new_itinerary.events = [];

    var hotel = {
        box_type: "hotel",
        hotelName: "Hilton",
        startDate: "2023-4-03",
        endDate: "2023-4-13"
    }
    new_itinerary.events.push(hotel);

    var flight = {
        box_type: "flight",
        airlineName: "Delta",
        startDate: "2023-4-05",
        endDate: "2023-4-07"
    }
    new_itinerary.events.push(flight);
    new_itinerary.events.push(flight);
    new_itinerary.events.push(flight);
    new_itinerary.events.push(flight);


    //Push to main itineraries array
    itineraries.push(new_itinerary);
    // debug
    console.log('Destination: ' + new_itinerary.destination);
    console.log('Start Date: ' + new_itinerary.startDate);
    console.log('End Date: ' + new_itinerary.endDate);
    console.log(itineraries);

    current_itinerary_index = itineraries.length - 1;

    var tempdate = new Date(new_itinerary.startDate);

    current_display_date.setMonth(tempdate.getMonth());

    if (!supported_cities.includes(new_itinerary.destination)) {
        new_itinerary.imgNum = (Math.floor(Math.random() * 4) + 1);
    }
}