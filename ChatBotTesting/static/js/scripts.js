/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

//Place Line 11 and 12 in Dictionary based on page URL to have a tutorial per page
homeDemoText = [
    "To start a conversation with the chatbot, you can type your questions or messages in the \"userInput\" field.",
    "Click the \"Send\" button to send your typed message to the chatbot.",
    "If you want to clear the chat and start over, use the \"Clear\" button.",
    "The microphone button allows you to communicate with the chatbot through voice input instead of typing.",
    "The speaking icon can be used to have the chatbot's responses read aloud.",
    "You can control the speaking volume by using the volume slider.",
    "To have the chatbot read a single message aloud, click the speaker button.",
    "These messages serve as optional initial prompts."
];

homePopupReferenceList = ["userInput", "chatBotSendButton", "chatBotClearButton", "toggleSpeechRecognition", "speak", "chatVolumeSlider", "readMessage", "example-message"];

prescriptionInfoDemoText = [
    "This dropdown here contains the antibiotic types.",
    "This dropdown here contains the different notations that may be prescribed.",
    "This dropdown here contains the different abbreviations used in prescriptions.",
    "This is the explanation of the above selected options."
];

prescriptionInfoReferenceList = ["antibiotics-dropdown", "notations-dropdown-container", "abbreviations-dropdown-container", "explanationText"]

mapDemoText = [
    "This here is the map.",
    "Click on a marker on the map. The red markers represent pharmacies whilst the blue markers represent General Practitioners.",
    "A route is now displayed."
];

mapPopupReferenceList = ["map", "map", "map"]

let popupTextList = { "/": homeDemoText, "/info": null, "/faq": null, "/prescriptionInfo": prescriptionInfoDemoText, "/map": mapDemoText, "/quiz": null }

let popupReferenceList = { "/": homePopupReferenceList, "/info": null, "/faq": null, "/prescriptionInfo": prescriptionInfoReferenceList, "/map": mapPopupReferenceList, "/quiz": null }

