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

    // function sendMessage() {
    //     console.log('sendMessage');
    //     const userInput = document.getElementById("userInput").value;
    //     const chatbox = document.getElementById("chatbox");
        
    //     // Display the user's message in the chatbox
    //     chatbox.innerHTML += `<p>User: ${userInput}</p>`;
        
    //     // Make an API call to GPT-3 using JavaScript's fetch() function
    //     fetch('/api/chat', {
    //         method: 'POST',
    //         body: JSON.stringify({ text: userInput }),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         // Display the response from GPT-3 in the chatbox
    //         chatbox.innerHTML += `<p>Bot: ${data.text}</p>`;
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
        
    //     // Clear the user input field
    //     document.getElementById("userInput").value = '';
    // }
});