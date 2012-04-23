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
		 * Returns the objects with a specific property and value, e.g. 'category', 'tags'
		 * @param context:string	in what context, e.g. 'markers' 
		 * @param options:object	property:string, keyword:string
		 * @param ccallback:function(Microsoft.Maps.Pushpin, isFound:boolean)
		 */
		findWith: function(context, options, callback) {
			var obj = this.get(context);
			for ( var property in obj ) {
				if ( obj.hasOwnProperty(property) && obj[property][options.property] ) {
					var isFound = false;
					var target = obj[property][options.property];
					if ( $.isArray( target ) ) {
						for ( var value in target ) {
							if ( target[value].toLowerCase().indexOf(options.keyword.toLowerCase()) === 0 ) {
								isFound = true;
								break;
							}
						}
					} else {
						isFound = ( target.toLowerCase().indexOf(options.keyword.toLowerCase()) === 0 );
					}
					callback(obj[property], isFound);
				}
			}
		},
		
		/**
		 * Gets the current position
		 * @param callback:function(position, status)
		 * @param geoPositionOptions:object, see http://msdn.microsoft.com/en-us/library/hh125839.aspx
		 */
		getCurrentPosition: function(callback, geoPositionOptions) {
			var geoPositionOptions = this._extend({ 
				'successCallback': function(position) { callback(position, "OK"); }, 
				'errorCallback': function(error) { callback(null, ( error.code === 5 ) ? 'NOT_SUPPORTED' : error.code); }
			}, geoPositionOptions);
			this.get('geolocation', new Microsoft.Maps.GeoLocationProvider(this.get('map'))).getCurrentPosition(geoPositionOptions);
		},
		
		/**
		 * Watches current position
		 * To clear watch, call navigator.geolocation.clearWatch(this.get('watch'));
		 * @param callback:function(position, status)
		 * @param geoPositionOptions:object, see https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIDOMGeoPositionOptions
		 */
		watchPosition: function(callback, geoPositionOptions) {
			var self = this;
			if ( navigator.geolocation ) {
				this.get('watch', navigator.geolocation.watchPosition ( 
					function(position) {
						self._call(callback, position, "OK");
					}, 
					function(error) {
						self._call(callback, null, error);
					}, 
					geoPositionOptions 
				));	
			} else {
				c._call(callback, null, "NOT_SUPPORTED");
			}
		},

		/**
		 * Clears any watches
		 */
		clearWatch: function() {
			if ( navigator.geolocation ) {
				navigator.geolocation.clearWatch(this.get('watch'));
				this.set('watch', null);
			}
		},
		
		/**
		 * Page through the markers. Very simple version.
		 * @param prop:the marker property to show in display, defaults to title
		 */
		pagination: function(prop) {
			var $el = $("<div id='pagination' class='pagination shadow gradient rounded clearfix'><div class='lt btn back-btn'></div><div class='lt display'></div><div class='rt btn fwd-btn'></div></div>");
			var self = this, i = 0, prop = prop || 'title';
			self.set('p_nav', function(a, b) {
				if (a) {
					i = i + b;
					$el.find('.display').text(self.get('markers')[i][prop]);
					self.get('map').setView({'center': self.get('markers')[i].getLocation()});
				}
			});
			self.get('p_nav')(true, 0);
			$el.find('.back-btn').click(function() {
				self.get('p_nav')((i > 0), -1, this);
			});
			$el.find('.fwd-btn').click(function() {
				self.get('p_nav')((i < self.get('markers').length - 1), 1, this);
			});
			self.addControl($el, 0);			
		},
		
		/**
		 * Sets the data that is to be clustered and displayed on the map. All objects 
		 * must at minimium have a Latitude and Longitude properties. 
		 * @param arrayOfLocations:array - An array of objects that are to be mapped. 
		 */
		createCluster: function(arrayOfLocations) {
			var self = this;
			Microsoft.Maps.registerModule('clusterModule', 'http://www.bingmapsportal.com/Scripts/V7ClientSideClustering.js');
			Microsoft.Maps.loadModule('clusterModule', { callback: function() {
				self.clear('markers');
				var clusteredCollection = new ClusteredEntityCollection( self.get('map'), { 
					singlePinCallback: function(data) {
						var pushPin = new Microsoft.Maps.Pushpin(data._LatLong, {
							'icon': 'http://www.bingmapsportal.com/Content/nonclusteredpin.png',
							'anchor': new Microsoft.Maps.Point(8, 8)
						});
						pushPin.title = data.Title;
						pushPin.description = data.Description;
						pushPin.GridKey = data.GridKey;
						$(pushPin).click(function() {
							self.openInfoWindow({'title': this.target.title, 'description': this.target.description}, this);
						});
						return pushPin;
					},
					clusteredPinCallback: function(cluster, latlong) {
						return new Microsoft.Maps.Pushpin(latlong, {
							'icon': 'http://www.bingmapsportal.com/Content/clusteredpin.png',
							'anchor': new Microsoft.Maps.Point(8, 8)
						});
					}
				});
				clusteredCollection.SetData(arrayOfLocations);
			}});
		}
	
	});
	
} (jQuery) );