/**
 * This API deals with the Foursquare Web service inorder to fetch detailed
 * information
 */
var FourSquareHandler = function () {

    //Config Properties for foursquare API
    var endPoint = 'https://api.foursquare.com/v2/venues/';
    var client_id = 'GHBSVU3SHG14OOJ4A5ICR0X04HGAETGF3U1LP2RHRR3ZFWTR';
    var client_secret = 'XZDHWHZDPSODIZN3ARGDKUKWXCCHUQEJ1A1F2O2032LD3VHT';
    var version = '20170801';

    //This function will get the details for a given location model
    var getDetails = function (locationModel) {

        $.ajax({
            type: "GET",
            url: this.endPoint + locationModel.fourSquareId,// prepare url
            dataType: "json",
            cache: false,
            locationModel: locationModel,
            data: {
                client_id: this.client_id,
                client_secret: this.client_secret,
                v: this.version,
            },
            success: function (data) {
                // Check whether the response is valid. If so, notify view model
                // if not valid call handle error
                var validatedResponse = _validateResponse(data);
                if (!validatedResponse.error) {
                    _notifyViewModel(data, this.locationModel);
                } else {
                    _handleError(validatedResponse.message);
                }
            },
            error: function (request, status, error) {
                var message;
                if (error) {
                    status = status || 'Not Specified';
                    message = 'Error status: ' + status + '     Message: ' + error;
                } else {
                    message = "Unknown Error occured";
                }

                _handleError(message);
            }

        });
    };

    // This should handle all errors network or invalid response
    var _handleError = function (message) {
        console.error(message); // log it on console
        alert(message);// notify to user;
    };

    // This will validate the response.
    var _validateResponse = function (data) {

        var validation = { error: true, message: '' };

        if (!data) {
            validation.message = 'No Data Object';
        } else if (!data.meta) {
            validation.message = 'No Meta Object';
        }
        else if (!data.meta.code) {
            validation.message = 'No Code Avaialable';
        }
        else if (!data.response) {
            validation.message = 'No Response Object';
        }
        else if (!data.response.venue) {
            validation.message = 'No Venu information on response Object';
        }
        else {
            validation.error = false;
        }
        return validation;
    };

    var formatToHTMLAddress =  function(unformattedAdressArray){
        var address = '';
        $.each(unformattedAdressArray, function (index, val) {
            address = address + '<br>' + val;
        });
        return address;
    };

    // This will notify the view model when the detail data is ready.
    var _notifyViewModel = function (data, locationModel) {
        var venue = data.response.venue;

        locationDetailModel.locationModel=locationModel;
        if(venue.bestPhoto.prefix && venue.bestPhoto.suffix){
            locationDetailModel.bestPhoto=venue.bestPhoto.prefix + "height60" + venue.bestPhoto.suffix;
        }else{
            locationDetailModel.bestPhoto='img/foursquare.png';            
        }
        locationDetailModel.phone=venue.contact.phone || 'No Phone provided';
        locationDetailModel.detailSource=venue.canonicalUrl || 'https://foursquare.com/';

        if(venue.location && venue.location.formattedAddress && venue.location.formattedAddress.length>0){
            locationDetailModel.address=formatToHTMLAddress(venue.location.formattedAddress);            
        }else{
            locationDetailModel.address=formatToHTMLAddress(['No Address','provided']);                        
        }
        controlAreaViewModel.onLocationDetailModelUpdate(locationDetailModel);
    };

    // Public API to access FourSquare Handler methods
    return {
        endPoint: endPoint,
        client_id: client_id,
        client_secret: client_secret,
        version: version,
        getDetails: getDetails
    };
};

var fourSquareHandler = new FourSquareHandler();