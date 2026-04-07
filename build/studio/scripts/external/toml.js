/**
 * Bundled by jsDelivr using Rollup v2.79.2 and Terser v5.39.0.
 * Original file: /npm/@ltd/j-toml@1.38.0/index.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
const e = "1.38.0", t = SyntaxError, n = RangeError, i = TypeError, r = { if: Error }.if, s = void 0, a = "undefined" == typeof BigInt ? s : BigInt, l = RegExp, o = WeakMap, c = WeakMap.prototype.get, u = WeakMap.prototype.set, f = Object.create, h = Number.isSafeInteger, d = Object.getOwnPropertyNames, p = Object.freeze, g = Object.prototype.isPrototypeOf, b = Object.seal ? Object.preventExtensions(Object.create(null)) : null, y = Function.prototype.bind, w = RegExp.prototype.test, m = RegExp.prototype.exec, x = Reflect.apply, T = Proxy, v = "undefined" == typeof Symbol ? s : Symbol.toStringTag, O = Object.defineProperty, $ = Object.assign, F = Object, I = Math.floor, S = Array.isArray, k = 1 / 0, L = String.fromCharCode, M = Array, A = Object.prototype.hasOwnProperty, B = Object.prototype.propertyIsEnumerable, U = Function.prototype.apply;
var D = B.call.bind(B), j = F.hasOwn || function () { return A.bind ? A.call.bind(A) : function (e, t) { return A.call(e, t); }; }(), C = F.create;
function _(e) { var t = C(b); return j(e, "value") && (t.value = e.value), j(e, "writable") && (t.writable = e.writable), j(e, "get") && (t.get = e.get), j(e, "set") && (t.set = e.set), j(e, "enumerable") && (t.enumerable = e.enumerable), j(e, "configurable") && (t.configurable = e.configurable), t; }
const N = function (e, t) { if (t || "function" == typeof e || (t = e, e = f(b)), $)
    $(e, t);
else
    for (var n in t)
        j(t, n) && (e[n] = t[n]); if (e.default = e, "function" == typeof e)
    e.prototype && p(e.prototype);
else if (v) {
    var i = f(b);
    i.value = "Module", O(e, v, i);
} return p(e); };
/*!@preserve@license
 * 模块名称：j-regexp
 * 模块功能：可读性更好的正则表达式创建方式。从属于“简计划”。
        More readable way for creating RegExp. Belong to "Plan J".
 * 模块版本：8.2.0
 * 许可条款：LGPL-3.0
 * 所属作者：龙腾道 <LongTengDao@LongTengDao.com> (www.LongTengDao.com)
 * 问题反馈：https://GitHub.com/LongTengDao/j-regexp/issues
 * 项目主页：https://GitHub.com/LongTengDao/j-regexp/
 */ var E = y ? y.bind(w) : function (e) { return function (t) { return w.call(e, t); }; }, P = y ? y.bind(m) : function (e) { return function (t) { return m.call(e, t); }; };
