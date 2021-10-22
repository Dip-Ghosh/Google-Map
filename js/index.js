
var ACoptions = {
    componentRestrictions: {
        country: "bd",
    },
};
var directionsService;
var directionsDisplay;

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    autoCompletePick();
    autoCompleteDrop();
    var dhaka = new google.maps.LatLng(23.8103, 90.4125);
    var myOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: dhaka,
    };
    var map = new google.maps.Map(document.getElementById("map", myOptions), {
        zoom: 6,
        center: dhaka
    });
    new google.maps.Marker({
        position: dhaka,
        map
    });

    directionsRenderer.setMap(map);

    document.getElementById("submit").addEventListener("click", () => {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
    });
}

//auto complete pick up
function autoCompletePick() {

    var acInputs = document.getElementsByClassName("m-input");

    for (var i = 0; i < acInputs.length; i++) {
        var autocomplete = new google.maps.places.Autocomplete(acInputs[i], ACoptions);
        autocomplete.inputId = acInputs[i].id;
    }
}

//auto complete drop off
function autoCompleteDrop() {

    var acInputs = document.getElementsByClassName("n-input");

    for (var i = 0; i < acInputs.length; i++) {
        var autocomplete = new google.maps.places.Autocomplete(acInputs[i], ACoptions);
        autocomplete.inputId = acInputs[i].id;
    }
}

//calculate route and display
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    const waypts = [];
    const destination = [];
    const pickUp = document.getElementsByName('pick_up[]');
    const dropOff = document.getElementsByName('drop_off[]');

    for (let i = 0; i < pickUp.length; i++) {
        waypts.push({location: pickUp[i].value});
    }

    for (let i = 0; i < dropOff.length; i++) {
        destination.push(dropOff[i].value);
        waypts.push({location: dropOff[i].value});
    }


    directionsService.route({
        origin: document.getElementById("start-1").value,
        destination: destination[destination.length - 1],
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: "DRIVING",
    }).then((response) => {
        directionsRenderer.setDirections(response);
        showRoutelocation(waypts)
        calculateDistanceAndTime(document.getElementById("start-1").value, destination[destination.length - 1]);

    }).catch((e) => window.alert("Directions request failed due to " + status));
}

//show the route
function showRoutelocation(wayPoints) {

    var summaryPanel = document.getElementById("directions-panel");
    summaryPanel.innerHTML = "";
    summaryPanel.innerHTML += "<b>Route: ";
    for (let i = 0; i < wayPoints.length; i++) {
        summaryPanel.innerHTML += " - ";
        summaryPanel.innerHTML += wayPoints[i].location + "</b>";
    }
}

//calculate distance and time
function calculateDistanceAndTime(origin, destination) {

    var distancePanel = document.getElementById("distance-panel");
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) {
        if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
            var distance = response.rows[0].elements[0].distance.text;
            var duration = response.rows[0].elements[0].duration.text;

            distancePanel.innerHTML = "<br>";
            distancePanel.innerHTML += "Distance: " + distance + "<br />";
            distancePanel.innerHTML += "Duration:" + duration;

        } else {
            alert("Unable to find the distance via road.");
        }
    });
}





