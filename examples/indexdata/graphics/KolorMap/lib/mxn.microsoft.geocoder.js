mxn.register('microsoft', {
	Geocoder: {

		init: function(){
			//Note : done to avoid 404 error on mxn.microsoft.geocoder.js file load
		},

		geocode: function(query){
			//TODO
		},

		geocode_callback: function(results){
			if (results.statusDescription != 'OK') {
				//TODO : error
			}
			else {
				//TODO : success
			}
		}
	}
});