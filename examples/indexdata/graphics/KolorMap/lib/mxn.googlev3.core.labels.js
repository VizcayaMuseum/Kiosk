/**
 * The GoogleLabel can be used on its own or bound to a marker.
 *
 * It supports:
 * set('position', latLng);
 * get('position');
 * set('text', string);
 * get('text);
 * set('visible', boolean);
 * get('visible');
 * set('clickable', boolean); (not supported)
 * get('clickable'); (not supported)
 * set('zIndex', index);
 * get('zIndex');
 * set('offsetY', number);
 * get('offsetY');
 *
 * and provides events:
 * position_changed
 * text_changed (not supported)
 * visible_changed
 * clickable_changed (not supported)
 * zindex_changed (not supported)
 * click (not supported)
 *
 * Many thanks to Marc Ridey (http://blog.mridey.com)
 */
// Define the overlay, derived from google.maps.OverlayView
function GoogleLabel(opt_options) {
	// Initialization
	this.setValues(opt_options);

	// Label specific
	var span = this.span_ = document.createElement('span');
	span.style.cssText = 'position:relative;left:-50%;top:0px;' +
	'white-space:nowrap;padding:2px;' +
	'font-family:Arial,sans-serif;font-size:11px;font-weight:bold;';
	var div = this.div_ = document.createElement('div');
	div.appendChild(span);
	div.style.cssText = 'position:absolute;display:none';
};
GoogleLabel.prototype = new google.maps.OverlayView;

// Implement onAdd
GoogleLabel.prototype.onAdd = function() {
	var pane = this.getPanes().overlayImage;
	pane.appendChild(this.div_);

	// Ensures the label is redrawn if the text or position is changed.
	var me = this;
	this.listeners_ = [
		google.maps.event.addListener(this, 'position_changed', function() { me.draw(); }),
		google.maps.event.addListener(this, 'visible_changed', function() { me.draw(); }),
		/*
		google.maps.event.addListener(this, 'clickable_changed', function() { me.draw(); }),
		google.maps.event.addListener(this, 'text_changed', function() { me.draw(); }),
		google.maps.event.addListener(this, 'zindex_changed', function() { me.draw(); }),
		google.maps.event.addDomListener(this.div_, 'click', function() {
			if (me.get('clickable')) {
				google.maps.event.trigger(me, 'click');
			}
		})
		*/
	];
};

// Implement onRemove
GoogleLabel.prototype.onRemove = function() {
	this.div_.parentNode.removeChild(this.div_);
	// Label is removed from the map, stop updating its position/text.
	for (var i = 0, I = this.listeners_.length; i < I; ++i) {
		google.maps.event.removeListener(this.listeners_[i]);
	}
};

// Implement draw
GoogleLabel.prototype.draw = function() {
	var projection = this.getProjection();
	var position = projection.fromLatLngToDivPixel(this.get('position'));

	var div = this.div_;
	div.style.left = position.x + 'px';
	div.style.top = position.y + this.get('offsetY') + 'px';

	var visible = this.get('visible');
	div.style.display = visible ? 'block' : 'none';

	//var clickable = this.get('clickable');
	//this.span_.style.cursor = clickable ? 'pointer' : '';

	var zIndex = this.get('zIndex');
	div.style.zIndex = zIndex;
	
	this.span_.innerHTML = this.get('text').toString();
};