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
		
		/**
		 * Adds a shape to the map
		 * @param shape:string Polygon, Polyline, Rectangle, Circle
		 * @param options:object
		 * @return object
		 */
		addShape: function(type, shapeOptions) {
			var self = this, shape;
			shapeOptions = this._extend({ 'paths': [] }, shapeOptions, {
				'strokeWeight': 'strokeThickness',
				'path': 'paths'
			});
			$.each(shapeOptions.paths, function(i, path) {
				shapeOptions.paths[i] = self._latLng(path);
			});
			if ( type === 'Circle' ) {
				shape = new Microsoft.Maps.GeoLocationProvider(self.get('map'));
				shape.addAccuracyCircle(self._latLng(shapeOptions.center), shapeOptions.radius, 100, shapeOptions);
			} else {
				shape = new Microsoft.Maps[type](shapeOptions.paths, shapeOptions);
				this.get('map').entities.push(shape);
			}
			this.get('overlays > ' + type, []).push(shape);
			return $(shape);
		}
	
	});
	
} (jQuery) );