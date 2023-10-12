/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});

//Waiting for the entire page to finish loading, then executing the showPosition() function
window.addEventListener('load', function () {
    showPosition();
});

//Declaring the map variables to be used
var infoWindow;
var directionsService;
var directionsRenderer;
var infoPanel;

//Function to show the user's position on the map
function showPosition() {
    //Checking if the browser supports HTML5 geolocation
    if (navigator.geolocation) {
        //Getting current position and calling the initMap() function with the latitude and longtitude as parameters
        navigator.geolocation.getCurrentPosition(function (position) {
            initMap(position.coords.latitude, position.coords.longitude);
        });
    } else {
        alert("Sorry, your browser does not support HTML5 geolocation.");
    }
}

//Function to initialise the map
function initMap(userLatitude, userLongitude) {
    //Creating a new Google Map centered at the user's coordinates
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: userLatitude, lng: userLongitude },
        zoom: 15
    });

    //Initialising map-related variables
    infoWindow = new google.maps.InfoWindow();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    //Setting the map for directions rendering
    directionsRenderer.setMap(map);

    //Getting the element for the information panel

    //Performing a text search for pharmacies using the Places API
    infoPanel = document.getElementById('info-panel');
    var request = {
        query: 'pharmacy',
        fields: ['name', 'geometry'],
    };
    var service = new google.maps.places.PlacesService(map);

    //Handling the results of the text search
    service.textSearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            //Sorting places by distance from the user's location
            results.sort(function (a, b) {
                var distanceA = google.maps.geometry.spherical.computeDistanceBetween({ lat: userLatitude, lng: userLongitude }, a.geometry.location);
                var distanceB = google.maps.geometry.spherical.computeDistanceBetween({ lat: userLatitude, lng: userLongitude }, b.geometry.location);
                return distanceA - distanceB;
            });
            //Creating marker for each pharmacy
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    });

    //Function to create a marker for a place (pharmacy)
    function createMarker(place) {
        //Creating a marker
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name
        });
        //Adding a click listener to the marker
        marker.addListener("click", function () {
            //Calling the calculateAndDisplayRoute() function to display the route from the user to the pharmacy
            calculateAndDisplayRoute({ lat: userLatitude, lng: userLongitude }, place.geometry.location);
            //Creating content for info window
            var content = `<strong>${place.name}</strong><br>${place.formatted_address}<br>`;
            content += `<a href="https://www.google.com/maps?q=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank">Open in Google Maps</a>`;
            //Setting the content and open the info window
            infoWindow.setContent(content);
            infoWindow.open(marker.getMap(), marker);
        });
    }
}

//Function to calculate and display the route from origin to destination
function calculateAndDisplayRoute(origin, destination) {
    //Creating the route
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            //Setting the directions on the map
            directionsRenderer.setDirections(response);
        } else {
            //Displaying an alert if directions request fails
            window.alert('Directions request failed due to ' + status);
        }
    });
}

//Function to communicate with the Chatbot
function sendMessage(user_icon, bot_icon) {
    const userInput = document.getElementById("user-input").value;
    const chatbox = document.getElementById("chat-box");

    //Displaying the user's message in the chatbox
    chatbox.innerHTML += `<div class="ChatItem ChatItem--expert">
    <div class="ChatItem-meta">
      <div class="ChatItem-avatar">
        <img class="ChatItem-avatarImage" src="` + user_icon + `">
      </div>
    </div>
    <div class="ChatItem-chatContent">
      <div class="ChatItem-chatText">${userInput}</div>
    </div>
  </div>`;

    //Making an API call to GPT-3 using JavaScript's fetch() function
    fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ text: userInput }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            //Displaying the response from GPT-3 in the chatbox
            chatbox.innerHTML += `<div class="ChatItem ChatItem--customer">
              <div class="ChatItem-meta">
                <div class="ChatItem-avatar">
                  <img class="ChatItem-avatarImage" src="` + bot_icon + `">
                </div>
              </div>
              <div class="ChatItem-chatContent">
                <div class="ChatItem-chatText">${data.text}</div>
              </div>
            </div>`
        })
        .catch(error => {
            console.error(error);
        });

    //Clearing the user input field
    document.getElementById("user-input").value = '';
}


//Waiting for the entire page to finish loading, then executing the showPosition() function
window.addEventListener('load', function () {
    const divToObserve = document.getElementById('chat-box'); // Replace 'myDiv' with the actual ID of your div

    if (divToObserve) {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Content of the div was changed
            divToObserve.scrollTop = divToObserve.scrollHeight;
        }
        }
    });

    const config = { childList: true };
    observer.observe(divToObserve, config);
    } else {
    console.error('The specified div element was not found.');
    }
});

function processImage() {
    // Assuming 'file' is the File object obtained from the input element
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];

    var formData = new FormData();
    formData.append('fileInput', file);

    fetch('/process', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
}

function speak() {
    var textarea = document.getElementsByClassName('ChatItem-chatText');
    for (var i = 0; i < textarea.length; i++) {
        var text = textarea[i].innerHTML;
        var synth = window.speechSynthesis;

        // Wait for voices to be loaded
        var utterance = new SpeechSynthesisUtterance(text);
        var voices = synth.getVoices();

        utterance.volume = 0.1; // You can adjust this value

        // Set voice (you can change the index to select a different voice)
        utterance.voice = voices[1]; // You can change this index           

        synth.speak(utterance);
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        // Trigger the same action as the "Send" button
        sendMessage(user_icon_src, bot_icon_src);
    }
}

