let btn = document.querySelector('.get-location');
let coords = document.querySelector('#location');

const geocodeAddress = (geocoder, resultsMap) => {
    let address = document.querySelector('#address').value;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            coords.value = `${results[0].geometry.location.lat()}, ${results[0].geometry.location.lng()}`;
            console.log(coords.value);
            resultsMap.setCenter(results[0].geometry.location);
            let marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
        } else {
            console.log('The address you entered is unknown: ' + status);
        }
    });
};

function initMap() {
    let map = new google.maps.Map(document.querySelector('#map'), {
        zoom: 8,
        center: { lat: 6.5243793, lng: 3.3792057 }
         
    });

   /* let marker = new google.maps.Marker({
        map: map,
        position: { lat: 6.5243793, lng: 3.3792057 }
    });*/

    let geocoder = new google.maps.Geocoder();

    let address = document.querySelector('#address');
    address.addEventListener('change', function () {
        geocodeAddress(geocoder, map);
    });
}

const showPosition = (position) => {
    coords.value = `${position.coords.latitude}, ${position.coords.longitude}`;
};

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};
btn.addEventListener('click', getLocation)