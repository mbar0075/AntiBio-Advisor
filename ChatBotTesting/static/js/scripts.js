/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/

// Demo showcase variables
homeDemoText = [
    "To start a conversation with the chatbot, you can type your questions or messages in the \"userInput\" field.",
    "Click the \"Send\" button or press Enter on your keyboard to send your typed message to the chatbot.",
    "If you want to clear the chat and start over, use the \"Clear\" button.",
    "The microphone button allows you to communicate with the chatbot through voice input instead of typing.",
    "The speaking icon can be used to have the chatbot's responses read aloud.",
    "You can control the speaking volume by using the volume slider.",
    "These messages serve as optional initial prompts."
];

homePopupReferenceList = ["userInput", "chatBotSendButton", "chatBotClearButton", "toggleSpeechRecognition", "speak", "chatVolumeSlider", "example-message"];

prescriptionInfoDemoText = [
    "This dropdown here contains the antibiotic types.",
    "This dropdown here contains the different notations that may be prescribed.",
    "This dropdown here contains the different abbreviations used in prescriptions.",
    "This is the explanation of the above selected options."
];

prescriptionInfoReferenceList = ["antibiotics-dropdown", "notations-dropdown-container", "abbreviations-dropdown-container", "explanationText"];

mapDemoText = [
    "This here is the map.",
    "Click on a marker on the map. The red markers represent pharmacies whilst the blue markers represent General Practitioners.",
    "A route is now displayed."
];

mapPopupReferenceList = ["map", "map", "map"]

let popupTextList = { "/": homeDemoText, "/info": [], "/faq": [], "/prescriptionInfo": prescriptionInfoDemoText, "/map": mapDemoText, "/quiz": [] }
let popupReferenceList = { "/": homePopupReferenceList, "/info": [], "/faq": [], "/prescriptionInfo": prescriptionInfoReferenceList, "/map": mapPopupReferenceList, "/quiz": [] }
let currentReferencePopup = popupReferenceList[window.location.pathname][0];
let popupText = popupTextList[window.location.pathname][0];

//Home/Chatbot variables
var synth = window.speechSynthesis;
var voices = synth.getVoices();
var currentTextIndex = 0; //To keep track of the text being spoken
var recognition; //Speech recognition

//FAQ variables
let currentSortOption = "Symptoms"; //variable to store the current sort option

//Map variables
var infoWindow;
var directionsService;
var directionsRenderer;
var infoPanel;

//Quiz variables
let selectedAnswers = []; //variable to store the selected answers
let correctAnswersCounter = 0; // Define a counter variable to keep track of correct answers
let answeredQuestions = {}; // Keep track of answered questions to avoid double-counting

/* General Javascript - Used by all webpages */
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

// Function to start the demo denoting how to use the website to the user 
function startDemo(dictionary) {
    let dict = JSON.parse(dictionary);

    if (dict[window.location.pathname] == 1) {
        return;
    }

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
    document.querySelector('.popup-container').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.popup-container').classList.remove('slide-out'); // Remove slide-out class
    document.querySelector('.popup-container').classList.add('slide-in'); // Add slide-in class
}

function setupDemo() {
    currentReferencePopup = popupReferenceList[window.location.pathname][0];
    popupText = popupTextList[window.location.pathname][0];
    document.querySelector('.popup-container').style.display = 'block';
    document.getElementById("speech-bubble").style.display = "block";
    document.querySelector('.overlay').style.display = 'block';
    if (document.getElementById("popup-container-bot-img").src.endsWith("/static/assets/img/demo-bot-talking.png")) {
        document.getElementById("popup-container-bot-img").src = "/static/assets/img/demo-bot-smile.png";
    } else {
        document.getElementById("popup-container-bot-img").src = "/static/assets/img/demo-bot-talking.png";
    }
    document.getElementById("yes-button").style.display = "none";
    document.getElementById("no-button").style.display = "none";
    document.getElementById("next-button").style.display = "block";
    document.getElementById("close-button").style.display = "block";
    popupText = popupTextList[window.location.pathname][popupTextList[window.location.pathname].indexOf(popupText)];
    positionPopup(currentReferencePopup);
    document.querySelector('.popup-container').classList.remove('slide-out'); // Remove slide-out class
    document.querySelector('.popup-container').classList.add('slide-in'); // Add slide-in class
}