let currentReferencePopup = popupReferenceList[window.location.pathname][0];
let popupText = popupTextList[window.location.pathname][0];

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

    var slider = document.getElementById("chatVolumeSlider");

    slider.addEventListener("input", function () {
        var value = slider.value;
        var percentage = (value - slider.min) / (slider.max - slider.min) * 100;
        var bg = "linear-gradient(to right, var(--bs-white) 0%, var(--bs-white)" + percentage + "%, gray " + percentage + "%, gray 100%)";
        slider.style.background = bg;
    });
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
    // Creating a new Google Map centered at the user's coordinates
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: userLatitude, lng: userLongitude },
        zoom: 15
    });

    // Initialising map-related variables
    infoWindow = new google.maps.InfoWindow();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    // Setting the map for directions rendering
    directionsRenderer.setMap(map);

    // Getting the element for the information panel
    infoPanel = document.getElementById('info-panel');

    // Perform a text search for pharmacies using the Places API
    var pharmacyRequest = {
        query: 'pharmacy',
        fields: ['name', 'geometry'],
    };

    // Perform a text search for general practitioners
    var gpRequest = {
        query: 'general practitioner',
        fields: ['name', 'geometry'],
    };

    var service = new google.maps.places.PlacesService(map);

    // Handling the results of the text search for pharmacies
    service.textSearch(pharmacyRequest, function (pharmacyResults, pharmacyStatus) {
        if (pharmacyStatus === google.maps.places.PlacesServiceStatus.OK) {
            // Sorting places by distance from the user's location
            pharmacyResults.sort(function (a, b) {
                var distanceA = google.maps.geometry.spherical.computeDistanceBetween(
                    { lat: userLatitude, lng: userLongitude },
                    a.geometry.location
                );
                var distanceB = google.maps.geometry.spherical.computeDistanceBetween(
                    { lat: userLatitude, lng: userLongitude },
                    b.geometry.location
                );
                return distanceA - distanceB;
            });
            // Creating marker for each pharmacy
            for (var i = 0; i < pharmacyResults.length; i++) {
                createMarker(pharmacyResults[i], true);
            }
        }
    });

    // Handling the results of the text search for general practitioners
    service.textSearch(gpRequest, function (gpResults, gpStatus) {
        if (gpStatus === google.maps.places.PlacesServiceStatus.OK) {
            // Sorting places by distance from the user's location
            gpResults.sort(function (a, b) {
                var distanceA = google.maps.geometry.spherical.computeDistanceBetween(
                    { lat: userLatitude, lng: userLongitude },
                    a.geometry.location
                );
                var distanceB = google.maps.geometry.spherical.computeDistanceBetween(
                    { lat: userLatitude, lng: userLongitude },
                    b.geometry.location
                );
                return distanceA - distanceB;
            });
            // Creating marker for each general practitioner
            for (var i = 0; i < gpResults.length; i++) {
                createMarker(gpResults[i], false);
            }
        }
    });

    // Function to create a marker for a place (pharmacy or general practitioner)
    function createMarker(place, isPharmacy = false) {
        // Creating a marker
        var markerIcon = null; // Default marker icon (no custom icon)

        if (isPharmacy) {
            // Check if the place is a pharmacy and set a custom pharmacy marker icon
            markerIcon = {
                url: '../static/assets/img/red_location.png', // Replace with the actual path to your pharmacy marker icon image
            };
        } else {
            // Check if the place is a general practitioner and set a custom GP marker icon
            markerIcon = {
                url: '../static/assets/img/blue_location.png', // Replace with the actual path to your blue GP marker icon image
            };
        }

        // Creating a marker with the selected marker icon
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name,
            icon: markerIcon // Set the marker icon
        });

        // Adding a click listener to the marker
        marker.addListener("click", function () {
            // Calling the calculateAndDisplayRoute() function to display the route from the user to the place
            calculateAndDisplayRoute({ lat: userLatitude, lng: userLongitude }, place.geometry.location);
            // Creating content for info window
            var content = `<strong>${place.name}</strong><br>${place.formatted_address}<br>`;
            content += `<a href="https://www.google.com/maps?q=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank">Open in Google Maps</a>`;
            // Setting the content and opening the info window
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

// Function to handle choice selection
function selectChoice(choice) {
    document.getElementById("userInput").value = choice

    sendMessage(user_icon_src, bot_icon_src)
}


//Function to communicate with the Chatbot
function sendMessage(user_icon, bot_icon) {
    const userInput = document.getElementById("userInput").value;
    const chatbox = document.getElementById("chatBox");

    var choices = document.getElementsByClassName('temporaryChoices');

    for (var i = 0; i < choices.length; i++) {
        choices[i].style.display = 'none';
    }



    if (userInput !== "") {
        //Displaying the user's message in the chatbox
        chatbox.innerHTML += `<div class="ChatItem ChatItem--expert">
            <div class="ChatItem-meta">
            <div class="ChatItem-avatar">
                <img class="ChatItem-avatarImage" src="` + user_icon + `">
            </div>
            </div>
            <div class="ChatItem-chatContent">
            <div class="ChatItem-chatText">${userInput}
            <button id="readMessage" onclick="readMessage(this)" oncontextmenu="showVolumeSlider(event)">
                    <img src="../static/assets/img/testingSpeaker2.png" alt="Speaker Icon">
                </button>
            </div>
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
                        <div class="ChatItem-chatText">${data.text}
                        <button id="readMessage" onclick="readMessage(this)" oncontextmenu="showVolumeSlider(event)">
                            <img src="../static/assets/img/testingSpeaker3.png" alt="Speaker Icon">
                        </button>
                        </div>
                    </div>
                    </div>`
            })
            .catch(error => {
                console.error(error);
            });

        //Clearing the user input field
        document.getElementById("userInput").value = '';
        userInput.value = "";
    } else {
        // The input is empty, handle this case (e.g., display an alert)
        alert("Please enter a message before sending.");
    }
}

