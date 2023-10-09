var infoWindow;
var directionsService;
var directionsRenderer;
var infoPanel;

function showPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            initMap(position.coords.latitude, position.coords.longitude);
        });
    } else {
        alert("Sorry, your browser does not support HTML5 geolocation.");
    }
}

function initMap(userLatitude, userLongitude) {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: userLatitude, lng: userLongitude},
        zoom: 15
    });

    infoWindow = new google.maps.InfoWindow();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    infoPanel = document.getElementById('info-panel');
    var request = {
        query: 'pharmacy',
        fields: ['name', 'geometry'],
    };

    var service = new google.maps.places.PlacesService(map);
    
    service.textSearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Sort places by distance
            results.sort(function (a, b) {
                var distanceA = google.maps.geometry.spherical.computeDistanceBetween({lat: userLatitude, lng: userLongitude}, a.geometry.location);
                var distanceB = google.maps.geometry.spherical.computeDistanceBetween({lat: userLatitude, lng: userLongitude}, b.geometry.location);
                return distanceA - distanceB;
            });
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    });

    function createMarker(place) {
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name
        });

        marker.addListener("click", function() {
            calculateAndDisplayRoute({lat: userLatitude, lng: userLongitude}, place.geometry.location);
            var content = `<strong>${place.name}</strong><br>${place.formatted_address}<br>`;
            content += `<a href="https://www.google.com/maps?q=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank">Open in Google Maps</a>`;
            infoWindow.setContent(content);                    
            infoWindow.open(marker.getMap(), marker);
        });
    }
}

function calculateAndDisplayRoute(origin, destination) {
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}