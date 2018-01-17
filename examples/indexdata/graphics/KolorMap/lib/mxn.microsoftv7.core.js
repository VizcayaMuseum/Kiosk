mxn.register('microsoftv7', {

Mapstraction: {
	init: function(element, api, properties) {
		var me = this;
		
		if (typeof Microsoft.Maps === 'undefined') {
			throw new Error(api + ' map script not imported');
		}
		
		this.defaultBaseMaps = [
			{
				mxnType: mxn.Mapstraction.ROAD,
				providerType: Microsoft.Maps.MapTypeId.road,
				nativeType: true
			},
			{
				mxnType: mxn.Mapstraction.SATELLITE,
				providerType: Microsoft.Maps.MapTypeId.aerial,
				nativeType: true
			},
			{
				mxnType: mxn.Mapstraction.HYBRID,
				providerType: Microsoft.Maps.MapTypeId.birdseye,
				nativeType: true
			},
			{
				mxnType: mxn.Mapstraction.PHYSICAL,
				providerType: Microsoft.Maps.MapTypeId.road,
				nativeType: true
			}
		];
		this.initBaseMaps();
		
		var options = {
			credentials: microsoftv7_key,
			enableClickableLogo: false,
			enableSearchLogo: false,
			showDashboard: true,
			showMapTypeSelector: true,
			showScalebar: true
		};
		/*
		var disable = {
			double_click: false,
			scroll_wheel: false
		};
		*/
		if (typeof properties !== 'undefined' && properties !== null) {
			if (properties.hasOwnProperty('controls')) {
				var controls = properties.controls;
				
				if ('pan' in controls && controls.pan) {
					options.showDashboard = true;
				}
				
				if ('zoom' in controls && controls.zoom || controls.zoom === 'small' || controls.zoom === 'large') {
					options.showDashboard = true;
				}
				
				// The overview/mini-map control isn't supported in the Bing v7 API. No, really.
				// See below for a rant.
				// TODO: Investigate possibility of implementing a custom overview map, see
				// http://pietschsoft.com/post/2010/12/19/Bing-Maps-Ajax-7-Add-a-Simple-Mini-Map
				// http://bingmapsv7modules.codeplex.com/wikipage?title=Mini-Map%20Module
				/*if ('overview' in controls) {
					
				}*/
				
				if ('scale' in controls && controls.scale) {
					options.showScalebar = true;
					//options.showDashboard = true;
				}
				
				if ('map_type' in controls && controls.map_type) {
					options.showMapTypeSelector = true;
					//options.showDashboard = true;
				}
			}
			
			if (properties.hasOwnProperty('center') && null !== properties.center) {
				var point;
				if (Object.prototype.toString.call(properties.center) === '[object Array]') {
					point = new mxn.LatLonPoint(properties.center[0], properties.center[1]);
				}
				
				else {
					point = properties.center;
				}
				options.center = point.toProprietary(this.api);
			}
			
			if (properties.hasOwnProperty('zoom') && null !== properties.zoom) {
				options.zoom = properties.zoom;
			}
			
			if (properties.hasOwnProperty('map_type') && null !== properties.map_type) {
				switch (properties.map_type) {
					case mxn.Mapstraction.ROAD:
						options.mapTypeId = Microsoft.Maps.MapTypeId.road;
						break;
					case mxn.Mapstraction.PHYSICAL:
						options.mapTypeId = Microsoft.Maps.MapTypeId.road;
						break;
					case mxn.Mapstraction.HYBRID:
						options.mapTypeId = Microsoft.Maps.MapTypeId.birdseye;
						break;
					case mxn.Mapstraction.SATELLITE:
						options.mapTypeId = Microsoft.Maps.MapTypeId.aerial;
						options.labelOverlay = Microsoft.Maps.LabelOverlay.hidden;
						break;
					default:
						options.mapTypeId = Microsoft.Maps.MapTypeId.road;
						break;
				}
			}
			
			/*
			if (properties.hasOwnProperty('dragging')) {
				options.disableUserInput = true;
			}

			if (properties.hasOwnProperty('scroll_wheel')) {
				disable.scroll_wheel = true;
			}

			if (properties.hasOwnProperty('double_click')) {
				disable.double_click = true;
			}
			*/
		}
		
		// The design decisions behind the Microsoft/Bing v7 API are simply jaw dropping.
		// Want to show/hide the dashboard or show/hide the scale bar? Nope. You can only
		// do that when you're creating the map object. Once you've done that the map controls
		// stay "as-is" unless you want to tear down the map and redisplay it. And as for the
		// overview "mini-map", that's not supported at all and you have to write your own.
		// See http://msdn.microsoft.com/en-us/library/gg427603.aspx for the whole sorry tale.

		// Code Health Warning
		// The documentation for the Microsoft.Maps.Map constructor says you can either
		// pass a MapOptions *or* a ViewOptions object as the 2nd constructor argument.
		// (http://msdn.microsoft.com/en-us/library/gg427609.aspx)
		// Despite this; it appears that if you aggregate the properties of MapOptions and
		// ViewOptions into a single object and pass this, it all automagically works.
		
		this.maps[api] = new Microsoft.Maps.Map(element, options);
		
		//Now get the update the microsoft key to be session key for geocoding use later without racking up api hits
		this.maps[api].getCredentials(function(credentials) { 
			if(credentials !== null) { microsoftv7_key = credentials; }
		});
		
		
		/*
		// Disable scroll wheel/mouse wheel interaction if specified in the
		// constructor properties
		Microsoft.Maps.Events.addHandler(this.maps[api], 'mousewheel', function(event) {
			if (event.targetType == 'map') { // && !me.options.enableScrollWheelZoom
				event.handled = true;
			}
		});
		
		// Disable double-click to zoom if specified in the constructor
		// properties
		Microsoft.Maps.Events.addHandler(this.maps[api], 'dblclick', function(event) {
			//if (event.targetType == 'map' && !me.options.enableDoubleClickZoom) {
			event.handled = true;
			//}
		});
		*/

		//Add Click Event - with IE7 workaround if needed
		if (element.addEventListener){
			element.addEventListener('contextmenu', function (evt) {
				e = evt?evt:window.event;
				if (e.preventDefault) e.preventDefault(); // For non-IE browsers.
				else e.returnValue = false; // For IE browsers.
			});
		} else if (element.attachEvent){
			element.attachEvent('oncontextmenu', function (evt) {
				e = evt?evt:window.event;
				if (e.preventDefault) e.preventDefault(); // For non-IE browsers.
				else e.returnValue = false; // For IE browsers.
			});
		}
		/*
		Microsoft.Maps.Events.addHandler(this.maps[api], 'rightclick', function(event) {
			var map = me.maps[me.api];
			var _x = event.getX();
			var _y = event.getY();
			var pixel = new Microsoft.Maps.Point(_x, _y);
			var ll = map.tryPixelToLocation(pixel);
			var _event = {
					'location': new mxn.LatLonPoint(ll.latitude, ll.longitude),
					'position': {x:_x, y:_y},
					'button': 'right'
				};
			me.click.fire(_event);
		});
		*/
		Microsoft.Maps.Events.addHandler(this.maps[api], 'click', function(event){
			var map = me.maps[me.api];
			e = event.originalEvent?event.originalEvent:window.event;
			if (e.preventDefault) e.preventDefault(); // For non-IE browsers.
			else e.returnValue = false; // For IE browsers.
			
			if (event.targetType == 'pushpin') {
				event.target.mapstraction_marker.click.fire();
			}
			else {
				var _x = event.getX();
				var _y = event.getY();
				var pixel = new Microsoft.Maps.Point(_x, _y);
				var ll = map.tryPixelToLocation(pixel);
				var _event = {
					'location': new mxn.LatLonPoint(ll.latitude, ll.longitude),
					'position': {x:_x, y:_y},
					'button': event.isSecondary ? 'right' : 'left'
				};
				me.click.fire(_event);
			}
		});

		Microsoft.Maps.Events.addHandler(this.maps[api], 'viewchangeend', me.changeZoom.fire);
		Microsoft.Maps.Events.addHandler(this.maps[api], 'viewchangeend', me.endPan.fire);
		/*
		Microsoft.Maps.Events.addHandler(this.maps[api], 'viewchange', function(event){ me.endPan.fire(); });
		*/
		
		//set focus/blur actions for keyboard events
		var msMapThis = this.maps[api];
		Microsoft.Maps.Events.addHandler(this.maps[api], 'mouseover', function(e) { msMapThis.focus(); });
		Microsoft.Maps.Events.addHandler(this.maps[api], 'mouseout', function(e) { msMapThis.blur(); });
		
		var loadListener = Microsoft.Maps.Events.addHandler(this.maps[api], 'tiledownloadcomplete', function(event) {
			me.load.fire();
			Microsoft.Maps.Events.removeHandler(loadListener);
		});
		
		if (jQuery) {
			jQuery("<style type='text/css'>.spotformicrosoft7 { cursor: pointer !important; }</style>").appendTo("head");
			jQuery("<style type='text/css'>#"+element.id+" svg { position: absolute; }</style>").appendTo("head");
		}
		
		me.storeElement = element;
	},
	
	getVersion: function() {
		return Microsoft.Maps.Map.getVersion();
	},
	
	applyOptions: function(){
		var map = this.maps[this.api];
		var opts = map.getOptions();
		
		opts.disablePanning = !this.options.enableDragging;
		opts.disableZooming = !this.options.enableScrollWheelZoom;
		//TODO disableDoubleClickZoom option doesn't exists
		
		map.setOptions(opts);
	},

	resizeTo: function(width, height){
		var map = this.maps[this.api];
		map.setOptions(height,width);
	},

	// Code Health Warning
	// Microsoft7 only supports (most of) the display controls as part of the Dashboard
	// and this needs to be configured *before* the map is instantiated and displayed.
	// So addControls, addSmallControls, addLargeControls and addMapTypeControls are
	// effectively no-ops and so they don't throw the unsupported feature exception.
	
	addControls: function( args ) {
		//update CSS to change display of div on the fly
		if (jQuery) {
			var me = this;
			this.myInterval = setInterval(function(){
				me.addControlsTimer( args );
			},20);
		} else {
			throw 'jQuery doesn\'t exists to CSS add/remove control';
		}
		//throw new Error('Mapstraction.addControls is not currently supported by provider ' + this.api);
	},
	
	addControlsTimer: function( args ) {
		var counterInterval = 0;
		if( jQuery(".OverlaysTL .NavBar_compassControlContainer").length ){
			clearInterval(this.myInterval);
			this.addControlsTimeout(args);
		}else if(counterInterval > 10){
			clearInterval(this.myInterval);
		}else{
			counterInterval++;
		}
	},
	
	addControlsTimeout: function ( args ) {
		//note : overview mini-map doesn't exists
		if ( !args.pan ) {
			if ( jQuery(".OverlaysTL .NavBar_compassControlContainer").length ){
				jQuery(".OverlaysTL .NavBar_compassControlContainer").css('display','none');
			}
		}else{
			this.addControlsArgs.pan = true;
		}
		if( !args.zoom ){
			if(jQuery(".OverlaysTL .NavBar_zoomControlContainer").length ){
				jQuery(".OverlaysTL .NavBar_zoomControlContainer").css('display','none');
			}
		}else{
			this.addControlsArgs.zoom = args.zoom;
		}
		if( !args.map_type ){
			if(jQuery(".OverlaysTL .NavBar_compassControlContainer").length ){
				jQuery(".OverlaysTL .NavBar_modeSelectorControlContainer").css('display','none');
			}
		}else{
			this.addControlsArgs.map_type = true;
		}
		if( !args.scale ) {
			if(jQuery(".OverlaysBR-logoAware .ScaleBarContainer").length ){
				jQuery(".OverlaysBR-logoAware .ScaleBarContainer").css('display','none');
			}
		}else{
			this.addControlsArgs.scale = true;
		}
	},
	
	addSmallControls: function() {
		//update CSS to change display of div on the fly
		if (jQuery) {
			var args = {pan: false, scale: false, zoom: 'small'};
			var me = this;
			me.myInterval = setInterval(function(){
				me.addControlsTimer( args );
			},20);
		} else {
			throw 'jQuery doesn\'t exists to CSS add/remove controls';
		};
	},

	addLargeControls: function() {
		//update CSS to change display of div on the fly
		if (jQuery) {
			var args = {pan: true, zoom: 'large'};
			var me = this;
			me.myInterval = setInterval(function(){
				me.addControlsTimer( args );
			},20);
		} else {
			throw 'jQuery doesn\'t exists to CSS add/remove controls';
		}
	},

	addMapTypeControls: function() {
		//update CSS to change display of div on the fly
		if (jQuery) {
			var args = {map_type: true};
			var me = this;
			me.myInterval = setInterval(function(){
				me.addControlsTimer( args );
			},20);
		} else {
			throw 'jQuery doesn\'t exists to CSS add/remove controls';
		}
	},

	setCenterAndZoom: function(point, zoom) { 
		var map = this.maps[this.api];
		var pt = point.toProprietary(this.api);	

		// Get the existing options.
		var options = {};
		options.zoom = zoom;
		options.center = pt;
		map.setView(options);
	},
	
	addMarker: function(marker, old) {
		var map = this.maps[this.api];
		var pin = marker.toProprietary(this.api);
		
		map.entities.push(pin);
		
		return pin;
	},

	removeMarker: function(marker) {
		//remove use marker.api, so marker must be up to date into vendor api
		var map = this.maps[this.api];// or marker.api
		if (marker.proprietary_marker) {
			map.entities.remove(marker.proprietary_marker);
		}
	},
	
	declutterMarkers: function(opts) {
		throw new Error('Mapstraction.declutterMarkers is not currently supported by provider ' + this.api);
	},
	
	changeMapStyle: function(styleArray) {
		throw new Error('Mapstraction.changeMapStyle is not currently supported by provider ' + this.api);
	},
	
	addPolyline: function(polyline, old) {
		var map = this.maps[this.api];
		var pl = polyline.toProprietary(this.api);
		
		map.entities.push(pl);
		
		return pl;
	},

	removePolyline: function(polyline) {
		var map = this.maps[this.api];
		
		if (polyline.proprietary_polyline) {
			map.entities.remove(polyline.proprietary_polyline);
		}
	},
	
	addRadar: function(radar, old) {
		var map = this.maps[this.api];
		var propRadar = radar.toProprietary(this.api);
		map.entities.push(propRadar);
		return propRadar;
	},
	
	removeRadar: function(radar) {
		var map = this.maps[this.api];
		if (radar.proprietary_radar) {
			map.entities.remove(radar.proprietary_radar);
		}
	},
	
	getCenter: function() {
		var map = this.maps[this.api];
		var center = map.getCenter();
		return new mxn.LatLonPoint(center.latitude, center.longitude);
	},

	setCenter: function(point, options) {
		var map = this.maps[this.api];
		var pt = point.toProprietary(this.api);
	 
		// Get the existing options.
		var msOptions = map.getOptions();
		msOptions.center = pt;
		msOptions.bounds = null;
		map.setView(msOptions);
	},

	setZoom: function(zoom) {
		var map = this.maps[this.api];
		// Get the existing options.
		var options = map.getOptions();
		options.zoom = zoom;
		map.setView(options);
	},
	
	getZoom: function() {
		var map = this.maps[this.api];
		return map.getZoom();
	},

	getZoomLevelForBoundingBox: function( bbox ) {
		throw new Error('Mapstraction.getZoomLevelForBoundingBox is not currently supported by provider ' + this.api);
	},

	setMapType: function(type) {
		var map = this.maps[this.api];
		var options = map.getOptions();
		
		switch (type) {
			case mxn.Mapstraction.ROAD:
				options.mapTypeId = Microsoft.Maps.MapTypeId.road;
				break;
			case mxn.Mapstraction.SATELLITE:
				options.mapTypeId = Microsoft.Maps.MapTypeId.aerial;
				options.labelOverlay = Microsoft.Maps.LabelOverlay.hidden;
				break;
			case mxn.Mapstraction.HYBRID:
				options.mapTypeId = Microsoft.Maps.MapTypeId.birdseye;
				break;
			default:
				options.mapTypeId = Microsoft.Maps.MapTypeId.road;
		}

		map.setView(options);
	},

	getMapType: function() {
		var map = this.maps[this.api];
		var options = map.getOptions();
		switch (options.mapTypeId) {
			case Microsoft.Maps.MapTypeId.road:
				return mxn.Mapstraction.ROAD;
			case Microsoft.Maps.MapTypeId.aerial:
				return mxn.Mapstraction.SATELLITE;
			case Microsoft.Maps.MapTypeId.birdseye:
				return mxn.Mapstraction.HYBRID;
			default:
				return mxn.Mapstraction.ROAD;
		}

	},

	getBounds: function () {
		var map = this.maps[this.api];
		var bounds = map.getBounds();
		var nw = bounds.getNorthwest();
		var se = bounds.getSoutheast();
		return new mxn.BoundingBox(se.latitude, nw.longitude, nw.latitude, se.longitude);
	},

	setBounds: function(bounds){
		var map = this.maps[this.api];
		var nw = bounds.getNorthWest();
		var se = bounds.getSouthEast();
		var viewRect = Microsoft.Maps.LocationRect.fromCorners(new Microsoft.Maps.Location(nw.lat, nw.lon), new Microsoft.Maps.Location(se.lat, se.lon));
		var options = map.getOptions();
		options.bounds = viewRect;
		options.center = null;
		map.setView(options);
	},

	addImageOverlay: function(id, src, opacity, west, south, east, north, oContext) {
		throw new Error('Mapstraction.addImageOverlay is not currently supported by provider ' + this.api);
	},

	setImagePosition: function(id, oContext) {
		throw new Error('Mapstraction.setImagePosition is not currently supported by provider ' + this.api);
	},
	
	addOverlay: function(url, autoCenterAndZoom) {
		throw new Error('Mapstraction.addOverlay is not currently supported by provider ' + this.api);
	},

	addTileMap: function(tileMap) {
		if (tileMap.properties.type === mxn.Mapstraction.TileType.OVERLAY) {
			var map = this.maps[this.api];
			var prop_tilemap = tileMap.toProprietary(this.api);
			map.entities.push(prop_tilemap);
			return prop_tilemap;
		}
		throw new Error('mxn.Mapstraction.TileType.BASE is not supported by provider ' + this.api);
	},

	getPixelRatio: function() {
		throw new Error('Mapstraction.getPixelRatio is not currently supported by provider ' + this.api);
	},
	
	mousePosition: function(element) {
		var map = this.maps[this.api];
		var locDisp = document.getElementById(element);
		if (locDisp !== null) {
			Microsoft.Maps.Events.addHandler(map, 'mousemove', function (e) {
				if (typeof (e.target.tryPixelToLocation) != 'undefined') {
					var point = new Microsoft.Maps.Point(e.getX(), e.getY());
					var coords = e.target.tryPixelToLocation(point);
					var loc = coords.latitude.toFixed(4) + '/' + coords.longitude.toFixed(4);
					locDisp.innerHTML = loc;
				}
			});
			locDisp.innerHTML = '0.0000 / 0.0000';
		}
	},
	
	mouseBearing: function(element, centerPoint) {
		//var map = this.maps[this.api];
		
		// TODO
	}
},

LatLonPoint: {
	
	toProprietary: function() {
		return new Microsoft.Maps.Location(this.lat, this.lon);
	},

	fromProprietary: function(mPoint) {
		this.lat = mPoint.latitude;
		this.lon = mPoint.longitude;
		this.lng = this.lon;
	}
	
},

Marker: {
	
	toProprietary: function() {
		var options = {};
		if (this.draggable)
		{
			options.draggable = true;
		}
		var ax = 0; // anchor x 
		var ay = 0; // anchor y

		if (this.iconAnchor) {
			ax = this.iconAnchor[0];
			ay = this.iconAnchor[1];
		}
		
		var mAnchorPoint = new Microsoft.Maps.Point(ax,ay);
		
		//add spot id
		options.id = this.getAttribute('id');
		options.typeName = 'spotformicrosoft7';
		
		if (this.iconUrl) {
			options.icon = this.iconUrl;
			if (this.iconSize) {
				options.height = this.iconSize[1];
				options.width = this.iconSize[0];
				//generate CSS for pushpin icon size
				var iconStyle = "."+options.typeName+" img { width:100%;height:100%; }";
				jQuery("<style type='text/css'>" +
						iconStyle + 
						"</style>").appendTo("head");
			}
			options.anchor = mAnchorPoint;
			//options.htmlContent = "<img id='" + this.getAttribute('id') + "' style='width:" + this.iconSize[0] + "px;height:" + this.iconSize[1] + "px;opacity:1.0;filter:alpha(opacity=100);' src='" + this.iconUrl + "'/>";
		}

		if (this.zIndex) {
			options.zIndex = this.zIndex;
		}
		
		if (this.labelText) {
			var alignToIconWidth = 0;
			var alignToIconHeight = 0;
			if(options.width){
				alignToIconWidth = parseInt(options.width / 2);
			}
			if(options.height){
				alignToIconHeight = options.height;
			}
			
			this.labelText = this.labelText.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g,' ');
			options.text = this.labelText;
			//options.width = 200;
			options.textOffset = new Microsoft.Maps.Point(-100+alignToIconWidth,alignToIconHeight);//-100+alignToIconWidth,alignToIconHeight);
		
			//generate CSS for label (allow div of pushpin to display overflowing content and add style for the text)
			var labelStyle1 = "."+options.typeName+" { overflow:visible !important; }";
			var labelStyle2 = "."+options.typeName+" div { font-size:11px !important;width:200px !important;white-space:nowrap; color:black !important;text-align:center;pointer-events:none; }";
			jQuery("<style type='text/css'>" +
					labelStyle1 + 
					labelStyle2 + 
					"</style>").appendTo("head");
		}
		/*
		if (this.htmlContent) {
			options.htmlContent = this.htmlContent;
			options.anchor = mAnchorPoint;
		}
		*/
		
		var mmarker = new Microsoft.Maps.Pushpin(this.location.toProprietary(this.api), options);
		//add marker on entites list
		
		if (this.infoBubble){
			var event_action = "click";
			if (this.hover) {
				event_action = "mouseover";
			}
			var that = this;
			Microsoft.Maps.Events.addHandler(mmarker, event_action, function() {
				
				if(that.proprietary_infowindow){
					that.closeBubble();
				}else{
					that.openBubble();
					if (!that.hover) {
						if (!that.infowindow_mouseclick){
							that.infowindow_mouseclick = Microsoft.Maps.Events.addHandler(that.proprietary_infowindow, 'click', function() {
								if (that.infoBubble && that.proprietary_infowindow) {
									that.closeBubble();
								}
							});
						}
					}
				}
				
			});
			
			if (that.hover) {
				Microsoft.Maps.Events.addHandler(mmarker, 'mouseout', function() {
					if (that.infoBubble && that.proprietary_infowindow) {
						that.closeBubble();
					}
				});
			}
		}
		
		if (this.draggable) {
			
			/*
			Microsoft.Maps.Events.addHandler(mmarker, 'dragstart', function(e){
			});
			*/
			
			Microsoft.Maps.Events.addHandler(mmarker, 'drag', function(e){
				var dragLoc = e.entity.getLocation();
				
				//close infoBubble
				mmarker.mapstraction_marker.closeBubble();
				
				//TODO stopAnimation
				
				//get the radar linked to marker
				var currentMarkerId = mmarker.mapstraction_marker.getAttribute('id');
				var markerRadar = null;
				var radarsLength = mmarker.mapstraction_marker.mapstraction.radars.length;
				for(var i = 0; i < radarsLength; i++){
					if(mmarker.mapstraction_marker.mapstraction.radars[i].getAttribute('id') == currentMarkerId){
						markerRadar = mmarker.mapstraction_marker.mapstraction.radars[i];
						break;
					}
				}
				
				if (markerRadar != null) {
					var array = markerRadar.proprietary_radar.getLocations();
					
					var tempPathArray = [];
					
					var lat = dragLoc.latitude;
					var lng = dragLoc.longitude;
					
					var radarPivotPt = array[0];
					var latDiff = radarPivotPt.latitude-lat;
					var lngDiff = radarPivotPt.longitude-lng;
					
					for(i = 0; i < array.length; i++){
						pLat = array[i].latitude;
						pLng = array[i].longitude;
						tempPathArray.push(new Microsoft.Maps.Location(pLat-latDiff,pLng-lngDiff));
					}
					
					//update radar
					markerRadar.proprietary_radar.setLocations(tempPathArray);
					
					//update pivot point
					markerRadar.center = new mxn.LatLonPoint(dragLoc.latitude, dragLoc.longitude);
				}
			});
			
			Microsoft.Maps.Events.addHandler(mmarker, 'dragend', function(e){
				var dragLoc = e.entity.getLocation();
				mmarker.setLocation(dragLoc);
				
				mmarker.mapstraction_marker.update();
				
				var dragEndPos = new mxn.LatLonPoint();
				dragEndPos.fromProprietary(mmarker.mapstraction_marker.api, dragLoc);
				mmarker.mapstraction_marker.dragend.fire({'location': dragEndPos });
			});
		}
		
		//rightclick event
		Microsoft.Maps.Events.addHandler(mmarker, 'rightclick', function(e){
			if(e.targetType === "pushpin" && e.isSecondary === true){
				var rightClickLocProp = e.target.getLocation();
				var rightClickLoc = new mxn.LatLonPoint();
				var rightClickPagePos = {pageX: e.pageX, pageY: e.pageY};
				
				rightClickLoc.fromProprietary(mmarker.mapstraction_marker.api, rightClickLocProp);
				
				mmarker.mapstraction_marker.rightclick.fire({'location': rightClickLoc, 'pageXY': rightClickPagePos });
			}
		});
		
		/**
		 * FIXME : sometimes DOM object are not completly loaded before this script.
		 */
		if(this.tooltipText){
			var dataTooltipText = this.tooltipText.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g,' ');
			Microsoft.Maps.Events.addHandler(mmarker, 'mouseover', function(e) {
				var DataName = e.target.getTypeName();
				jQuery('.MicrosoftMap .'+DataName).children().attr('title', dataTooltipText);
			});
		}
		
		return mmarker;
	},
	
	startMarkerAnimation: function(markerId) {
		if(this.proprietary_marker.getId() == markerId){
			//bounce
			var _bounceEffect = 'bounce 0.35s ease infinite alternate';
			jQuery('.MicrosoftMap a#'+this.proprietary_marker.getId()).css('mozAnimation', _bounceEffect);
			jQuery('.MicrosoftMap a#'+this.proprietary_marker.getId()).css('oAnimation', _bounceEffect);
			jQuery('.MicrosoftMap a#'+this.proprietary_marker.getId()).css('msAnimation', _bounceEffect);
			jQuery('.MicrosoftMap a#'+this.proprietary_marker.getId()).css('webkitAnimation', _bounceEffect);
			jQuery('.MicrosoftMap a#'+this.proprietary_marker.getId()).css('animation', _bounceEffect);
			jQuery('.MicrosoftMap a#'+this.proprietary_marker.getId()).css('animation', _bounceEffect);
		}
	},
	
	stopMarkerAnimation: function(markerId) {
		if(this.proprietary_marker.getId() == markerId){
			//bounce
			jQuery('.MicrosoftMap a#'+this.proprietary_marker.getId()).css('mozAnimation', '');
			jQuery('.MicrosoftMap a#'+this.proprietary_marker.getId()).css('oAnimation', '');
			jQuery('.MicrosoftMap a#'+this.proprietary_marker.getId()).css('msAnimation', '');
			jQuery('.MicrosoftMap a#'+this.proprietary_marker.getId()).css('webkitAnimation', '');
			jQuery('.MicrosoftMap a#'+this.proprietary_marker.getId()).css('animation', '');
		}
	},
	
	openBubble: function() {
		//if (!this.hasOwnProperty('proprietary_infowindow') || this.proprietary_infowindow === null) {
		var infowindow = new Microsoft.Maps.Infobox(this.location.toProprietary(this.api),
			{
				description: this.infoBubble,
				showCloseButton: false
			});
		/*
			this.map.entities.push(infowindow);
		} else {
			infowindow = this.proprietary_infowindow;
			//force position update on existing infoBox
			infowindow.setLocation(this.proprietary_marker.getLocation());
		}
		*/
		this.openInfoBubble.fire({'marker': this});
		/*
		//add anchor value
		if(this.iconAnchor){
			infowindow.setOptions({offset: new Microsoft.Maps.Point(0, (this.iconAnchor[1]+2))});
		}
		*/
		this.map.entities.push(infowindow);
		infowindow.setOptions({visible: true});
		this.proprietary_infowindow = infowindow; // Save so we can close it later
	},
	closeBubble: function() {
		if (!this.map) {
			throw new Error('Marker.closeBubble; marker must be added to map in order to display infobox');
		}
		if (!this.proprietary_infowindow) {
			return;
		}
		if (this.infowindow_mouseclick) {
			Microsoft.Maps.Events.removeHandler(this.infowindow_mouseclick);
			this.infowindow_mouseclick = null;
		}
		this.proprietary_infowindow.setOptions({visible:false});
		this.map.entities.remove(this.proprietary_infowindow);
		this.proprietary_infowindow = null;
		this.closeInfoBubble.fire( { 'marker': this } );
	},
	
	hide: function() {
		this.proprietary_marker.setOptions({visible: false});
	},

	show: function() {
		this.proprietary_marker.setOptions({visible: true});
	},

	update: function() {
		var loc = this.proprietary_marker.getLocation();
		var point = new mxn.LatLonPoint(loc.latitude, loc.longitude);
		this.location = point;
	}
	
},