//Waiting for the entire page to finish loading, then executing the showPosition() function
window.addEventListener('load', function () {
    const divToObserve = document.getElementById('chatBox');

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

    if (formData) {
        console.log("YEAH");
    }

    fetch('/api/scan_barcode', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').textContent = data.text;
        });
}

var synth = window.speechSynthesis;
var voices = synth.getVoices();
var currentTextIndex = 0; // To keep track of the text being spoken

function showVolumeSlider(event) {
    event.preventDefault();
    var slider = document.getElementById("chatVolumeSlider");
    slider.style.display = "block";
    var volumeRange = document.getElementById("chatVolumeSlider");
    volumeRange.value = parseFloat(utterance.getAttribute("data-volume")) || 0.5;
}

function speak() {
    var textarea = document.getElementsByClassName('ChatItem-chatText');
    var lengthOfTextArea = textarea.length;
    var text = "";
    for (var counter = 0; counter < lengthOfTextArea; counter++) {
        text = textarea[counter].innerText;

        console.log(text)
        // Create a new SpeechSynthesisUtterance for each text
        var utterance = new SpeechSynthesisUtterance(text);

        // Set the volume from the slider
        var volumeRange = document.getElementById("chatVolumeSlider");

        var value = parseFloat(volumeRange.value);
        utterance.volume = value;

        synth.speak(utterance);
    }
}

function readMessage(button) {
    // Get the text from the parent <div> element
    console.log("Dhalna")
    var chatText = button.parentElement.textContent.trim();
    console.log(chatText)
    // Create a new SpeechSynthesisUtterance for the text
    var utterance = new SpeechSynthesisUtterance(chatText);

    // Set the volume from the slider
    var volumeRange = document.getElementById("chatVolumeSlider");
    var value = parseFloat(volumeRange.value);
    utterance.volume = value;

    synth.speak(utterance);
}

/* ------------------------------------------------------ */
/* Speech to Text */
document.addEventListener('DOMContentLoaded', function () {
    var userInput = document.getElementById('userInput'); // Get the text input element

    handleFormSubmission();
});

var recognition;
function startSpeechToText() {
    document.getElementById("recognitionIcon").src = "../static/assets/img/speaker.png";

    if (recognition && recognition.state === 'running') {
        // A recognition instance is already running, so don't start another.
        return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        recognition.continuous = true;

        recognition.onresult = function (event) {
            var text = event.results[0][0].transcript;
            // console.log('Speech Recognition result: ' + text);
            // console.log(userInput)
            userInput.value += text + " "; // Set the recognized text in the input field
        };

        recognition.onerror = function (event) {
            console.error('Speech Recognition Error: ' + event.error);
        };

        recognition.onend = function () {
            // Optionally add logic when recognition ends
        };

        recognition.start();
    } else {
        alert('Speech recognition is not supported in your browser.');
    }
}

function stopSpeechToText() {
    document.getElementById("recognitionIcon").src = "../static/assets/img/microphone.png";
    if (recognition) {
        recognition.stop();
    }
}
/* ------------------------------------------------------ */


