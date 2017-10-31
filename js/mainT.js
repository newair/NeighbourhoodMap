var map, infoWindow;
var markers = [];

function initMap() {

    // var styledMapType = new google.maps.StyledMapType(
    // 	[
    // 		{ elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
    // 		{ elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
    // 		{ elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
    // 		{
    // 			featureType: 'administrative',
    // 			elementType: 'geometry.stroke',
    // 			stylers: [{ color: '#c9b2a6' }]
    // 		},
    // 		{
    // 			featureType: 'administrative.land_parcel',
    // 			elementType: 'geometry.stroke',
    // 			stylers: [{ color: '#dcd2be' }]
    // 		},
    // 		{
    // 			featureType: 'administrative.land_parcel',
    // 			elementType: 'labels.text.fill',
    // 			stylers: [{ color: '#ae9e90' }]
    // 		},
    // 		{
    // 			featureType: 'landscape.natural',
    // 			elementType: 'geometry',
    // 			stylers: [{ color: '#dfd2ae' }]
    // 		},
    // 		{
    // 			featureType: 'poi',
    // 			elementType: 'geometry',
    // 			stylers: [{ color: '#dfd2ae' }]
    // 		},
    // 		{
    // 			featureType: 'poi',
    // 			elementType: 'labels.text.fill',
    // 			stylers: [{ color: '#93817c' }]
    // 		},
    // 		{
    // 			featureType: 'poi.park',
    // 			elementType: 'geometry.fill',
    // 			stylers: [{ color: '#a5b076' }]
    // 		},
    // 		{
    // 			featureType: 'poi.park',
    // 			elementType: 'labels.text.fill',
    // 			stylers: [{ color: '#447530' }]
    // 		},
    // 		{
    // 			featureType: 'road',
    // 			elementType: 'geometry',
    // 			stylers: [{ color: '#f5f1e6' }]
    // 		},
    // 		{
    // 			featureType: 'road.arterial',
    // 			elementType: 'geometry',
    // 			stylers: [{ color: '#fdfcf8' }]
    // 		},
    // 		{
    // 			featureType: 'road.highway',
    // 			elementType: 'geometry',
    // 			stylers: [{ color: '#f8c967' }]
    // 		},
    // 		{
    // 			featureType: 'road.highway',
    // 			elementType: 'geometry.stroke',
    // 			stylers: [{ color: '#e9bc62' }]
    // 		},
    // 		{
    // 			featureType: 'road.highway.controlled_access',
    // 			elementType: 'geometry',
    // 			stylers: [{ color: '#e98d58' }]
    // 		},
    // 		{
    // 			featureType: 'road.highway.controlled_access',
    // 			elementType: 'geometry.stroke',
    // 			stylers: [{ color: '#db8555' }]
    // 		},
    // 		{
    // 			featureType: 'road.local',
    // 			elementType: 'labels.text.fill',
    // 			stylers: [{ color: '#806b63' }]
    // 		},
    // 		{
    // 			featureType: 'transit.line',
    // 			elementType: 'geometry',
    // 			stylers: [{ color: '#dfd2ae' }]
    // 		},
    // 		{
    // 			featureType: 'transit.line',
    // 			elementType: 'labels.text.fill',
    // 			stylers: [{ color: '#8f7d77' }]
    // 		},
    // 		{
    // 			featureType: 'transit.line',
    // 			elementType: 'labels.text.stroke',
    // 			stylers: [{ color: '#ebe3cd' }]
    // 		},
    // 		{
    // 			featureType: 'transit.station',
    // 			elementType: 'geometry',
    // 			stylers: [{ color: '#dfd2ae' }]
    // 		},
    // 		{
    // 			featureType: 'water',
    // 			elementType: 'geometry.fill',
    // 			stylers: [{ color: '#b9d3c2' }]
    // 		},
    // 		{
    // 			featureType: 'water',
    // 			elementType: 'labels.text.fill',
    // 			stylers: [{ color: '#92998d' }]
    // 		}
    // 	],
    // 	{ name: 'Styled Map' });

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        // mapTypeControlOptions: {
        // 	mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
        // 		'styled_map']
        // }
    });

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon']
        },
        markerOptions: { icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png' },

    });
    drawingManager.setMap(map);
    // map.mapTypes.set('styled_map', styledMapType);
    // map.setMapTypeId('styled_map');
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
        var radius = polygon;
        var paths = polygon.getPath();
        var coordinates=[];
        for (var i = 0; i < paths.length; i++) {
            coordinates.push({lat:paths.getAt(i).lat, lng:paths.getAt(i).lng});
        }
        var area = google.maps.geometry.spherical.computeArea(paths);
        alert(area);

    });

    document.getElementById('show-map').addEventListener('click', showMap);
    document.getElementById('hide-map').addEventListener('click', hideMap);

}

function showMap() {

    infoWindow = new google.maps.InfoWindow({
    });

    var bounds = new google.maps.LatLngBounds();

    var locations = [
        { title: 'Location 1', location: { lat: -34.397, lng: 151.644 } },
        { title: 'Location 2', location: { lat: -34.399, lng: 152.644 } },
        { title: 'Location 3', location: { lat: -34.397, lng: 150.645 } },
        { title: 'Location 4', location: { lat: -34.399, lng: 153.645 } }
    ];

    for (i = 0; i < locations.length; i++) {

        var marker = new google.maps.Marker({
            position: locations[i].location,
            draggable: true,
            animation: google.maps.Animation.DROP,
            map: map,
            title: 'Sydney'
        });

        markers.push(marker);

        marker.addListener('click', function () {
            setUpInfoWindow(this, infoWindow);
        });

        bounds.extend(marker.position);
    }

    map.fitBounds(bounds);
}

function hideMap() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function setUpInfoWindow(marker, infoWindow) {
    if (infoWindow.marker !== marker) {
        infoWindow.marker = marker;
        infoWindow.setContent('<div>' + marker.position.lat() + '</div>');
        infoWindow.open(map, marker);
        infoWindow.addListener('closeclick', function () {
            infoWindow.setMarker(null);
        });
    }
}