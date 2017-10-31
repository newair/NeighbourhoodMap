
/**
 * This is the location model which shows the properties of a given location
 * @param {*} name searchable name of the given location
 * @param {*} lat  latitude
 * @param {*} lng  longitude
 * @param {*} fourSquareId Foursquare API id for venu detailed information
 */

var LocationModel = function (name, lat, lng, fourSquareId) {
    var self =this;
    self.name = name;
    self.position = {lng: lng, lat: lat};
    self.fourSquareId = fourSquareId;
    self.marker = null;
};

/**
 * This is the main data array which shows the neighbourhood location data
 */
var dataPoints = [
    new LocationModel('Beverly Street', 6.890622, 79.858873, '4c26f4ed3703d13a175da636'),
    new LocationModel('Barista', 6.910408, 79.861888, '4ba06f61f964a520986d37e3'),
    new LocationModel('Baskin Robins', 6.907677, 79.850826, '4be3f02921d5a593a6391a11'),
    new LocationModel('Sinhalese Sports Club', 6.905750, 79.869462, '53c28e2b498ed626a1253248'),
    new LocationModel('Cinnamon Grand Colombo', 6.917900, 79.848445, '4bd10754b221c9b66c02d5d0')
];

/**
 * LocationDetailModel consists of detailed information which is shown when the
 * detail views are requested
 */
var LocationDetailModel = function () {

    var self = this;

    self.locationName = ko.observable("");
    self.bestPhoto = ko.observable("");
    self.phone = ko.observable("");
    self.detailSource = ko.observable("");
    self.unformattedAdressArray = ko.observableArray([]);

    //Address has several lines. Thus it needs to be formatted in order to display
    self.address = ko.pureComputed(function () {
        var address = '';
        $.each(self.unformattedAdressArray(), function (index, val) {
            address = address + '<br>' + val;
        });
        return address;
    }, self);
};

/**
 * This is the view model that is responsibe for list view, search view and other
 * controll related tasks
 */
var ControlAreaViewModel = function () {
    var self = this;
    self.searchText = ko.observable("");
    self.locations = ko.observableArray(dataPoints);
    self.openMenu = ko.observable(false);

    // Search menu open
    openSearchMenu = function(){
       self.openMenu(true);
    };

    // Search menu close
    closeSearchMenu = function(){
       self.openMenu(false);
    };

    // callback when clicked on list view
    onSearchResultClick = function (locationModel) {
        fourSquareHandler.getDetails(locationModel);
    };

    // callback when detailed results are retreived from FourSquare API 
    self.onLocationDetailModelUpdate = function (locationModel) {
        // After getting details from Foursquare API  trigger the detail view with google map handler
        googleMapHandler.triggerLocationDetailView($('#info-window').html(), locationModel);
    };

    // listen on search text and prepare new array to render and search index to load
    self.searchText.subscribe(function (searchText) {

        var searchResult = [];
        var searchIndex={};
        $.each(dataPoints, function (index, val) {
            if (self._isSearchTextFound(searchText,val.name)) {
                searchResult.push(val);
                searchIndex[val.position.lng+'_'+ val.position.lat] = val; // This index is kept for performance
                // reasons. For example if this is not kept complexity will be higher
                // when trying to re render the markers
            }
        });

        self.locations(searchResult);
        googleMapHandler.populateDataPoints(searchIndex);
        
    });

    //This method finds the text in a given text. Since this search string can reside anywhere
    //on the text, preference has been given for those that contain in very begining of each
    //word (splitted by space)
    self._isSearchTextFound = function (searchText, availableText) {
        var keywords = availableText.split(' ');
        var found =false;
        $.each(keywords, function (index, val) {
            //Check whether the searchText is included in the very begining of the text
            if (val.toLowerCase().indexOf(searchText.toLowerCase()) === 0) {
                found = true;
            }
        });

        return found;
    };
};

// Instantiate view models
var locationDetailModel = new LocationDetailModel();
var controlAreaViewModel = new ControlAreaViewModel();

// Apply bindings for view models. Note that bindings are applied for certain
// parts of the UI.
ko.applyBindings(locationDetailModel, document.getElementById("info-window"));
ko.applyBindings(controlAreaViewModel, document.getElementById("control-area"));