function clearChatHistory(bot_icon) {
    const chatbox = document.getElementById("chatBox");

    chatbox.innerHTML = `<div class="ChatItem ChatItem--customer">
    <div class="ChatItem-meta">
      <div class="ChatItem-avatar">
        <img class="ChatItem-avatarImage" src="` + bot_icon + `">
      </div>
    </div>
    <div class="ChatItem-chatContent">
      <div class="ChatItem-chatText">Hey there 👋, you can call me MediBot. How can I assist you today?
      <button id="readMessage" onclick="readMessage(this)" oncontextmenu="showVolumeSlider(event)">
            <img src="../static/assets/img/testingSpeaker3.png" alt="Speaker Icon">
        </button>
      </div>
    </div>
  </div>
  <div class="ChatItem ChatItem--expert temporaryChoices">
  <div class="ChatItem-meta">
  <div class="ChatItem-avatar">
      <img class="ChatItem-avatarImage" src="` + user_icon_src + `">
  </div>
  </div>
  <div class="ChatItem-chatContent">
      <div class="ChatItem-chatText ChatSelection" onclick="selectChoice('Hello, I would like to learn about AntiBiotics.')">
          Hello, I would like to learn about AntiBiotics.
      </div>
  </div>
</div>
<div class="ChatItem ChatItem--expert temporaryChoices">
  <div class="ChatItem-meta">
  <div class="ChatItem-avatar">
      <img class="ChatItem-avatarImage" src="` + user_icon_src + `">
  </div>
  </div>
  <div class="ChatItem-chatContent">
      <div class="ChatItem-chatText ChatSelection" onclick="selectChoice('When are antibiotics needed?')">
          When are antibiotics needed?
      </div>
  </div>
</div>
<div class="ChatItem ChatItem--expert temporaryChoices">
  <div class="ChatItem-meta">
  <div class="ChatItem-avatar">
      <img class="ChatItem-avatarImage" src="` + user_icon_src + `">
  </div>
  </div>
  <div class="ChatItem-chatContent">
      <div class="ChatItem-chatText ChatSelection" onclick="selectChoice('Can you better explain to me what Anti-Microbial Resistance means?')">
          Can you better explain to me what Anti-Microbial Resistance means?
      </div>
  </div>
</div>`


    // JavaScript code to reset the conversation
    fetch('/api/reset_conversation', {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    cancelClear();
}

function confirmClear() {
    document.querySelector('.confirmation-dialog').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
}
// Function to cancel the clear operation
function cancelClear() {
    document.querySelector('.confirmation-dialog').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
}


function handleKeyPress(event) {
    if (event.key === "Enter") {
        // Trigger the same action as the "Send" button
        sendMessage(user_icon_src, bot_icon_src);
    }
}

function showExplanation() {
    var antibioticsValue = document.getElementById("antibiotic-box").innerText.trim();
    var wordsValue = document.getElementById("abbreviations-box").innerText;
    var numericValue = document.getElementById("notations-box").innerText;

    var explanationText = document.getElementById("explanationText");
    var explanationDiv = document.getElementById("explanation");

    var abbreviation_explanations = {
        "0-1-0": "0-1-0: Take no pills in the morning, one pill at midday, and no pills in the evening.",
        "1-0-1": "1-0-1: One pill in the morning, skip midday, and one pill in the evening.",
        "1-1-1": "1-1-1: Take one pill three times a day: morning, midday, and evening.",
        "2-2-2": "2-2-2: Two pills in the morning, two at midday, and two in the evening.",
        "1/2-1-1/2": "1/2-1-1/2: Half a pill in the morning, one full pill at midday, and half a pill in the evening",
    };

    var word_explanations = {
        "HS": "HS: Stands for 'hora somni', meaning 'at bedtime'.",
        "PRN": "PRN: Abbreviation for 'pro re nata', or 'as needed'.",
        "OD": "OD: Represents 'once daily'.",
        "BD": "BD: Short for 'bis in die', or 'twice a day'.",
    };

    var antibiotic_explanations = {
        "Penicillin": "Explanation for Penicillin",
        "Cephalosporins": "Explanation for Cephalosporins",
        "Tetracyclines": "Explanation for Tetracyclines",
        "Macrolides": "Explanation for Macrolides",
        "Fluoroquinolones": "Explanation for Fluoroquinolones",
        "Sulfonamides": "Explanation for Sulfonamides",
        "Aminoglycosides": "Explanation for Aminoglycosides",
        "Metronidazole": "Explanation for Metronidazole",
        "Clindamycin": "Explanation for Clindamycin",
        "Vancomycin": "Explanation for Vancomycin",
        "Linezolid": "Explanation for Linezolid",
        "Doxycycline": "Explanation for Doxycycline",
    };

    var explanation = "";

    if (antibioticsValue in antibiotic_explanations) {
        explanation += antibiotic_explanations[antibioticsValue];
    }

    if (wordsValue in word_explanations) {
        if (explanation !== "") {
            explanation += "<br><br>";
        }
        explanation += word_explanations[wordsValue];
    }

    if (numericValue in abbreviation_explanations) {
        if (explanation !== "") {
            explanation += "<br><br>";
        }
        explanation += abbreviation_explanations[numericValue];
    }

    if (explanation.trim() !== "") {
        explanationDiv.style.display = "block";
        explanationDiv.classList.add("bg-purple");

        // Remove and add the class to trigger the animation
        explanationText.classList.remove("prescription-fade-in");
        void explanationText.offsetWidth; // This line is needed to force a reflow
        explanationText.classList.add("prescription-fade-in");
        explanationText.classList.add("description-text-container-inner")


        explanationText.innerHTML = explanation; // Use innerHTML to render line breaks
    } else {
        explanationText.classList.remove("prescription-fade-in");
        explanationText.textContent = "No explanation available for this selection.";
        explanationDiv.classList.add("bg-purple");
        explanationDiv.style.display = "block";
        explanationText.classList.add("prescription-fade-in");
        explanationText.classList.add("description-text-container-inner")
    }
}

function mapExplanation(event) {
    var popup = document.getElementById("myPopup");

    // Toggle the visibility of the popup
    if (popup.style.visibility === "visible") {
        popup.style.visibility = "hidden";
    } else {
        popup.style.visibility = "visible";
    }

    // Prevent event propagation to parent elements
    if (event) {
        event.stopPropagation();
    }
}

function selectText(id) {
    // Remove the 'selected' class from all elements
    var elements = document.getElementsByClassName('description-text-container-inner');
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('selected');
    }

    // Add the 'selected' class to the hovered element
    document.getElementById(id).classList.add('selected');
}


window.onload = showExplanation;

/* Barcode Scanning */
function handleFormSubmission() {
    // JavaScript to handle the form submission and display the result
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();

        var formData = new FormData(this);

        fetch('/api/scan_barcode', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('result').textContent = data.text;
            });
    });
}

