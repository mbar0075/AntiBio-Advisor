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

// function sendMessage() {
//     const userInput = document.getElementById("user-input").value;
//     const chatMessages = document.getElementById("chat-messages");
    
//     // Display the user's message in the chat area
//     chatMessages.innerHTML += `<p>User: ${userInput}</p>`;
    
//     // Make an API call or process the input as needed (you can add this part)
    
//     // Clear the user input field
//     document.getElementById("user-input").value = '';
// }

// Set your OpenAI API key
const apiKey = "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";
const chatMessages = document.getElementById("chat-messages");

const userQueries = [];
const conversation = [];

function appendMessage(role, content) {
    const message = document.createElement("p");
    message.textContent = `${role}: ${content}`;
    chatMessages.appendChild(message);
}

function sendMessage() {
    // Retrieving user input
    const userInput = document.getElementById("user-input").value;

    // Display the user's message in the chat area
    appendMessage("User", userInput);

    // Define the conversation
    conversation.push({ role: "user", content: userInput})

    console.log(conversation)

    // Make the API call
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=conversation
    )

    console.log(response['choices'][0]['message']['content'])


    // Make the API call to GPT-3 using fetch
    // fetch('/api/chat', {
    //     method: 'POST',
    //     body: JSON.stringify({ apiKey, conversation }),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     // Display the response from GPT-3 in the chat area
    //     appendMessage("Bot", data.text);
    // })
    // .catch(error => {
    //     console.error(error);
    // });

    // Clear the user input field
    // document.getElementById("user-input").value = '';
}