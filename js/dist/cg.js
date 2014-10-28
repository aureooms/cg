(function(exports, undefined){

	'use strict';


/* js/src/d2 */
/* js/src/d2/ch */
/* js/src/d2/ch/chn2.js */


var ch_n2 = function(set){
	var discard = [];
	for(var b = 0; b < set.length; ++b){
		for(var a = 0; a < set.length; ++a){
			if(b == a) continue;
			var max = [null, null];
			var max_cos = [1, 1];
			for(var x = 0; x < set.length; ++x){
				if(x == a || x == b) continue;
				var sin = sin_sign(set[a], set[b], set[x]);
				var cos = geo.cos(set[a], set[b], set[x]);
				if(sin >= 0 && cos <= max_cos[0]){
					max[0] = set[x];
					max_cos[0] = cos;
				}
				if(sin <= 0 && cos <= max_cos[1]){
					max[1] = set[x];
					max_cos[1] = cos;
				}
			}
			if(max[0] && max[1] && sin_sign(max[0], max[1], set[b]) <= 0){
				discard[b] = true;
				break;
			}
			break;
		}
	}

	var ch = [];
	for(var x = 0; x < set.length; ++x){
		if(!discard[x]) ch.push(set[x]);
	}
	return ch;
};

exports.ch_n2 = ch_n2;

/* js/src/d2/ch/chn3.js */


/**
 * Find the convex hull in O(n^3) by keeping any point that
 * is not the vertex of an obtuse angle of the set of points.
 */

var __chn3__ = function (sinsign, cossign) {

	var chn3 = function(set, hull){

		var i, j, k, a, b, c, len, sin;

		len = set.length;

		for (i = 0; i < len; ++i){

			a = set[i];

			loopj : for (j = 0; j < len; ++j){

				if (j === i) continue;

				b = set[j];

				for (k = 0; k < len; ++k){

					if (k === i || k === j) continue;

					c = set[k];

					sin = sinsign(a, b, c);

					if (sin < 0 || (sin === 0 && cossign(a, b, c) < 0)){
						continue loopj;
					}

				}

				hull[j] = true;
			}
		}

	};

	return chn3;

};

exports.__chn3__ = __chn3__;

/* js/src/d2/ch/chn4.js */


/**
 * Find the convex hull in O(n^4) by removing any point lying inside
 * a triangle of the set of points.
 */

var __chn4__ = function (colinear, pit) {


	var chn4 = function (set, hull) {

		var i, j, k, a, b, c, x, len;

		len = set.length;

		for (i = 0; i < len; ++i) {

			if (!hull[i]) continue;

			a = set[i];

			for (j = 0; j < len; ++j) {

				if (j === i || !hull[j]) continue;

				b = set[j];

				for (k = 0; k < len; ++k) {

					if (k === i || k === j || !hull[k]) continue;

					c = set[k];

					if (colinear(a, b, c)) continue;

					for (x = 0; x < len; ++x) {
						if(x === i || x === j || x === k || !hull[x]) continue;

						if (pit(set[x], a, b, c)) {
							hull[x] = false;
						}
					}
				}
			}
		}
	};

	return chn4;

};

exports.__chn4__ = __chn4__;

/* js/src/d2/ch/chonline.js */


var binary_ext_sin_search = function(ch, l, r, o, p){
	var i = o;
	while(l < r){
		i = Math.floor((r - l) / 2) + l;
		var p_i = (i - 1) < 0 ? ch.length - 1: i - 1;
		var n_i = (i + 1) % ch.length;
		var cos_m = geo.cos(ch[o], p, ch[i]);
		var cos_l = geo.cos(ch[o], p, ch[p_i]);
		var cos_r = geo.cos(ch[o], p, ch[n_i]);

		if(cos_m < cos_l){
			if(cos_m < cos_r) return i;
			else if(cos_m == cos_r && dist(p, ch[i]) < dist(p, ch[n_i])) return i;
			else l = i + 1;
		}
		else if(cos_m == cos_l && cos_m < cos_r && dist(p, ch[i]) < dist(p, ch[p_i])) return i;
		else r = i;
	}

	return i;

};

var ch_online_add = function(ch, p){
	if(ch.length == 0){
		ch.push(p);
		return;
	}
	if(ch.length == 1){
		if(p.x < ch[0] || (p.x == ch[0] && p.y < ch[0].y)) ch.splice(0, 0, p);
		else ch.push(p);
		return;
	}
	if(ch.length == 2){
		if(p.x < ch[0] || (p.x == ch[0] && p.y < ch[0].y)) ch.splice(0, 0, p);
		else if(sin_sign(ch[0], ch[1], p) > 0) ch.splice(1, 0, p);
		else ch.push(p);
		return;
	}



	var l = 1, r = ch.length;
	var i = Math.floor((r - l) / 2) + l;
	var which = sin_sign(ch[0], ch[1], p) < 0 ? 1 : -1;
	while(l < r){
		if(which * sin_sign(ch[0], p, ch[i]) > 0){
			if(which * sin_sign(ch[0], p, ch[(i + 1) % ch.length]) < 0){
				++i;
				break;
			}
			else l = i + 1;
		}
		else{
			if(which * sin_sign(ch[0], p, ch[i - 1]) > 0) break;
			else r = i;
		}
		i = Math.floor((r - l) / 2) + l;
	}



	var j = binary_ext_sin_search(ch, 0, i, 0, p);
	var k = binary_ext_sin_search(ch, i, ch.length, 0, p);

	if(k == 0) k = [j, j = k][0];

	if(sin_sign(ch[j], ch[k], p) >= 0) ch.splice(j + 1, k - j - 1, p);
	else{
		ch.splice(k + 1, ch.length - k - 1, p);
		ch.splice(0, j);
	}


};

var ch_online_rm = function(set, p, ch){

};

exports.ch_online_add = ch_online_add;
exports.ch_online_rm = ch_online_rm;

/* js/src/d2/ch/chsort.js */


var ch_sort = function(ch){
	if(ch.length < 2) return;
	graham_sort(ch);
};

exports.ch_sort = ch_sort;

/* js/src/d2/ch/graham_scan.js */


var graham_sort = function(set){

	var c = 0;
	for(var i = 1; i < set.length; ++i){
		if(set[i].x < set[c].x || (set[i].x == set[c].x && set[i].y < set[c].y)) c = i;
	}

	set[0] = [set[c], set[c] = set[0]][0];

	var p = 0;
	var tmp = new Point(set[p].x, set[p].y - 1);

	shuffle(set, 1, set.length);
	quicksort(set, 1, set.length, function(a,b){
		var cos_a = geo.cos(tmp, set[p], a);
		var cos_b = geo.cos(tmp, set[p], b);
		return cos_a < cos_b || (cos_a == cos_b && dist(set[p], a) > dist(set[p], b));
	});

};


var graham_scan = function(set){
	if(set.length < 2) return set;

	graham_sort(set);

	var stack = [0, 1];

	for(var i = 2; i < set.length; ++i){
		while(sin_sign(set[stack[stack.length-2]], set[stack[stack.length-1]], set[i]) > 0){
			stack.pop();
		}
		stack.push(i);
	}

	var ch = [];
	for(var i = 0; i < stack.length; ++i) ch.push(set[stack[i]]);

	return ch;

};

exports.graham_sort = graham_sort;
exports.graham_scan = graham_scan;

/* js/src/d2/ch/graham_scan_mono.js */


var graham_scan_mono = function(set){
	if(set.length < 2) return set;

	shuffle(set, 0, set.length);
	quicksort(set, 0, set.length, function(a,b){ return a.x < b.x; });

	var up = [0, 1], down = [0, 1];

	for(var i = 2; i < set.length; ++i){
		while(up.length > 1 && sin_sign(set[up[up.length-2]], set[up[up.length-1]], set[i]) <= 0){
			up.pop();
		}
		up.push(i);
		while(down.length > 1 && sin_sign(set[down[down.length-2]], set[down[down.length-1]], set[i]) >= 0){
			down.pop();
		}
		down.push(i);
	}

	var ch = [];
	for(var i = 0; i < down.length; ++i) ch.push(set[down[i]]);
	for(var i = up.length - 2; i > 0; --i) ch.push(set[up[i]]);

	return ch;

};

exports.graham_scan_mono = graham_scan_mono;

/* js/src/d2/ch/jarvis_march.js */


var jarvis_march = function(set){
	if(set.length < 2) return set.slice();

	var c = 0;
	for(var i = 1; i < set.length; ++i){
		if(set[i].x < set[c].x || (set[i].x == set[c].x && set[i].y < set[c].y)) c = i;
	}

	if(set.length < 3) return [set[c], set[c?0:1]];

	var p = c;
	var tmp = new Point(set[p].x, set[p].y - 1);

	c = 0;
	var i = p?0:1;
	var cos = geo.cos(tmp, set[p], set[i]);
	var d = dist(set[p], set[i]);
	for(++i; i < set.length; ++i){
		if(p == i) continue;
		var cos_i = geo.cos(tmp, set[p], set[i]);
		var d_i = dist(set[p], set[i]);
		if(cos_i < cos || (cos_i == cos && d_i > d)){
			c = i;
			cos = cos_i;
			d = d_i;
		}
	}


	var ch = [set[p]];
	var ch_0 = p;
	var f = -1;
	while(ch_0 != f){
		ch.push(set[c]);
		f = 0;
		var i = 0;
		for(; i < set.length; ++i){
			if(p == i || c == i) continue;
			f = i;
			cos = geo.cos(set[p], set[c], set[i]);
			d = dist(set[c], set[i]);
			++i;
			break;
		}
		for(; i < set.length; ++i){
			if(p == i || c == i) continue;
			var cos_i = geo.cos(set[p], set[c], set[i]);
			var d_i = dist(set[c], set[i]);
			if(cos_i < cos || (cos_i == cos && d_i > d)){
				f = i;
				cos = cos_i;
				d = d_i;
			}
		}

		p = c;
		c = f;
	}

	return ch;

};

exports.jarvis_march = jarvis_march;

/* js/src/d2/ch/quick_hull.js */


var quick_hull = function(set){
	if(set.length < 4) return set.slice();

	var b0 = find_min_y(set, 0, set.length);
	set[0] = [set[b0], set[b0] = set[0]][0];
	b0 = 0;

	var b1 = find_max_y(set, 1, set.length);
	set[1] = [set[b1], set[b1] = set[1]][0];
	b1 = 1;

	var b2, b3, b2_m, b3_m, l = 2, r = e = set.length - 1;

	while(l <= r){
		var sin = sin_sign(set[b0], set[b1], set[l]);
		if(sin > 0){
			var d = dist_pl(set[l], [set[b0], set[b1]]);
			if(b2 === undefined || d > b2_m){
				b2 = l;
				b2_m = d;
			}
			++l;
		}
		else if(sin < 0){
			set[l] = [set[r], set[r] = set[l]][0];
			var d = dist_pl(set[r], [set[b0], set[b1]]);
			if(b3 === undefined || d > b3_m){
				b3 = r;
				b3_m = d;
			}
			--r;
		}
		else{
			if(b3 === e) b3 = r;
			if(l != r) set[e] = [set[r], set[r] = set[e]][0];
			set[l] = [set[e], set[e] = set[l]][0];
			--e;
			--r;
		}
	}


	var ch = [];

	ch.push(set[b0]);
	if(b2 !== undefined){
		set[b2] = [set[2], set[2] = set[b2]][0];
		b2 = 2;
		quick_hull_rec(set, 3, r, b0, b1, b2, ch);
	}

	ch.push(set[b1]);
	if(b3 !== undefined){
		set[b3] = [set[r+1], set[r+1] = set[b3]][0];
		b3 = r + 1;
		quick_hull_rec(set, r + 2, e, b1, b0, b3, ch);
	}

	return ch;
};

var quick_hull_rec = function(set, l, r, b0, b1, b2, ch){

	var b3, b4, b3_m, b4_m, e = r, f = l;

	while(l <= r){
		if(sin_sign(set[b2], set[b1], set[l]) > 0){
			var d = dist_pl(set[l], [set[b2], set[b1]]);
			if(b3 === undefined || d > b3_m){
				b3 = l;
				b3_m = d;
			}
			++l;
		}
		else if(sin_sign(set[b0], set[b2], set[l]) > 0){
			set[l] = [set[r], set[r] = set[l]][0];
			var d = dist_pl(set[r], [set[b0], set[b2]]);
			if(b4 === undefined || d > b4_m){
				b4 = r;
				b4_m = d;
			}
			--r;
		}
		else{
			if(b4 === e) b4 = r;
			if(l != r) set[e] = [set[r], set[r] = set[e]][0];
			set[l] = [set[e], set[e] = set[l]][0];
			--e;
			--r;
		}
	}


	if(b3 !== undefined){
		set[b3] = [set[f], set[f] = set[b3]][0];
		b3 = f;
		quick_hull_rec(set, f + 1, r, b2, b1, b3, ch);

	}

	ch.push(set[b2]);

	if(b4 !== undefined){
		set[b4] = [set[r+1], set[r+1] = set[b4]][0];
		b4 = r + 1;
		quick_hull_rec(set, r + 2, e, b0, b2, b4, ch);

	}
};

exports.quick_hull = quick_hull;

/* js/src/d2/intersect */
/* js/src/d2/op */
/* js/src/d2/op/det3.js */

var det3 = function (A) {

	var A0, A1, A2, A00, A01, A02, A10, A11, A12, A20, A21, A22;

	A0 = A[0]; A00 = A0[0]; A01 = A0[1]; A02 = A0[2];
	A1 = A[1]; A10 = A1[0]; A11 = A1[1]; A12 = A1[2];
	A2 = A[2]; A20 = A2[0]; A21 = A2[1]; A22 = A2[2];

	return A00 * A11 * A22 +
	       A01 * A12 * A20 +
	       A02 * A10 * A21 -
	       A20 * A11 * A02 -
	       A21 * A12 * A00 -
	       A22 * A10 * A01;
};

exports.det3 = det3;

/* js/src/d2/op/scalar.js */

/* js/src/d2/op/vadd.js */


/**
 * Computes u + v
 */

var vsub = function (u, v) {
	return [u[0] + v[0], u[1] + v[1]];
};

exports.vsub = vsub;

/* js/src/d2/op/vcross.js */


/**
 * Computes cross product u x v
 */

var vcross = function (u, v) {
	return u[0] * v[1] - u[1] * v[0];
};

exports.vcross = vcross;

/* js/src/d2/op/vdot.js */


/**
 * Computes dot product u.v
 */

var vdot = function (u, v) {
	return u[0] * v[0] + u[1] * v[1];
};

exports.vdot = vdot;

/* js/src/d2/op/vsub.js */


/**
 * Computes u - v
 */

var vsub = function (u, v) {
	return [u[0] - v[0], u[1] - v[1]];
};

exports.vsub = vsub;

/* js/src/d2/pred */
/* js/src/d2/pred/ccw.js */


var __ccw__ = function(sinsign){

	/**
	 * Returns true if _c_ lies to the left of segment _ab_
	 * in a "right-handed" coordinate system.
	 */

	var ccw = function(a, b, c){
		return sinsign(a, b, c) > 0;
	};

	return ccw;
};

exports.__ccw__ = __ccw__;

/* js/src/d2/pred/ccwc.js */


var __ccwc__ = function(sinsign){

	/**
	 * Returns true if _c_ lies to the left of segment _ab_
	 * or if _a_ , _b_ and _c_ are colinear in a
	 * "right-handed" coordinate system.
	 */

	var ccwc = function(a, b, c){
		return sinsign(a, b, c) >= 0;
	};

	return ccwc;
};

exports.__ccwc__ = __ccwc__;

/* js/src/d2/pred/colinear.js */


var __colinear__ = function(sinsign){

	/**
	 * Returns true if _a_ , _b_ and _c_ are colinear.
	 */

	var colinear = function(a, b, c){
		return sinsign(a, b, c) === 0;
	};

	return colinear;
};

exports.__colinear__ = __colinear__;

/* js/src/d2/pred/convex.js */


var __convex__ = function (ccwc) {

	var convex = function (a, i, j) {
		var x, y, z, k, n;

		n = j - i;

		if (n <= 2) {
			return true;
		}

		k = i;

		x = a[k];
		++k;
		y = a[k];
		++k;
		z = a[k];
		++k;

		if (n === 3) {
			return ccwc(x, y, z);
		}

		for (;;) {

			if (!ccwc(x, y, z)) {
				return false;
			}

			if (k === j) {
				k = i;
				x = a[k];

				if (!ccwc(y, z, x)) {
					return false;
				}

				++k;
				y = a[k];

				return ccwc(z, x, y);
			}

			x = a[k];
			++k;


			if (!ccwc(y, z, x)) {
				return false;
			}

			if (k === j) {
				k = i;
				y = a[k];

				if (!ccwc(z, x, y)) {
					return false;
				}

				++k;
				z = a[k];

				return ccwc(x, y, z);
			}

			y = a[k];
			++k;


			if (!ccwc(z, x, y)) {
				return false;
			}

			if (k === j) {
				k = i;
				z = a[k];

				if (!ccwc(x, y, z)) {
					return false;
				}

				++k;
				x = a[k];

				return ccwc(y, z, x);
			}

			z = a[k];
			++k;

		}

	};

	return convex;

};

exports.__convex__ = __convex__;

/* js/src/d2/pred/cossign.js */


/**
 * Computes the cosinus sign in a "right-handed"
 * coordinate system (i.e. clockwise angle values).
 * cossign(x, y, z) > 0 iff angle _xyz_ is acute.
 *
 * <p>
 *
 * http://en.wikipedia.org/wiki/Dot_product#Geometric_definition
 *
 *     A.B = ||A|| ||B|| cos t
 *     A.B = A0 B0 + A1 B1
 *     A = [y[0] - x[0], y[1] - x[1]]
 *     B = [y[0] - z[0], y[1] - z[1]]
 *     A.B = (y[0] - x[0]) * (y[0] - z[0]) + (y[1] - x[1]) * (y[1] - z[1])
 *
 *
 * # of operations
 *
 *   - 1 add
 *   - 4 sub
 *   - 2 mul
 *
 *
 * Originally implemented as
 *
 *     return y[0] * (y[0] - x[0] - z[0]) +
 *            y[1] * (y[1] - x[1] - z[1]) +
 *            z[0] * x[0] +
 *            z[1] * x[1];
 *
 * with
 *   - 3 add
 *   - 4 sub
 *   - 4 mul
 *
 */

var cossign = function(x, y, z){
	return (y[0] - x[0]) * (y[0] - z[0]) +
	       (y[1] - x[1]) * (y[1] - z[1]);
};

exports.cossign = cossign;

/* js/src/d2/pred/cw.js */


var __cw__ = function(sinsign){

	/**
	 * Returns true if _c_ lies to the right of segment _ab_
	 * in a "right-handed" coordinate system.
	 */

	var cw = function(a, b, c){
		return sinsign(a, b, c) < 0;
	};

	return cw;
};

exports.__cw__ = __cw__;

/* js/src/d2/pred/cwc.js */


var __cwc__ = function(sinsign){

	/**
	 * Returns true if _c_ lies to the right of segment _ab_
	 * or if _a_ , _b_ and _c_ are colinear in a
	 * "right-handed" coordinate system.
	 */

	var cwc = function(a, b, c){
		return sinsign(a, b, c) <= 0;
	};

	return cwc;
};

exports.__cwc__ = __cwc__;

/* js/src/d2/pred/icc.js */


/**
 * In circum circle predicate
 */

var __icc__ = function (det3) {

	/**
	 * Checks if _w_ lies strictly inside the circum circle
	 * of triangle _tuv_.
	 */

	var icc = function (t, u, v, w) {
		var t0, t1, u0, u1, v0, v1, w0, w1, y;

		t0 = t[0]; t1 = t[1];
		u0 = u[0]; u1 = u[1];
		v0 = v[0]; v1 = v[1];
		w0 = w[0]; w1 = w[1];

		y = w0 * w0 + w1 * w1;

		return det3([
			[t0 - w0, t1 - w1, t0 * t0 + t1 * t1 - y],
			[u0 - w0, u1 - w1, u0 * u0 + u1 * u1 - y],
			[v0 - w0, v1 - w1, v0 * v0 + v1 * v1 - y]
		]) > 0;
	};

	return icc;
};

exports.__icc__ = __icc__;

/* js/src/d2/pred/pit.js */


/**
 * Returns true if point is in triangle.
 */

var __pit__ = function (ccw) {

	var pit = function (x, a, b, c) {
		return ccw(a, b, x) &&
		       ccw(b, c, x) &&
		       ccw(c, a, x);
	};

	return pit;
};

exports.__pit__ = __pit__;

/* js/src/d2/pred/rc.js */


/**
 * Ray casting algorithm.
 * ==
 *
 * Counts the number of time a ray intersects a polygon.
 *
 * Hypothesis :
 *  - polygon is represented as an array of vertices
 *  - polygon has at least 3 vertices
 *
 * @param {array} polygon array of vertices
 * @param {integer} i index of the first vertex of the polygon
 * @param {integer} j index of the last vertex of the polygon
 * @param {point} p first point of the ray
 * @param {point} q second point of the ray
 *
 * see http://en.wikipedia.org/wiki/Point_in_polygon
 */

var __rc__ = function (ris) {

	var rc = function (polygon, i, j, p, q) {

		var u, v, n;

		n = 0;

		u = polygon[j-1];
		v = polygon[i];
		++i;

		for (;;) {
			n += ris(p, q, u, v);
			++i;

			if (i === j) {
				return n;
			}

			u = polygon[i];

			n += ris(p, q, u, v);
			++i;

			if (i === j) {
				return n;
			}

			v = polygon[i];
		}
	};

	return rc;
};

exports.__rc__ = __rc__;

/* js/src/d2/pred/sinsign.js */


/**
 * Computes the cross product of vectors _ab_ and _ac_.
 * Can be interpreted as the sinus sign in a "right-handed"
 * coordinate system (i.e. clockwise angle values).
 * sinsign(a, b, c) > 0 iff point c 'lies to the left' of segment _ab_.
 *
 * <p>
 * Originally implemented as
 *
 *     a[1] * (c[0] - b[0]) + b[1] * (a[0] - c[0]) + c[1] * (b[0] - a[0])
 *
 * with
 *   - 2 add
 *   - 3 sub
 *   - 3 mul
 *
 * Reduced to
 *
 *     (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
 *
 * with
 *   - 5 sub
 *   - 2 mul
 *
 */

var sinsign = function(a, b, c){
	return (b[0] - a[0]) * (c[1] - a[1]) -
	       (b[1] - a[1]) * (c[0] - a[0]);
};


exports.sinsign = sinsign;

})(typeof exports === 'undefined' ? this['cg'] = {} : exports);