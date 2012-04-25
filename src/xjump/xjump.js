 /*!
 * xjump.js 1.0 - Crossover
 * https://github.com/openlab/jump.js
 * Copyright (c) 2010 - 2012 Johan Säll Larsson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
 
 if ( window.Microsoft && window.Microsof.Maps ) {
	window.google = {};
	google.maps = {};
	google.maps.Size = Microsoft.Maps.Point;
	google.maps.LatLng = Microsoft.Maps.Location;
	google.maps.Marker = Microsoft.Maps.Pushpin;
	google.maps.InfoWindow = Microsoft.Maps.Infobox;
	google.maps.MapTypeId = {
		'HYBRID': Microsoft.Maps.MapTypeId.birdseye,
		'ROADMAP': Microsoft.Maps.MapTypeId.road,
		'SATELLITE': Microsoft.Maps.MapTypeId.aerial,
		'TERRAIN': Microsoft.Maps.MapTypeId.mercator
	}
 }