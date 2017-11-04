var LocationModel=function(e,o,n,a){var t=this;t.name=e,t.position={lng:n,lat:o},t.fourSquareId=a,t.marker=null},dataPoints=[new LocationModel("Beverly Street",6.890622,79.858873,"4c26f4ed3703d13a175da636"),new LocationModel("Barista",6.910408,79.861888,"4ba06f61f964a520986d37e3"),new LocationModel("Baskin Robins",6.907677,79.850826,"4be3f02921d5a593a6391a11"),new LocationModel("Sinhalese Sports Club",6.90575,79.869462,"53c28e2b498ed626a1253248"),new LocationModel("Cinnamon Grand Colombo",6.9179,79.848445,"4bd10754b221c9b66c02d5d0")],locationDetailModel={locationName:"",bestPhoto:"",phone:"",detailSource:"",address:""},ControlAreaViewModel=function(){var e=this;e.searchText=ko.observable(""),e.locations=ko.observableArray(dataPoints),e.openMenu=ko.observable(!1),openSearchMenu=function(){$(".content").css("height","100%"),e.openMenu(!0)},closeSearchMenu=function(){$(".content").css("height","90%"),e.openMenu(!1)},onSearchResultClick=function(e){closeSearchMenu(),fourSquareHandler.getDetails(e)},e.onLocationDetailModelUpdate=function(e){var o=" <a href="+e.detailSource+" target='_blank'><img src='img/foursquare.png' class='foursquare-icon' /> </a> <div class='location-name'>"+e.locationModel.name+"</div><img class='best-photo' src='"+e.bestPhoto+"' /><div class='address'>"+e.address+"</div><div class='phone'>"+e.phone+"</div>";googleMapHandler.triggerLocationDetailView(o,e.locationModel)},e.searchText.subscribe(function(o){var n=[],a={};$.each(dataPoints,function(t,i){e._isSearchTextFound(o,i.name)&&(n.push(i),a[i.position.lng+"_"+i.position.lat]=i)}),e.locations(n),googleMapHandler.populateDataPoints(a)}),e._isSearchTextFound=function(e,o){var n=o.split(" "),a=!1;return $.each(n,function(o,n){0===n.toLowerCase().indexOf(e.toLowerCase())&&(a=!0)}),a}},controlAreaViewModel=new ControlAreaViewModel;ko.applyBindings(controlAreaViewModel,document.getElementById("control-area"));var GoogleMapHandler=function(){var e={lat:6.9092478,lng:79.856681},o=function(){return new google.maps.Map($("#map")[0],{center:e,zoom:8,mapTypeControl:!1})},n=function(e){return new google.maps.Marker({position:e.position,draggable:!0,animation:google.maps.Animation.DROP,map:map,title:e.name})},a=function(){fourSquareHandler.getDetails(this)},t=function(){this.marker.setAnimation(null),this.marker=null},r=function(e){window.setTimeout(function(){map.setCenter(e.marker.getPosition()),map.panTo(e.marker.getPosition()),map.setZoom(16)},500)};return{map:null,infoWindow:null,bounds:null,initLocation:e,addEvenetHandlersToMap:function(){infoWindow.addListener("closeclick",t.bind(infoWindow)),google.maps.event.addDomListener(window,"resize",function(){map.fitBounds(bounds)})},addEventListenersToMarker:function(e){e.marker.addListener("click",a.bind(e))},initMap:function(){map=o(),infoWindow=new google.maps.InfoWindow({}),bounds=new google.maps.LatLngBounds,this.populateDataPoints(),this.addEvenetHandlersToMap()},populateDataPoints:function(e){var o;for(i=0;i<dataPoints.length;i++){var a=dataPoints[i];e?(o=a.marker,e[a.position.lng+"_"+a.position.lat]?a.marker.setVisible(!0):a.marker.setVisible(!1)):(o=n(a),a.marker=o,this.addEventListenersToMarker(a)),bounds.extend(o.position)}map.fitBounds(bounds)},triggerLocationDetailView:function(e,o){infoWindow.marker!==o.marker&&(infoWindow.marker&&(infoWindow.marker.setAnimation(null),infoWindow.marker=null),infoWindow.marker=o.marker,r(o),infoWindow.marker.setAnimation(google.maps.Animation.BOUNCE),infoWindow.setContent(e),infoWindow.open(map,o.marker))},handleMapError:function(){alert("Google Maps Error. Please check configuration for loading google maps")}}},googleMapHandler=new GoogleMapHandler,FourSquareHandler=function(){var e=function(e){console.error(e),alert(e)},o=function(e){var o={error:!0,message:""};return e?e.meta?e.meta.code?e.response?e.response.venue?o.error=!1:o.message="No Venu information on response Object":o.message="No Response Object":o.message="No Code Avaialable":o.message="No Meta Object":o.message="No Data Object",o},n=function(e){var o="";return $.each(e,function(e,n){o=o+"<br>"+n}),o},a=function(e,o){var a=e.response.venue;locationDetailModel.locationModel=o,a.bestPhoto.prefix&&a.bestPhoto.suffix?locationDetailModel.bestPhoto=a.bestPhoto.prefix+"height60"+a.bestPhoto.suffix:locationDetailModel.bestPhoto="img/foursquare.png",locationDetailModel.phone=a.contact.phone||"No Phone provided",locationDetailModel.detailSource=a.canonicalUrl||"https://foursquare.com/",a.location&&a.location.formattedAddress&&a.location.formattedAddress.length>0?locationDetailModel.address=n(a.location.formattedAddress):locationDetailModel.address=n(["No Address","provided"]),controlAreaViewModel.onLocationDetailModelUpdate(locationDetailModel)};return{endPoint:"https://api.foursquare.com/v2/venues/",client_id:"GHBSVU3SHG14OOJ4A5ICR0X04HGAETGF3U1LP2RHRR3ZFWTR",client_secret:"XZDHWHZDPSODIZN3ARGDKUKWXCCHUQEJ1A1F2O2032LD3VHT",version:"20170801",getDetails:function(n){$.ajax({type:"GET",url:this.endPoint+n.fourSquareId,dataType:"json",cache:!1,locationModel:n,data:{client_id:this.client_id,client_secret:this.client_secret,v:this.version},success:function(n){var t=o(n);t.error?e(t.message):a(n,this.locationModel)},error:function(o,n,a){var t;t=a?"Error status: "+(n=n||"Not Specified")+"     Message: "+a:"Unknown Error occured",e(t)}})}}},fourSquareHandler=new FourSquareHandler;