/*FAQs */

// Function to toggle the display of the chatbot response when the question is clicked
function toggleResponse(response, faqIcon, faqItem) {
    faqItem.classList.toggle('expanded');
    response.style.display = response.style.display === 'block' ? 'none' : 'block';
    if (faqIcon.alt == "add") {
        faqIcon.src = "../static/assets/img/minus.png";
        faqIcon.alt = "minus"
    }
    else {
        faqIcon.src = "../static/assets/img/add.png";
        faqIcon.alt = "add"
    }

    // Check if the current height is larger than 100px, and set maxHeight accordingly
    const currentHeight = faqItem.scrollHeight;
    if (currentHeight < 100) {
        faqItem.style.maxHeight = "90px";
    } else {
        faqItem.style.maxHeight = "1000px"
    }

    faqIcon.classList.toggle('rotate');
}

// Global variable to store the current sort option
let currentSortOption = "Age"; // or "Symptoms"

// Function to toggle the sorting option
function toggleSortOption() {
    currentSortOption = currentSortOption === "Age" ? "Symptoms" : "Age";
    document.getElementById('toggle-btn').textContent = "Sort by " + currentSortOption;
    if (currentSortOption == "Age") {
        document.getElementById('toggle-btn').textContent = "Sort by Symptoms";
    } else {
        document.getElementById('toggle-btn').textContent = "Sort by Age";
    }

    loadFAQFromCSV();
}