Polyline: {

	toProprietary: function() {
		var coords = [];
		
		for (var i = 0, length = this.points.length; i < length; i++) {
			coords.push(this.points[i].toProprietary(this.api));
		}
		
		if (this.closed) {
			if (!(this.points[0].equals(this.points[this.points.length - 1]))) {
				coords.push(coords[0]);
			}
		}
		else if (this.points[0].equals(this.points[this.points.length - 1])) {
			this.closed = true;
		}

		var strokeColor = Microsoft.Maps.Color.fromHex(this.color);
		if (this.opacity) {
			strokeColor.a = this.opacity * 255;
		}
		var fillColor = Microsoft.Maps.Color.fromHex(this.fillColor);
		if (this.fillOpacity) {
			fillColor.a = this.fillOpacity * 255;
		}
		
		var polyOptions = {
			strokeColor: strokeColor,
			strokeThickness: this.width || 3
		};

		if (this.closed) {
			polyOptions.fillColor = fillColor;
			this.proprietary_polyline = new Microsoft.Maps.Polygon(coords, polyOptions);
		}
		else {
			this.proprietary_polyline = new Microsoft.Maps.Polyline(coords, polyOptions);
		}
		return this.proprietary_polyline;
	},
	
	show: function() {
		this.proprietary_polyline.setOptions({visible:true});
	},

	hide: function() {
		this.proprietary_polyline.setOptions({visible:false});
	}
},

