/*global requestAnimFrame*/
/**
 * Krpano idle view plugin
 * The Krpano idle view plugin (formerly simplexIdle) uses Simplex noise to look around and zoom when the panorama is idle. The movement is random but not as random as Brownian motion. Simplex noise, like Perlin noise, interpolates between random numbers. The result is a motion that could be perceived as life-like.
 * Additional copyrights and acknowlegdements:
 *    - Simplex noise: Stefan Gustavson, Sean McCullough, Karsten Schmidt, Ron Valstar
 *    - requestAnimFrame: Paul Irish, mr Doob
 * @summary Idle panoramas move around randomly.
 * @name idleView
 * @version 1.3.6
 * @licenseDual licensed under the MIT and GPL licenses: http://www.opensource.org/licenses/mit-license.php and http://www.gnu.org/licenses/gpl.html
 * @author Ron Valstar (http://www.sjeiti.com/)
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 * @requires krpanoJS 1.0.8.14
 * @example
<plugin
	name="idleView"
	url="idleView.min.js"
	keep="true"
	idletimeout="10000"
	forceh=".2"
	forcev=".1"
	forcez="0"
	frequencyh=".5"
	frequencyv=".5"
	attractz=".5"
/>
 */
window.krpanoplugin = function() {
	'use strict';
	var krpano = null
		,plugin = null
		//
		,bEventsAdded = false
		//
		,iIdle
		,bIdle = false
		//
		,fForceBase = 0.1
		,fForceHlookat = 1
		,fForceVlookat = 1
		,fForceFov = 1
		//
		,fFreqBase = 0.0001
		,fFreqHlookat = 1
		,fFreqVlookat = 1
		,fFreqFov = 1
		//
		,fGammaHlookat = 1
		,fGammaVlookat = 1
		,fGammaFov = 1
		//
		,iIdleTimeout = 1
		//
		,iFovMiddle = 95
		//
		,fAttractFovBase = 0.002
		,fAttractVBase = 0.001
		,fAttractFov = 1
		,fAttractV = 1
		//
		,fOffsetBase = 0.01
		,fOffsetH = 0
		//
		,aRand = function(a){
			for (var i=0;i<16;i++) a.push(999+parseInt(99999*Math.random(),10));
			return a;
		}([])
		// custom events
		,sEventInitialised = 'idleViewInitialized'
		,sEventStart = 'idleViewStart'
		,sEventEnd = 'idleViewEnd'
		// animate
		,fDeltaT = 1.5
		,iLastT
		,fDTDeviation = 0.87
		,fDTDeviation1 = 1/fDTDeviation
		,iDTLen = 11
		,aDeltaT = function(a){
			for (var i=0;i<iDTLen;i++) a.push(fDeltaT);
			return a;
		}([])
	;

	////////////////////////////////////////////////////////////
	// plugin management

	this.registerplugin = function(krpanointerface, pluginpath, pluginobject) {
		delete window.krpanoplugin;

		krpano = krpanointerface;
		plugin = pluginobject;

		if (krpano.version<'1.0.8.14'||krpano.build<'2011-03-30') {
			console.warn(3,"idleView plugin - too old krpano version (min. 1.0.8.14)");
			return;
		}

		// find default fov
		//console.log('krpano.get(xml)',krpano.get('xml')); // log
		var xContent = krpano.get('xml').content;
		var aFov = xContent&&xContent.match(/\sfov="([0-9]*)"/);
		if (aFov&&aFov.length>1) iFovMiddle = parseInt(aFov[1],10);

		// Register attributes
		plugin.registerattribute("idletimeout",iIdleTimeout,function(i){iIdleTimeout=i;},	function(){ return iIdleTimeout; });

		plugin.registerattribute("forceh",fForceHlookat,	function(f){fForceHlookat=f;},	function(){ return fForceHlookat; });
		plugin.registerattribute("forcev",fForceVlookat,	function(f){fForceVlookat=f;},	function(){ return fForceVlookat; });
		plugin.registerattribute("forcez",fForceFov,		function(f){fForceFov=f;},		function(){ return fForceFov; });

		plugin.registerattribute("frequencyh",fFreqHlookat,	function(f){fFreqHlookat=f;},	function(){ return fFreqHlookat; });
		plugin.registerattribute("frequencyv",fFreqVlookat,	function(f){fFreqVlookat=f;},	function(){ return fFreqVlookat; });
		plugin.registerattribute("frequencyz",fFreqFov,		function(f){fFreqFov=f;},		function(){ return fFreqFov; });

		plugin.registerattribute("gammah",fGammaHlookat,	function(f){fGammaHlookat=f;},	function(){ return fGammaHlookat; });
		plugin.registerattribute("gammav",fGammaVlookat,	function(f){fGammaVlookat=f;},	function(){ return fGammaVlookat; });
		plugin.registerattribute("gammaz",fGammaFov,		function(f){fGammaFov=f;},		function(){ return fGammaFov; });

		plugin.registerattribute("attractv",fAttractV,		function(f){fAttractV=f;},		function(){ return fAttractV; });
		plugin.registerattribute("attractz",fAttractFov,	function(f){fAttractFov=f;},	function(){ return fAttractFov; });

		plugin.registerattribute("offseth",0,				function(f){fOffsetH=f;},	function(){ return fOffsetH; });

		// Register methods
		plugin.enable  = enable;
		plugin.disable = disable;

		// start
		enable();

		// expose // todo: expose subset only
		plugin.toString = function(){return '[object krpano idle view plugin]';};
		dispatch(window,sEventInitialised,plugin);
	};


	this.unloadplugin = function() {
		addEvents(false);
		plugin = null;
		krpano = null;
	};

	// PUBLIC METHODS

	// PRIVATE EXPOSED METHODS

	/**
	 * Turns the plugin on.
	 */
	function enable(){
		addEvents();
		unIdle();
	}

	/**
	 * Turns the plugin off.
	 */
	function disable(){
		addEvents(false);
		unIdle();
	}

	// PRIVATE METHODS

	/**
	 * Dispatch a custom event.
	 * @param {EventTarget} from
	 * @param {String} type
	 * @param {object} object
	 * @returns {boolean}
	 */
	function dispatch(from,type,object){
		//window.dispatchEvent(new CustomEvent(sEventInitialised,{detail:plugin}));
		var eEvent = document.createEvent('CustomEvent');
		eEvent.initCustomEvent(type,false,false,object);
		return from.dispatchEvent(eEvent);
	}

	/**
	 * Add (or remove) event listeners to which to react.
	 * @param {Boolean} add Add or remove the events.
	 */
	function addEvents(add) {
		if (add===undefined) add = true;
		if (bEventsAdded!==add) {
			var fn = add?window.addEventListener:window.removeEventListener;
			var aEvents = ['mousemove','touchmove'];//'ontouchstart','ontouchend'
			for (var i=0;i<aEvents.length;i++) fn(aEvents[i],unIdle);
			bEventsAdded = add;
		}
	}

	/**
	 * Turn idling off (typically on an event).
	 */
	function unIdle(){
		if (bIdle) {
			setIdle(false);
		}
		if (iIdle!==undefined) clearTimeout(iIdle);
		iIdle = setTimeout(function(){
			setIdle();
		},iIdleTimeout);
	}
	/**
	 * Turn idling on- or off
	 * @param {Boolean} b Idling on or off.
	 */
	function setIdle(b){
		if (b===undefined) {
			b = true;
		}
		if (bIdle!==b) {
			bIdle = b;
			bIdle&&animate();
			dispatch(window,bIdle?sEventStart:sEventEnd,plugin);
		}
	}

	/**
	 * Gamma correction with negative implentation
	 * @param {number} value
	 * @param {number} exponent
	 * @returns {number}
	 */
	function gamma(value,exponent){
		var bNeg = value<0,fReturn;
		if (bNeg) value = -value;
		fReturn = Math.pow(value,exponent);
		return bNeg?-fReturn:fReturn;
	}

	/**
	 * The animation method that is run while idle.
	 * Uses deltaT and noise to look around.
	 */
	function animate() {
		// millis
		var t = Date.now()
			,iDeltaTms = t-iLastT
			// deltaT min max deviation
			,fTmpDeltaT = Math.min(Math.max(
				!iLastT?1:iDeltaTms/10.0
				,fDTDeviation*fDeltaT)
				,fDTDeviation1*fDeltaT)
		;
		// push and shift deltaT stack
		aDeltaT.push(fTmpDeltaT);
		aDeltaT.shift();
		// calculate average (deltaT)
		fDeltaT = 0;
		for (var i=0;i<iDTLen;i++) fDeltaT += aDeltaT[i];
		fDeltaT /= iDTLen;
		// remember millis
		iLastT = t;
		//
		if (bIdle) {
			if (iDeltaTms<1000) { // can get too huge when window is hidden
				var sCall = '',fNoise,fMove;
				// horizontal
				if (fForceHlookat>0) {
					fNoise = PerlinSimplex.noise(aRand[0]+fFreqHlookat*fFreqBase*t,aRand[1])-0.5;
					if (fGammaHlookat!==1) fNoise = gamma(fNoise,fGammaHlookat);
					fMove = fForceHlookat*fForceBase*fNoise + fOffsetBase*fOffsetH;
					sCall += 'set(hlookat_moveforce,'+fDeltaT*fMove+');';
				}
				// vertical
				if (fForceVlookat>0) {
					fNoise = PerlinSimplex.noise(aRand[2]+fFreqVlookat*fFreqBase*t,aRand[3])-0.5;
					if (fGammaVlookat!==1) fNoise = gamma(fNoise,fGammaVlookat);
					fMove = fForceVlookat*fForceBase*fNoise;
					if (fAttractV>=0)	fMove -= fAttractV*fAttractVBase*krpano.get('view.vlookat');
					sCall += 'set(vlookat_moveforce,'+fDeltaT*fMove+');';
				}
				// field of view
				if (fForceFov>0) {
					fNoise = PerlinSimplex.noise(aRand[4]+fFreqFov*fFreqBase*t,aRand[5])-0.5;
					if (fGammaFov!==1) fNoise = gamma(fNoise,fGammaFov);
					fMove = fForceFov*fForceBase*fNoise;
					if (fAttractFov>=0)	fMove -= fAttractFov*fAttractFovBase*(krpano.get('view.fov')-iFovMiddle);
					sCall += 'set(fov_moveforce,'+fDeltaT*fMove+');';
				}
				//
				if (sCall!=='') krpano.call(sCall);
			}
			requestAnimFrame(animate);
		} else { // called once after bIdle has been set to false
			krpano.call('set(hlookat_moveforce,0);set(vlookat_moveforce,0);set(fov_moveforce,0);');
			iLastT = null;
		}
	}

	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////

	// todo: move requestAnimFrame and PerlinSimplex outside this script


	// requestAnimFrame :: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	if (!window.hasOwnProperty('requestAnimFrame')) {
		window.requestAnimFrame = (function(){
			return	window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				function(callback){
					window.setTimeout(callback, 1000 / 60);
				};
		})();
	}

	// PerlinSimplex 1.2 :: http://www.sjeiti.com/?p=448
	// Ported from Stefan Gustavson's java implementation by Sean McCullough banksean@gmail.com
	// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
	// Read Stefan's excellent paper for details on how this code works.
	// octaves and falloff implementation (and passing jslint) by Ron Valstar
	// also implemented Karsten Schmidt's implementation

	// noise3 and noise4d are removed because they are not used in the krpano plugin

	var PerlinSimplex = (function() {

		var F2 = 0.5*(Math.sqrt(3)-1);
		var G2 = (3-Math.sqrt(3))/6;
		var G22 = 2*G2 - 1;
		// Gradient vectors for 3D (pointing to mid points of all edges of a unit cube)
		var aGrad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
		// To remove the need for index wrapping, double the permutation table length
		var aPerm;
		//
		var g;
		var n0, n1, n2;
		var s;
		var i, j;
		var t;
		var x0, y0;
		var i1, j1;
		var x1, y1;
		var x2, y2;
		var ii, jj;
		var gi0, gi1, gi2;
		var t0, t1, t2;
		//
		var oRng = Math;
		var iOctaves = 1;
		var fPersistence = 0.5;
		var fResult, fFreq, fPers;
		var aOctFreq; // frequency per octave
		var aOctPers; // persistence per octave
		var fPersMax; // 1 / max persistence
		//
		// octFreqPers
		var octFreqPers = function octFreqPers() {
			var fFreq, fPers;
			aOctFreq = [];
			aOctPers = [];
			fPersMax = 0;
			for (var i=0;i<iOctaves;i++) {
				fFreq = Math.pow(2,i);
				fPers = Math.pow(fPersistence,i);
				fPersMax += fPers;
				aOctFreq.push( fFreq );
				aOctPers.push( fPers );
			}
			fPersMax = 1 / fPersMax;
		};
		// 2D dotproduct
		var dot2 = function dot2(g, x, y) {
			return g[0]*x + g[1]*y;
		};
		// setPerm
		var setPerm = function setPerm() {
			var i;
			var p = [];
			for (i=0; i<256; i++) {
				p[i] = Math.floor(oRng.random()*256);
			}
			// To remove the need for index wrapping, double the permutation table length
			aPerm = [];
			for(i=0; i<512; i++) {
				aPerm[i] = p[i & 255];
			}
		};
		// noise2d
		var noise2d = function noise2d(x, y) {
			// Skew the input space to determine which simplex cell we're in
			s = (x+y)*F2; // Hairy factor for 2D
			i = Math.floor(x+s);
			j = Math.floor(y+s);
			t = (i+j)*G2;
			x0 = x - (i - t); // Unskew the cell origin back to (x,y) space
			y0 = y - (j - t); // The x,y distances from the cell origin
			// For the 2D case, the simplex shape is an equilateral triangle.
			// Determine which simplex we are in.
			// Offsets for second (middle) corner of simplex in (i,j) coords
			if (x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
				i1 = 1;
				j1 = 0;
			}  else { // upper triangle, YX order: (0,0)->(0,1)->(1,1)
				i1 = 0;
				j1 = 1;
			}
			// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
			// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
			// c = (3-sqrt(3))/6
			x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
			y1 = y0 - j1 + G2;
			x2 = x0 + G22; // Offsets for last corner in (x,y) unskewed coords
			y2 = y0 + G22;
			// Work out the hashed gradient indices of the three simplex corners
			ii = i&255;
			jj = j&255;
			// Calculate the contribution from the three corners
			t0 = 0.5 - x0*x0-y0*y0;
			if (t0<0) {
				n0 = 0;
			} else {
				t0 *= t0;
				gi0 = aPerm[ii+aPerm[jj]] % 12;
				n0 = t0 * t0 * dot2(aGrad3[gi0], x0, y0);  // (x,y) of aGrad3 used for 2D gradient
			}
			t1 = 0.5 - x1*x1-y1*y1;
			if (t1<0) {
				n1 = 0;
			} else {
				t1 *= t1;
				gi1 = aPerm[ii+i1+aPerm[jj+j1]] % 12;
				n1 = t1 * t1 * dot2(aGrad3[gi1], x1, y1);
			}
			t2 = 0.5 - x2*x2-y2*y2;
			if (t2<0) {
				n2 = 0;
			} else {
				t2 *= t2;
				gi2 = aPerm[ii+1+aPerm[jj+1]] % 12;
				n2 = t2 * t2 * dot2(aGrad3[gi2], x2, y2);
			}
			// Add contributions from each corner to get the final noise value.
			// The result is scaled to return values in the interval [0,1].
			return 70 * (n0 + n1 + n2);
		};
		// init
		setPerm();
		octFreqPers();
		// return
		return {
			noise: function(x,y) {//,z,w
				fResult = 0;
				for (g=0;g<iOctaves;g++) {
					fFreq = aOctFreq[g];
					fPers = aOctPers[g];
					fResult += fPers*noise2d(fFreq*x,fFreq*y);
				}
				return ( fResult*fPersMax + 1 )*0.5;
			},noiseDetail: function(octaves,falloff) {
				iOctaves = octaves||iOctaves;
				fPersistence = falloff||fPersistence;
				octFreqPers();
			},setRng: function(r) {
				oRng = r;
				setPerm();
			},toString: function() {
				return "[object PerlinSimplex "+iOctaves+" "+fPersistence+"]";
			}
		};
	})();
};