// Function to load the FAQ from CSV
function loadFAQFromCSV() {
    fetch('../static/FAQs.csv')
        .then(response => response.text())
        .then(data => {
            const faqData = data.split('\n');

            // Sort faqData based on the currentSortOption
            const sortedFaqData = faqData.slice(1).sort((a, b) => {
                const valueA = a.split(',')[currentSortOption === "Age" ? 1 : 2];
                const valueB = b.split(',')[currentSortOption === "Age" ? 1 : 2];

                // Prioritize "General" to appear first
                if (valueA === "General") return -1;
                if (valueB === "General") return 1;

                return valueA.localeCompare(valueB);
            });

            const faqContainer = document.getElementById('faq-container');

            // Clear previous items from the container
            faqContainer.innerHTML = '';

            var lastTitle = "";

            sortedFaqData.forEach((line, index) => {
                lineContent = line.split(',');

                const title = currentSortOption === "Age" ? lineContent[1] : lineContent[2];

                if (title != lastTitle) {
                    // Create a new h1 element
                    const titleElement = document.createElement('h1');

                    titleElement.classList.add("sub-heading");
                    titleElement.classList.add("animated-text");
                    // Set the text content of the h1 element to the title
                    titleElement.textContent = title;

                    // Append the h1 element to the container
                    faqContainer.appendChild(titleElement);

                    // Update lastTitle to the current title for future comparisons
                    lastTitle = title;
                }

                query = lineContent[3];
                query = "Q: " + query;
                response = lineContent.slice(4, lineContent.length).join(", ");
                response = "A: " + response;

                // Create FAQ item HTML
                const faqItem = document.createElement('div');
                faqItem.classList.add('faq-item');

                const faqIcon = document.createElement('img');
                faqIcon.classList.add('faq-icon');
                faqIcon.src = "../static/assets/img/add.png";
                faqIcon.alt = "add";

                // Create the user query
                const queryElement = document.createElement('div');
                queryElement.classList.add('query');
                queryElement.textContent = query;

                // Create the chatbot response initially hidden
                const responseElement = document.createElement('div');
                responseElement.classList.add('response');
                responseElement.textContent = response;
                responseElement.style.display = 'none';

                // Append user query and response to the FAQ item
                faqItem.appendChild(queryElement);
                queryElement.appendChild(faqIcon);
                faqItem.appendChild(responseElement);

                // Append the FAQ item to the container
                faqContainer.appendChild(faqItem);

                // Attach a click event to toggle the response when the user query is clicked
                faqItem.addEventListener('click', () => {
                    toggleResponse(responseElement, faqIcon, faqItem);
                });
            });
        })
        .catch(error => {
            console.error('Error loading CSV file:', error);
        });
}

/*Quiz */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let selectedAnswers = [];

function loadQuizFromCSV() {
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    alphabetIndex = 0;
    fetch('../static/Quiz.csv')
        .then(response => response.text())
        .then(data => {
            const quizData = data.split('\n');
            const quizContainer = document.getElementById('quiz-container');
            const shuffledQuizData = [...quizData.slice(1)].sort(() => Math.random() - 0.5);
            const quizItemsHTML = shuffledQuizData.slice(0, 4).map((line, index) => {
                const [question, answersCSV] = line.split(',');
                const answers = answersCSV.split('|').map(answer => answer.trim());

                // Shuffle the options randomly
                const shuffledOptions = [...answers];
                shuffleArray(shuffledOptions);
                return `
                    <div class="quiz-item">
                        <div class="question">Question ${index + 1} - ${question}</div>
                        <div class="options">
                            ${shuffledOptions.map((option, alphabetIndex) => `
                                <div class="answer-button" data-value="${option}" data-correct-answer="${answers[0]}" data-question="${index + 1}">
                                    ${alphabet[alphabetIndex] + ": " + option}
                                </div>
                            `).join('')}
                        </div>
                        <div class="user-answer" style="display: none;">
                            <p>Correct Answer: ${answers[0]}</p>
                        </div>
                    </div>`;
            });

            alphabetIndex = 0;

            quizContainer.innerHTML = quizItemsHTML.join('');

            // Use event delegation for click handling
            quizContainer.addEventListener('click', (event) => {
                const button = event.target.closest('.answer-button');
                if (button) {
                    handleUserSelection(button);
                }
            });
        })
        .catch(error => {
            console.error('Error loading CSV file:', error);
        });
}