function changeBotImage() {
    if (document.getElementById("popup-container-bot-img").src.endsWith("/static/assets/img/demo-bot-talking.png")) {
        document.getElementById("popup-container-bot-img").src = "/static/assets/img/demo-bot-smile.png";
    } else {
        document.getElementById("popup-container-bot-img").src = "/static/assets/img/demo-bot-talking.png";
    }
}

function closeDemo() {
    const visiblePopup = document.getElementById("popup-container");
    document.getElementById("speech-bubble").style.display = "none";
    // Remove the slide-in class and add the slide-out class
    visiblePopup.classList.remove('slide-in');
    visiblePopup.classList.add('slide-out');
    document.querySelector('.overlay').style.display = 'none';
}

// Function to position the popup based on window size 
function positionPopup(referenceID) {
    const visiblePopup = document.getElementById("popup-text");
    visiblePopup.innerText = popupText;

    var id = document.getElementById(referenceID);
    
    if (id) {
        id.scrollIntoView({ behavior: 'smooth', block: 'start' });
        id.style.zIndex = 1000;
        id.style.pointerEvents = 'none';
    }
}
  

// Function to close current popup and display the next one
function nextPopup() {
    if (document.getElementById("popup-container-bot-img").src.endsWith("/static/assets/img/demo-bot-talking.png")) {
        document.getElementById("popup-container-bot-img").src = "/static/assets/img/demo-bot-smile.png";
    } else {
        document.getElementById("popup-container-bot-img").src = "/static/assets/img/demo-bot-talking.png";
    }
     
    if (popupTextList[window.location.pathname].indexOf(popupText) == popupTextList[window.location.pathname].length - 1) {
        document.getElementById(currentReferencePopup).style.zIndex = 0;
        document.getElementById(currentReferencePopup).style.pointerEvents = "auto";
        closeDemo();
    } else {
        document.getElementById(currentReferencePopup).style.zIndex = 0;
        document.getElementById(currentReferencePopup).style.pointerEvents = "auto";
        currentReferencePopup = popupReferenceList[window.location.pathname][popupReferenceList[window.location.pathname].indexOf(currentReferencePopup) + 1];
        popupText = popupTextList[window.location.pathname][popupTextList[window.location.pathname].indexOf(popupText) + 1];
        positionPopup(currentReferencePopup);
    }
}

// Code to resise/reposition the popup when the window is resized
window.addEventListener('resize', function () {
    if (popupTextList[window.location.pathname].indexOf(popupText) != popupTextList[window.location.pathname].length - 1) {
        positionPopup(currentReferencePopup);
    }
});

/* Home Javascript - Used by home webpage */
// Function to highlight at least one choice selection from the home page explenations
function highlightText(id) {
    // Remove the 'selected' class from all elements
    var elements = document.getElementsByClassName('description-text-container-inner');
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('selected');
    }

    // Add the 'selected' class to the hovered element
    document.getElementById(id).classList.add('selected');
}

//Function to handle choice selection
function selectChoice(choice) {
    document.getElementById("userInput").value = choice

    sendMessage(user_icon_src, bot_icon_src)
}

