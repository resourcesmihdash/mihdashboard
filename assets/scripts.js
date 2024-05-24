let map;
let markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 42.4072, lng: -71.3824 },
        zoom: 8
    });

    // Log the mihPrograms data to ensure it's being loaded correctly
    console.log("MIH Programs Data:", mihPrograms);

    if (mihPrograms && mihPrograms.length > 0) {
        mihPrograms.forEach(program => {
            const marker = new google.maps.Marker({
                position: { lat: program.lat, lng: program.lng },
                map: map,
                title: program.provider
            });

            const infowindow = new google.maps.InfoWindow({
                content: `<h5>${program.provider}</h5>
                          <p>${program.address}</p>
                          <p>Phone: ${program.phone}</p>
                          <p>Official: ${program.official} (${program.email})</p>
                          <p>Medical Director: ${program.medicalDirector}</p>
                          <p>Services:</p>
                          <ul>${program.services.map(service => `<li>${service}</li>`).join('')}</ul>`
            });

            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });

            markers.push({ marker, program });
        });
    }
}

function filterMarkers() {
    const providerInput = document.getElementById('provider').value.toLowerCase();
    const selectedServices = Array.from(document.getElementById('services').selectedOptions).map(option => option.value);

    markers.forEach(({ marker, program }) => {
        const matchesProvider = program.provider.toLowerCase().includes(providerInput);
        const matchesService = selectedServices.length === 0 || selectedServices.some(service => program.services.includes(service));

        if (matchesProvider && matchesService) {
            marker.setMap(map);
        } else {
            marker.setMap(null);
        }
    });
}