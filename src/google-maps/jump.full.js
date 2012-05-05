 /*!
 * jump.js 1.0 - Google Maps
 * https://github.com/openlab/jump.js
 * Copyright (c) 2010 - 2012 Johan Säll Larsson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
( function($) {
	
	/**
	 * @param name:string
	 * @param version:string
	 * @param prototype:object
	 */
	$.a = function(name, version, prototype) {
		
		var namespace = name.split('.')[0];
        name = name.split('.')[1];
		
		$[namespace] = $[namespace] || {};
		$[namespace][name] = function(options, element, callback) {
			if ( arguments.length ) {
				this._setup(options, element, callback);
			}
		};
		
		$[namespace][name].prototype = $.extend({
			'namespace': namespace,
			'pluginName': name,
			'version': version
        }, prototype);
		
		$.fn[name] = function(options) {
			
			var isMethodCall = typeof options === "string",
				args = Array.prototype.slice.call(arguments, 1),
				returnValue = this;
			
			if ( isMethodCall && options.substring(0, 1) === '_' ) { 
				return returnValue; 
			}

			this.each(function() {
				var instance = $.data(this, name);
				if (!instance) {
					instance = $.data(this, name, new $[namespace][name](options, this, args));
				}
				if (isMethodCall) {
					var value = instance[options].apply(instance, args);
					if ( options === 'get' || value != null ) {
						returnValue = value;
					}
				}
			});
			
			return returnValue; 
			
		};
		
	};
	
	$.a('ui.jump', '1.0', {
		
		/**
		 * Map options
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MapOptions
		 */
		options: {
			mapTypeId: 'roadmap',
			zoom: 5	
		},
		
		/**
		 * Get or set options
		 * @param key:string
		 * @param options:object
		 * @return object
		 */
		option: function(key, options) {
			if (options) {
				this.options[key] = options;
				this.get('map').set(key, options);
				return;
			}
			return this.options[key];
		},
		
		/**
		 * Setup plugin basics, 
		 * @param options:object
		 * @param element:node
		 * @param callback:function() (optional)
		 */
		_setup: function(options, element, callback) {
			this.el = element;
			this.$el = $(element);
			options = options || {};
			$.extend(this.options, options, { 'center': this._latLng(options.center) });
			this._create(callback);
			if ( this._init ) { this._init(); }
		},
		
		/**
		 * Instanciate the Google Maps object
		 */
		_create: function(callback) {
			var self = this;
			this.instance = { 'map': new google.maps.Map(self.el, self.options), 'markers': [], 'overlays': [], 'services': [] };
			if ( callback ) {
				self._call(callback[0], self.instance.map);
			} 
			google.maps.event.addListenerOnce(self.instance.map, 'bounds_changed', function() { 
				$(self.el).trigger('init', self.instance.map); 
			});
		},
		
		/**
		 * Adds a latitude longitude pair to the bounds.
		 * @param position:google.maps.LatLng/string
		 */
		addBounds: function(position) {
			var bounds = this.get('bounds', new google.maps.LatLngBounds());
			bounds.extend(this._latLng(position));
			this.get('map').fitBounds(bounds);
		},
		
		/**
		 * Helper function to check if a LatLng is within the viewport
		 * @param marker:google.maps.Marker
		 */
		inViewport: function(marker) {
			var bounds = this.get('map').getBounds();
			return (bounds) ? bounds.contains(marker.getPosition()) : false;
		},
		
		/**
		 * Adds a custom control to the map
		 * @param panel:jquery/node/string	
		 * @param position:google.maps.ControlPosition	 
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ControlPosition
		 */
		addControl: function(panel, position) {
			this.get('map').controls[position].push(this._unwrap(panel));
		},
		
		/**
		 * Adds a Marker to the map
		 * @param markerOptions:google.maps.MarkerOptions
		 * @param callback:function(map:google.maps.Map, marker:google.maps.Marker) (optional)
		 * @return $(google.maps.Marker)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MarkerOptions
		 */
		addMarker: function(markerOptions, callback) {
			markerOptions.map = this.get('map');
			markerOptions.position = this._latLng(markerOptions.position);
			var marker = new (markerOptions.marker || google.maps.Marker)(markerOptions);
			var markers = this.get('markers');
			if ( marker.id ) {
				markers[marker.id] = marker;
			} else {
				markers.push(marker);
			}
			if ( marker.bounds ) {
				this.addBounds(marker.getPosition());
			}
			this._call(callback, markerOptions.map, marker);
			return $(marker);
		},
		
		/**
		 * Clears by type
		 * @param ctx:string	e.g. 'markers', 'overlays', 'services'
		 */
		clear: function(ctx) {
			this._c(this.get(ctx));
			this.set(ctx, []);
		},
		
		_c: function(obj) {
			for ( var property in obj ) {
				if ( obj.hasOwnProperty(property) ) {
					if ( obj[property] instanceof google.maps.MVCObject ) {
						google.maps.event.clearInstanceListeners(obj[property]);
						if ( obj[property].setMap ) {
							obj[property].setMap(null);
						}
					} else if ( obj[property] instanceof Array ) {
						this._c(obj[property]);
					}
					obj[property] = null;
				}
			}
		},
		
		/**
		 * Returns the objects with a specific property and value, e.g. 'category', 'tags'
		 * @param ctx:string	in what context, e.g. 'markers' 
		 * @param options:object	property:string	the property to search within, value:string, operator:string (optional) (AND/OR)
		 * @param callback:function(marker:google.maps.Marker, isFound:boolean)
		 */
		find: function(ctx, options, callback) {
			var obj = this.get(ctx);
			options.value = $.isArray(options.value) ? options.value : [options.value];
			for ( var property in obj ) {
				if ( obj.hasOwnProperty(property) ) {
					var isFound = false;
					for ( var value in options.value ) {
						if ( $.inArray(options.value[value], obj[property][options.property]) > -1 ) {
							isFound = true;
						} else {
							if ( options.operator && options.operator === 'AND' ) {
								isFound = false;
								break;
							}
						}
					}
					callback(obj[property], isFound);
				}
			}
		},
		
		/**
		 * Returns an instance property by key. Has the ability to set an object if the property does not exist
		 * @param key:string
		 * @param value:object(optional)
		 */
		get: function(key, value) {
			var instance = this.instance;
			if ( !instance[key] ) {
				if ( key.indexOf('>') > -1 ) {
					var e = key.replace(/ /g, '').split('>');
					for ( var i = 0; i < e.length; i++ ) {
						if ( !instance[e[i]] ) {
							if (value) {
								instance[e[i]] = ( (i + 1) < e.length ) ? [] : value;
							} else {
								return null;
							}
						}
						instance = instance[e[i]];
					}
					return instance;
				} else if ( value && !instance[key] ) {
					this.set(key, value);
				}
			}
			return instance[key];
		},
		
		/**
		 * Triggers an InfoWindow to open
		 * @param infoWindowOptions:google.maps.InfoWindowOptions
		 * @param marker:google.maps.Marker (optional)
		 * @param callback:function (optional)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		 */
		openInfoWindow: function(infoWindowOptions, marker, callback) {
			var iw = this.get('iw', infoWindowOptions.infoWindow || new google.maps.InfoWindow);
			iw.setOptions(infoWindowOptions);
			iw.open(this.get('map'), this._unwrap(marker)); 
			this._call(callback, iw);
		},
		
		/**
		 * Triggers an InfoWindow to close
		 */
		closeInfoWindow: function() {
			if ( this.get('iw') != null ) {
				this.get('iw').close();
			}
		},
				
		/**
		 * Sets an instance property
		 * @param key:string
		 * @param value:object
		 */
		set: function(key, value) {
			this.instance[key] = value;
		},
		
		/**
		 * Refreshes the map
		 */
		refresh: function() {
			var map = this.get('map');
			var latLng = map.getCenter();
			$(map).triggerEvent('resize');
			map.setCenter(latLng);
		},
		
		/**
		 * Destroys the plugin.
		 */
		destroy: function() {
			this.clear('markers');
			this.clear('services')
			this.clear('overlays')
			this._c(this.instance);
			$.removeData(this.el, this.name);
		},
		
		/**
		 * Helper method for calling a function
		 * @param callback
		 */
		_call: function(callback) {
			if ( callback && $.isFunction(callback) ) {
				callback.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},
		
		/**
		 * Helper method for google.maps.Latlng
		 * @param latLng:string/google.maps.LatLng
		 */
		_latLng: function(latLng) {
			if ( !latLng ) {
				return new google.maps.LatLng(0.0, 0.0);
			}
			if ( latLng instanceof google.maps.LatLng ) {
				return latLng;
			} else if ( typeof latLng === 'string' ) {
				latLng = latLng.replace(/ /g,'').split(',');
				return new google.maps.LatLng(latLng[0], latLng[1]);
			} else if ( $.isArray(latLng) ) {
				for ( var i = 0; i < latLng.length; i++ ) {
					latLng[i] = this._latLng(latLng[i]);
				}
				return latLng;
			}
		},
		
		/**
		 * Helper method for unwrapping jQuery/DOM/string elements
		 * @param obj:string/node/jQuery
		 * @param isObject:boolean
		 */
		_unwrap: function(obj, isObject) {
			if ( !obj ) {
				return null;
			} else if ( obj instanceof $ ) {
				return obj[0];
			} else if ( obj instanceof Object ) {
				return obj;
			} else if ( obj.indexOf('#') > 0 || obj.indexOf('.') > 0 ) {
				return $('#'+obj)[0];
			} else {
				return ( !isObject ) ? document.getElementById(obj) : null;
			}
		},
		
		/**
		 * Helper method for extending an object
		 * @param defaults:object
		 * @param option:object
		 * @param replace:object
		 */
		_extend: function(defaults, options, replace) { 
			for ( var key in options ) {
				if ( replace && replace[key] ) {
					replace = replace[key];
					if ( typeof replace === 'string' ) {
						defaults[replace] = options[key];
					} else {
						var rkey = ( replace.replace ) ? replace.replace : key;
						defaults[rkey] = (replace.callback) ? replace.callback(options[key]) : options[key];
					}
				} else {
					defaults[key] = options[key];
				}
			}
			return defaults;
		},
		
		/**
		 * Computes directions between two or more places.
		 * @param directionsRequest:google.maps.DirectionsRequest
		 * @param directionsRendererOptions:google.maps.DirectionsRendererOptions (optional)
		 * @param callback:function(result:google.maps.DirectionsResult, status:google.maps.DirectionsStatus)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRequest
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRendererOptions
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsResult
		 */
		displayDirections: function(directionsRequest, directionsRendererOptions, callback) {
			var self = this;		
			var directionService = this.get('services > DirectionsService', new google.maps.DirectionsService());
			var directionRenderer = this.get('services > DirectionsRenderer', new google.maps.DirectionsRenderer());
			if ( directionsRendererOptions ) {
				directionRenderer.setOptions(directionsRendererOptions);
			}
			directionService.route(directionsRequest, function(results, status) {
				if ( status === 'OK' ) {
					directionRenderer.setDirections(results);
					directionRenderer.setMap(self.get('map'));
				} else {
					directionRenderer.setMap(null);
				}
				callback(results, status);
			});
		},
		
		/**
		 * Displays the panorama for a given LatLng or panorama ID.
		 * @param panel:jQuery/String/Node
		 * @param streetViewPanoramaOptions:google.maps.StreetViewPanoramaOptions (optional) 
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#StreetViewPanoramaOptions
		 */
		displayStreetView: function(panel, streetViewPanoramaOptions) {
			this.get('map').setStreetView(this.get('services > StreetViewPanorama', new google.maps.StreetViewPanorama(this._unwrap(panel), streetViewPanoramaOptions)));
		},
		
		/**
		 * A service for converting between an address and a LatLng.
		 * @param geocoderRequest:google.maps.GeocoderRequest
		 * @param callback:function(result:google.maps.GeocoderResult, status:google.maps.GeocoderStatus), 
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#GeocoderResult
		 */
		search: function(geocoderRequest, callback) {
			this.get('services > Geocoder', new google.maps.Geocoder()).geocode(geocoderRequest, callback);
		},
		
		/**
		 * Adds a shape to the map
		 * @param shapeType:string Polygon, Polyline, Rectangle, Circle
		 * @param shapeOptions:object
		 * @return object
		 */
		addShape: function(shapeType, shapeOptions) {
			var self = this;
			var shape = new google.maps[shapeType](this._extend({ 'map': this.get('map') }, shapeOptions, {
				'center': { 'callback': function(center) { return self._latLng(center) } },
				'paths': { 'callback': function(paths) { return self._latLng(paths) } },
				'path': { 'callback': function(paths) { return self._latLng(paths) } }
			}));
			this.get('overlays > ' + shapeType, []).push(shape);
			return $(shape);
		},
		
		/**
		 * Adds fusion data to the map.
		 * @param fusionTableOptions:google.maps.FusionTablesLayerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#FusionTablesLayerOptions
		 * @param fusionTableId:int
		 */
		loadFusion: function(fusionTableOptions, fusionTableId) {
			( (!fusionTableId) ? this.get('overlays > FusionTablesLayer', new google.maps.FusionTablesLayer()) : this.get('overlays > FusionTablesLayer', new google.maps.FusionTablesLayer(fusionTableId, fusionTableOptions)) ).setOptions($.extend({'map': this.get('map') }, fusionTableOptions));
		},
		
		/**
		 * Adds markers from KML file or GeoRSS feed
		 * @param uid:String - an identifier for the RSS e.g. 'rss_dogs'
		 * @param url:String - URL to feed
		 * @param kmlLayerOptions:google.maps.KmlLayerOptions, http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#KmlLayerOptions
		 */
		loadKML: function(uid, url, kmlLayerOptions) {
			this.get('overlays > ' + uid, new google.maps.KmlLayer(url, $.extend({'map': this.get('map')}, kmlLayerOptions)));
		}
		
	});
	
	$.fn.extend( {
		
		triggerEvent: function(eventType) {
			google.maps.event.trigger(this[0], eventType);
			return this;
		},
		
		addEventListener: function(eventType, eventDataOrCallback, eventCallback) {
			if ( google.maps && this[0] instanceof google.maps.MVCObject ) {
				google.maps.event.addListener(this[0], eventType, eventDataOrCallback);
			} else {
				if (eventCallback) {
					this.bind(eventType, eventDataOrCallback, eventCallback);
				} else {
					this.bind(eventType, eventDataOrCallback);
				} 
			}
			return this;
		},
		  
		removeEventListener: function(eventType) {
			if ( google.maps && this[0] instanceof google.maps.MVCObject ) {
				if (eventType) {
					google.maps.event.clearListeners(this[0], eventType);
				} else {
					google.maps.event.clearInstanceListeners(this[0]);
				}
			} else {
				this.unbind(eventType);
			}
			return this;
		}
		
	});
	
	$.each(('click rightclick dblclick mouseover mouseout drag dragend').split(' '), function(i, name) {
		$.fn[name] = function(a, b) {
			return this.addEventListener(name, a, b);
		}
	});
	
} (jQuery) );