//Function to communicate with the Chatbot
function sendMessage(user_icon, bot_icon) {
    const userInput = document.getElementById("userInput").value;
    const chatbox = document.getElementById("chatBox");

    var choices = document.getElementsByClassName('temporaryChoices');

    if (userInput !== "") {
        // Deleting the temporary choices
        for (var i = 0; i < choices.length; i++) {
            choices[i].remove();
        }

        //Displaying the user's message in the chatbox
        chatbox.innerHTML += `<div class="ChatItem ChatItem--expert">
            <div class="ChatItem-meta">
            <div class="ChatItem-avatar">
                <img class="ChatItem-avatarImage" src="` + user_icon + `">
            </div>
            </div>
            <div class="ChatItem-chatContent">
            <div class="ChatItem-chatText">${userInput}
            <button class="readMessage" onclick="readMessage(this)" oncontextmenu="showVolumeSlider(event)">
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
                        <button class="readMessage" onclick="readMessage(this)" oncontextmenu="showVolumeSlider(event)">
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

//Function to display the volume slider in the chtabot area
function showVolumeSlider(event) {
    event.preventDefault();
    var slider = document.getElementById("chatVolumeSlider");
    slider.style.display = "block";
    var volumeRange = document.getElementById("chatVolumeSlider");
    volumeRange.value = parseFloat(utterance.getAttribute("data-volume")) || 0.5;
}

//Function to read out the chat message history
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

//Function to read a singular message in the chat message history
function readMessage(button) {
    // Get the text from the parent <div> element
    var chatText = button.parentElement.textContent.trim();
    // Create a new SpeechSynthesisUtterance for the text
    var utterance = new SpeechSynthesisUtterance(chatText);

    // Set the volume from the slider
    var volumeRange = document.getElementById("chatVolumeSlider");
    var value = parseFloat(volumeRange.value);
    utterance.volume = value;

    synth.speak(utterance);
}

//Function to start converting speech to text
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
            userInput.value += text + " "; // Set the recognized text in the input field
        };

        recognition.onerror = function (event) {
            console.error('Speech Recognition Error: ' + event.error);
        };

        recognition.start();
    } else {
        alert('Speech recognition is not supported in your browser.');
    }
}

//Function to stop converting speech to text
function stopSpeechToText() {
    document.getElementById("recognitionIcon").src = "../static/assets/img/microphone.png";
    if (recognition) {
        recognition.stop();
    }
}

//Function to clear the chat history and reset its contents
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
        <button class="readMessage" onclick="readMessage(this)" oncontextmenu="showVolumeSlider(event)">
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
            <div class="ChatSelection ChatItem-chatText"
                onclick="selectChoice('Hello, I would like to learn about AntiBiotics.')">
                Hello, I would like to learn about AntiBiotics.
            </div>
            <div class="ChatSelection ChatItem-chatText"
                onclick="selectChoice('When are antibiotics needed?')">
                When are antibiotics needed?
            </div>
            <div id="example-message" class="ChatSelection ChatItem-chatText"
                onclick="selectChoice('Can you better explain to me what Anti-Microbial Resistance means?')">
                Can you better explain to me what Anti-Microbial Resistance means?
            </div>
            <div class="ChatSelection ChatItem-chatText"
                onclick="selectChoice('What types of antibiotics are safe to give my child if prescribed by a doctor?')">
                Which antibiotics, when prescribed by a doctor, are safe to administer to my child?
            </div>
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

//Function to confirm the clear operation
function confirmClear() {
    document.querySelector('.confirmation-dialog').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
}

//Function to cancel the clear operation
function cancelClear() {
    document.querySelector('.confirmation-dialog').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
}

//Function to send the message in the chatbot iput field on enter key press
function handleKeyPress(event) {
    if (event.key === "Enter") {
        // Trigger the same action as the "Send" button
        sendMessage(user_icon_src, bot_icon_src);
    }
}

/* FAQ Javascript - Used by faq webpage */
//Function to toggle the display of the response when the question is clicked
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

    if (!window.matchMedia('(max-width: 767px)').matches) {
        console.log(currentHeight);
        if (currentHeight < 115) {
            faqItem.style.maxHeight = "110px";
        } else if (currentHeight < 145) {
            faqItem.style.maxHeight = "140px";
        } else {
            faqItem.style.maxHeight = "1000px";
        }

        faqIcon.classList.toggle('rotate');
    } else {
        if (currentHeight < 120) {
            faqItem.style.maxHeight = "115px";
        } else if (currentHeight < 150) {
            faqItem.style.maxHeight = "135px";
        } else {
            faqItem.style.maxHeight = "1000px";
        }

        faqIcon.classList.toggle('rotate');
    }
}

// Function to toggle the sorting option
function toggleSortOption() {
    currentSortOption = currentSortOption === "Symptoms" ? "Age" : "Symptoms";
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

/* PrescriptionInfo Javascript - Used by PrescriptionInfo webpage */
//Function to display the appropraite explenation based on user selection
function showExplanation() {

    var antibioticsValue = document.getElementById("antibiotic-box").innerText.trim();
    var wordsValue = document.getElementById("abbreviations-box").innerText;
    var numericValue = document.getElementById("notations-box").innerText;

    var explanationText = document.getElementById("explanationText");
    var explanationDiv = document.getElementById("explanation");

    var abbreviation_explanations = {
        "0-1-0": "<b>0-1-0:</b> Take no pills in the morning, one pill at midday, and no pills in the evening.",
        "1-0-1": "<b>1-0-1:</b> One pill in the morning, skip midday, and one pill in the evening.",
        "1-1-1": "<b>1-1-1:</b> Take one pill three times a day: morning, midday, and evening.",
        "2-2-2": "<b>2-2-2:</b> Two pills in the morning, two at midday, and two in the evening.",
        "1/2-1-1/2": "<b>1/2-1-1/2:</b> Half a pill in the morning, one full pill at midday, and half a pill in the evening",
    };

    var word_explanations = {
        "HS": "<b>HS:</b> Stands for 'hora somni', meaning 'at bedtime'.",
        "PRN": "<b>PRN:</b> Abbreviation for 'pro re nata', or 'as needed'.",
        "OD": "<b>OD:</b> Represents 'once daily'.",
        "BD": "<b>BD:</b> Short for 'bis in die', or 'twice a day'.",
    };

    var antibiotic_explanations = {
        "Penicillin": "<b>Penicillin</b> is one of the first antibiotics discovered by Alexander Fleming in 1928. It's effective against a wide range of bacteria and has been used to treat various infections, including strep throat and syphilis.",
        "Cephalosporins": "<b>Cephalosporins</b> are a group of antibiotics that are effective against a broad spectrum of bacteria. They are commonly used to treat respiratory and skin infections.",
        "Tetracyclines": "<b>Tetracyclines</b> are a class of antibiotics that can treat a variety of infections, including acne and respiratory tract infections. They work by inhibiting bacterial protein synthesis.",
        "Macrolides": "<b>Macrolides</b> are antibiotics often used to treat respiratory infections, such as pneumonia and bronchitis. They work by inhibiting bacterial protein synthesis.",
        "Fluoroquinolones": "<b>Fluoroquinolones</b> are a group of antibiotics used to treat a wide range of bacterial infections, including urinary tract and respiratory infections. They work by interfering with bacterial DNA replication.",
        "Sulfonamides": "<b>Sulfonamides</b> are antibiotics that inhibit the growth of bacteria by interfering with their folic acid synthesis. They are used to treat urinary tract infections and other bacterial infections.",
        "Aminoglycosides": "<b>Aminoglycosides</b> are antibiotics used to treat severe bacterial infections. They work by disrupting bacterial protein synthesis. They are often administered intravenously.",
        "Metronidazole": "<b>Metronidazole</b> is an antibiotic used to treat infections caused by certain parasites and anaerobic bacteria. It's effective against infections of the gastrointestinal tract and vaginal infections.",
        "Clindamycin": "<b>Clindamycin</b> is an antibiotic that's effective against a variety of bacteria, including those responsible for skin and respiratory infections. It works by inhibiting protein synthesis in bacteria.",
        "Vancomycin": "<b>Vancomycin</b> is an antibiotic used to treat serious bacterial infections, including those resistant to other antibiotics. It's often administered intravenously and works by disrupting cell wall synthesis in bacteria.",
        "Linezolid": "<b>Linezolid</b> is an antibiotic used to treat certain bacterial infections, including those caused by drug-resistant bacteria. It inhibits protein synthesis in bacteria and is available in oral and intravenous forms.",
        "Doxycycline": "<b>Doxycycline</b> is a tetracycline antibiotic used to treat various infections, including acne and respiratory tract infections. It inhibits protein synthesis in bacteria and is available in oral and intravenous forms.",
        "Amoxicillin": "<b>Amoxicillin</b> is a widely used antibiotic that belongs to the penicillin class. It's effective against various bacterial infections, including ear and throat infections.",
        "Azithromycin": "<b>Azithromycin</b> is a macrolide antibiotic commonly prescribed for respiratory tract infections, including bronchitis and pneumonia.",
        "Ciprofloxacin": "<b>Ciprofloxacin</b> is a fluoroquinolone antibiotic used to treat a range of infections, including urinary tract and skin infections.",
        "Trimethoprim": "<b>Trimethoprim-sulfamethoxazole</b> is a combination antibiotic effective against various bacterial infections, such as urinary tract and respiratory infections.",
    };

    var explanation = "";

    fetch('../static/PrescriptionInfo.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');

            if (antibioticsValue in antibiotic_explanations) {
                // Parse CSV data
                const antibioticData = {};
                for (const row of rows.slice(1)) {
                    let columns = row.split(',');
                    let antibioticName = columns[2].trim();
                    let antibioticImgLink = columns[1].trim();
                    if (antibioticName == antibioticsValue) {
                        antibioticData[antibioticName] = antibioticImgLink;
                        break;
                    }

                }
                // Create an image element
                var antibioticImage = document.createElement("img");

                // Set attributes for the image element
                antibioticImage.src = antibioticData[antibioticsValue];
                antibioticImage.alt = "Antibiotic Image";
                antibioticImage.classList.add("antibiotic-image");

                // Create a wrapper for the image
                var wrapper = document.createElement("div");
                wrapper.classList.add("antibiotic-image-wrapper");

                // Append the image to the wrapper
                wrapper.appendChild(antibioticImage);

                // Add the wrapper's HTML to the explanation
                explanation += wrapper.outerHTML + "<br>";
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
                explanationText.textContent = "Please select one of the above options to see an explanation.";
                explanationDiv.classList.add("bg-purple");
                explanationDiv.style.display = "block";
                explanationText.classList.add("prescription-fade-in");
                explanationText.classList.add("description-text-container-inner");
            }
        })
}

// Function to display the dropdowns
function toggleDropdown(id) {
    const idItem = document.getElementById(id);
    const dropdown = idItem.querySelector('.custom-select .options');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Function to update the dropdown text based on user selection
function updateSelectedText(option) {
    const dropDown = document.getElementById(option.parentNode.parentNode.parentNode.id);
    const selectBox = dropDown.querySelector('.custom-select .select-box');
    selectBox.innerHTML = option.textContent + ' <i class="dropdown-icon fa fa-caret-down"></i>';
    showExplanation();

    // Adding an icon to the dropdown <i class="fa fa-caret-down"></i>
    console.log(selectBox.innerHTML);

    // Get the element with the 'explanation' id
    const explanationElement = document.getElementById('explanation');

    // Scroll to the explanation element smoothly
    explanationElement.scrollIntoView({ behavior: 'smooth' });
}


/* Map Javascript - Used by map webpage */
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

//Waiting for the entire page to finish loading, then executing the showPosition() function
window.addEventListener('load', function () {
    showPosition();
});

/* Quiz Javascript - Used by quiz webpage */
// Function to shuffle the questions present
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to load the quiz question/answers from JSON
function loadQuizFromJSON() {
    selectedAnswers = [];
    correctAnswersCounter = 0;
    answeredQuestions = {};
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    alphabetIndex = 0;
    fetch('../static/Quiz.json')
        .then(response => response.json())
        .then(data => {
            const quizContainer = document.getElementById('quiz-container');
            const shuffledQuizData = [...data].sort(() => Math.random() - 0.5);
            const quizItemsHTML = shuffledQuizData.slice(0, 4).map((questionData, index) => {
                const { Question, Answers } = questionData;
                const shuffledOptions = [...Answers];
                shuffleArray(shuffledOptions);
                return `
                    <div class="quiz-item">
                        <div class="question">Question ${index + 1} - ${Question}</div>
                        <div class="options">
                            ${shuffledOptions.map((option, optionIndex) => `
                                <div class="answer-button" data-value="${option}" data-correct-answer="${Answers[0]}" data-question="${index + 1}">
                                    ${alphabet[optionIndex] + ": " + option}
                                </div>
                            `).join('')}
                        </div>
                        <div class="user-answer" style="display: none;">
                            <p>Correct Answer: ${Answers[0]}</p>
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
            console.error('Error loading JSON file:', error);
        });
    // Enable the submit button and change its text back to "Submit"
    let submitButton = document.getElementById("submitQuizButton");
    submitButton.style.display = "inline-block";
    submitButton.textContent = 'Submit';
}

