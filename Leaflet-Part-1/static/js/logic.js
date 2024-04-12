var map = L.map('map').setView([35, -100], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch earthquake data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            var magnitude = feature.properties.mag;
            var depth = feature.geometry.coordinates[2];
            var lon = feature.geometry.coordinates[0];
            var lat = feature.geometry.coordinates[1];
            var place = feature.properties.place;

            // Define marker color based on depth
            var color;
            if (depth < 30) {
                color = 'green';
            } else if (depth < 70) {
                color = 'yellow';
            } else if (depth < 150) {
                color = 'orange';
            } else {
                color = 'red';
            }

            // Define marker size based on magnitude
            var radius = Math.min(magnitude * 3, 10);

            // Create popup content
            var popupContent = `
                <strong>Magnitude:</strong> ${magnitude}<br>
                <strong>Depth:</strong> ${depth} km<br>
                <strong>Location:</strong> ${place}
            `;

            // Add marker to map
            L.circleMarker([lat, lon], {
                radius: radius,
                color: color,
                fillColor: color,
                fillOpacity: 0.6
            }).bindPopup(popupContent).addTo(map);
        });
    });

// Add legend
var legend = L.control({ position: 'bottomleft' });
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<p><strong>Legend</strong></p>';
    div.innerHTML += '<p><span style="color:green;">Depth &lt; 30 km</span></p>';
    div.innerHTML += '<p><span style="color:yellow;">30 km &lt; Depth &lt; 70 km</span></p>';
    div.innerHTML += '<p><span style="color:orange;">70 km &lt; Depth &lt; 150 km</span></p>';
    div.innerHTML += '<p><span style="color:red;">Depth &gt; 150 km</span></p>';
    return div;
};
legend.addTo(map);