TileMap: {
	addToMapTypeControl: function() {
		// The Bing v7 API only allows the contents of the Map Type selector control to
		// be set at the time the map is constructed, plus adding base maps to a map
		// isn't supported either, so this function is effectively a no-op.
	},
	
	hide: function() {
		if (this.prop_tilemap === null) {
			throw new Error(this.api + ': A TileMap must be added to the map before calling hide()');
		}

		if (this.properties.type === mxn.Mapstraction.TileType.OVERLAY) {
			var tileCache = this.mxn.overlayMaps;

			if (tileCache[this.index].visible) {
				this.prop_tilemap.setOptions({
					visible: false
				});
				tileCache[this.index].visible = false;
			
				this.tileMapHidden.fire({
					'tileMap': this
				});
			}
		}
	},
	
	removeFromMapTypeControl: function() {
		// See note on TileMap.addToMapTypeControl() above
	},
	
	show: function() {
		if (this.prop_tilemap === null) {
			throw new Error(this.api + ': A TileMap must be added to the map before calling show()');
		}

		if (this.properties.type === mxn.Mapstraction.TileType.OVERLAY) {
			var tileCache = this.mxn.overlayMaps;
			if (!tileCache[this.index].visible) {
				this.prop_tilemap.setOptions({
					visible: true
				});
				tileCache[this.index].visible = true;
			
				this.tileMapShown.fire({
					'tileMap': this
				});
			}
		}
	},
	
	toProprietary: function() {
		var self = this;
		var source_options = {
			getTileUrl: function(tile) {
				var url = mxn.util.sanitizeTileURL(self.properties.url);
				if (typeof self.properties.options.subdomains !== 'undefined') {
					url = mxn.util.getSubdomainTileURL(url, self.properties.options.subdomains);
				}
				url = url.replace(/\{Z\}/gi, tile.levelOfDetail);
				url = url.replace(/\{X\}/gi, tile.x);
				url = url.replace(/\{Y\}/gi, tile.y);
				return url;
			}
		};
		var tileSource = new Microsoft.Maps.TileSource({
			uriConstructor: source_options.getTileUrl
		});
		var layer_options = {
			mercator: tileSource,
			opacity: self.properties.options.opacity,
			visible: false
		};
		
		return new Microsoft.Maps.TileLayer(layer_options);
	}
},

