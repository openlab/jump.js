 /*!
 * jQuery UI Google Map 3.0-alpha
 * http://code.google.com/p/jquery-ui-map/
 * Copyright (c) 2010 - 2011 Johan Säll Larsson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Depends:
 *		jquery.ui.map.js
 */
( function($) {
	
	window.google = {};
	window.google.maps = {
		'Size': Microsoft.Maps.Point,
		'LatLng': Microsoft.Maps.Location,
		'Marker': Microsoft.Maps.Pushpin,
		'InfoWindow': Microsoft.Maps.Infobox,
		'MapTypeId': { 
			'HYBRID': Microsoft.Maps.MapTypeId.birdseye,
			'ROADMAP': Microsoft.Maps.MapTypeId.road,
			'SATELLITE': Microsoft.Maps.MapTypeId.aerial,
			'TERRAIN': Microsoft.Maps.MapTypeId.mercator
		}
	};
	
	$.extend($.ui.gmap.prototype, {
		_convert: function(a, b) {
			switch (a) {
				case 'openInfoWindow':
					return jQuery.extend({
						'location': b.position,
						'htmlContent': b.content,
						'disableAutoPan': b.disableAutoPan,
						'width': b.maxWidth,
						'offset': b.pixelOffset,
						'zIndex': b.zIndex
					}, b);
				case 'addMarker':
					return jQuery.extend({
						'icon': b.icon,
						'location': b.position,
						'text': b.title,
						'visible': b.visible,
						'zIndex': b.zIndex
					}, b);
				default: return b;
			}
		}
	});
	
} (jQuery) );