function handleUserSelection(button) {
    const selectedAnswer = button.getAttribute('data-value');
    const correctAnswer = button.getAttribute('data-correct-answer');
    const userAnswerElement = button.parentElement.parentElement.querySelector('.user-answer');

    if (selectedAnswer === correctAnswer) {
        userAnswerElement.textContent = 'Correct!';
        userAnswerElement.style.color = 'green';
    } else {
        userAnswerElement.textContent = 'Incorrect. Correct answer: ' + correctAnswer;
        userAnswerElement.style.color = 'red';
    }

    userAnswerElement.style.display = 'block';

    // Update the selected answer array
    const questionIndex = button.getAttribute('data-question');
    selectedAnswers[questionIndex] = selectedAnswer;

    // Remove 'active' class from all options within the same question
    const optionsWithinQuestion = document.querySelectorAll(`.answer-button[data-question="${questionIndex}"]`);
    optionsWithinQuestion.forEach(item => {
        item.classList.remove('active');
    });

    // Toggle the 'active' class for the clicked option
    button.classList.add('active');
}

function toggleDropdown(id) {
    const idItem = document.getElementById(id);
    const dropdown = idItem.querySelector('.custom-select .options');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function updateSelectedText(option) {
    const dropDown = document.getElementById(option.parentNode.parentNode.parentNode.id);
    const selectBox = dropDown.querySelector('.custom-select .select-box');
    selectBox.innerText = option.textContent;
    showExplanation();
}

// Function to get the value of a cookie by its name
function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return "";
}

// Function to parse a JSON string from a cookie and return a dictionary
function getDictionaryFromCookie(cookieName) {
    var cookieValue = getCookie(cookieName);
    if (cookieValue) {
        return JSON.parse(decodeURIComponent(cookieValue));
    }
    return {};
}

function startDemo(dictionary) {

    let dict = JSON.parse(dictionary)

    if (dict[window.location.pathname] == 1) {
        return;
    }

    const userResponse = confirm("Do you want to go through the tutorial?");
    if (userResponse) {
        positionPopup(currentReferencePopup);
    }

    // Setting the demo completed inidicator to true to avoid reasking the user every time
    dict[window.location.pathname] = 1;

    fetch('/updateCompletedList', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dict),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function positionPopup(referenceID) {
    const location = document.getElementById(referenceID).getBoundingClientRect();
    const visiblePopup = document.getElementById("popup1");

    const offsetY = location.height * 2;
    const offsetX = location.width / 2;

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    visiblePopup.style.display = "block";
    visiblePopup.style.position = "absolute";
    visiblePopup.style.top = `${location.top + scrollY - offsetY}px`;
    visiblePopup.style.left = `${location.left + scrollX + offsetX}px`;
    visiblePopup.style.width = `20%`;
    visiblePopup.style.height = `auto`;
    visiblePopup.style.overflow = "hidden";

    visiblePopup.children[1].innerText = popupText;
}

//Waiting for the entire page to finish loading, then executing the showPosition() function
window.addEventListener('load', function () {
    showPosition();
});

// Call the positioning function on page load and on window rup)esize
window.addEventListener('resize', function () {
    if (popupTextList[window.location.pathname].indexOf(popupText) != popupTextList[window.location.pathname].length - 1) {
        positionPopup(currentReferencePopup);
    }
});

// Function to close the popup
function nextPopup() {
    console.log(popupReferenceList[window.location.pathname])
    if (popupTextList[window.location.pathname].indexOf(popupText) == popupTextList[window.location.pathname].length - 1) {
        const visiblePopup = document.getElementById("popup1");
        visiblePopup.style.display = "none";
    } else {
        currentReferencePopup = popupReferenceList[window.location.pathname][popupReferenceList[window.location.pathname].indexOf(currentReferencePopup) + 1];
        popupText = popupTextList[window.location.pathname][popupTextList[window.location.pathname].indexOf(popupText) + 1];

        positionPopup(currentReferencePopup);
    }
}

window.onload = loadFAQFromCSV();
window.onload = loadQuizFromCSV();