Radar: {
	
	mouseMove: function() {
		
		var map = this.map;
		var centerPoint = this.center;
		var selfRadar = this;
		
		Microsoft.Maps.Events.addHandler(map, 'mousemove', function(event) {
			
			var pt_x = event.getX();
			var pt_y = event.getY();
			var pixel = new Microsoft.Maps.Point(pt_x, pt_y);
			var ll = map.tryPixelToLocation(pixel);
			var mousePoint = new mxn.LatLonPoint(ll.latitude, ll.longitude);
			
			var bearingOrientation = KolorMap.util.bearing(centerPoint, mousePoint);
			
			//add start heading and fov incidence
			bearingOrientation = bearingOrientation + selfRadar.heading - ((90/180) * (180-selfRadar.fov));
			
			//rotate the current radar polygon and update radar object
			selfRadar =	KolorMap.util.rotation(selfRadar, centerPoint, bearingOrientation, selfRadar.mapstraction);
			
		});
		
		this.mouseMoveRadar.fire( { 'radar': this } );
	},
	
	activateClick: function(){
		var selfRadar = this;
		this.clickable = true;
		Microsoft.Maps.Events.addHandler(selfRadar.proprietary_radar, 'click', function() {
			selfRadar.click.fire();
		});
	},
	
	toProprietary: function() {
		
		// toProprietary render only the modified polyline part of the radar (Radar.polyline property)
		var points = [];
		for (var i = 0, length = this.polyline.points.length; i < length; i++) {
			points.push(this.polyline.points[i].toProprietary(this.api));
		}
		
		var strokeColor = Microsoft.Maps.Color.fromHex(this.polyline.color || '#000000');
		strokeColor.a = (this.polyline.opacity || 1.0) * 255;
		var fillColor = Microsoft.Maps.Color.fromHex(this.polyline.fillColor || '#000000');
		fillColor.a = (this.polyline.fillOpacity || 1.0) * 255;
		
		var polyOptions = {
			strokeColor: strokeColor,
			strokeThickness: this.polyline.width || 3
		};

		if (this.polyline.closed) {
			polyOptions.fillColor = fillColor;
			points.push(this.polyline.points[0].toProprietary(this.api));
			return new Microsoft.Maps.Polygon(points, polyOptions);
		}
		else {
			return new Microsoft.Maps.Polyline(points, polyOptions);
		}
	},
	
	show: function() {
		this.proprietary_radar.setOptions({visible:true});
	},

	hide: function() {
		this.proprietary_radar.setOptions({visible:false});
	}
	
}

});