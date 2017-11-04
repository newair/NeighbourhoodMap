/**
 * This handler is responsible to deal with all functionalities of google MAP API and
 * hence act has a wrapper for MAP API which communcates with Handler
 */
var GoogleMapHandler = function () {

    var initLocation = { lat: 6.9092478, lng: 79.856681 }; // Colombo
    //Initializes the map, infowindow, boundaries and populates data points
    var initMap = function () {
        map = _createNewMap();
        infoWindow = new google.maps.InfoWindow({});
        bounds = new google.maps.LatLngBounds();
        this.populateDataPoints();
        this.addEvenetHandlersToMap();
    };

    //This method will listen events in dom tree
    var addEvenetHandlersToMap = function () {
        infoWindow.addListener('closeclick', _closeInfoWindow.bind(infoWindow));        
        google.maps.event.addDomListener(window, 'resize', function () {
            map.fitBounds(bounds);
        });
    };

    // This method will add event listeners 
    var addEventListenersToMarker = function (locationModel) {
        locationModel.marker.addListener('click', _onClickMapMarker.bind(locationModel));
    };
    // This will populate the data points on the map as markers.
    // Filter is optional to apply. Filter is not available when the map is initialized
    var populateDataPoints = function (filter) {

        var marker;
        for (i = 0; i < dataPoints.length; i++) {
            var locationModel = dataPoints[i];

            if (!filter) {
                marker = _createMarker(locationModel);
                // set that marker inside the dataPoints array so that We can reuse
                // it later to pop up info window
                locationModel.marker = marker;
                this.addEventListenersToMarker(locationModel);
            } else {
                marker = locationModel.marker;
                //if a filter is applied check whether it is in filter index
                if (!filter[locationModel.position.lng + '_' + locationModel.position.lat]) {
                    //Not available in filter hence marker should be hidden
                    locationModel.marker.setVisible(false);
                } else {
                    // Otherwise it should be visible
                    locationModel.marker.setVisible(true);
                }
            }
            // extend the bounds
            bounds.extend(marker.position);
        }
        // fit relevant bounds
        map.fitBounds(bounds);
    };

    //This will trigger the detailed view and make the marker animated
    var triggerLocationDetailView = function (content, locationModel) {
        if (infoWindow.marker !== locationModel.marker) {
            if (infoWindow.marker) {
                //if existing marker is available close it
                infoWindow.marker.setAnimation(null);
                infoWindow.marker = null;
            }           
            infoWindow.marker = locationModel.marker;
            _centerMap(locationModel);   // This will center the map to the given location    
            infoWindow.marker.setAnimation(google.maps.Animation.BOUNCE);
            infoWindow.setContent(content);
            infoWindow.open(map, locationModel.marker);
        }
    };

    //This will create a new map
    var _createNewMap = function () {
        return new google.maps.Map($('#map')[0], {
            center: initLocation,
            zoom: 8,
            mapTypeControl: false
        });
    };

    // This will return a new instance of marker
    var _createMarker = function (locationModel) {
        return new google.maps.Marker({
            position: locationModel.position,
            draggable: true,
            animation: google.maps.Animation.DROP,
            map: map,
            title: locationModel.name
        });
    };

    // This is the callback when clicked on the map marker
    var _onClickMapMarker = function () {
        fourSquareHandler.getDetails(this);
    };

    //This is the callback when clicked on close icon detailed view
    var _closeInfoWindow = function () {
        this.marker.setAnimation(null);
        this.marker = null;// setting it null to make sure new marker is set next time
    };

    //Handling the error with Map API
    var handleMapError = function () {
        alert('Google Maps Error. Please check configuration for loading google maps');
    };

    var _centerMap =function(locationModel){
        window.setTimeout(function(){
            map.setCenter(locationModel.marker.getPosition());
            map.panTo(locationModel.marker.getPosition());   
            map.setZoom(16);                
            
        }, 500); 
    };

    //Public API of the handler
    return {
        map: null,
        infoWindow: null,
        bounds: null,
        initLocation: initLocation,
        addEvenetHandlersToMap: addEvenetHandlersToMap,
        addEventListenersToMarker: addEventListenersToMarker,
        initMap: initMap,
        populateDataPoints: populateDataPoints,
        triggerLocationDetailView: triggerLocationDetailView,
        handleMapError: handleMapError,
    };
};

var googleMapHandler = new GoogleMapHandler();