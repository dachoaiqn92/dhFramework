/// <reference path="../control.js" />
/// <reference path="../colors.js" />


var ggMap = {
    init: function (apiKey) {
        //var script = document.createElement("script");
        //script.src = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=onMapInit";
        //script.defer = "defer";
        //script.async = "async";
        //document.head.appendChild(script);
    },
    newMapInstance: function (mapHolder, lat, lng, zoom) {
        var tag = null;
        lat = lat || 10.771637;
        lng = lng || 106.693502;
        var markers = new dh.List();
        var map_service = null , autocomplete_service;
        var config = {
            kmlSrc: ""
        }
        var self = new google.maps.Map(mapHolder.control, {
            zoom: zoom || 11,
            center: { lat: lat, lng: lng },
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [{
                featureType: "poi",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            },
            {
                featureType: "administrative.locality",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }],
            disableDefaultUI: true
        });
        var id = 0;
        function addMarker(lat, lng, icon, label) {
            id++;
            var newMarkerObject = { id: id, marker: ggMap.addMarker(self, lat, lng, icon, label), tag: null };
            markers.add(newMarkerObject);
            newMarkerObject.marker.setId = function (newId) {
                newMarkerObject.id = newId;
                return newMarkerObject.marker;
            }
            newMarkerObject.marker.setTag = function (value) {
                newMarkerObject.tag = value;
                return newMarkerObject.marker;
            }
            newMarkerObject.marker.getTag = function () {
                return newMarkerObject.tag;
            }
            return newMarkerObject.marker;
        }
        function findMarkerById(id) {
            return markers.filter.equal("id", id).get(0).marker;
        }
        function addKML(kmlSrc) {
            config.kmlSrc = kmlSrc;
            return ggMap.addKML(self, kmlSrc);
        }
        function reload() {
            var bakZoom = self.getZoom();
            var bakCenter = self.getCenter();
            self = new google.maps.Map(mapHolder.control, {
                disableDefaultUI: true
            });
            self.setZoom(bakZoom);
            if (bakCenter != null) {
                self.setCenter(bakCenter);
            }
            markers.foreach(function (markerItem, position) {
                if (!markerItem.marker.isRemoved)
                    markerItem.marker.updateMap(self);
            });
            initEvent();
            if (config.kmlSrc != "") {
                self.addKML(config.kmlSrc);
            }
            return self;
        }
        function removeMarkers() {
            var oldMarkers = markers.clone();
            markers = new dh.List();
            oldMarkers.asyncForeach(function (markerItem, position) {
                markerItem.marker.setMap(null);
            });
        }
        function clusterMarker() {
            var markerCluster = new MarkerClusterer(self, markers.toArray());
            return markerCluster;
        }
        function getAllMarkerObject() {
            return markers;
        }
        function getTag() {
            return tag;
        }
        function setTag(value) {
            tag = value;
        }
        function removeMarkerById(id) {
            var markerObject = markers.filter.equal("id", id).get(0);
            markerObject.marker.remove();
            markers.remove(markerObject);
        }
        var waiter_find = null;
        function findNearByPlace(options, callback) {
            //dh.NetWork.info.allowCORS = true;
            //var request = dh.NetWork.GET("https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAgmTcDWMpd1IOZPsgdLNZS9nGSba0A47E&location=10.790145,106.640211&radius=2000&type=food",
            //       function (request, body) {
            //           callback(JSON.parse(body));
            //       }, function () {
            //           if (onFailed != undefined) {
            //               onFailed()
            //           }
            //       }, false);
            //request.addHeader("authorization", "Bearer " + oAuthV2);
            //request.addHeader("Access-Control-Allow-Origin", "*");
            //request.execute();
            if (waiter_find) {
                waiter_find.remove();
            }
            var service = getService();
            waiter_find = dh.Waiter.create(function () {
                waiter_find = null;
                service.nearbySearch(options, callback);
            }, 400);
            return service;
        }

        function findPlaceByKey(options, callback) {
            if (waiter_find) {
                waiter_find.remove();
            }
            var service = getService();
            waiter_find = dh.Waiter.create(function () {
                waiter_find = null;
                service.textSearch(options, callback);
            }, 400);
            return service;
        }

        function findAddressByKey(key, onFound) {
            getAutoCompleteService().getQueryPredictions({ input: key }, onFound);
        }

        function getService() {
            return map_service || (map_service = new google.maps.places.PlacesService(self));
        }

        function getAutoCompleteService(){
          return autocomplete_service || (autocomplete_service = new google.maps.places.AutocompleteService());
        }

        function initEvent() {
            self.addMarker = addMarker;
            self.findMarkerById = findMarkerById;
            self.removeMarkerById = removeMarkerById;
            self.removeMarkerById
            self.addKML = addKML;
            self.reload = reload;
            self.removeMarkers = removeMarkers;
            self.addDirection = addDirection;
            self.setTag = setTag;
            self.getTag = getTag;
            self.clusterMarker = clusterMarker;
            self.getAllMarkerObject = getAllMarkerObject;
            self.findNearByPlace = findNearByPlace;
            self.findPlacesByKey = findPlaceByKey;
            self.findAddressByKey = findAddressByKey;
            self.getService = getService;
        }
        function optionsToParams(options) {
            param = "?key=AIzaSyAgmTcDWMpd1IOZPsgdLNZS9nGSba0A47E";
            for (var key in options) {
                param += "&" + key + "=" + options[key].toString();
            }
            console.log(param);
            return param;
        }
        function addDirection(from, to, onRouted, waypoints) {
            ggMap.addDirection(self, from, to, onRouted, waypoints);
        }
        initEvent();
        mapHolder.events.override.onDestroy(function (view) {
            self.removeMarkers();
        });
        return self;
    },
    addMarker: function (map, lat, lng, icon, label) {
        if (label != undefined) {
            label = label + "" || "";
        } else {
            label = "";
        }
        var isPaused = false;
        var marker;
        if (icon == null) {
            marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map,
                label: label
            });
        } else {
            var image = {
                url: icon,
                // This marker is 20 pixels wide by 32 pixels high.
                scaledSize: new google.maps.Size(24, 24),
                // The origin for this image is (0, 0).
                origin: new google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new google.maps.Point(0, 0)
            };
            var shape = {
                coords: [1, 1, 1, 20, 18, 20, 18, 1],
                type: 'poly'
            };
            marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map,
                shap: shape,
                icon: image,
                label: label
            });

        }
        marker.setOnClick = function (onMarkerClicked) {
            marker.addListener('click', function () {
                onMarkerClicked(this);
            });
            return marker;
        }
        marker.updatePosition = function (lat, lng) {
            var newLatLng = new google.maps.LatLng(lat, lng);
            marker.setPosition(newLatLng);
            return marker;
        }
        marker.isRemoved = false;
        marker.isPaused = false;
        marker.remove = function () {
            marker.isRemoved = true;
            marker.setMap(null);
        }
        marker.pause = function () {
            marker.setMap(null);
            marker.isPaused = true;
        }
        marker.resume = function () {
            if (marker.isPaused) {
                marker.setMap(map);
                marker.isPaused = false;
            }
        }
        marker.updateMap = function (newMap) {
            map = newMap;
            if (!marker.isPaused) {
                marker.setMap(map);
            }
        }
        return marker;
    },
    addKML: function (map, kmlSrc) {
        var kml = new google.maps.KmlLayer({
            url: kmlSrc,
            map: map,
            preserveViewport: true
        });
        return kml;
    },
    addDirection: function (map, from, to, onRouted, waypoints) {
        var directionsDisplay = new google.maps.DirectionsRenderer({ map: map });
        var directionsService = new google.maps.DirectionsService({ map: map });
        directionsService.route({
            origin: from,
            destination: to,
            waypoints: waypoints,
            optimizeWaypoints: true,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                if (onRouted != null) {
                    onRouted(response, directionsService, directionsDisplay);
                }
            } else {
                window.alert('Directions request failed due to ' + status);
            }

        });
        return directionsDisplay;
    }
}

function onMapInit() {

}