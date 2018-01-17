mxn.register('openlayersv2', {

	Mapstraction: {

		init: function(element, api, properties){
			
			var me = this;
			
			if (typeof OpenLayers.Map === 'undefined') {
				throw new Error(api + ' map script not imported');
			}
			
			OpenLayers.Util.onImageLoadErrorColor = "transparent"; //Otherwise missing tiles default to pink!	
			
			this.controls = {
				pan: null,
				zoom: null,
				overview: null,
				scale: null,
				map_type: null
			};
			
			/*
			this.layers = {};
			this.overlays = {};
			*/
			this.currentMapType = mxn.Mapstraction.ROAD;
			
			this.defaultBaseMaps = [
                {
                    mxnType: mxn.Mapstraction.ROAD,
                    providerType: mxn.BaseMapProviders.OpenStreetMap,
                    //providerType: 'mxn.BaseMapProviders.MapQuestOpen',
                    nativeType: true
                },
                {
                    mxnType: mxn.Mapstraction.SATELLITE,
                    providerType: mxn.BaseMapProviders.OpenStreetMap,
                    //providerType: 'mxn.BaseMapProviders.Esri.WorldImagery',
                    nativeType: true
                },
                {
                    mxnType: mxn.Mapstraction.HYBRID,
                    providerType: mxn.BaseMapProviders.OpenStreetMap,
                    //providerType: 'mxn.BaseMapProviders.Esri.WorldTopoMap',
                    nativeType: true
                },
                {
                    mxnType: mxn.Mapstraction.PHYSICAL,
                    providerType: mxn.BaseMapProviders.OpenStreetMap,
                    //providerType: 'mxn.BaseMapProviders.Esri.WorldPhysical',
                    nativeType: true
                }
			];

			this.initBaseMaps();
			
			//add class for right-click
			OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
				defaultHandlerOptions: {
					'single': true,
					'double': true,
					'pixelTolerance': null,
					'stopSingle': false,
					'stopDouble': false
				},
				handleRightClicks:true,
				initialize: function(options) {
					this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
					OpenLayers.Control.prototype.initialize.apply(this, arguments);
					this.handler = new OpenLayers.Handler.Click(this, this.eventMethods, this.handlerOptions);
				},
				CLASS_NAME: "OpenLayers.Control.Click"
			});
			
			var map = new OpenLayers.Map(
				element.id,
				{
					autoUpdateSize: true,
					numZoomLevels: 19,
					/*
					 * OLD
					maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
					maxResolution: 156543,
					units: 'm',
					*/
					projection: 'EPSG:900913',
					controls: [
						new OpenLayers.Control.Navigation(),
						new OpenLayers.Control.ArgParser(),
						new OpenLayers.Control.Attribution()
						]
				}
			);
			
			// initialize layers map (this was previously in mxn.core.js)
			this.layers = {};
			
			// create OSM layer using all 3 hostnames
			this.layers.osm = new OpenLayers.Layer.OSM("OpenStreetMap", 
				["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
				"http://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
				"http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"]);
			
			// deal with click
			map.events.register('click', map, function(evt){
				var lonlat = map.getLonLatFromViewPortPx(evt.xy);
				var point = new mxn.LatLonPoint();
				point.fromProprietary(api, lonlat);
				me.click.fire({'location': point });
			});

			// deal with zoom change
			map.events.register('zoomend', map, function(evt){
				me.changeZoom.fire();
			});
			
			// deal with map movement
			map.events.register('moveend', map, function(evt){
				me.moveendHandler(me);
				me.endPan.fire();
			});
			
			// deal with initial tile loading
			var loadfire = function(e) {
				me.load.fire();
				this.events.unregister('loadend', this, loadfire);
			};
			
			for (var layerName in this.layers) {
				if (this.layers.hasOwnProperty(layerName)) {
					if (this.layers[layerName].visibility === true) {
						this.layers[layerName].events.register('loadend', this.layers[layerName], loadfire);
					}
				}
			}
			
			//add svg layer for Openlayers
			if (jQuery) {
				jQuery("<style type='text/css'>#"+element.id+" svg { position: absolute; }</style>").appendTo("head");
			}
			
			map.addLayer(this.layers.osm);
			this.tileLayers.push(["http://a.tile.openstreetmap.org/", this.layers.osm, true]);
			
			//map.addLayer(this.layers.osm);
			//this.tileLayers.push(["http://a.tile.openstreetmap.org/", this.layers.osm, true]);
			this.maps[api] = map;
			this.loaded[api] = true;
		},

		getVersion: function() {
			return OpenLayers.VERSION_NUMBER;
		},

		applyOptions: function(){
			var map = this.maps[this.api],
				navigators = map.getControlsByClass( 'OpenLayers.Control.Navigation' ),
				navigator;

			//note : 'disableDoubleClickZoom' option cannot be set alone.
			
			if ( navigators.length > 0 ) {
				navigator = navigators[0];
				/*
				if ( this.options.enableScrollWheelZoom ) {
					navigator.enableZoomWheel();
				} else {
					navigator.disableZoomWheel();
				}
				*/
				if ( this.options.enableDragging ) {
					navigator.activate();
				} else {
					navigator.deactivate();
				}
			}
		},

		resizeTo: function(width, height){
			this.currentElement.style.width = width;
			this.currentElement.style.height = height;
			this.maps[this.api].updateSize();
		},

		addControls: function( args ) {
			/* args = { 
			 *     pan:      true,
			 *     zoom:     'large' || 'small',
			 *     overview: true,
			 *     scale:    true,
			 *     map_type: true,
			 * }
			 */

			var map = this.maps[this.api];
			
			if ('zoom' in args) {
				if (args.zoom == 'large') {
					this.controls.zoom = this.addLargeControls();
				}
				
				else if (args.zoom == 'small') {
					this.controls.zoom = this.addSmallControls();
				}
			}

			else {
				if (this.controls.zoom !== null) {
					this.controls.zoom.deactivate();
					map.removeControl(this.controls.zoom);
					this.controls.zoom = null;
				}
			}

			// See notes for addSmallControls and addLargeControls for why we suppress
			// the PanPanel if the 'zoom' arg is set ...
			if ('pan' in args && args.pan && ((!'zoom' in args) || ('zoom' in args && args.zoom == 'small'))) {
				if (this.controls.pan === null) {
					this.controls.pan = new OpenLayers.Control.PanPanel();
					map.addControl(this.controls.pan);
				}
			}

			else {
				if (this.controls.pan !== null) {
					this.controls.pan.deactivate();
					map.removeControl(this.controls.pan);
					this.controls.pan = null;
				}
			}
			
			if ('overview' in args && args.overview) {
				if (this.controls.overview === null) {
					if (this.layers.osm) {
						 //overview layer for OSM
						 var layerOverview = this.layers.osm.clone();
						 var mapOptions = {
								maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
								maxResolution: 156543,
								numZoomLevels: 18,
								units: 'm',
								projection: 'EPSG:900913'
						 };
						 var overviewControlOptions = {
								 maximized : true,
								 mapOptions : mapOptions,
								 layers : [layerOverview]
						 };
						 this.controls.overview = new OpenLayers.Control.OverviewMap(overviewControlOptions);
						 map.addControl(this.controls.overview);
					 }
					 else {
						 //no layer available for overview
						 this.controls.overview = new OpenLayers.Control.OverviewMap();
						 map.addControl(this.controls.overview);
					 }
					/*
					this.controls.overview = new OpenLayers.Control.OverviewMap();
					map.addControl(this.controls.overview);
					*/
				}
			}

			else {
				if (this.controls.overview !== null) {
					this.controls.overview.deactivate();
					map.removeControl(this.controls.overview);
					this.controls.overview = null;
				}
			}
			
			/*
			if ('map_type' in args && args.map_type) {
				this.controls.map_type = this.addMapTypeControls();
			}
			
			else {
				if (this.controls.map_type !== null) {
					this.controls.map_type.deactivate();
					map.removeControl(this.controls.map_type);
					this.controls.map_type = null;
				}
			}
			*/

			if ('scale' in args && args.scale) {
				if (this.controls.scale === null) {
					this.controls.scale = new OpenLayers.Control.ScaleLine();
					map.addControl(this.controls.scale);
				}
			}

			else {
				if (this.controls.scale !== null) {
					this.controls.scale.deactivate();
					map.removeControl(this.controls.scale);
					this.controls.scale = null;
				}
			}
		},

		addSmallControls: function() {
			var map = this.maps[this.api];

			if (this.controls.zoom !== null) {
				this.controls.zoom.deactivate();
				map.removeControl(this.controls.zoom);
			}
			// ZoomPanel == ZoomIn + ZoomOut + ZoomToMaxExtent
			this.controls.zoom = new OpenLayers.Control.ZoomPanel();
			map.addControl(this.controls.zoom);
			return this.controls.zoom;
		},

		addLargeControls: function() {
			var map = this.maps[this.api];
			if (this.controls.zoom !== null) {
				this.controls.zoom.deactivate();
				map.removeControl(this.controls.zoom);
			}
			// PanZoomBar == PanPanel + ZoomBar
			this.controls.zoom = new OpenLayers.Control.PanZoomBar();
			map.addControl(this.controls.zoom);
			return this.controls.zoom;
		},

		addMapTypeControls: function() {
			var map = this.maps[this.api];
			var control = null;
			
			if (this.controls.map_type === null) {
				control = new OpenLayers.Control.LayerSwitcher({ 'ascending':false });
				map.addControl(control);
			}
			
			else {
				control = this.controls.map_type;
			}
			
			return control;
		},

		setCenterAndZoom: function(point, zoom) {
			var map = this.maps[this.api];
			var pt = point.toProprietary(this.api);
			map.setCenter(pt, zoom);
		},

		addMarker: function(marker, old) {
			
			var map = this.maps[this.api];
			var apiId = this.api;
			var pin = marker.toProprietary(this.api);
			var selfMarker = marker;
			
			if (!this.layers.markers) {
				var default_style = new OpenLayers.Style({
					'cursor' : 'pointer',
					'graphicZIndex': 2
				});
				var select_style = default_style;
				var style_map = new OpenLayers.StyleMap({
					'default': default_style,
					'select' : select_style
				});
				this.layers.markers = new OpenLayers.Layer.Vector('markers', {
					// events            : null,
					// isBaseLayer       : false,
					// isFixed           : false,
					// features          : [],
					// filter            : null,
					// selectedFeatures  : [],
					// unrenderedFeatures: {},
					// style             : {},
					// strategies        : [],
					// protocol          : null,
					// renderers         : [],
					// renderer          : null,
					// rendererOptions   : {},
					// geometryType      : 'OpenLayers.Geometry.Point',
					// drawn             : false,
					// ratio             : 1.0,
					reportError          : false,
					styleMap             : style_map,
					rendererOptions : {
						yOrdering: true,
						zIndexing: true
					}
				});
				map.addLayer(this.layers.markers);
				
				/**
				 * Due to marker.hover property applied to 'hover' SelectFeature only support one type of feature.
				 * It means only click or only hover for all markers.
				 */
				select = new OpenLayers.Control.SelectFeature(this.layers.markers, {
					// events        : null,
					// multipleKey   : 'altKey',
					// toggleKey     : 'ctrlKey',
					//highlightOnly    : true,
					// box           : true,
					// onBeforeSelect: null,
					// onUnselect    : null,
					// scope         : {},
					// geometryTypes : ['OpenLayers.Geometry.Point'],
					// layer         : null,
					// layers        : [],
					// callbacks     : {},
					// selectStyle   : {},
					// renderIntent  : '',
					// handlers      : {},
					multiple         : false,
					clickout         : true,
					toggle           : true,
					hover            : false,
					autoActivate     : true,
					onSelect : function(feature) {
						var markerSelect = feature.mapstraction_marker;
						markerSelect.click.fire();
						
						//TODO : verify if unselect is necessary
						//this.onUnselect();
						//this.unselect(feature);
						
						//popup open action on 'click'
						if(!markerSelect.hover && !!markerSelect.popup){
							markerSelect.map.addPopup(markerSelect.popup, true);
							markerSelect.popup.show();
						}
						
					}
					/*,
					onUnselect : function(feature) {
						this.unselect(feature);
					}
					*/
				});
				this.controls.select = select;
				
				rightclick = new OpenLayers.Control.Click({eventMethods:{
					'rightclick': function(e) {
						for (var i=0; i<map.layers.length; i++){
							var curLayer = map.layers[i];
							if(curLayer['name'] == "markers"){
								//get the feature layer under the click event
								var rightClickFeature = curLayer.getFeatureFromEvent(e);
								if(rightClickFeature){
									var rightClickPagePos = {pageX: e.xy.x, pageY: e.xy.y};
									var rightClickLoc = rightClickFeature.mapstraction_marker.location;
									rightClickFeature.mapstraction_marker.rightclick.fire({'location': rightClickLoc, 'pageXY': rightClickPagePos });
								}
								break;
							}
						}
						
						
					}
				}});
				this.controls.rightclick = rightclick;
				
				if (marker.hover) {
					var highlight = new OpenLayers.Control.SelectFeature(this.layers.markers, {
						// events        : null,
						// multipleKey   : 'altKey',
						// toggleKey     : 'ctrlKey',
						//highlightOnly    : true,//true
						// box           : true,
						// onBeforeSelect: null,
						multiple : false,
						toggle : false,
						clickout : true,
						hover : true,
						highlightOnly : true,
						autoActivate : true,
						overFeature      : function(feature) {
							if (selfMarker.hover) {
								var marker = feature.mapstraction_marker;
								if (!!marker.hoverIconUrl) {
									marker.setUrl(marker.hoverIconUrl);
								}
								if (marker.hover && !!marker.popup) {
									marker.map.addPopup(marker.popup, true);
									marker.popup.show();
								}
							}
						},
						outFeature       : function(feature) {
							if (selfMarker.hover) {
								var marker = feature.mapstraction_marker;
								if (!!marker.hoverIconUrl) {
									var iconUrl = marker.iconUrl || 'http://openlayers.org/dev/img/marker-gold.png';
									marker.setUrl(iconUrl);
								}
								if (marker.hover && !!marker.popup) {
									marker.popup.hide();
									marker.map.removePopup(marker.popup);
								}
							}
						}
					});
					this.controls.highlight = highlight;
				}
				
				if(marker.draggable) {
					/**
					* activated for all markers
					*/
					drag = new OpenLayers.Control.DragFeature(this.layers.markers, {
						// geometryTypes: ['OpenLayers.Geometry.Point'],//WAS ACTIVE
						// onStart         : null,
						// onDrag          : null,
						// onComplete      : null,
						// onEnter         : null,
						// onLeave         : null,
						// layer           : null,
						// feature         : null,
						// dragCallbacks   : {},
						// featureCallbacks: {},
						// lastPixel       : null,
						documentDrag    : true,
						autoActivate    : true,
						onComplete : function(draggedMarkerFeature, draggedPositionPixel) {
							//change marker position
							draggedMarkerFeature.move(draggedPositionPixel);
							
							draggedMarkerFeature.lonlat = map.getLonLatFromViewPortPx(draggedPositionPixel);
							
							var markerDrag = draggedMarkerFeature.mapstraction_marker;
							//update proprietary popup position
							if(!!markerDrag.popup){
								markerDrag.popup.lonlat = draggedMarkerFeature.lonlat;
							}
							
							//update mapstraction marker location
							markerDrag.update();
							
							var dragEndPos = new mxn.LatLonPoint();
							dragEndPos.fromProprietary(apiId, draggedMarkerFeature.lonlat);
							
							markerDrag.dragend.fire({'location': dragEndPos });
						},
						//onStart : function(draggedMarkerFeature, draggedPositionPixel) {
							//DO NOTHING
						//},
						onDrag : function(draggedMarkerFeature, draggedPositionPixel) {
							var marker = draggedMarkerFeature.mapstraction_marker;
							var dragLonLat = map.getLonLatFromViewPortPx(draggedPositionPixel);
							
							//close infoBubble if opened
							if(!!marker.popup) {
								marker.closeBubble();
							}
							
							//TODO stopAnimation
							
							//get the radar linked to marker
							var markerRadar = null;
							var currentMarkerId = marker.getAttribute('id');
							var radarsLength = marker.mapstraction.radars.length;
							for(var i = 0; i < radarsLength; i++){
								if(marker.mapstraction.radars[i].getAttribute('id') == currentMarkerId){
									markerRadar = marker.mapstraction.radars[i];
									break;
								}
							}
							
							if(markerRadar != null) {
								//move radar
								markerRadar.proprietary_radar.move(draggedPositionPixel);
								
								//change center
								markerRadar.center = new mxn.LatLonPoint();
								markerRadar.center.fromProprietary(apiId, dragLonLat);
								
								//redraw
								//markerRadar.proprietary_radar.layer.redraw();
							}
						}
					});
					
					//avoid propagation
					//HACK to avoid OpenLayers.Control.SelectFeature actions to be lost after map pan
					drag.handlers.drag.stopDown     = false;
					drag.handlers.drag.stopUp       = false;
					drag.handlers.drag.stopClick    = false;
					drag.handlers.feature.stopDown  = false;
					drag.handlers.feature.stopUp    = false;
					drag.handlers.feature.stopClick = false;
					drag.onStart = function(feature,pixel) {
						if (feature.mapstraction_marker.draggable !== true) {
							drag.handlers.drag.deactivate();
						}
					};
					this.controls.drag = drag;
				}
				
				//add features controls
				if(marker.draggable) {
					if (marker.hover) {
						map.addControls([this.controls.highlight, this.controls.select, this.controls.drag, this.controls.rightclick]);
					}else{
						map.addControls([this.controls.select, this.controls.drag, this.controls.rightclick]);
					}
				}else{
					if (marker.hover) {
						map.addControls([this.controls.highlight, this.controls.select, this.controls.rightclick]);
					}else{
						map.addControls([this.controls.select, this.controls.rightclick]);
					}
				}
				//activate right-click
				rightclick.activate();
			}
			this.layers.markers.addFeatures([pin]);
			return pin;
		},

		removeMarker: function(marker) {
			var pin = marker.proprietary_marker;
			if (this.layers.markers) {
				this.layers.markers.removeFeatures([pin]);
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
			if (!this.layers.polylines) {
				this.layers.polylines = new OpenLayers.Layer.Vector('polylines');
				map.addLayer(this.layers.polylines);
			}
			this.layers.polylines.addFeatures([pl]);
			return pl;
		},

		removePolyline: function(polyline) {
			var pl = polyline.proprietary_polyline;
			this.layers.polylines.removeFeatures([pl]);
		},
		
		removeAllPolylines: function() {
			var olpolylines = [];
			for (var i = 0, length = this.polylines.length; i < length; i++) {
				olpolylines.push(this.polylines[i].proprietary_polyline);
			}
			if (this.layers.polylines) {
				this.layers.polylines.removeFeatures(olpolylines);
			}
		},
		
		addRadar: function(radar, old) {
			var map = this.maps[this.api];
			var propRadar = radar.toProprietary(this.api);
			if (!this.layers.radars) {
				this.layers.radars = new OpenLayers.Layer.Vector('radars');
				map.addLayer(this.layers.radars);
			}
			this.layers.radars.addFeatures([propRadar]);
			return propRadar;
		},
		
		removeRadar: function(radar) {
			this.layers.radars.removeFeatures([radar.proprietary_radar]);
		},
		
		getCenter: function() {
			var map = this.maps[this.api];
			var pt = map.getCenter();
			var mxnPt = new mxn.LatLonPoint();
			mxnPt.fromProprietary(this.api, pt);
			return mxnPt;
		},

		setCenter: function(point, options) {
			var map = this.maps[this.api];
			var pt = point.toProprietary(this.api);
			map.setCenter(pt);
		},

		setZoom: function(zoom) {
			var map = this.maps[this.api];
			//verify if zoom is valid
			if(map.isValidZoomLevel(zoom)){
				map.zoomTo(zoom);
			} else if (zoom > 0) {
				// loop on previous zoom
				this.setZoom(zoom - 1);
			} else {
				map.zoomTo(zoom);
			}
		},

		getZoom: function() {
			var map = this.maps[this.api];
			return map.zoom;
		},

		getZoomLevelForBoundingBox: function( bbox ) {
			var map = this.maps[this.api];
			var sw = bbox.getSouthWest();
			var ne = bbox.getNorthEast();
			if(sw.lon > ne.lon) {
				sw.lon -= 360;
			}

			var obounds = new OpenLayers.Bounds();
			obounds.extend(new mxn.LatLonPoint(sw.lat,sw.lon).toProprietary(this.api));
			obounds.extend(new mxn.LatLonPoint(ne.lat,ne.lon).toProprietary(this.api));
			
			var zoom = map.getZoomForExtent(obounds);
			return zoom;
		},

		setMapType: function (mapType) {
			var i;
			var name = null;

			for (i = 0; i < this.defaultBaseMaps.length; i++) {
				if (this.defaultBaseMaps[i].mxnType === mapType) {
					if (this.currentMapType === this.defaultBaseMaps[i].mxnType) {
						return;
					}
					name = this.defaultBaseMaps[i].providerType;
					break;
				}
			}

			if (name === null) {
				name = mapType;
			}

			var layers = [];
			var map = this.maps[this.api];
			var fn = function (elem, index, array) {
				if (elem === this.customBaseMaps[i].tileMap.prop_tilemap) {
					layers.push(elem);
				}
			};

			for (i = 0; i < this.customBaseMaps.length; i++) {
				if (this.customBaseMaps[i].name === name) {
					map.addLayer(this.customBaseMaps[i].tileMap.prop_tilemap, true);
				}
				else {
					map.layers.forEach(fn, this);
				}
			}

			for (i = 0; i < layers.length; i++) {
				map.removeLayer(layers[i]);
			}
		},

		getMapType: function () {
			// Only Open Street Map road map is implemented, so you can't change the Map Type
			//return mxn.Mapstraction.ROAD;
			return this.currentMapType;
		},

		getBounds: function () {
			var map = this.maps[this.api];
			var olbox = map.calculateBounds();
			var ol_sw = new OpenLayers.LonLat( olbox.left, olbox.bottom );
			var mxn_sw = new mxn.LatLonPoint(0,0);
			mxn_sw.fromProprietary( this.api, ol_sw );
			var ol_ne = new OpenLayers.LonLat( olbox.right, olbox.top );
			var mxn_ne = new mxn.LatLonPoint(0,0);
			mxn_ne.fromProprietary( this.api, ol_ne );
			return new mxn.BoundingBox(mxn_sw.lat, mxn_sw.lon, mxn_ne.lat, mxn_ne.lon);
		},

		setBounds: function(bounds) {
			var map = this.maps[this.api];
			var sw = bounds.getSouthWest();
			var ne = bounds.getNorthEast();

			if(sw.lon > ne.lon) {
				sw.lon -= 360;
			}

			var obounds = new OpenLayers.Bounds();
			obounds.extend(new mxn.LatLonPoint(sw.lat,sw.lon).toProprietary(this.api));
			obounds.extend(new mxn.LatLonPoint(ne.lat,ne.lon).toProprietary(this.api));
			map.zoomToExtent(obounds);
		},

		addImageOverlay: function(id, src, opacity, west, south, east, north, oContext) {
			var map = this.maps[this.api];
			var bounds = new OpenLayers.Bounds();
			bounds.extend(new mxn.LatLonPoint(south,west).toProprietary(this.api));
			bounds.extend(new mxn.LatLonPoint(north,east).toProprietary(this.api));
			var overlay = new OpenLayers.Layer.Image(
				id, 
				src,
				bounds,
				new OpenLayers.Size(oContext.imgElm.width, oContext.imgElm.height),
				{'isBaseLayer': false, 'alwaysInRange': true}
			);
			map.addLayer(overlay);
			this.setImageOpacity(overlay.div.id, opacity);
		},

		setImagePosition: function(id, oContext) {
			throw new Error('Mapstraction.setImagePosition is not currently supported by provider ' + this.api);
		},

		addOverlay: function(url, autoCenterAndZoom) {
			var map = this.maps[this.api];
			var kml = new OpenLayers.Layer.GML("kml", url,{
				'format'       : OpenLayers.Format.KML,
				'formatOptions': new OpenLayers.Format.KML({
					'extractStyles'    : true,
					'extractAttributes': true
				}),
				'projection'   : new OpenLayers.Projection('EPSG:4326')
			});
			if (autoCenterAndZoom) {
				var setExtent = function() {
					dataExtent = this.getDataExtent();
					map.zoomToExtent(dataExtent);
				};
				kml.events.register('loadend', kml, setExtent); 
			}
			map.addLayer(kml);
		},

		addTileMap: function (tileMap) {
			return tileMap.toProprietary(this.api);
		},

		toggleTileLayer: function(tile_url) {
			var map = this.maps[this.api];
			for (var f=this.tileLayers.length-1; f>=0; f--) {
				if(this.tileLayers[f][0] == tile_url) {
					this.tileLayers[f][2] = !this.tileLayers[f][2];
					this.tileLayers[f][1].setVisibility(this.tileLayers[f][2]);
				}
			}	   
		},

		getPixelRatio: function() {
			throw new Error('Mapstraction.getPixelRatio is not currently supported by provider ' + this.api);
		},

		mousePosition: function(element) {
			var map = this.maps[this.api];
			var locDisp = document.getElementById(element);
			if (locDisp !== null) {
				map.events.register('mousemove', map, function (evt) {
					var lonlat = map.getLonLatFromViewPortPx(evt.xy);
					var point = new mxn.LatLonPoint();
					point.fromProprietary(this.api, lonlat);
					var loc = point.lat.toFixed(4) + ' / ' + point.lon.toFixed(4);
					locDisp.innerHTML = loc;
				});
			}
			locDisp.innerHTML = '0.0000 / 0.0000';
		},
		
		mouseBearing: function(element, centerPoint) {
			var map = this.maps[this.api];
			var locDisp = document.getElementById(element);
			if (locDisp !== null) {
				map.events.register('mousemove', map, function (evt) {
					var lonlat = map.getLonLatFromViewPortPx(evt.xy);
					var mousePoint = new mxn.LatLonPoint();
					mousePoint.fromProprietary(this.api, lonlat);
					var bearingOrientation = KolorMap.util.bearing(centerPoint, mousePoint).toFixed(4);
					locDisp.innerHTML = bearingOrientation;
				});
				locDisp.innerHTML = '0.0000';
			}
		}
	},

	LatLonPoint: {

		toProprietary: function() {
			var ollon = this.lon * 20037508.34 / 180;
			var ollat = Math.log(Math.tan((90 + this.lat) * Math.PI / 360)) / (Math.PI / 180);
			ollat = ollat * 20037508.34 / 180;
			return new OpenLayers.LonLat(ollon, ollat);
		},

		fromProprietary: function(olPoint) {
			var lon = (olPoint.lon / 20037508.34) * 180;
			var lat = (olPoint.lat / 20037508.34) * 180;
			lat = 180/Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
			this.lon = lon;
			this.lng = this.lon;
			this.lat = lat;
		}

	},

	Marker: {

		toProprietary: function() {
			var size, anchor, style, marker, position;
			if (!!this.iconSize) {
				size = new OpenLayers.Size(this.iconSize[0], this.iconSize[1]);
			}
			else {
				size = new OpenLayers.Size(21, 25);
			}
			
			if (!!this.iconAnchor) {
				anchor = new OpenLayers.Pixel(-this.iconAnchor[0], -this.iconAnchor[1]);
			}
			else {
				anchor = new OpenLayers.Pixel(-(size.w / 2), -size.h);
			}
			
			if (!!this.iconUrl) {
				markerIcon = this.iconUrl;
				this.icon = new OpenLayers.Icon(markerIcon, size, anchor);
			}
			else {
				markerIcon = 'http://openlayers.org/dev/img/marker-gold.png';
				this.icon = new OpenLayers.Icon(markerIcon, size, anchor);
			}
			
			if(this.zIndex){
				this.attributes.zIndex = this.zIndex;
			}
			
			//markerStyle = {
			style = {
				cursor         : 'pointer',
				externalGraphic: markerIcon,
				//graphicTitle   : ((!!this.labelText) ? this.labelText : ''),//TODO
				graphicHeight  : size.h,
				graphicWidth   : size.w,
				graphicOpacity : 1.0,
				graphicXOffset : anchor.x,
				graphicYOffset : anchor.y,
				graphicZIndex  : (!!this.attributes.zIndex ? this.attributes.zIndex : 2)//,
				// title       : this.labelText
			};
			
			//tooltips
			if(this.tooltipText){
				//style.graphicTitle = this.tooltipText;
				this.tooltipText = this.tooltipText.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g,' ');
				style.graphicTitle = this.tooltipText;
			}
			else if (this.labelText) {
				//labels
				this.labelText = this.labelText.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g,' ');
				style.label = this.labelText;
				style.labelAlign = "cb";
				style.labelYOffset = -(size.h);
				style.fontFamily = "Arial";
				style.fontSize = "11";
				style.fontWeight = "bold";
			}
			
			position = this.location.toProprietary(this.api);
			
			
			var markerType = null;
			if(this.draggable){
				markerType = new OpenLayers.Geometry.Point(
					position.lon,
					position.lat);
			}else{
				//forced to OpenLayers.Geometry.MultiPoint to remove marker from draggable geometryTypes property (based on Geometry.Point)
				markerType = new OpenLayers.Geometry.MultiPoint(
					[new OpenLayers.Geometry.Point(
						position.lon,
						position.lat)
					]);
			}
			
			//generate vector with spot id
			marker = new OpenLayers.Feature.Vector(markerType, //new OpenLayers.Geometry.Point(position.lon, position.lat),
			 {id: this.getAttribute('id')},
				style);

			if (!!this.infoBubble) {
				
				var that = this;
				var closeCallback = function(e) {
					that.closeBubble();
					//OpenLayers.Event.stop(e);
				};
				
				var closeBox = (this.hover)?false:true;
				this.popup = new OpenLayers.Popup.FramedCloud(
					null,
					position,
					new OpenLayers.Size(100, 100),
					this.infoBubble,
					this.icon,
					closeBox,
					closeCallback);
				this.popup.autoSize = true;
				this.popup.panMapIfOutOfView = true;
				this.popup.fixedRelativePosition = false;
				this.popup.feature = marker;
			}
			else {
				this.popup = null;
			}
			
			return marker;
		},
		
		startMarkerAnimation: function(markerId) {
			if(this.proprietary_marker.attributes.id == markerId){
				//bounce
				var mmarker = this;
				//add timer attribute
				this.proprietary_marker.attributes.savedOffset = this.proprietary_marker.style.graphicYOffset;
				this.proprietary_marker.attributes.addOffset = true;
				this.proprietary_marker.attributes.timer = setInterval(function(){
					if(mmarker.proprietary_marker.attributes.addOffset){
						if(mmarker.proprietary_marker.style.graphicYOffset <= (mmarker.proprietary_marker.attributes.savedOffset - 9)){
							mmarker.proprietary_marker.attributes.addOffset = false;
						}
						mmarker.proprietary_marker.style.graphicYOffset -= 1;
					}else{
						if(mmarker.proprietary_marker.style.graphicYOffset >= (mmarker.proprietary_marker.attributes.savedOffset - 1)){
							mmarker.proprietary_marker.attributes.addOffset = true;
						}
						mmarker.proprietary_marker.style.graphicYOffset += 1;
					}
					
					//redraw
					mmarker.mapstraction.layers.markers.redraw();
				}, 50);
			}
		},
		
		stopMarkerAnimation: function(markerId) {
			if(this.proprietary_marker.attributes.id == markerId){
				//bounce
				clearInterval( this.proprietary_marker.attributes.timer );
				this.proprietary_marker.attributes.timer = null;
				this.proprietary_marker.style.graphicYOffset = this.proprietary_marker.attributes.savedOffset;
				this.proprietary_marker.attributes.addOffset = true;
				this.proprietary_marker.attributes.savedOffset = null;
			}
		},
		
		openBubble: function() {
			if (!!this.infoBubble) {
				var that = this;
				var closeCallback = function(e) {
					that.closeBubble();
					//OpenLayers.Event.stop(e);
				};
				
				// Need to create a new popup in case setInfoBubble has been called
				this.popup = new OpenLayers.Popup.FramedCloud(
					null,
					this.location.toProprietary(this.api),
					new OpenLayers.Size(100, 100),
					this.infoBubble,
					this.icon,
					true,
					closeCallback);
				this.popup.autoSize = true;
				this.popup.panMapIfOutOfView = true;
				this.popup.fixedRelativePosition = false;
				this.popup.feature = this.proprietary_marker;
			}
			
			if (!!this.popup) {
				this.map.addPopup(this.popup, true);
				this.popup.show();
			}
			this.openInfoBubble.fire( { 'marker': this } );
		},
		
		closeBubble: function() {
			if (!!this.popup) {
				this.popup.hide();
				this.map.removePopup(this.popup);
				//this.popup.destroy();
				//this.popup = null;
				/*
				TODO NEW for fire unselect event if possible ?
				//console.log('marker id is : '+this.attributes.id);
				for (var i = 0; i < this.mapstraction.layers.markers.features.length; ++i) {
					if (this.mapstraction.layers.markers.features[i].mapstraction_marker.attributes.id == this.attributes.id) {
						//console.log('marker id selected is : '+this.mapstraction.layers.markers.features[i].mapstraction_marker.attributes.id);
						//this.map.controls.select(this.mapstraction.layers.markers.features[i]);
						//selectControl.select(visibleLayer.features[i]);
					}
				}
				*/
			}
			this.closeInfoBubble.fire( { 'marker': this } );
		},
		
		hide: function() {
			delete this.proprietary_marker.style.display;
			this.proprietary_marker.layer.redraw();
		},
		
		show: function() {
			this.proprietary_marker.style.display = 'true';
			this.proprietary_marker.layer.redraw();
		},
		
		update: function() {
			var locPoint = this.proprietary_marker.geometry; // get the OpenLayers.Geometry.Point
			var locLatLon = new OpenLayers.LonLat(locPoint.x, locPoint.y); // convert to LonLat
			var point = new mxn.LatLonPoint();
			point.fromProprietary(this.api, locLatLon); // convert to LatLonPoint
			
			this.location = point;
		}
	},

	Polyline: {

		toProprietary: function() {
			var coords = [];
			var ring;
			var style = {
				strokeColor  : this.color,
				strokeOpacity: this.opacity,
				strokeWidth  : this.width,
				fillColor    : this.fillColor,
				fillOpacity  : this.fillOpacity
			};
			
			for (var i = 0, length = this.points.length ; i< length; i++){
				var point = this.points[i].toProprietary(this.api);
				coords.push(new OpenLayers.Geometry.Point(point.lon, point.lat));
			}
			
			if (this.closed) {
				if (!(this.points[0].equals(this.points[this.points.length - 1]))) {
					coords.push(coords[0]);
				}
			}
			
			else if (this.points[0].equals(this.points[this.points.length - 1])) {
				this.closed = true;
			}
			
			if (this.closed) {
				// a closed polygon
				ring = new OpenLayers.Geometry.LinearRing(coords);
			} else {
				// a line
				ring = new OpenLayers.Geometry.LineString(coords);
			}

			this.proprietary_polyline = new OpenLayers.Feature.Vector(ring, null, style);
			return this.proprietary_polyline;
		},

		show: function() {
			delete this.proprietary_polyline.style.display;
			this.proprietary_polyline.layer.redraw();
		},

		hide: function() {
			this.proprietary_polyline.style.display = 'none';
			this.proprietary_polyline.layer.redraw();
		}
	},
	
	TileMap: {
	    addToMapTypeControl: function () {
	        if (this.proprietary_tilemap === null) {
	            throw new Error(this.api + ': A TileMap must be added to the map before calling addControl()');
	        }

	        if (!this.mxn.customBaseMaps[this.index].inControl) {
	            this.mxn.customBaseMaps[this.index].inControl = true;
	            this.mxn.layers[this.properties.options.label] = this.proprietary_tilemap;
	            if (this.mxn.controls.map_type !== null && typeof (this.mxn.controls.map_type) !== "undefined") {
	                this.mxn.controls.map_type.addBaseLayer(this.proprietary_tilemap, this.properties.options.label);
	                /*
					this.mxn.maps[this.mxn.api].setBaseLayer(this.toProprietary());//this.proprietary_tilemap) ; //, this.properties.options.label);
	            	if (this.mxn.controls.overview !== null && typeof (this.mxn.controls.overview) !== "undefined") {
	            		var zoomOffset = //TODO: Unused at present: -this.mxn.controls.overview.options.zoomLevelOffset;
	            		this.mxn.removeOverviewControls();
	            		var that = this;
	            		setTimeout(function () { //Needs time for the basemap layer to be loaded, as the overview map deaults to use it.
	            			that.mxn.addOverviewControls(zoomOffset);
	            		}, 50);
	            	}
					*/
	            }
	        }
	    },

	    removeFromMapTypeControl: function () {
	        if (this.proprietary_tilemap === null) {
	            throw new Error(this.api + ': A TileMap must be added to the map before calling removeControl()');
	        }

	        if (this.mxn.customBaseMaps[this.index].inControl) {
	            this.mxn.customBaseMaps[this.index].inControl = false;
	            delete this.mxn.layers[this.properties.options.label];
	            if (typeof (this.mxn.controls.map_type) !== "undefined") {
	                this.mxn.controls.map_type.removeLayer(this.proprietary_tilemap);
	            }
	        }
	    },

	    hide: function () {
	        if (this.proprietary_tilemap === null) {
	            throw new Error(this.api + ': A TileMap must be added to the map before calling hide()');
	        }

	        if (this.properties.type === mxn.Mapstraction.TileType.OVERLAY) {
	            if (this.mxn.overlayMaps[this.index].visible) {
	                this.mxn.overlayMaps[this.index].visible = false;
	                this.map.removeLayer(this.proprietary_tilemap);
	            }
	        }
	    },

	    show: function () {
	        if (this.proprietary_tilemap === null) {
	            throw new Error(this.api + ': A TileMap must be added to the map before calling show()');
	        }

	        if (this.properties.type === mxn.Mapstraction.TileType.OVERLAY) {
	            if (!this.mxn.overlayMaps[this.index].visible) {
	                this.mxn.overlayMaps[this.index].visible = true;
	                this.map.addLayer(this.proprietary_tilemap, false);
	            }
	        }
	    },

	    toProprietary: function () {
	        var urls = null;
	        var url = mxn.util.sanitizeTileURL(this.properties.url);
	        url = url.replace(/\{/g, '\/${'); //ol2 seems to need this format to do substitutions: '/mqopen/${Z}/${X}/${Y}.jpeg'
	        var subdomains = this.properties.options.subdomains;

	        //TODO: This is duplicated in Leaflet, ol2, ol3 move it to utils.
            //TODO: Actually ol probably copes with the domain parameter
	        if (this.properties.options.subdomains !== null) {
	            var pos = url.search('{s}');
	            if (pos !== -1) {
	                var i = 0;
	                var domain;
	                urls = [];

	                for (i = 0; i < subdomains.length; i++) {
	                    if (typeof subdomains === 'string') {
	                        domain = subdomains.substring(i, i + 1);
	                    }

	                    else {
	                        domain = subdomains[i];
	                    }

	                    if (typeof domain !== 'undefined') {
	                        urls.push(url.replace(/\{s\}/g, domain));
	                    }
	                }
	            }
	        }

            //OSM Layer works better than XYZ Layer for what we are doing here.
	        var overlay = new OpenLayers.Layer.OSM(this.properties.options.label, urls || url);

	        if(!this.properties.opacity) {
	            overlay.addOptions({opacity: this.properties.opacity});
	        }

	        if(!this.properties.options.attribution) {
	            overlay.addOptions({ attribution: this.properties.attribution });
	        }
			
	        /* if(!map_type) {
	            overlay.addOptions({displayInLayerSwitcher: false, isBaseLayer: false});
	        } */
	        //map.addLayer(overlay);		
	        //this.tileLayers.push( [tile_url, overlay, true] );		

	        return overlay;
	    }
	},
	
	Radar: {
		
		mouseMove: function() {
			
			var map = this.map;
			var centerPoint = this.center;
			var selfRadar = this;
			
			map.events.register('mousemove', map, function (evt) {
				
				var lonlat = map.getLonLatFromViewPortPx(evt.xy);
				var mousePoint = new mxn.LatLonPoint();
				mousePoint.fromProprietary(this.api, lonlat);
				
				var bearingOrientation = KolorMap.util.bearing(centerPoint, mousePoint);
				
				//add start heading and fov incidence
				bearingOrientation = bearingOrientation + selfRadar.heading - ((90/180) * (180-selfRadar.fov));
				
				//rotate the current radar polygon and update radar object
				selfRadar =	KolorMap.util.rotation(selfRadar, centerPoint, bearingOrientation, selfRadar.mapstraction);
			});
				
			this.mouseMoveRadar.fire( { 'radar': this } );
		},
		
		activateClick: function(){
			//var selfRadar = this;
			//this.clickable = true;
			throw new Error('Radar.activateClick is not currently supported by provider ' + this.api);
			/*
			//fire click event for marker
			var vector = selfRadar.proprietary_radar;
			vector.events.on({
				'featureselected': function(feature) {
					//document.getElementById('counter').innerHTML = this.selectedFeatures.length;
				},
			});
			
			var selectControl =  new OpenLayers.Control.SelectFeature(
					vectors,
					{
					clickout: false, toggle: false,
					multiple: false, hover: false,
					toggleKey: "ctrlKey", // ctrl key removes from selection
					multipleKey: "shiftKey", // shift key adds to selection
					box: true
					}
					);
			selfRadar.mapstraction.addControl(selectControl);
			
			//OLD
			//selfRadar.proprietary_radar.layer.events.register('click',selfRadar.proprietary_radar,function(event) {
				//selfRadar.click.fire();
			//});
			*/
		},
		
		toProprietary: function() {
			
			//toProprietary render only the modified polyline part of the radar (Radar.polyline property)
			var coords = [];
			var ring;
			var style = {
				strokeColor: this.polyline.color,
				strokeOpacity: this.polyline.opacity,
				strokeWidth: this.polyline.width,
				fillColor: this.polyline.fillColor,
				fillOpacity: this.polyline.fillOpacity
			};
			
			for (var i = 0, length = this.polyline.points.length ; i< length; i++){
				var point = this.polyline.points[i].toProprietary(this.api);
				coords.push(new OpenLayers.Geometry.Point(point.lon, point.lat));
			}
			
			if (this.polyline.closed) {
				if (!(this.polyline.points[0].equals(this.polyline.points[this.polyline.points.length - 1]))) {
					coords.push(coords[0]);
				}
			}
			else if (this.polyline.points[0].equals(this.polyline.points[this.polyline.points.length - 1])) {
				this.polyline.closed = true;
			}
			
			if (this.polyline.closed) {
				// a closed polygon
				ring = new OpenLayers.Geometry.LinearRing(coords);
			} else {
				// a line
				ring = new OpenLayers.Geometry.LineString(coords);
			}
			this.proprietary_radar = new OpenLayers.Feature.Vector(ring, null, style);
			return this.proprietary_radar;
		},
		
		show: function() {
			delete this.proprietary_radar.style.display;// = "block";
			this.proprietary_radar.layer.redraw();
			//this.proprietary_radar.layer.setVisibility(true);
		},

		hide: function() {
			this.proprietary_radar.style.display = "none";
			this.proprietary_radar.layer.redraw();
			//this.proprietary_radar.layer.setVisibility(false);
		}
		
	}
});