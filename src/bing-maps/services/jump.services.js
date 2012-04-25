 /*!
 * jump.js 1.0 - BING Map
 * https://github.com/openlab/jump.js
 * Copyright (c) 2010 - 2012 Johan Säll Larsson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Depends:
 *		jump.js
 */
( function($) {
	
	$.extend($.ui.jump.prototype, {
		
		search: function(searchRequest, callback) {
			var self = this;
			searchRequest = this._extend({ 
				'count': 10, 
				'callback': function(result, data) { callback(result, 'OK', data); }, 
				'errorCallback': function(request) { callback(null, 'ERROR'); } }, 
				searchRequest, 
				{ 'address': 'where' }
			);
			self.set('temp', function() {
				self.get('services > SearchManager', new Microsoft.Maps.Search.SearchManager(self.get('map'))).search(searchRequest);
			});
			if ( !self.get('services > SearchManager') ) {
				Microsoft.Maps.loadModule('Microsoft.Maps.Search', { 'callback': self.get('temp') });
			} else {
				self.get('temp')();
			}
		},
		
		displayDirections: function(directionsRequest, renderOptions) {
			var self =this;
			directionsRequest = self._extend({ 'waypoints': [] }, directionsRequest, { 'travelMode': 'routeMode', 'unitSystem': 'distanceUnit' });
			renderOptions = self._extend({}, renderOptions, { 'panel': { 'replace': 'itineraryContainer', 'callback': function(el) { console.log(el); return self._unwrap(el); } } });
			self.set('temp', function() {
				var directionManager = self.get('services > DirectionsManager', new Microsoft.Maps.Directions.DirectionsManager(self.get('map')));
				directionManager.resetDirections();
				if ( directionsRequest.origin && directionsRequest.destination ) {
					directionsRequest.waypoints.push(( typeof directionsRequest.origin === 'string' ) ? { 'address': directionsRequest.origin } : { 'location': directionsRequest.origin });
					directionsRequest.waypoints.push(( typeof directionsRequest.destination === 'string' ) ? { 'address': directionsRequest.destination } : { 'location': directionsRequest.destination });
				}
				$.each(directionsRequest.waypoints, function(i, waypoint) {
					directionManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint(waypoint));
				});
				if ( renderOptions ) {
					directionManager.setRenderOptions(renderOptions);
				}
				directionManager.calculateDirections();
			});
			if ( !self.get('services > DirectionsManager') ) {
				Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { 'callback': self.get('temp') });
			} else {
				self.get('temp')();
			}
		},
		
		displayVenue: function(venueRequest, callback) {
			var self = this, venue = self.get('services > VenueMap');
			this._extend(venueRequest, { 'success': function(venue) { self.get('map').setView(venue.bestMapView); self.get('services > VenueMap', venue).show(); self._call(callback, venue); } });
			self.set('temp', function() {
				 self.get('services > VenueMapFactory', new Microsoft.Maps.VenueMaps.VenueMapFactory(self.get('map'))).create(venueRequest);
			});
			if ( !venue ) {
				Microsoft.Maps.loadModule('Microsoft.Maps.VenueMaps', { 'callback': self.get('temp') });
			} else {
				venue.dispose();
				self.set('services > VenueMap', null); 
				self.get('temp')();
			}
		},
		
		showVenue: function() {
			var venue = self.get('services > VenueMap');
			if ( venue ) {
				venue.show();
			}
		},
		
		hideVenue: function() {
			var venue = self.get('services > VenueMap');
			if ( venue ) {
				venue.hide();
			}
		}

	
	});
	
} (jQuery) );