function K(e) { var t = e.test = E(e), n = e.exec = P(e), i = t.source = n.source = e.source; return t.unicode = n.unicode = e.unicode, t.ignoreCase = n.ignoreCase = e.ignoreCase, t.multiline = n.multiline = i.indexOf("^") < 0 && i.indexOf("$") < 0 ? null : e.multiline, t.dotAll = n.dotAll = i.indexOf(".") < 0 ? null : e.dotAll, e; }
function W(e) { return K(e); }
var R = /[\n\t]+/g, Z = /\\./g;
function q(e) { return "\\`" === e ? "`" : e; }
var H = "".includes ? function (e, t) { return e.includes(t); } : function (e, t) { return e.indexOf(t) > -1; };
function z(e) { for (var n = this.U, r = this.I, s = this.M, a = this.S, o = e.raw, c = o[0].replace(R, ""), u = 1, f = arguments.length; u !== f;) {
    var h = arguments[u];
    if ("string" == typeof h)
        c += h;
    else {
        var d = h.source;
        if ("string" != typeof d)
            throw i("source");
        if (h.unicode === n)
            throw t("unicode");
        if (h.ignoreCase === r)
            throw t("ignoreCase");
        if (h.multiline === s && (H(d, "^") || H(d, "$")))
            throw t("multiline");
        if (h.dotAll === a && H(d, "."))
            throw t("dotAll");
        c += d;
    }
    c += o[u++].replace(R, "");
} var p = l(n ? c = c.replace(Z, q) : c, this.flags), g = p.test = E(p), b = p.exec = P(p); return g.source = b.source = c, g.unicode = b.unicode = !n, g.ignoreCase = b.ignoreCase = !r, g.multiline = b.multiline = H(c, "^") || H(c, "$") ? !s : null, g.dotAll = b.dotAll = H(c, ".") ? !a : null, p; }
var Y = y && y.bind(z);
function J(e) { return { U: !H(e, "u"), I: !H(e, "i"), M: !H(e, "m"), S: !H(e, "s"), flags: e }; }
var V = J(""), G = T ? new T(z, { apply: function (e, t, n) { return x(e, V, n); }, get: function (e, t) { return Y(J(t)); }, defineProperty: function () { return !1; }, preventExtensions: function () { return !1; } }) : function () { z.apply = z.apply; for (var e = function () { return z.apply(V, arguments); }, t = 63; t--;)
    !function (t) { e[t.flags] = function () { return z.apply(t, arguments); }; }(J((1 & t ? "" : "d") + (2 & t ? "" : "g") + (4 & t ? "" : "i") + (8 & t ? "" : "m") + (8 & t ? "" : "s") + (16 & t ? "" : "u") + (32 & t ? "" : "y"))); return p ? p(e) : e; }(), X = "$_" in l ? function () { var e = /^/; return e.test = e.test, function (t) { return e.test(""), t; }; }() : function (e) { return e; }, Q = /^[$()*+\-.?[\\\]^{|]/, ee = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/, te = f(b);
function ne(e, t, n) { for (var i = f(b), r = t ? ie : re, s = e.length, a = 0; a < s; ++a)
    r(i, e[a]); return se(i, !n); }
function ie(e, t) { if (t) {
    var n = ee.test(t) ? t.slice(0, 2) : t.charAt(0);
    ie(e[n] || (e[n] = f(b)), t.slice(n.length));
}
else
    e[""] = te; }
function re(e, t) { if (t) {
    var n = t.charAt(0);
    re(e[n] || (e[n] = f(b)), t.slice(1));
}
else
    e[""] = te; }
function se(e, t) { var n = [], i = [], r = !0; for (var s in e)
    if (s) {
        var a = se(e[s], t);
        t && Q.test(s) && (s = "\\" + s), a ? n.push(s + a) : i.push(s);
    }
    else
        r = !1; return i.length && n.unshift(1 === i.length ? i[0] : "[" + i.join("") + "]"), 0 === n.length ? "" : (1 === n.length && (i.length || r) ? n[0] : "(?:" + n.join("|") + ")") + (r ? "" : "?"); }
const ae = WeakSet, le = WeakSet.prototype.has, oe = WeakSet.prototype.add, ce = WeakSet.prototype.delete, ue = Object.keys, fe = Object.getOwnPropertySymbols, he = function () { var e = Object.assign || function (e, t) { var n, i, r; for (n = ue(t), i = 0; i < n.length; ++i)
    e[r = n[i]] = t[r]; if (fe)
    for (n = fe(t), i = 0; i < n.length; ++i)
        r = n[i], D(t, r) && (e[r] = t[r]); return e; }; function t(e) { return delete e.prototype.constructor, p(e.prototype), e; } function n(n) { return n === s ? this : "function" == typeof n ? t(n) : e(C(b), n); } return delete n.name, n.prototype = null, p(n), n; }(), de = Object.is, pe = Object.defineProperties, ge = Object.fromEntries, be = Reflect.construct, ye = Reflect.defineProperty, we = Reflect.deleteProperty, me = Reflect.ownKeys, xe = () => { const e = new o; return e.has = e.has, e.get = e.get, e.set = e.set, e; }, Te = xe(), ve = xe(), Oe = xe(), $e = $(f(b), { defineProperty: (e, t, n) => { if (j(e, t))
        return ye(e, t, $(f(b), n)); if (ye(e, t, $(f(b), n))) {
        const n = Te.get(e);
        return n[n.length] = t, !0;
    } return !1; }, deleteProperty: (e, t) => { if (we(e, t)) {
        const n = Te.get(e), i = n.indexOf(t);
        return i < 0 || --n.copyWithin(i, i + 1).length, !0;
    } return !1; }, ownKeys: e => Te.get(e), construct: (e, t, n) => Ie(be(e, t, n)), apply: (e, t, n) => Ie(x(e, t, n)) }), Fe = (e, t) => { Te.set(e, t); const n = new T(e, $e); return ve.set(n, e), n; }, Ie = e => { if (ve.has(e))
    return e; let t = Oe.get(e); return t || (t = Fe(e, $([], me(e))), Oe.set(e, t), t); }, Se = function () { function e() { throw i("Super constructor Null cannot be invoked with 'new'"); } function t() { throw i("Super constructor Null cannot be invoked without 'new'"); } const n = e => (delete e.prototype.constructor, p(e.prototype), e); function r(i) { return new.target ? new.target === r ? e() : Fe(this, []) : "function" == typeof i ? n(i) : t(); } return r.prototype = null, O(r, "name", $(f(b), { value: "", configurable: !1 })), p(r), r; }(), ke = WeakMap.prototype.has, Le = WeakMap.prototype.delete, Me = new o, Ae = new ae, Be = Le.bind(Me), Ue = ce.bind(Ae), De = ke.bind(Me), je = c.bind(Me), Ce = u.bind(Me), _e = (e, t, r) => { if (S(e)) {
    if (r)
        t = 3;
    else if (t === s)
        t = 3;
    else if (0 !== t && 1 !== t && 2 !== t && 3 !== t)
        throw "number" == typeof t ? n(`array inline mode must be 0 | 1 | 2 | 3, not including ${t}`) : i('array inline mode must be "number" type, not including ' + (null === t ? '"null"' : typeof t));
    Ce(e, t);
}
else
    Ce(e, !0), Ue(e); return e; }, Ne = e => (Be(e), e), Ee = le.bind(Ae), Pe = oe.bind(Ae), Ke = e => { if (S(e))
    throw i("array can not be section, maybe you want to use it on the tables in it"); return Pe(e), Be(e), e; }, We = new ae, Re = oe.bind(We), Ze = le.bind(We), qe = new ae, He = oe.bind(qe), ze = ce.bind(qe), Ye = !0, Je = !1, Ve = new ae, Ge = oe.bind(Ve), Xe = le.bind(Ve), Qe = !0, et = he(class extends he {
    constructor(e, t) { return super(), Re(this), e ? t ? Ce(this, !0) : Pe(this) : (t ? Ge : He)(this), this; }
}), tt = he(class extends Se {
    constructor(e, t) { return super(), Re(this), e ? t ? Ce(this, !0) : Pe(this) : (t ? Ge : He)(this), this; }
}), nt = [];
let it = "", rt = nt, st = -1, at = -1;
const lt = e => { throw e; }, ot = /\r?\n/, ct = (e, t) => { if ("string" != typeof t)
    throw i("TOML.parse({ path })"); it = t, rt = e.split(ot), st = rt.length - 1, at = -1; };
class ut {
    constructor(e, t) {
        this.lineIndex = at;
        return this.type = e, this.restColumn = t, this;
    }
    must() { return at === st && lt(t(`${this.type} is not close until the end of the file` + ft(", which started from ", this.lineIndex, rt[this.lineIndex].length - this.restColumn + 1))), rt[++at]; }
    nowrap(e) { throw lt(r(`TOML.parse(${e ? `${e}multilineStringJoiner` : ",{ joiner }"}) must be passed, while the source including multi-line string` + ft(", which started from ", this.lineIndex, rt[this.lineIndex].length - this.restColumn + 1))); }
}
const ft = (e, t = at, n = 0) => rt === nt ? "" : it ? `\n    at (${it}:${t + 1}:${n})` : `${e}line ${t + 1}: ${rt[t]}`, ht = () => { it = "", rt = nt; }, dt = /[ \t]/, pt = G `
	^${dt}+`.valueOf(), { exec: gt } = G.s `
	^
	(
		(?:\d\d\d\d-\d\d-\d\d \d)?
		[\w\-+.:]+
	)
	${dt}*
	(.*)
	$`.valueOf(), { exec: bt } = G.s `
	^
	'([^']*)'
	${dt}*
	(.*)`.valueOf(), { exec: yt } = G.s `
	^
	(.*?)
	'''('{0,2})
	${dt}*
	(.*)`.valueOf(), { exec: wt } = G.s `
	^
	(.*?)
	'''()
	${dt}*
	(.*)`.valueOf();
let mt = wt;
const xt = G.s `
	^
	.
	${dt}*`.valueOf(), Tt = /[^\x00-\x1F"#'()<>[\\\]`{}\x7F]+/, { exec: vt } = G.s `
	^
	${dt}*
	=
	${dt}*
	(?:
		<(${Tt})>
		${dt}*
	)?
	(.*)
	$`.valueOf(), { exec: Ot } = G.s `
	^
	<(${Tt})>
	${dt}*
	(.*)
	$`.valueOf(), { exec: $t } = G.s `
	^
	<(${Tt})>
	${dt}*
	(.*)
	$`.valueOf(), Ft = W(/[^\\"]+|\\.?|"(?!"")"?/sy), It = e => { let t = 0; for (; Ft.test(e);)
    t = Ft.lastIndex; return t; }, St = /[^\\\x00-\x08\x0B-\x1F\x7F]+|\\(?:[btnfr"\\]|[\t ]*\n[\t\n ]*|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8})/g, kt = /[^\\\x00-\x09\x0B-\x1F\x7F]+|\\(?:[btnfr"\\]|[\t ]*\n[\t\n ]*|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8})/g, Lt = /[^\\\x00-\x09\x0B-\x1F]+|\\(?:[btnfr"\\]|[\t ]*\n[\t\n ]*|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8})/g, Mt = /[^\\\x00-\x09\x0B-\x1F]+|\\(?:[btnfr"\\/]|[\t ]*\n[\t\n ]*|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8})/g;
let At = St;
const Bt = e => !e.replace(At, ""), Ut = W(/[^\\"\x00-\x08\x0B-\x1F\x7F]+|\\(?:[btnfr"\\]|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8})/y), Dt = W(/[^\\"\x00-\x08\x0B-\x1F\x7F]+|\\(?:[btnfr"\\]|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8})/y), jt = W(/[^\\"\x00-\x08\x0B-\x1F]+|\\(?:[btnfr"\\]|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8})/y), Ct = W(/[^\\"\x00-\x08\x0B-\x1F]+|\\(?:[btnfr"\\/]|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8})/y);
let _t = Ct;
const Nt = e => { let n = _t.lastIndex = 1; for (; _t.test(e);)
    n = _t.lastIndex; return n !== e.length && '"' === e[n] || lt(t("Bad basic string" + ft(" at "))), n; }, { test: Et } = W(/^[ \t]*\./), Pt = /^[ \t]*\.[ \t]*/, { exec: Kt } = W(/^[\w-]+/), { exec: Wt } = W(/^[^ \t#=[\]'".]+(?:[ \t]+[^ \t#=[\]'".]+)*/);
let Rt = Wt;
const { exec: Zt } = W(/^'[^'\x00-\x08\x0B-\x1F\x7F]*'/), { exec: qt } = W(/^'[^'\x00-\x08\x0B-\x1F]*'/);
let Ht = qt, zt = !0;
const Yt = (e, n) => { const i = "[" === e[1]; i ? (zt || lt(t("Array of Tables is not allowed before TOML v0.2" + ft(", which at "))), e = e.slice(2)) : e = e.slice(1), e = e.replace(pt, ""); const { leadingKeys: r, finalKey: s } = ({ lineRest: e } = n(e)); let a; return (e = e.replace(pt, "")) && "]" === e[0] || lt(t("Table header is not closed" + ft(", which is found at "))), (e.length > 1 ? "]" === e[1] === i : !i) || lt(t("Square brackets of Table definition statement not match" + ft(" at "))), (e = e.slice(i ? 2 : 1).replace(pt, "")) && "<" === e[0] ? ({ 1: a, 2: e } = $t(e) || lt(t("Bad tag" + ft(" at ")))) : a = "", { leadingKeys: r, finalKey: s, asArrayItem: i, tag: a, lineRest: e }; }, { test: Jt } = W(/[\x00-\x08\x0B-\x1F\x7F]/), { test: Vt } = W(/[\x00-\x08\x0B-\x1F]/);
let Gt = Jt;
const Xt = G `
	(?:
		0
		(?:
			b[01][_01]*
		|
			o[0-7][_0-7]*
		|
			x[\dA-Fa-f][_\dA-Fa-f]*
		|
			(?:\.\d[_\d]*)?(?:[Ee]-?\d[_\d]*)?
		)
	|
		[1-9][_\d]*
		(?:\.\d[_\d]*)?(?:[Ee]-?\d[_\d]*)?
	|
		inf
	|
		nan
	)
`.valueOf(), { test: Qt } = G `
	^(?:
		-?${Xt}
		(?:-${Xt})*
	|
		true
	|
		false
	)$
`.valueOf(), { test: en } = G `_(?![\dA-Fa-f])`.valueOf(), tn = e => Qt(e) && !en(e);
let nn = !0, rn = "", sn = null, an = !0, ln = 0, on = 0;
const cn = { test: () => !0 }, un = class extends l {
    constructor(e) { super(`^${ne(e)}$`); let t = -1; for (let n = e.length; n;) {
        const { length: i } = e[--n];
        i > t && (t = i);
    } return this.lastIndex = t + 1, this; }
    test(e) { return e.length < this.lastIndex && super.test(e); }
}, fn = g.bind(p(un.prototype));
let hn, dn, pn, gn, bn, yn, wn, mn, xn, Tn, vn, On, $n, Fn = cn;
const In = new o, Sn = c.bind(In), kn = u.bind(In), Ln = () => { const e = t => { const n = Sn(t); return n ? n === e || lt(i("Types in Array must be same" + ft(". Check "))) : kn(t, e), t; }; return e; }, Mn = { asNulls: Ln(), asStrings: Ln(), asTables: Ln(), asArrays: Ln(), asBooleans: Ln(), asFloats: Ln(), asIntegers: Ln(), asOffsetDateTimes: Ln(), asLocalDateTimes: Ln(), asLocalDates: Ln(), asLocalTimes: Ln() }, An = e => e;
let Bn, Un, Dn, jn, Cn, _n, Nn, En, Pn, Kn, Wn, Rn = null, Zn = null;
const qn = (e, t, n, i) => { const r = f(b); r._linked = Zn, r.tag = e, n && (r.table = n, r.key = i), t && (r.array = t, r.index = t.length), Zn = r; }, Hn = () => { throw lt(t("xOptions.tag is not enabled, but found tag syntax" + ft(" at "))); };
let zn = Hn;
const Yn = (e, t, l, o, c, u) => { let f; switch (rn = u, e) {
    case 1:
        nn = f = gn = wn = pn = !0, dn = bn = !1;
        break;
    case .5:
        nn = gn = wn = pn = !0, f = dn = bn = !1;
        break;
    case .4:
        nn = bn = pn = !0, f = dn = gn = wn = !1;
        break;
    case .3:
        nn = bn = !0, f = dn = gn = wn = pn = !1;
        break;
    case .2:
    case .1:
        dn = bn = !0, nn = f = gn = wn = pn = !1;
        break;
    default: throw n("TOML.parse(,specificationVersion)");
} if ((e => { switch (e) {
    case 1:
        mt = yt, Ht = Zt, Gt = Jt, At = St, _t = Ut, Rt = Kt, zt = !0;
        break;
    case .5:
        mt = wt, Ht = Zt, Gt = Jt, At = kt, _t = Dt, Rt = Kt, zt = !0;
        break;
    case .4:
        mt = wt, Ht = qt, Gt = Vt, At = Lt, _t = jt, Rt = Kt, zt = !0;
        break;
    default: mt = wt, Ht = qt, Gt = Vt, At = Mt, _t = Ct, Rt = Wt, zt = !1;
} })(e), "string" == typeof t)
    sn = t;
else {
    if (t !== s)
        throw i(`TOML.parse(${rn ? `${rn}multilineStringJoiner` : ",{ joiner }"})`);
    sn = null;
} if (l === s || !0 === l)
    an = !0;
else if (!1 === l)
    an = !1;
else {
    if ("number" != typeof l)
        throw i(`TOML.parse(${rn ? `${rn},useBigInt` : ",{ bigint }"})`);
    if (!h(l))
        throw n(`TOML.parse(${rn ? `${rn},useBigInt` : ",{ bigint }"})`);
    an = null, l >= 0 ? ln = -(on = l) : on = -(ln = l) - 1;
} if (!a && !1 !== an)
    throw r(`Can't work without TOML.parse(${rn ? `${rn},useBigInt` : ",{ bigint }"}) being set to false, because the host doesn't have BigInt support`); if (null == o)
    Fn = cn;
else {
    if (!fn(o))
        throw i("TOML.parse(,{ keys })");
    Fn = o;
} if (null == c)
    mn = et, yn = xn = Tn = vn = !1, zn = Hn;
else {
    if ("object" != typeof c)
        throw i(`TOML.parse(${rn ? `${rn},,xOptions` : ",{ x }"})`);
    {
        const { order: e, longer: t, exact: n, null: r, multi: s, comment: a, string: l, literal: o, tag: u, ...h } = c, p = d(h);
        if (p.length)
            throw i(`TOML.parse(${rn ? `${rn},,{ ${p.join(", ")} }` : `,{ x: { ${p.join(", ")} } }`})`);
        if (mn = e ? tt : et, xn = !t, yn = !!n, Tn = !!r, vn = !!s, On = !!a, $n = !!l, hn = !!o, u) {
            if ("function" != typeof u)
                throw i(`TOML.parse(${rn ? `${rn},,{ tag }` : ",{ x: { tag } }"})`);
            if (!f)
                throw i(`TOML.parse(${rn ? `${rn},,xOptions` : ",{ x }"}) xOptions.tag needs at least TOML 1.0 to support mixed type array`);
            Rn = u, zn = qn;
        }
        else
            zn = Hn;
    }
} f ? Bn = Un = Dn = jn = Cn = _n = Nn = En = Pn = Kn = Wn = An : ({ asNulls: Bn, asStrings: Un, asTables: Dn, asArrays: jn, asBooleans: Cn, asFloats: _n, asIntegers: Nn, asOffsetDateTimes: En, asLocalDateTimes: Pn, asLocalDates: Kn, asLocalTimes: Wn } = Mn); }, Jn = ArrayBuffer.isView, Vn = function () { if ("function" == typeof ArrayBuffer) {
    var e = U.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get);
    return function (t) { try {
        e(t);
    }
    catch (e) {
        return !1;
    } return !0; };
} return function () { return !1; }; }(), Gn = TextDecoder, Xn = Symbol, Qn = Xn("previous"), ei = e => { let t = e, n = t.next(); if (!n.done)
    for (n.value[Qn] = t, n = (t = n.value).next();;)
        if (n.done) {
            if (t === e)
                break;
            t = t[Qn], n = t.next(n.value);
        }
        else
            n.value[Qn] = t, n = (t = n.value).next(); return n.value; }, ti = Xn("_literal"), ni = (e, t) => { const n = F(t); return n[ti] = e, n; }, ii = new ae, ri = oe.bind(ii), si = le.bind(ii), ai = new ae, li = oe.bind(ai), oi = le.bind(ai), ci = e => { const t = []; return ri(t), e && li(t), t; }, ui = Date, fi = Date.parse, hi = Object.preventExtensions, di = Object.getOwnPropertyDescriptors, pi = function (e, t) { for (var n = f(b), i = ue(t), r = i.length, s = 0; s < r; ++s) {
    var a = i[s];
    n[a] = _(t[a]);
} if (fe) {
    var l = fe(t);
    for (r = l.length, s = 0; s < r; ++s) {
        var o = l[s];
        D(t, o) && (n[o] = _(t[o]));
    }
} return pe(e, n); }, gi = e => (p(p(e).prototype), e), bi = /(?:0[1-9]|[12]\d|30)/, yi = /(?:0[1-9]|[12]\d|3[01])/, wi = /(?:[01]\d|2[0-3])/, mi = /[0-5]\d/, xi = G `
	\d\d\d\d-
	(?:
		0
		(?:
			[13578]-${yi}
			|
			[469]-${bi}
			|
			2-${/(?:0[1-9]|1\d|2\d)/}
		)
		|
		1
		(?:
			[02]-${yi}
			|
			1-${bi}
		)
	)
`.valueOf(), Ti = G `
	${wi}:${mi}:${mi}
`.valueOf(), { exec: vi } = W(/(([+-])\d\d):(\d\d)$/), { exec: Oi } = G `
	^
	${xi}
	[Tt ]
	${Ti}
	(?:\.\d{1,3}(\d*?)0*)?
	(?:[Zz]|[+-]${wi}:${mi})
	$`.valueOf(), { exec: $i } = G `
	^
	${xi}
	[Tt ]
	${Ti}
	()
	[Zz]
	$`.valueOf(), { test: Fi } = G `
	^
	${xi}
	[Tt ]
	${Ti}
	(?:\.\d+)?
	$`.valueOf(), { test: Ii } = G `
	^
	${xi}
	$`.valueOf(), { test: Si } = G `
	^
	${Ti}
	(?:\.\d+)?
	$`.valueOf(), ki = /[ t]/, Li = /[-T:.]/g, Mi = /\.?0+$/, Ai = /\.(\d*?)0+$/, Bi = (e, t) => t, Ui = (() => { const e = function () { return this; }, t = he(null); {
    const e = he(null);
    for (const n of me(ui.prototype))
        "constructor" === n || "toJSON" === n || (t[n] = e);
} return e.prototype = hi(f(ui.prototype, t)), p(e); })(), Di = e => e.replace(Ai, Bi).replace(Li, ""), ji = /./gs, Ci = e => "          "[e], _i = e => { if (e.startsWith("02-29", 5)) {
    const t = +e.slice(0, 4);
    return !(3 & t) && (!!(t % 100) || !(t % 400) && !!(t % 3200));
} return !0; }, { test: Ni } = G.s `^.....(?:06.30|12.31).23:59:59`.valueOf(), Ei = pi(new ui(0), di(ui.prototype)), Pi = Xn("OffsetDateTime_ISOString"), Ki = Xn("OffsetDateTime_value"), Wi = (e, t = 0) => (Ei.setTime(+e[Ki] + t), Ei), Ri = gi(class extends Ui {
    get [Xn.toStringTag]() { return "OffsetDateTime"; }
    valueOf() { return this[Ki]; }
    toISOString() { return this[Pi]; }
    constructor(e) { _i(e) || lt(t(`Invalid Offset Date-Time ${e}` + ft(" at "))); const n = e.startsWith("60", 17); let i = n ? e.slice(0, 17) + "59" + e.slice(19) : e; const { 1: r = "" } = (dn ? $i(i) : Oi(i)) || lt(t(`Invalid Offset Date-Time ${e}` + ft(" at "))), s = fi(i = i.replace(ki, "T").replace("z", "Z")); return n && (Ei.setTime(s), Ni(Ei.toISOString()) || lt(t(`Invalid Offset Date-Time ${e}` + ft(" at ")))), super(), this[Pi] = i, this[Ki] = ((e, t) => e < 0 ? ("" + (e + 6216730554e4)).replace(ji, Ci).padStart(14, " ") + t.replace(ji, Ci) + e : t ? (e + ".").padStart(16, "0") + t : ("" + e).padStart(15, "0"))(s, r), this; }
    getUTCFullYear() { return Wi(this).getUTCFullYear(); }
    getUTCMonth() { return Wi(this).getUTCMonth(); }
    getUTCDate() { return Wi(this).getUTCDate(); }
    getUTCHours() { return Wi(this).getUTCHours(); }
    getUTCMinutes() { return Wi(this).getUTCMinutes(); }
    getUTCSeconds() { return Wi(this).getUTCSeconds(); }
    getUTCMilliseconds() { return Wi(this).getUTCMilliseconds(); }
    getUTCDay() { return Wi(this).getUTCDay(); }
    getTimezoneOffset() { const e = vi(this[Pi]); return e ? 60 * +e[1] + +(e[2] + e[3]) : 0; }
    getTime() { return I(+this[Ki]); }
}), Zi = Xn("LocalDateTime_ISOString"), qi = Xn("LocalDateTime_value"), Hi = (e, t, n) => +e[Zi].slice(t, n), zi = (e, t, i, r) => { const s = "" + r, a = i - t; if (s.length > a)
    throw n(); e[qi] = Di(e[Zi] = e[Zi].slice(0, t) + s.padStart(a, "0") + e[Zi].slice(i)); }, Yi = gi(class extends Ui {
    get [Xn.toStringTag]() { return "LocalDateTime"; }
    valueOf() { return this[qi]; }
    toISOString() { return this[Zi]; }
    constructor(e) { return Fi(e) && _i(e) || lt(t(`Invalid Local Date-Time ${e}` + ft(" at "))), super(), this[qi] = Di(this[Zi] = e.replace(ki, "T")), this; }
    getFullYear() { return Hi(this, 0, 4); }
    setFullYear(e) { zi(this, 0, 4, e); }
    getMonth() { return Hi(this, 5, 7) - 1; }
    setMonth(e) { zi(this, 5, 7, e + 1); }
    getDate() { return Hi(this, 8, 10); }
    setDate(e) { zi(this, 8, 10, e); }
    getHours() { return Hi(this, 11, 13); }
    setHours(e) { zi(this, 11, 13, e); }
    getMinutes() { return Hi(this, 14, 16); }
    setMinutes(e) { zi(this, 14, 16, e); }
    getSeconds() { return Hi(this, 17, 19); }
    setSeconds(e) { zi(this, 17, 19, e); }
    getMilliseconds() { return +this[qi].slice(14, 17).padEnd(3, "0"); }
    setMilliseconds(e) { this[qi] = Di(this[Zi] = this[Zi].slice(0, 19) + (e ? ("." + ("" + e).padStart(3, "0")).replace(Mi, "") : "")); }
}), Ji = Xn("LocalDate_ISOString"), Vi = Xn("LocalDate_value"), Gi = (e, t, n) => +e[Ji].slice(t, n), Xi = (e, t, i, r) => { const s = "" + r, a = i - t; if (s.length > a)
    throw n(); e[Vi] = Di(e[Ji] = e[Ji].slice(0, t) + s.padStart(a, "0") + e[Ji].slice(i)); }, Qi = gi(class extends Ui {
    get [Xn.toStringTag]() { return "LocalDate"; }
    valueOf() { return this[Vi]; }
    toISOString() { return this[Ji]; }
    constructor(e) { return Ii(e) && _i(e) || lt(t(`Invalid Local Date ${e}` + ft(" at "))), super(), this[Vi] = Di(this[Ji] = e), this; }
    getFullYear() { return Gi(this, 0, 4); }
    setFullYear(e) { Xi(this, 0, 4, e); }
    getMonth() { return Gi(this, 5, 7) - 1; }
    setMonth(e) { Xi(this, 5, 7, e + 1); }
    getDate() { return Gi(this, 8, 10); }
    setDate(e) { Xi(this, 8, 10, e); }
}), er = Xn("LocalTime_ISOString"), tr = Xn("LocalTime_value"), nr = (e, t, n) => +e[er].slice(t, n), ir = (e, t, i, r) => { const s = "" + r, a = i - t; if (s.length > a)
    throw n(); e[tr] = Di(e[er] = e[er].slice(0, t) + s.padStart(2, "0") + e[er].slice(i)); }, rr = gi(class extends Ui {
    get [Xn.toStringTag]() { return "LocalTime"; }
    valueOf() { return this[tr]; }
    toISOString() { return this[er]; }
    constructor(e) { return Si(e) || lt(t(`Invalid Local Time ${e}` + ft(" at "))), super(), this[tr] = Di(this[er] = e), this; }
    getHours() { return nr(this, 0, 2); }
    setHours(e) { ir(this, 0, 2, e); }
    getMinutes() { return nr(this, 3, 5); }
    setMinutes(e) { ir(this, 3, 5, e); }
    getSeconds() { return nr(this, 6, 8); }
    setSeconds(e) { ir(this, 6, 8, e); }
    getMilliseconds() { return +this[tr].slice(6, 9).padEnd(3, "0"); }
    setMilliseconds(e) { this[tr] = Di(this[er] = this[er].slice(0, 8) + (e ? ("." + ("" + e).padStart(3, "0")).replace(Mi, "") : "")); }
}), sr = parseInt, ar = String.fromCodePoint, lr = /[^\\]+|\\(?:[\\"btnfr/]|u.{4}|U.{8})/gs, or = /[^\n\\]+|\n|\\(?:[\t ]*\n[\t\n ]*|[\\"btnfr/]|u.{4}|U.{8})/gs, cr = e => { if (!e)
    return ""; const t = e.match(lr), { length: i } = t; let r = 0; do {
    const e = t[r];
    if ("\\" === e[0])
        switch (e[1]) {
            case "\\":
                t[r] = "\\";
                break;
            case '"':
                t[r] = '"';
                break;
            case "b":
                t[r] = "\b";
                break;
            case "t":
                t[r] = "\t";
                break;
            case "n":
                t[r] = "\n";
                break;
            case "f":
                t[r] = "\f";
                break;
            case "r":
                t[r] = "\r";
                break;
            case "u":
                const i = sr(e.slice(2), 16);
                nn && 55295 < i && i < 57344 && lt(n(`Invalid Unicode Scalar ${e}` + ft(" at "))), t[r] = L(i);
                break;
            case "U":
                const s = sr(e.slice(2), 16);
                (nn && 55295 < s && s < 57344 || 1114111 < s) && lt(n(`Invalid Unicode Scalar ${e}` + ft(" at "))), t[r] = ar(s);
                break;
            case "/": t[r] = "/";
        }
} while (++r !== i); return t.join(""); }, ur = (e, t, i) => { if (!e)
    return ""; const r = e.match(or), { length: s } = r; let a = 0; do {
    const e = r[a];
    if ("\n" === e)
        ++i, r[a] = t;
    else if ("\\" === e[0])
        switch (e[1]) {
            case "\n":
            case " ":
            case "\t":
                for (let t = 0; t = e.indexOf("\n", t) + 1;)
                    ++i;
                r[a] = "";
                break;
            case "\\":
                r[a] = "\\";
                break;
            case '"':
                r[a] = '"';
                break;
            case "b":
                r[a] = "\b";
                break;
            case "t":
                r[a] = "\t";
                break;
            case "n":
                r[a] = "\n";
                break;
            case "f":
                r[a] = "\f";
                break;
            case "r":
                r[a] = "\r";
                break;
            case "u":
                const t = sr(e.slice(2), 16);
                nn && 55295 < t && t < 57344 && lt(n(`Invalid Unicode Scalar ${e}` + ft(" at ", at + i))), r[a] = L(t);
                break;
            case "U":
                const s = sr(e.slice(2), 16);
                (nn && 55295 < s && s < 57344 || 1114111 < s) && lt(n(`Invalid Unicode Scalar ${e}` + ft(" at ", at + i))), r[a] = ar(s);
                break;
            case "/": r[a] = "/";
        }
} while (++a !== s); return r.join(""); }, fr = /[-+]?(?:0|[1-9][_\d]*)/, { test: hr } = G `_(?!\d)`.valueOf(), { test: dr } = G `^${fr}$`.valueOf(), { test: pr } = W(/^0(?:x[\dA-Fa-f][_\dA-Fa-f]*|o[0-7][_0-7]*|b[01][_01]*)$/), { test: gr } = G `_(?![\dA-Fa-f])`.valueOf(), br = /_/g, yr = /_|^[-+]/g, wr = e => (dr(e) || pr(e)) && !gr(e), mr = a && -a("0x8000000000000000"), xr = a && a("0x7FFFFFFFFFFFFFFF"), Tr = e => { if (!0 === an)
    return (e => { wr(e) || lt(t(`Invalid Integer ${e}` + ft(" at "))); const i = "-" === e[0] ? -a(e.replace(yr, "")) : a(e.replace(yr, "")); return xn || mr <= i && i <= xr || lt(n(`Integer expect 64 bit range (-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807), not includes ${e}` + ft(" meet at "))), i; })(e); if (!1 === an)
    return (e => { wr(e) || lt(t(`Invalid Integer ${e}` + ft(" at "))); const i = sr(e.replace(br, "")); return h(i) || lt(n(`Integer did not use BitInt must fit Number.isSafeInteger, not includes ${e}` + ft(" meet at "))), i; })(e); wr(e) || lt(t(`Invalid Integer ${e}` + ft(" at "))); const i = sr(e.replace(br, "")); if (ln <= i && i <= on)
    return i; const r = "-" === e[0] ? -a(e.replace(yr, "")) : a(e.replace(yr, "")); return xn || mr <= r && r <= xr || lt(n(`Integer expect 64 bit range (-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807), not includes ${e}` + ft(" meet at "))), r; }, vr = isFinite, Or = NaN, $r = -1 / 0, { test: Fr } = G `
	^
	${fr}
	(?:
		\.\d[_\d]*
		(?:[eE][-+]?\d[_\d]*)?
	|
		[eE][-+]?\d[_\d]*
	)
	$`.valueOf(), Ir = /_/g, { test: Sr } = W(/^[-+]?0(?:\.0+)?(?:[eE][-+]?0+)?$/), { exec: kr } = W(/^[-0]?(\d*)(?:\.(\d+))?(?:e\+?(-?\d+))?$/), { exec: Lr } = W(/^[-+]?0?(\d*)(?:\.(\d*?)0*)?(?:[eE]\+?(-?\d+))?$/), Mr = e => { if (!Fr(e) || hr(e)) {
    if (wn) {
        if ("inf" === e || "+inf" === e)
            return k;
        if ("-inf" === e)
            return $r;
        if ("nan" === e || "+nan" === e)
            return Or;
        if ("-nan" === e)
            return NaN;
    }
    else if (!yn) {
        if ("inf" === e || "+inf" === e)
            return k;
        if ("-inf" === e)
            return $r;
    }
    throw lt(t(`Invalid Float ${e}` + ft(" at ")));
} const i = e.replace(Ir, ""), r = +i; if (yn) {
    vr(r) || lt(n(`Float ${e} has been as big as inf` + ft(" at "))), r || Sr(i) || lt(n(`Float ${e} has been as little as ${"-" === e[0] ? "-" : ""}0` + ft(" at ")));
    const { 1: t, 2: s = "", 3: a = "" } = kr(r), { 1: l, 2: o = "", 3: c = "" } = Lr(i);
    l + o === t + s && c - o.length == a - s.length || lt(n(`Float ${e} has lost its exact and been ${r}` + ft(" at ")));
} return r; }, Ar = (e, t) => { const { length: n } = t; let i = 0; for (; i < n;) {
    const s = t[i++];
    if (!(s in e)) {
        for (e = e[s] = new mn(Je); i < n;)
            e = e[t[i++]] = new mn(Je);
        return e;
    }
    if (e = e[s], Ze(e))
        De(e) && lt(r("Trying to define Table under Inline Table" + ft(" at ")));
    else {
        if (!si(e))
            throw lt(r("Trying to define Table under non-Table value" + ft(" at ")));
        oi(e) && lt(r("Trying to append value to Static Array" + ft(" at "))), e = e[e.length - 1];
    }
} return e; }, Br = (e, t, n, i) => { let s; if (n) {
    let n;
    t in e ? si(n = e[t]) && !oi(n) || lt(r("Trying to push Table to non-ArrayOfTables value" + ft(" at "))) : n = e[t] = ci(false), i && zn(i, n, e, t), n[n.length] = s = new mn(Ye);
}
else
    t in e ? (s = e[t], Xe(s) && lt(r("A table defined implicitly via key/value pair can not be accessed to via []" + ft(", which at "))), (e => !!ze(e) && (Pe(e), !0))(s) || lt(r("Duplicate Table definition" + ft(" at ")))) : e[t] = s = new mn(Ye), i && zn(i, null, e, t); return s; }, Ur = (e, t) => { const { length: n } = t; let i = 0; for (; i < n;) {
    const s = t[i++];
    if (!(s in e)) {
        for (e = e[s] = new mn(Je, Qe); i < n;)
            e = e[t[i++]] = new mn(Je, Qe);
        return e;
    }
    e = e[s], Ze(e) || lt(r("Trying to assign property through non-Table value" + ft(" at "))), De(e) && lt(r("Trying to assign property through static Inline Table" + ft(" at "))), Xe(e) || lt(r("A table defined implicitly via [] can not be accessed to via key/value pair" + ft(", which at ")));
} return e; }, Dr = e => (Gt(e) && lt(t("Control characters other than Tab are not permitted in a Literal String" + ft(", which was found at "))), e), jr = (e, n, i) => { if (!i.startsWith("'''")) {
    const r = bt(i) || lt(t("Bad literal string" + ft(" at "))), s = Dr(r[1]);
    return e[n] = hn ? ni(i.slice(0, s.length + 2), s) : s, r[2];
} const r = mt(i.slice(3)); if (r) {
    const t = Dr(r[1]) + r[2];
    return e[n] = hn ? ni(i.slice(0, t.length + 6), t) : t, r[3];
} const s = new ut("Multi-line Literal String", i.length), a = !(i = i.slice(3)); if (a) {
    i = s.must();
    const t = mt(i);
    if (t) {
        const r = Dr(t[1]) + t[2];
        return e[n] = hn ? ni(["'''", i.slice(0, r.length + 3)], r) : r, t[3];
    }
} null === sn && s.nowrap(rn); for (const t = [Dr(i)];;) {
    const r = s.must(), l = mt(r);
    if (l) {
        t[t.length] = Dr(l[1]) + l[2];
        const r = t.join(sn);
        return hn ? (t[t.length - 1] += "'''", a ? t.unshift("'''") : t[0] = `'''${i}`, e[n] = ni(t, r)) : e[n] = r, l[3];
    }
    t[t.length] = Dr(r);
} }, Cr = (e, n, i) => { if (!i.startsWith('"""')) {
    const t = Nt(i), r = cr(i.slice(1, t));
    return e[n] = hn ? ni(i.slice(0, t + 1), r) : r, i.slice(t + 1).replace(pt, "");
} let r = 3 + It(i.slice(3)); if (i.length !== r) {
    const s = i.slice(3, r);
    Bt(s) || lt(t("Bad multi-line basic string" + ft(" at ")));
    const a = cr(s) + (i.startsWith('"', r += 3) ? i.startsWith('"', ++r) ? (++r, '""') : '"' : "");
    return e[n] = hn ? ni(i.slice(0, r), a) : a, i.slice(r).replace(pt, "");
} const s = new ut("Multi-line Basic String", r), a = (i = i.slice(3)) ? 0 : 1; if (a) {
    i = s.must();
    let r = It(i);
    if (i.length !== r) {
        const s = i.slice(0, r);
        Bt(s) || lt(t("Bad multi-line basic string" + ft(" at ")));
        const l = ur(s, sn, a) + (i.startsWith('"', r += 3) ? i.startsWith('"', ++r) ? (++r, '""') : '"' : "");
        return e[n] = hn ? ni(['"""', i.slice(0, r)], l) : l, i.slice(r).replace(pt, "");
    }
} null === sn && s.nowrap(rn), Bt(i + "\n") || lt(t("Bad multi-line basic string" + ft(" at "))); for (const r = [i];;) {
    const l = s.must();
    let o = It(l);
    if (l.length !== o) {
        const s = l.slice(0, o);
        Bt(s) || lt(t("Bad multi-line basic string" + ft(" at ")));
        const c = ur(r.join("\n") + "\n" + s, sn, a) + (l.startsWith('"', o += 3) ? l.startsWith('"', ++o) ? (++o, '""') : '"' : "");
        return hn ? (a ? r.unshift('"""') : r[0] = `"""${i}`, r[r.length] = `${s}"""`, e[n] = ni(r, c)) : e[n] = c, l.slice(o).replace(pt, "");
    }
    Bt(l + "\n") || lt(t("Bad multi-line basic string" + ft(" at "))), r[r.length] = l;
} }, _r = he(null), Nr = e => _r[e] || (_r[e] = Xn(e)), Er = Xn("this"), { test: Pr } = W(/\r?\n/g), Kr = (e, n) => { if (n in e) {
    const r = e[n];
    if ("string" != typeof r)
        throw i(`the value of comment must be a string, while "${null === r ? "null" : typeof r}" type is found`);
    if (Pr(r))
        throw t("the value of comment must be a string and can not include newline");
    return ` #${r}`;
} return ""; }, Wr = (e, t) => t in _r ? Kr(e, _r[t]) : "", { test: Rr } = W(/(?:[Zz]|[+-]\d\d:\d\d)$/), { test: Zr } = W(/^\[[\t ]*]/), qr = e => { let n = e; const i = []; let s = -1; for (;;) {
    if (n || lt(t("Empty bare key" + ft(" at "))), '"' === n[0]) {
        const e = Nt(n);
        Fn.test(i[++s] = cr(n.slice(1, e))) || lt(r("Key not allowed" + ft(" at "))), n = n.slice(e + 1);
    }
    else {
        const e = "'" === n[0], a = ((e ? Ht : Rt)(n) || lt(t(`Bad ${e ? "literal string" : "bare"} key` + ft(" at "))))[0];
        n = n.slice(a.length), Fn.test(i[++s] = e ? a.slice(1, -1) : a) || lt(r("Key not allowed" + ft(" at ")));
    }
    if (!Et(n))
        break;
    n = n.replace(Pt, "");
} if ($n) {
    const i = e.slice(0, -n.length);
    (tn(i) || Tn && "null" === i) && lt(t("Bad bare key disabled by xOptions.string" + ft(" at ")));
} if (bn) {
    let e = s;
    do {
        i[e] || lt(t("Empty key is not allowed before TOML v0.5" + ft(", which at ")));
    } while (e--);
} const a = i[s]; return i.length = s, { leadingKeys: i, finalKey: a, lineRest: n }; }, Hr = (e, n) => { if ("<" === n[0]) {
    const { 1: i } = ({ 2: n } = Ot(n) || lt(t("Bad tag " + ft(" at "))));
    switch (zn(i, e, null), n && n[0]) {
        case ",":
        case "]":
        case "":
        case "#": return e[e.length] = s, n;
    }
} switch (n[0]) {
    case "'": return jr(Un(e), e.length, n);
    case '"': return Cr(Un(e), e.length, n);
    case "{": return pn || lt(t("Inline Table is not allowed before TOML v0.4" + ft(", which at "))), Yr(Dn(e), e.length, n);
    case "[": return zr(jn(e), e.length, n);
} const { 1: i } = ({ 2: n } = gt(n) || lt(t("Bad atom value" + ft(" at ")))); return "true" === i ? Cn(e)[e.length] = !0 : "false" === i ? Cn(e)[e.length] = !1 : Tn && "null" === i ? Bn(e)[e.length] = null : i.includes(":") ? i.includes("-") ? Rr(i) ? En(e)[e.length] = new Ri(i) : (gn || lt(t("Local Date-Time is not allowed before TOML v0.5" + ft(", which at "))), Pn(e)[e.length] = new Yi(i)) : (gn || lt(t("Local Time is not allowed before TOML v0.5" + ft(", which at "))), Wn(e)[e.length] = new rr(i)) : i.indexOf("-") !== i.lastIndexOf("-") && "-" !== i[0] ? (gn || lt(t("Local Date is not allowed before TOML v0.5" + ft(", which at "))), Kn(e)[e.length] = new Qi(i)) : i.includes(".") || i.includes("n") || (i.includes("e") || i.includes("E")) && !i.startsWith("0x") ? _n(e)[e.length] = hn ? ni(i, Mr(i)) : Mr(i) : Nn(e)[e.length] = hn ? ni(i, Tr(i)) : Tr(i), n; }, zr = function* (e, n, i) { const r = e[n] = ci(true); if (Zr(i))
    return Ce(r, "]" === i[1] ? 0 : 3), i.slice(i.indexOf("]")).replace(xt, ""); const s = new ut("Static Array", i.length); let a = i.startsWith("[ ") || i.startsWith("[\t") ? 3 : 0; for (i = i.replace(xt, ""); !i || "#" === i[0];)
    a = null, i = s.must().replace(pt, ""); if ("]" === i[0])
    return null === a || Ce(r, a), i.replace(xt, ""); for (;;) {
    const e = Hr(r, i);
    for (i = "string" == typeof e ? e : yield e; !i || "#" === i[0];)
        a = null, i = s.must().replace(pt, "");
    if ("," !== i[0]) {
        if ("]" === i[0])
            break;
        throw lt(t("Unexpect character in static array item value" + ft(", which is found at ")));
    }
    for (i = i.replace(xt, ""); !i || "#" === i[0];)
        a = null, i = s.must().replace(pt, "");
    if ("]" === i[0])
        break;
} return null === a || Ce(r, a), i.replace(xt, ""); }, Yr = function* (e, n, i) { const r = e[n] = new mn(Ye, true); if (vn) {
    const e = new ut("Inline Table", i.length);
    i = i.replace(xt, "");
    let t = !0;
    for (;;) {
        for (; !i || "#" === i[0];)
            t = !1, i = e.must().replace(pt, "");
        if ("}" === i[0])
            break;
        const n = Jr(r, i), s = Vr(n);
        if (i = "string" == typeof s ? s : yield s) {
            if ("#" === i[0]) {
                On && (n.table[Nr(n.finalKey)] = i.slice(1)), t = !1;
                do {
                    i = e.must().replace(pt, "");
                } while (!i || "#" === i[0]);
            }
        }
        else {
            t = !1;
            do {
                i = e.must().replace(pt, "");
            } while (!i || "#" === i[0]);
        }
        "," === i[0] && (i = i.replace(xt, ""));
    }
    t || Ce(r, !1);
}
else if ("}" !== (i = i.replace(xt, "") || lt(t("Inline Table is intended to appear on a single line" + ft(", which broken at "))))[0])
    for (;;) {
        "#" === i[0] && lt(t("Inline Table is intended to appear on a single line" + ft(", which broken at ")));
        const e = Vr(Jr(r, i));
        if ("}" === (i = ("string" == typeof e ? e : yield e) || lt(t("Inline Table is intended to appear on a single line" + ft(", which broken at "))))[0])
            break;
        "," === i[0] && "}" === (i = i.replace(xt, "") || lt(t("Inline Table is intended to appear on a single line" + ft(", which broken at "))))[0] && lt(t("The last property of an Inline Table can not have a trailing comma" + ft(", which was found at ")));
    } return i.replace(xt, ""); }, Jr = (e, n) => { const { leadingKeys: i, finalKey: r, tag: s } = ({ lineRest: n } = (({ leadingKeys: e, finalKey: n, lineRest: i }) => { const { 1: r = "" } = ({ 2: i } = vt(i) || lt(t("Keys must equal something" + ft(", but missing at ")))); return r || i && "#" !== i[0] || lt(t("Value can not be missing after euqal sign" + ft(", which is found at "))), { leadingKeys: e, finalKey: n, tag: r, lineRest: i }; })(qr(n))); return { table: Ur(e, i), finalKey: r, tag: s, lineRest: n }; }, Vr = ({ finalKey: e, tag: n, lineRest: i, table: a }) => { if (e in a && lt(r("Duplicate property definition" + ft(" at "))), n)
    switch (zn(n, null, a, e), i && i[0]) {
        case ",":
        case "}":
        case "":
        case "#": return a[e] = s, i;
    } switch (i && i[0]) {
    case "'": return jr(a, e, i);
    case '"': return Cr(a, e, i);
    case "{": return pn || lt(t("Inline Table is not allowed before TOML v0.4" + ft(", which at "))), Yr(a, e, i);
    case "[": return zr(a, e, i);
} const { 1: l } = ({ 2: i } = gt(i) || lt(t("Bad atom value" + ft(" at ")))); return "true" === l ? a[e] = !0 : "false" === l ? a[e] = !1 : Tn && "null" === l ? a[e] = null : l.includes(":") ? l.includes("-") ? Rr(l) ? a[e] = new Ri(l) : (gn || lt(t("Local Date-Time is not allowed before TOML v0.5" + ft(", which at "))), a[e] = new Yi(l)) : (gn || lt(t("Local Time is not allowed before TOML v0.5" + ft(", which at "))), a[e] = new rr(l)) : l.indexOf("-") !== l.lastIndexOf("-") && "-" !== l[0] ? (gn || lt(t("Local Date is not allowed before TOML v0.5" + ft(", which at "))), a[e] = new Qi(l)) : a[e] = l.includes(".") || l.includes("n") || (l.includes("e") || l.includes("E")) && !l.startsWith("0x") ? hn ? ni(l, Mr(l)) : Mr(l) : hn ? ni(l, Tr(l)) : Tr(l), i; }, Gr = () => { const e = new mn; let n = e; for (; at !== st;) {
    const i = rt[++at].replace(pt, "");
    if (i)
        if ("[" === i[0]) {
            const { leadingKeys: r, finalKey: s, asArrayItem: a, tag: l, lineRest: o } = Yt(i, qr), c = Ar(e, r);
            o && ("#" === o[0] || lt(t("Unexpect charachtor after table header" + ft(" at ")))), n = Br(c, s, a, l), On && o && (n[Er] = a ? o.slice(1) : c[Nr(s)] = o.slice(1));
        }
        else if ("#" === i[0])
            Gt(i) && lt(t("Control characters other than Tab are not permitted in comments" + ft(", which was found at ")));
        else {
            const e = Jr(n, i);
            let r = Vr(e);
            "string" == typeof r || (r = ei(r)), r && ("#" === r[0] || lt(t("Unexpect charachtor after key/value pair" + ft(" at "))), On && (e.table[Nr(e.finalKey)] = r.slice(1)));
        }
} return e; }, Xr = Number.MAX_SAFE_INTEGER, Qr = Date.prototype, es = String.prototype.valueOf, ts = function () { if (U.bind) {
    var e = U.bind(es);
    return function (t) { try {
        e(t);
    }
    catch (e) {
        return !1;
    } return !0; };
} return function (e) { try {
    es.apply(e);
}
catch (e) {
    return !1;
} return !0; }; }(), ns = Number.prototype.valueOf, is = function () { if (U.bind) {
    var e = U.bind(ns);
    return function (t) { try {
        e(t);
    }
    catch (e) {
        return !1;
    } return !0; };
} return function (e) { try {
    ns.apply(e);
}
catch (e) {
    return !1;
} return !0; }; }(), rs = function () { if ("function" == typeof BigInt) {
    var e = U.bind(BigInt.prototype.valueOf);
    return function (t) { try {
        e(t);
    }
    catch (e) {
        return !1;
    } return !0; };
} return function () { return !1; }; }(), ss = BigInt.prototype.valueOf, as = function () { if (U.bind) {
    var e = U.bind(ss);
    return function (t) { try {
        e(t);
    }
    catch (e) {
        return !1;
    } return !0; };
} return function (e) { try {
    ss.apply(e);
}
catch (e) {
    return !1;
} return !0; }; }(), ls = he({ ...ge([...M(32)].map(((e, t) => [L(t), "\\u" + t.toString(16).toUpperCase().padStart(4, "0")]))), "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', '"""': '""\\"', "\\": "\\\\", "": "\\u007F" }), { test: os } = W(/[\x00-\x08\x0A-\x1F'\x7F]/), cs = /[^\x00-\x08\x0A-\x1F"\\\x7F]+|./gs, { test: us } = W(/^[\x00-\x08\x0A-\x1F"\\\x7F]/), fs = e => { if (os(e)) {
    const t = e.match(cs);
    let n = t.length;
    do {
        us(t[--n]) && (t[n] = ls[t[n]]);
    } while (n);
    return `"${t.join("")}"`;
} return `'${e}'`; }, { test: hs } = W(/[\x00-\x08\x0A-\x1F\x7F]|'''/), { test: ds } = W(/[\x00-\x08\x0B-\x1F\x7F]|'''/), { test: ps } = W(/[\x00-\x08\x0A-\x1F\\\x7F]|"""/), gs = /[^\x00-\x08\x0A-\x1F"\\\x7F]+|"""|./gs, { test: bs } = W(/^(?:[\x00-\x08\x0A-\x1F\\\x7F]|""")/), ys = (e, t) => { const n = e[t]; if (ps(n)) {
    const i = n.match(gs);
    let r = i.length;
    do {
        bs(i[--r]) && (i[r] = ls[i[r]]);
    } while (r);
    e[t] = i.join("");
} }, ws = e => 1 === (e = ["", ...e]).length ? ["", ""] : e, ms = e => { let t = e.length - 1; for (ys(e, t), e[t] += e[0] = '"""'; --t;)
    ys(e, t); return e; }, xs = e => (e[e.length - 1] += e[0] = "'''", e), Ts = Float64Array, vs = Uint8Array, Os = -1 / 0, { test: $s } = W(/^-?\d+$/), Fs = e => $s(e) ? e + ".0" : e, Is = new Ts([Or]), Ss = new vs(Is.buffer), ks = Ss[7], Ls = ks === new vs(new Ts([NaN]).buffer)[7] ? e => e ? e === k ? "inf" : e === Os ? "-inf" : Fs("" + e) : e == e ? de(e, 0) ? "0.0" : "-0.0" : "nan" : e => e ? e === k ? "inf" : e === Os ? "-inf" : Fs("" + e) : e == e ? de(e, 0) ? "0.0" : "-0.0" : (Is[0] = e, Ss[7] === ks ? "nan" : "-nan"), Ms = g.bind(Qr), { test: As } = W(/^[\w-]+$/), Bs = e => As(e) ? e : fs(e), Us = /[^.]+/, Ds = e => `'${e}'`, js = e => tn(e) ? e.replace(Us, Ds) : "null" === e ? "'null'" : e;
class Cs extends M {
    constructor(e) { return super(), this.document = e, this; }
    [Xn.toPrimitive]() { return this.join(this.document.newline); }
    appendNewline() { this[this.length] = ""; }
    set appendLine(e) { this[this.length] = e; }
    set appendInline(e) { this[this.length - 1] += e; }
    set appendInlineIf(e) { e && (this[this.length - 1] += e); }
    *assignBlock(e, t, n, r) { const { document: s } = this, { newlineUnderHeader: a, newlineUnderSectionButPair: l } = s, o = !!t && s.newlineUnderPairButDotted, c = t ? s.newlineUnderDotted : s.newlineUnderPair; for (const u of r) {
        const r = n[u], f = Bs(u), h = e + f;
        if (S(r)) {
            const { length: e } = r;
            if (e) {
                let t = r[0];
                if (Ee(t)) {
                    const n = `[[${h}]]`, o = h + ".";
                    let c = 0, u = t;
                    for (;;) {
                        const t = s.appendSection();
                        if (t[0] = n + Kr(u, Er), a ? (t[1] = "", yield t.assignBlock(o, "", u, d(u)), l && 2 !== t.length && t.appendNewline()) : (yield t.assignBlock(o, "", u, d(u)), l && t.appendNewline()), ++c === e)
                            break;
                        if (u = r[c], !Ee(u))
                            throw i("the first table item marked by Section() means the parent array is an array of tables, which can not include other types or table not marked by Section() any more in the rest items");
                    }
                    continue;
                }
                {
                    let t = 1;
                    for (; t !== e;)
                        if (Ee(r[t++]))
                            throw i("if an array is not array of tables, it can not include any table that marked by Section()");
                }
            }
        }
        else if (Ee(r)) {
            const e = s.appendSection();
            e[0] = `[${h}]${s.preferCommentForThis ? Kr(r, Er) || Wr(n, u) : Wr(n, u) || Kr(r, Er)}`, a ? (e[1] = "", yield e.assignBlock(h + ".", "", r, d(r)), l && 2 !== e.length && e.appendNewline()) : (yield e.assignBlock(h + ".", "", r, d(r)), l && e.appendNewline());
            continue;
        }
        const p = t + f;
        this.appendLine = js(p) + " = ";
        const g = this.value("", r, !0);
        g ? (--this.length, yield this.assignBlock(h + ".", p + ".", r, g), o && this.appendNewline()) : (this.appendInlineIf = Wr(n, u), c && this.appendNewline());
    } }
    value(e, t, n) { switch (typeof t) {
        case "object":
            if (null === t) {
                if (this.document.nullDisabled)
                    throw i('toml can not stringify "null" type value without truthy options.xNull');
                this.appendInline = "null";
                break;
            }
            const r = je(t);
            if (S(t)) {
                if (r === s)
                    this.staticArray(e, t);
                else {
                    const { $singlelineArray: n = r } = this.document;
                    this.singlelineArray(e, t, n);
                }
                break;
            }
            if (r !== s) {
                r || this.document.multilineTableDisabled ? this.inlineTable(e, t) : this.multilineTable(e, t, this.document.multilineTableComma);
                break;
            }
            if (Ms(t)) {
                this.appendInline = t.toISOString().replace("T", this.document.T).replace("Z", this.document.Z);
                break;
            }
            if (ti in t) {
                const e = t[ti];
                if ("string" == typeof e)
                    this.appendInline = e;
                else {
                    if (!S(e))
                        throw i("literal value is broken");
                    {
                        const { length: t } = e;
                        if (!t)
                            throw i("literal value is broken");
                        {
                            this.appendInline = e[0];
                            let n = 1;
                            for (; n !== t;)
                                this.appendLine = e[n++];
                        }
                    }
                }
                break;
            }
            if (ts(t))
                throw i("TOML.stringify refuse to handle [object String]");
            if (is(t))
                throw i("TOML.stringify refuse to handle [object Number]");
            if (rs(t))
                throw i("TOML.stringify refuse to handle [object BigInt]");
            if (as(t))
                throw i("TOML.stringify refuse to handle [object Boolean]");
            if (n) {
                const e = d(t);
                if (e.length)
                    return e;
                this.appendInline = "{ }";
            }
            else
                this.inlineTable(e, t);
            break;
        case "bigint":
            this.appendInline = "" + t;
            break;
        case "number":
            this.appendInline = this.document.asInteger(t) ? de(t, -0) ? "-0" : "" + t : Ls(t);
            break;
        case "string":
            this.appendInline = fs(t);
            break;
        case "boolean":
            this.appendInline = t ? "true" : "false";
            break;
        default: throw i(`toml can not stringify "${typeof t}" type value`);
    } return null; }
    singlelineArray(e, t, n) { const { length: i } = t; if (i) {
        this.appendInline = 2 & n ? "[ " : "[", this.value(e, t[0], !1);
        let r = 1;
        for (; r !== i;)
            this.appendInline = ", ", this.value(e, t[r++], !1);
        this.appendInline = 2 & n ? " ]" : "]";
    }
    else
        this.appendInline = 1 & n ? "[ ]" : "[]"; }
    staticArray(e, t) { this.appendInline = "["; const n = e + this.document.indent, { length: i } = t; let r = 0; for (; r !== i;)
        this.appendLine = n, this.value(n, t[r++], !1), this.appendInline = ","; this.appendLine = e + "]"; }
    inlineTable(e, t) { const n = d(t); n.length ? (this.appendInline = "{ ", this.assignInline(e, t, "", n), this[this.length - 1] = this[this.length - 1].slice(0, -2) + " }") : this.appendInline = "{ }"; }
    multilineTable(e, t, n) { this.appendInline = "{", this.assignMultiline(e, t, "", d(t), n), this.appendLine = e + "}"; }
    assignInline(e, t, n, i) { for (const r of i) {
        const i = t[r], s = n + Bs(r), a = this.appendInline = js(s) + " = ", l = this.value(e, i, !0);
        l ? (this[this.length - 1] = this[this.length - 1].slice(0, -a.length), this.assignInline(e, i, s + ".", l)) : this.appendInline = ", ";
    } }
    assignMultiline(e, t, n, i, r) { const s = e + this.document.indent; for (const a of i) {
        const i = t[a], l = n + Bs(a);
        this.appendLine = s + js(l) + " = ";
        const o = this.value(s, i, !0);
        o ? (--this.length, this.assignMultiline(e, i, l + ".", o, r)) : r ? this.appendInline = "," + Wr(t, a) : this.appendInlineIf = Wr(t, a);
    } }
}
const _s = he({ document: 0, section: 1, header: 2, pairs: 3, pair: 4 }), { test: Ns } = W(/^[\t ]*$/), Es = () => !1;
class Ps extends M {
    get ["constructor"]() { return M; }
    constructor(e) {
        this[0] = new Cs(this);
        this.asInteger = Es;
        this.newline = "";
        this.newlineUnderSection = !0;
        this.newlineUnderSectionButPair = !0;
        this.newlineUnderHeader = !0;
        this.newlineUnderPair = !1;
        this.newlineUnderPairButDotted = !1;
        this.newlineUnderDotted = !1;
        this.indent = "\t";
        this.T = "T";
        this.Z = "Z";
        this.nullDisabled = !0;
        this.multilineTableDisabled = !0;
        this.preferCommentForThis = !1;
        if (super(), null == e)
            return this;
        const { integer: r } = e;
        if (void 0 === r)
            ;
        else if (r === Xr)
            this.asInteger = h;
        else {
            if ("number" != typeof r)
                throw i("TOML.stringify(,{integer}) can only be number");
            {
                if (!h(r))
                    throw n("TOML.stringify(,{integer}) can only be a safe integer");
                const e = r >= 0 ? r : -r - 1, t = r >= 0 ? -r : r;
                this.asInteger = n => h(n) && t <= n && n <= e;
            }
        }
        const { newline: s } = e;
        if (void 0 === s)
            ;
        else {
            if ("\n" !== s && "\r\n" !== s)
                throw "string" == typeof s ? t("TOML.stringify(,{newline}) can only be valid TOML newline") : i("TOML.stringify(,{newline}) can only be string");
            this.newline = s;
        }
        const { preferCommentFor: a } = e;
        if (void 0 === a)
            ;
        else {
            if ("this" !== a && "key" !== a)
                throw i("TOML.stringify(,{preferCommentFor) can only be 'key' or 'this'");
            this.preferCommentForThis = "this" === a;
        }
        const { [e.newlineAround || "header"]: l = _s.header } = _s;
        this.newlineUnderSection = l > 0, this.newlineUnderSectionButPair = 1 === l || 2 === l, this.newlineUnderHeader = l > 1, this.newlineUnderPair = l > 2, this.newlineUnderPairButDotted = 3 === l, this.newlineUnderDotted = l > 3;
        const { indent: o } = e;
        if (void 0 === o)
            ;
        else if ("string" == typeof o) {
            if (!Ns(o))
                throw t("TOML.stringify(,{indent}) can only include Tab or Space");
            this.indent = o;
        }
        else {
            if ("number" != typeof o)
                throw i(`TOML.stringify(,{indent}) can not be "${typeof o}" type`);
            if (!h(o))
                throw n(`TOML.stringify(,{indent:${o}}) is out of range`);
            this.indent = " ".repeat(o);
        }
        const { T: c } = e;
        if (void 0 === c)
            ;
        else {
            if (" " !== c && "t" !== c && "T" !== c)
                throw i('TOML.stringify(,{T}) can only be "T" or " " or "t"');
            this.T = c;
        }
        const { Z: u } = e;
        if (void 0 === u)
            ;
        else {
            if ("z" !== u && "Z" !== u)
                throw i('TOML.stringify(,{Z}) can only be "Z" or "z"');
            this.Z = u;
        }
        e.xNull && (this.nullDisabled = !1);
        const { xBeforeNewlineInMultilineTable: f } = e;
        if (void 0 === f)
            ;
        else {
            if ("" !== f && "," !== f)
                throw i('TOML.stringify(,{xBeforeNewlineInMultilineTable}) can only be "" or ","');
            this.multilineTableDisabled = !1, this.multilineTableComma = !!f;
        }
        const d = e.forceInlineArraySpacing;
        switch (d) {
            case void 0: break;
            case 0:
            case 1:
            case 2:
            case 3:
                this.$singlelineArray = d;
                break;
            default: throw "number" == typeof d ? n(`array inline mode must be 0 | 1 | 2 | 3, not including ${d}`) : i('array inline mode must be "number" type, not including ' + (null === d ? '"null"' : typeof d));
        }
        return this;
    }
    appendSection() { return this[this.length] = new Cs(this); }
}
const Ks = new ae, Ws = oe.bind(Ks), Rs = le.bind(Ks), Zs = (e, t) => { const n = new Ps(t), i = n[0]; if (i[0] = "", ei(i.assignBlock("", "", e, d(e))), n.newlineUnderSectionButPair && 1 !== i.length && i.appendNewline(), n.newlineUnderSection || n[n.length - 1].appendNewline(), n.newline)
    return n.join(n.newline); const r = n.flat(); return Ws(r), r; }, qs = (() => { const e = (e, t) => "string" == typeof e ? ni((ds(e) ? ms : xs)(("\n" + e).split("\n")), e) : S(e) ? ni((e => { const t = e.length - 1; let n = t; do {
    if (hs(e[n]))
        break;
} while (--n); if (n)
    for (n = t, ys(e, n), e[n] += e[0] = '"""'; --n;)
        ys(e, n);
else
    e[t] += e[0] = "'''"; return e; })(ws(e)), "string" == typeof t ? t : he(null)) : (e => (Ce(e, !1), Ue(e), e))(e); return e.basic = (e, t) => "string" == typeof e ? ni(ms(("\n" + e).split("\n")), e) : ni(ms(ws(e)), "string" == typeof t ? t : he(null)), e.array = Ne, p(e), e; })(), Hs = e => ni((e => { if (e) {
    const t = e.match(cs);
    let n = t.length;
    do {
        us(t[--n]) && (t[n] = ls[t[n]]);
    } while (n);
    return `"${t.join("")}"`;
} return '""'; })(e), e), zs = (e, ...t) => { if ("string" == typeof e) {
    if (1 === t.length)
        return ni(e.includes("\n") ? e.split("\n") : e, t[0]);
}
else {
    let n = t.length;
    if (n) {
        const { raw: i } = e;
        for (e = i[n]; n;)
            t[--n] += i[n];
        e = t.join("") + e;
    }
    else
        e = e.raw[0];
} return ni(e.includes("\n") ? e.split("\n") : e, he(null)); }, Ys = new Gn("utf-8", he({ fatal: !0, ignoreBOM: !1 })), Js = e => { if (Jn(e) ? e.length !== e.byteLength : !Vn(e))
    throw i("only Uint8Array or ArrayBuffer is acceptable"); try {
    return Ys.decode(e);
}
catch {
    throw r("A TOML doc must be a (ful-scalar) valid UTF-8 file, without any unknown code point.");
} }, Vs = e => "byteLength" in e, { test: Gs } = W(/[\uD800-\uDFFF]/u), Xs = e => { if (X(Gs(e)))
    throw r("A TOML doc must be a (ful-scalar) valid UTF-8 file, without any uncoupled UCS-4 character code."); };
let Qs = !1;
const ea = (e, t, n, a, l, o) => { let c, u, f, h, d = ""; if ("object" == typeof e && e) {
    if (S(e))
        throw i(Rs(e) ? "TOML.parse(array from TOML.stringify(,{newline?}))" : "TOML.parse(array)");
    if (Vs(e))
        e = Js(e);
    else {
        if (d = e.path, "string" != typeof d)
            throw i("TOML.parse(source.path)");
        const { data: t, require: n = ("function" == typeof require ? require : s) } = e;
        if (n) {
            const { resolve: r } = n;
            if (null != r) {
                const { paths: e } = r;
                if (null != e) {
                    const t = x(e, r, [""]);
                    if (null != t) {
                        const e = t[0];
                        if (null != e) {
                            const t = e.replace(/node_modules$/, "");
                            if (t && (d = n("path").resolve(t, d), "string" != typeof d))
                                throw i("TOML.parse(source.require('path').resolve)");
                        }
                    }
                }
            }
            if (t === s) {
                const t = n("fs").readFileSync(d);
                if ("object" != typeof t || !t || !Vs(t))
                    throw i("TOML.parse(source.require('fs').readFileSync)");
                e = Js(t);
            }
            else if ("string" == typeof t)
                Xs(e = t);
            else {
                if ("object" != typeof t || !t || !Vs(t))
                    throw i("TOML.parse(source.data)");
                e = Js(t);
            }
        }
        else {
            if (t === s)
                throw i("TOML.parse(source.data|source.require)");
            if ("string" == typeof t)
                Xs(e = t);
            else {
                if ("object" != typeof t || !t || !Vs(t))
                    throw i("TOML.parse(source.data)");
                e = Js(t);
            }
        }
    }
}
else {
    if ("string" != typeof e)
        throw i("TOML.parse(source)");
    Xs(e);
} if ("object" == typeof n && n) {
    if (a !== s || l !== s)
        throw i("options mode ? args mode");
    c = n.joiner, a = n.bigint, u = n.keys, l = n.x, o = "";
}
else
    c = n; if (Qs)
    throw r("parsing during parsing."); Qs = !0; try {
    Yn(t, c, a, u, l, o), ct(e, d), e && "\ufeff" === e[0] && lt(i("TOML content (string) should not start with BOM (U+FEFF)" + ft(" at "))), f = Gr(), h = (() => { if (Zn) {
        const e = Rn;
        let t = Zn;
        return Zn = null, () => { const n = e; let i = t; t = null; do {
            n(i);
        } while (i = i._linked); };
    } return null; })();
}
finally {
    ht(), Fn = cn, sn = Rn = Zn = null, dn = !1, Qs = !1, X();
} return h && h(), f; }, ta = $(((e, t, n, i, r) => "number" == typeof t ? ea(e, t, n, i, r, ",,") : ea(e, 1, t, n, i, ",")), { "1.0": (e, t, n, i) => ea(e, .1, t, n, i, ","), 1: (e, t, n, i) => ea(e, 1, t, n, i, ","), .5: (e, t, n, i) => ea(e, .5, t, n, i, ","), .4: (e, t, n, i) => ea(e, .4, t, n, i, ","), .3: (e, t, n, i) => ea(e, .3, t, n, i, ","), .2: (e, t, n, i) => ea(e, .2, t, n, i, ","), .1: (e, t, n, i) => ea(e, .1, t, n, i, ",") }), na = N({ version: e, parse: ta, stringify: Zs, Section: Ke, inline: _e, multiline: qs, basic: Hs, literal: zs, commentFor: Nr, commentForThis: Er, OffsetDateTime: Ri, LocalDateTime: Yi, LocalDate: Qi, LocalTime: rr, isInline: De, isSection: Ee, Keys: un });
export { un as Keys, Qi as LocalDate, Yi as LocalDateTime, rr as LocalTime, Ri as OffsetDateTime, Ke as Section, Hs as basic, Nr as commentFor, Er as commentForThis, na as default, _e as inline, De as isInline, Ee as isSection, zs as literal, qs as multiline, ta as parse, Zs as stringify, e as version };
//# sourceMappingURL=/sm/7a151dbf03975d9bba609787df662e5b56ac5ab0a54755c8432b04ea034b38e7.map