// Function to handle user answer selection
function handleUserSelection(button) {
    const questionIndex = button.getAttribute('data-question');

    const selectedAnswer = button.getAttribute('data-value');
    const correctAnswer = button.getAttribute('data-correct-answer');

    // Update the selected answer array
    selectedAnswers[questionIndex] = selectedAnswer;

    if (selectedAnswer === correctAnswer) {
        // Mark the question as answered to prevent double-counting
        answeredQuestions[questionIndex] = true;
    } else {
        answeredQuestions[questionIndex] = false;
    }

    correctAnswersCounter = Object.values(answeredQuestions).filter(value => value === true).length;

    // Remove 'active' class from all options within the same question
    const optionsWithinQuestion = document.querySelectorAll(`.answer-button[data-question="${questionIndex}"]`);
    optionsWithinQuestion.forEach(item => {
        item.classList.remove('active');
    });

    // Toggle the 'active' class for the clicked option
    button.classList.add('active');
}

// Function to display the total number of points and check each quiz item
function submitQuizResults(button) {
    button.style.display = "none";

    document.getElementById('resulting-points-text').innerText = "You got " + correctAnswersCounter + "/4 points.";
    document.querySelector('.confirmation-dialog').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';


    // Call a function for each quiz item to display whether it is correct or not
    document.querySelectorAll('.quiz-item').forEach((item, index) => {
        displayResult(item, index + 1);
    });
}

// Function to display whether a quiz item is correct or not
function displayResult(item, questionNumber) {
    const userAnswer = selectedAnswers[questionNumber];
    const correctAnswer = item.querySelector('.user-answer p').textContent.split(': ')[1].trim();

    // Check if a result element already exists
    let resultElement = item.querySelector('.result');

    if (!resultElement) {
        // If it doesn't exist, create a new result element
        resultElement = document.createElement('div');
        resultElement.classList.add('result');
    }

    if (userAnswer === correctAnswer) {
        resultElement.textContent = 'Correct!';
        resultElement.style.color = 'green';
    } else {
        resultElement.textContent = 'Incorrect. Correct answer: ' + correctAnswer;
        resultElement.style.color = "#bf0000";
    }

    // Append the result element to the quiz item
    item.appendChild(resultElement);
}

document.addEventListener('DOMContentLoaded', function () {
    var defaultOption = document.getElementById('antibiotic-button-name');
    if (defaultOption && typeof updateSelectedText === 'function') {
        updateSelectedText(defaultOption);
    }
});

// Window onload functions
window.onload = loadFAQFromCSV();
window.onload = loadQuizFromJSON();