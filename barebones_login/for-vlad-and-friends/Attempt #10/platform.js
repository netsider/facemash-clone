var gapi = (window.gapi = window.gapi || {});
gapi._bs = new Date().getTime();
(function () {
    /*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
    var n,
        aa = function (a) {
            var b = 0;
            return function () {
                return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
            };
        },
        ba =
            "function" == typeof Object.defineProperties
                ? Object.defineProperty
                : function (a, b, c) {
                      if (a == Array.prototype || a == Object.prototype) return a;
                      a[b] = c.value;
                      return a;
                  },
        ca = function (a) {
            a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
            for (var b = 0; b < a.length; ++b) {
                var c = a[b];
                if (c && c.Math == Math) return c;
            }
            throw Error("Cannot find global object");
        },
        da = ca(this),
        ha = function (a, b) {
            if (b)
                a: {
                    var c = da;
                    a = a.split(".");
                    for (var d = 0; d < a.length - 1; d++) {
                        var e = a[d];
                        if (!(e in c)) break a;
                        c = c[e];
                    }
                    a = a[a.length - 1];
                    d = c[a];
                    b = b(d);
                    b != d && null != b && ba(c, a, { configurable: !0, writable: !0, value: b });
                }
        };
    ha("Symbol", function (a) {
        if (a) return a;
        var b = function (f, g) {
            this.ca = f;
            ba(this, "description", { configurable: !0, writable: !0, value: g });
        };
        b.prototype.toString = function () {
            return this.ca;
        };
        var c = "jscomp_symbol_" + ((1e9 * Math.random()) >>> 0) + "_",
            d = 0,
            e = function (f) {
                if (this instanceof e) throw new TypeError("Symbol is not a constructor");
                return new b(c + (f || "") + "_" + d++, f);
            };
        return e;
    });
    ha("Symbol.iterator", function (a) {
        if (a) return a;
        a = Symbol("Symbol.iterator");
        for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
            var d = da[b[c]];
            "function" === typeof d &&
                "function" != typeof d.prototype[a] &&
                ba(d.prototype, a, {
                    configurable: !0,
                    writable: !0,
                    value: function () {
                        return ia(aa(this));
                    },
                });
        }
        return a;
    });
    var ia = function (a) {
            a = { next: a };
            a[Symbol.iterator] = function () {
                return this;
            };
            return a;
        },
        ja = function (a, b) {
            a instanceof String && (a += "");
            var c = 0,
                d = !1,
                e = {
                    next: function () {
                        if (!d && c < a.length) {
                            var f = c++;
                            return { value: b(f, a[f]), done: !1 };
                        }
                        d = !0;
                        return { done: !0, value: void 0 };
                    },
                };
            e[Symbol.iterator] = function () {
                return e;
            };
            return e;
        };
    ha("Array.prototype.keys", function (a) {
        return a
            ? a
            : function () {
                  return ja(this, function (b) {
                      return b;
                  });
              };
    });
    var p = this || self,
        ka = function (a) {
            var b = typeof a;
            return "object" != b ? b : a ? (Array.isArray(a) ? "array" : b) : "null";
        },
        la = function (a) {
            var b = ka(a);
            return "array" == b || ("object" == b && "number" == typeof a.length);
        },
        ma = function (a) {
            var b = typeof a;
            return ("object" == b && null != a) || "function" == b;
        },
        na = function (a, b, c) {
            return a.call.apply(a.bind, arguments);
        },
        oa = function (a, b, c) {
            if (!a) throw Error();
            if (2 < arguments.length) {
                var d = Array.prototype.slice.call(arguments, 2);
                return function () {
                    var e = Array.prototype.slice.call(arguments);
                    Array.prototype.unshift.apply(e, d);
                    return a.apply(b, e);
                };
            }
            return function () {
                return a.apply(b, arguments);
            };
        },
        pa = function (a, b, c) {
            pa = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? na : oa;
            return pa.apply(null, arguments);
        },
        qa = function (a, b) {
            function c() {}
            c.prototype = b.prototype;
            a.pa = b.prototype;
            a.prototype = new c();
            a.prototype.constructor = a;
            a.B = function (d, e, f) {
                for (var g = Array(arguments.length - 2), h = 2; h < arguments.length; h++) g[h - 2] = arguments[h];
                return b.prototype[e].apply(d, g);
            };
        },
        ra = function (a) {
            return a;
        },
        sa = function (a) {
            var b = null,
                c = p.trustedTypes;
            if (!c || !c.createPolicy) return b;
            try {
                b = c.createPolicy(a, { createHTML: ra, createScript: ra, createScriptURL: ra });
            } catch (d) {
                p.console && p.console.error(d.message);
            }
            return b;
        };
    function r(a) {
        if (Error.captureStackTrace) Error.captureStackTrace(this, r);
        else {
            var b = Error().stack;
            b && (this.stack = b);
        }
        a && (this.message = String(a));
    }
    qa(r, Error);
    r.prototype.name = "CustomError";
    var ta;
    var ua = function (a, b) {
        a = a.split("%s");
        for (var c = "", d = a.length - 1, e = 0; e < d; e++) c += a[e] + (e < b.length ? b[e] : "%s");
        r.call(this, c + a[d]);
    };
    qa(ua, r);
    ua.prototype.name = "AssertionError";
    var va = function (a, b, c, d) {
            var e = "Assertion failed";
            if (c) {
                e += ": " + c;
                var f = d;
            } else a && ((e += ": " + a), (f = b));
            throw new ua("" + e, f || []);
        },
        wa = function (a, b, c) {
            a || va("", null, b, Array.prototype.slice.call(arguments, 2));
            return a;
        },
        xa = function (a, b) {
            throw new ua("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
        },
        ya = function (a, b, c) {
            "string" !== typeof a && va("Expected string but got %s: %s.", [ka(a), a], b, Array.prototype.slice.call(arguments, 2));
        };
    var za = Array.prototype.forEach
        ? function (a, b) {
              wa(null != a.length);
              Array.prototype.forEach.call(a, b, void 0);
          }
        : function (a, b) {
              for (var c = a.length, d = "string" === typeof a ? a.split("") : a, e = 0; e < c; e++) e in d && b.call(void 0, d[e], e, a);
          };
    function Aa(a) {
        var b = a.length;
        if (0 < b) {
            for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
            return c;
        }
        return [];
    }
    var Da = function (a, b) {
            for (var c in a) b.call(void 0, a[c], c, a);
        },
        Ea = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),
        Fa = function (a, b) {
            for (var c, d, e = 1; e < arguments.length; e++) {
                d = arguments[e];
                for (c in d) a[c] = d[c];
                for (var f = 0; f < Ea.length; f++) (c = Ea[f]), Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
            }
        };
    var Ga;
    var w = function (a, b) {
        this.S = (a === Ha && b) || "";
        this.da = Ia;
    };
    w.prototype.F = !0;
    w.prototype.D = function () {
        return this.S;
    };
    w.prototype.toString = function () {
        return "Const{" + this.S + "}";
    };
    var Ja = function (a) {
            if (a instanceof w && a.constructor === w && a.da === Ia) return a.S;
            xa("expected object of type Const, got '" + a + "'");
            return "type_error:Const";
        },
        Ia = {},
        Ha = {};
    var Ka = /&/g,
        La = /</g,
        Ma = />/g,
        Na = /"/g,
        Oa = /'/g,
        Pa = /\x00/g,
        Qa = /[\x00&<>"']/;
    var x = function (a, b) {
        this.P = b === Ra ? a : "";
    };
    x.prototype.F = !0;
    x.prototype.D = function () {
        return this.P.toString();
    };
    x.prototype.toString = function () {
        return this.P.toString();
    };
    var Sa = function (a) {
            if (a instanceof x && a.constructor === x) return a.P;
            xa("expected object of type SafeUrl, got '" + a + "' of type " + ka(a));
            return "type_error:SafeUrl";
        },
        Ta = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i,
        Ua = function (a) {
            if (a instanceof x) return a;
            a = "object" == typeof a && a.F ? a.D() : String(a);
            wa(Ta.test(a), "%s does not match the safe URL pattern", a) || (a = "about:invalid#zClosurez");
            return new x(a, Ra);
        },
        Ra = {};
    var y;
    a: {
        var Va = p.navigator;
        if (Va) {
            var Wa = Va.userAgent;
            if (Wa) {
                y = Wa;
                break a;
            }
        }
        y = "";
    }
    var B = function (a, b, c) {
        this.O = c === Xa ? a : "";
    };
    B.prototype.F = !0;
    B.prototype.D = function () {
        return this.O.toString();
    };
    B.prototype.toString = function () {
        return this.O.toString();
    };
    var Ya = function (a) {
            if (a instanceof B && a.constructor === B) return a.O;
            xa("expected object of type SafeHtml, got '" + a + "' of type " + ka(a));
            return "type_error:SafeHtml";
        },
        Xa = {},
        Za = new B((p.trustedTypes && p.trustedTypes.emptyHTML) || "", 0, Xa);
    var $a = function (a, b) {
        a: {
            try {
                var c = a && a.ownerDocument,
                    d = c && (c.defaultView || c.parentWindow);
                d = d || p;
                if (d.Element && d.Location) {
                    var e = d;
                    break a;
                }
            } catch (g) {}
            e = null;
        }
        if (e && "undefined" != typeof e[b] && (!a || (!(a instanceof e[b]) && (a instanceof e.Location || a instanceof e.Element)))) {
            if (ma(a))
                try {
                    var f = a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a);
                } catch (g) {
                    f = "<object could not be stringified>";
                }
            else f = void 0 === a ? "undefined" : null === a ? "null" : typeof a;
            xa("Argument is not a %s (or a non-Element, non-Location mock); got: %s", b, f);
        }
        return a;
    };
    var ab = { MATH: !0, SCRIPT: !0, STYLE: !0, SVG: !0, TEMPLATE: !0 },
        bb = (function (a) {
            var b = !1,
                c;
            return function () {
                b || ((c = a()), (b = !0));
                return c;
            };
        })(function () {
            if ("undefined" === typeof document) return !1;
            var a = document.createElement("div"),
                b = document.createElement("div");
            b.appendChild(document.createElement("div"));
            a.appendChild(b);
            if (!a.firstChild) return !1;
            b = a.firstChild.firstChild;
            a.innerHTML = Ya(Za);
            return !b.parentElement;
        });
    var cb = function (a) {
        Qa.test(a) &&
            (-1 != a.indexOf("&") && (a = a.replace(Ka, "&amp;")),
            -1 != a.indexOf("<") && (a = a.replace(La, "&lt;")),
            -1 != a.indexOf(">") && (a = a.replace(Ma, "&gt;")),
            -1 != a.indexOf('"') && (a = a.replace(Na, "&quot;")),
            -1 != a.indexOf("'") && (a = a.replace(Oa, "&#39;")),
            -1 != a.indexOf("\x00") && (a = a.replace(Pa, "&#0;")));
        return a;
    };
    var db = -1 != y.indexOf("Opera"),
        eb = -1 != y.indexOf("Trident") || -1 != y.indexOf("MSIE"),
        fb = -1 != y.indexOf("Edge"),
        gb = -1 != y.indexOf("Gecko") && !(-1 != y.toLowerCase().indexOf("webkit") && -1 == y.indexOf("Edge")) && !(-1 != y.indexOf("Trident") || -1 != y.indexOf("MSIE")) && -1 == y.indexOf("Edge"),
        hb = -1 != y.toLowerCase().indexOf("webkit") && -1 == y.indexOf("Edge"),
        ib = function () {
            var a = p.document;
            return a ? a.documentMode : void 0;
        },
        jb;
    a: {
        var kb = "",
            lb = (function () {
                var a = y;
                if (gb) return /rv:([^\);]+)(\)|;)/.exec(a);
                if (fb) return /Edge\/([\d\.]+)/.exec(a);
                if (eb) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
                if (hb) return /WebKit\/(\S+)/.exec(a);
                if (db) return /(?:Version)[ \/]?(\S+)/.exec(a);
            })();
        lb && (kb = lb ? lb[1] : "");
        if (eb) {
            var mb = ib();
            if (null != mb && mb > parseFloat(kb)) {
                jb = String(mb);
                break a;
            }
        }
        jb = kb;
    }
    var nb = jb,
        ob;
    if (p.document && eb) {
        var pb = ib();
        ob = pb ? pb : parseInt(nb, 10) || void 0;
    } else ob = void 0;
    var qb = ob;
    var rb;
    (rb = !eb) || (rb = 9 <= Number(qb));
    var sb = rb;
    var ub = function (a, b) {
            Da(b, function (c, d) {
                c && "object" == typeof c && c.F && (c = c.D());
                "style" == d
                    ? (a.style.cssText = c)
                    : "class" == d
                    ? (a.className = c)
                    : "for" == d
                    ? (a.htmlFor = c)
                    : tb.hasOwnProperty(d)
                    ? a.setAttribute(tb[d], c)
                    : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0)
                    ? a.setAttribute(d, c)
                    : (a[d] = c);
            });
        },
        tb = {
            cellpadding: "cellPadding",
            cellspacing: "cellSpacing",
            colspan: "colSpan",
            frameborder: "frameBorder",
            height: "height",
            maxlength: "maxLength",
            nonce: "nonce",
            role: "role",
            rowspan: "rowSpan",
            type: "type",
            usemap: "useMap",
            valign: "vAlign",
            width: "width",
        },
        vb = function (a, b, c, d) {
            function e(h) {
                h && b.appendChild("string" === typeof h ? a.createTextNode(h) : h);
            }
            for (; d < c.length; d++) {
                var f = c[d];
                if (!la(f) || (ma(f) && 0 < f.nodeType)) e(f);
                else {
                    a: {
                        if (f && "number" == typeof f.length) {
                            if (ma(f)) {
                                var g = "function" == typeof f.item || "string" == typeof f.item;
                                break a;
                            }
                            if ("function" === typeof f) {
                                g = "function" == typeof f.item;
                                break a;
                            }
                        }
                        g = !1;
                    }
                    za(g ? Aa(f) : f, e);
                }
            }
        },
        wb = function (a, b) {
            b = String(b);
            "application/xhtml+xml" === a.contentType && (b = b.toLowerCase());
            return a.createElement(b);
        },
        xb = function (a) {
            wa(a, "Node cannot be null or undefined.");
            return 9 == a.nodeType ? a : a.ownerDocument || a.document;
        },
        yb = function (a) {
            this.C = a || p.document || document;
        };
    n = yb.prototype;
    n.getElementsByTagName = function (a, b) {
        return (b || this.C).getElementsByTagName(String(a));
    };
    n.ga = function (a, b, c) {
        var d = this.C,
            e = arguments,
            f = String(e[0]),
            g = e[1];
        if (!sb && g && (g.name || g.type)) {
            f = ["<", f];
            g.name && f.push(' name="', cb(g.name), '"');
            if (g.type) {
                f.push(' type="', cb(g.type), '"');
                var h = {};
                Fa(h, g);
                delete h.type;
                g = h;
            }
            f.push(">");
            f = f.join("");
        }
        f = wb(d, f);
        g && ("string" === typeof g ? (f.className = g) : Array.isArray(g) ? (f.className = g.join(" ")) : ub(f, g));
        2 < e.length && vb(d, f, e, 2);
        return f;
    };
    n.createElement = function (a) {
        return wb(this.C, a);
    };
    n.createTextNode = function (a) {
        return this.C.createTextNode(String(a));
    };
    n.appendChild = function (a, b) {
        wa(null != a && null != b, "goog.dom.appendChild expects non-null arguments");
        a.appendChild(b);
    };
    n.append = function (a, b) {
        vb(xb(a), a, arguments, 1);
    };
    n.canHaveChildren = function (a) {
        if (1 != a.nodeType) return !1;
        switch (a.tagName) {
            case "APPLET":
            case "AREA":
            case "BASE":
            case "BR":
            case "COL":
            case "COMMAND":
            case "EMBED":
            case "FRAME":
            case "HR":
            case "IMG":
            case "INPUT":
            case "IFRAME":
            case "ISINDEX":
            case "KEYGEN":
            case "LINK":
            case "NOFRAMES":
            case "NOSCRIPT":
            case "META":
            case "OBJECT":
            case "PARAM":
            case "SCRIPT":
            case "SOURCE":
            case "STYLE":
            case "TRACK":
            case "WBR":
                return !1;
        }
        return !0;
    };
    n.removeNode = function (a) {
        return a && a.parentNode ? a.parentNode.removeChild(a) : null;
    };
    n.contains = function (a, b) {
        if (!a || !b) return !1;
        if (a.contains && 1 == b.nodeType) return a == b || a.contains(b);
        if ("undefined" != typeof a.compareDocumentPosition) return a == b || !!(a.compareDocumentPosition(b) & 16);
        for (; b && a != b; ) b = b.parentNode;
        return b == a;
    }; /*
 gapi.loader.OBJECT_CREATE_TEST_OVERRIDE &&*/
    var C = window,
        D = document,
        zb = C.location,
        Ab = function () {},
        Bb = /\[native code\]/,
        E = function (a, b, c) {
            return (a[b] = a[b] || c);
        },
        Cb = function (a) {
            for (var b = 0; b < this.length; b++) if (this[b] === a) return b;
            return -1;
        },
        Db = function (a) {
            a = a.sort();
            for (var b = [], c = void 0, d = 0; d < a.length; d++) {
                var e = a[d];
                e != c && b.push(e);
                c = e;
            }
            return b;
        },
        Eb = /&/g,
        Fb = /</g,
        Gb = />/g,
        Hb = /"/g,
        Ib = /'/g,
        Jb = function (a) {
            return String(a).replace(Eb, "&amp;").replace(Fb, "&lt;").replace(Gb, "&gt;").replace(Hb, "&quot;").replace(Ib, "&#39;");
        },
        F = function () {
            var a;
            if ((a = Object.create) && Bb.test(a)) a = a(null);
            else {
                a = {};
                for (var b in a) a[b] = void 0;
            }
            return a;
        },
        G = function (a, b) {
            return Object.prototype.hasOwnProperty.call(a, b);
        },
        Kb = function (a) {
            if (Bb.test(Object.keys)) return Object.keys(a);
            var b = [],
                c;
            for (c in a) G(a, c) && b.push(c);
            return b;
        },
        H = function (a, b) {
            a = a || {};
            for (var c in a) G(a, c) && (b[c] = a[c]);
        },
        Lb = function (a) {
            return function () {
                C.setTimeout(a, 0);
            };
        },
        I = function (a, b) {
            if (!a) throw Error(b || "");
        },
        J = E(C, "gapi", {});
    var K = function (a, b, c) {
            var d = new RegExp("([#].*&|[#])" + b + "=([^&#]*)", "g");
            b = new RegExp("([?#].*&|[?#])" + b + "=([^&#]*)", "g");
            if ((a = a && (d.exec(a) || b.exec(a))))
                try {
                    c = decodeURIComponent(a[2]);
                } catch (e) {}
            return c;
        },
        Mb = new RegExp(/^/.source + /([a-zA-Z][-+.a-zA-Z0-9]*:)?/.source + /(\/\/[^\/?#]*)?/.source + /([^?#]*)?/.source + /(\?([^#]*))?/.source + /(#((#|[^#])*))?/.source + /$/.source),
        Nb = /[\ud800-\udbff][\udc00-\udfff]|[^!-~]/g,
        Ob = new RegExp(/(%([^0-9a-fA-F%]|[0-9a-fA-F]([^0-9a-fA-F%])?)?)*/.source + /%($|[^0-9a-fA-F]|[0-9a-fA-F]($|[^0-9a-fA-F]))/.source, "g"),
        Pb = /%([a-f]|[0-9a-fA-F][a-f])/g,
        Qb = /^(https?|ftp|file|chrome-extension):$/i,
        Rb = function (a) {
            a = String(a);
            a = a
                .replace(Nb, function (e) {
                    try {
                        return encodeURIComponent(e);
                    } catch (f) {
                        return encodeURIComponent(e.replace(/^[^%]+$/g, "\ufffd"));
                    }
                })
                .replace(Ob, function (e) {
                    return e.replace(/%/g, "%25");
                })
                .replace(Pb, function (e) {
                    return e.toUpperCase();
                });
            a = a.match(Mb) || [];
            var b = F(),
                c = function (e) {
                    return e.replace(/\\/g, "%5C").replace(/\^/g, "%5E").replace(/`/g, "%60").replace(/\{/g, "%7B").replace(/\|/g, "%7C").replace(/\}/g, "%7D");
                },
                d = !!(a[1] || "").match(Qb);
            b.B = c((a[1] || "") + (a[2] || "") + (a[3] || (a[2] && d ? "/" : "")));
            d = function (e) {
                return c(e.replace(/\?/g, "%3F").replace(/#/g, "%23"));
            };
            b.query = a[5] ? [d(a[5])] : [];
            b.i = a[7] ? [d(a[7])] : [];
            return b;
        },
        Sb = function (a) {
            return a.B + (0 < a.query.length ? "?" + a.query.join("&") : "") + (0 < a.i.length ? "#" + a.i.join("&") : "");
        },
        Tb = function (a, b) {
            var c = [];
            if (a)
                for (var d in a)
                    if (G(a, d) && null != a[d]) {
                        var e = b ? b(a[d]) : a[d];
                        c.push(encodeURIComponent(d) + "=" + encodeURIComponent(e));
                    }
            return c;
        },
        Ub = function (a, b, c, d) {
            a = Rb(a);
            a.query.push.apply(a.query, Tb(b, d));
            a.i.push.apply(a.i, Tb(c, d));
            return Sb(a);
        },
        Vb = new RegExp(/\/?\??#?/.source + "(" + /[\/?#]/i.source + "|" + /[\uD800-\uDBFF]/i.source + "|" + /%[c-f][0-9a-f](%[89ab][0-9a-f]){0,2}(%[89ab]?)?/i.source + "|" + /%[0-9a-f]?/i.source + ")$", "i"),
        Wb = function (a, b) {
            var c = Rb(b);
            b = c.B;
            c.query.length && (b += "?" + c.query.join(""));
            c.i.length && (b += "#" + c.i.join(""));
            var d = "";
            2e3 < b.length && ((d = b), (b = b.substr(0, 2e3)), (b = b.replace(Vb, "")), (d = d.substr(b.length)));
            var e = a.createElement("div");
            a = a.createElement("a");
            c = Rb(b);
            b = c.B;
            c.query.length && (b += "?" + c.query.join(""));
            c.i.length && (b += "#" + c.i.join(""));
            b = new x(b, Ra);
            $a(a, "HTMLAnchorElement");
            b = b instanceof x ? b : Ua(b);
            a.href = Sa(b);
            e.appendChild(a);
            b = e.innerHTML;
            c = new w(Ha, "Assignment to self.");
            ya(Ja(c), "must provide justification");
            wa(!/^[\s\xa0]*$/.test(Ja(c)), "must provide non-empty justification");
            void 0 === Ga && (Ga = sa("gapi#html"));
            b = (c = Ga) ? c.createHTML(b) : b;
            b = new B(b, null, Xa);
            if (e.tagName && ab[e.tagName.toUpperCase()]) throw Error("goog.dom.safe.setInnerHtml cannot be used to set content of " + e.tagName + ".");
            if (bb()) for (; e.lastChild; ) e.removeChild(e.lastChild);
            e.innerHTML = Ya(b);
            b = String(e.firstChild.href);
            e.parentNode && e.parentNode.removeChild(e);
            c = Rb(b + d);
            d = c.B;
            c.query.length && (d += "?" + c.query.join(""));
            c.i.length && (d += "#" + c.i.join(""));
            return d;
        },
        Xb = /^https?:\/\/[^\/%\\?#\s]+\/[^\s]*$/i;
    var Yb;
    var Zb = function (a, b, c, d) {
            if (C[c + "EventListener"]) C[c + "EventListener"](a, b, !1);
            else if (C[d + "tachEvent"]) C[d + "tachEvent"]("on" + a, b);
        },
        $b = function () {
            var a = D.readyState;
            return "complete" === a || ("interactive" === a && -1 == navigator.userAgent.indexOf("MSIE"));
        },
        cc = function (a) {
            var b = ac;
            if (!$b())
                try {
                    b();
                } catch (c) {}
            bc(a);
        },
        bc = function (a) {
            if ($b()) a();
            else {
                var b = !1,
                    c = function () {
                        if (!b) return (b = !0), a.apply(this, arguments);
                    };
                C.addEventListener
                    ? (C.addEventListener("load", c, !1), C.addEventListener("DOMContentLoaded", c, !1))
                    : C.attachEvent &&
                      (C.attachEvent("onreadystatechange", function () {
                          $b() && c.apply(this, arguments);
                      }),
                      C.attachEvent("onload", c));
            }
        },
        dc = function (a) {
            for (; a.firstChild; ) a.removeChild(a.firstChild);
        },
        ec = { button: !0, div: !0, span: !0 };
    var L;
    L = E(C, "___jsl", F());
    E(L, "I", 0);
    E(L, "hel", 10);
    var fc = function (a) {
            return L.dpo ? L.h : K(a, "jsh", L.h);
        },
        gc = function (a) {
            var b = E(L, "sws", []);
            b.push.apply(b, a);
        },
        hc = function (a) {
            return E(L, "watt", F())[a];
        },
        ic = function (a) {
            var b = E(L, "PQ", []);
            L.PQ = [];
            var c = b.length;
            if (0 === c) a();
            else
                for (
                    var d = 0,
                        e = function () {
                            ++d === c && a();
                        },
                        f = 0;
                    f < c;
                    f++
                )
                    b[f](e);
        },
        jc = function (a) {
            return E(E(L, "H", F()), a, F());
        };
    var kc = E(L, "perf", F()),
        lc = E(kc, "g", F()),
        mc = E(kc, "i", F());
    E(kc, "r", []);
    F();
    F();
    var nc = function (a, b, c) {
            var d = kc.r;
            "function" === typeof d ? d(a, b, c) : d.push([a, b, c]);
        },
        M = function (a, b, c) {
            lc[a] = (!b && lc[a]) || c || new Date().getTime();
            nc(a);
        },
        pc = function (a, b, c) {
            b && 0 < b.length && ((b = oc(b)), c && 0 < c.length && (b += "___" + oc(c)), 28 < b.length && (b = b.substr(0, 28) + (b.length - 28)), (c = b), (b = E(mc, "_p", F())), (E(b, c, F())[a] = new Date().getTime()), nc(a, "_p", c));
        },
        oc = function (a) {
            return a.join("__").replace(/\./g, "_").replace(/\-/g, "_").replace(/,/g, "_");
        };
    var qc = F(),
        rc = [],
        N = function (a) {
            throw Error("Bad hint" + (a ? ": " + a : ""));
        };
    rc.push([
        "jsl",
        function (a) {
            for (var b in a)
                if (G(a, b)) {
                    var c = a[b];
                    "object" == typeof c ? (L[b] = E(L, b, []).concat(c)) : E(L, b, c);
                }
            if ((b = a.u)) (a = E(L, "us", [])), a.push(b), (b = /^https:(.*)$/.exec(b)) && a.push("http:" + b[1]);
        },
    ]);
    var sc = /^(\/[a-zA-Z0-9_\-]+)+$/,
        tc = [/\/amp\//, /\/amp$/, /^\/amp$/],
        uc = /^[a-zA-Z0-9\-_\.,!]+$/,
        vc = /^gapi\.loaded_[0-9]+$/,
        wc = /^[a-zA-Z0-9,._-]+$/,
        Ac = function (a, b, c, d) {
            var e = a.split(";"),
                f = e.shift(),
                g = qc[f],
                h = null;
            g ? (h = g(e, b, c, d)) : N("no hint processor for: " + f);
            h || N("failed to generate load url");
            b = h;
            c = b.match(xc);
            ((d = b.match(yc)) && 1 === d.length && zc.test(b) && c && 1 === c.length) || N("failed sanity: " + a);
            return h;
        },
        Dc = function (a, b, c, d) {
            a = Bc(a);
            vc.test(c) || N("invalid_callback");
            b = Cc(b);
            d = d && d.length ? Cc(d) : null;
            var e = function (f) {
                return encodeURIComponent(f).replace(/%2C/g, ",");
            };
            return [
                encodeURIComponent(a.pathPrefix).replace(/%2C/g, ",").replace(/%2F/g, "/"),
                "/k=",
                e(a.version),
                "/m=",
                e(b),
                d ? "/exm=" + e(d) : "",
                "/rt=j/sv=1/d=1/ed=1",
                a.U ? "/am=" + e(a.U) : "",
                a.$ ? "/rs=" + e(a.$) : "",
                a.ba ? "/t=" + e(a.ba) : "",
                "/cb=",
                e(c),
            ].join("");
        },
        Bc = function (a) {
            "/" !== a.charAt(0) && N("relative path");
            for (var b = a.substring(1).split("/"), c = []; b.length; ) {
                a = b.shift();
                if (!a.length || 0 == a.indexOf(".")) N("empty/relative directory");
                else if (0 < a.indexOf("=")) {
                    b.unshift(a);
                    break;
                }
                c.push(a);
            }
            a = {};
            for (var d = 0, e = b.length; d < e; ++d) {
                var f = b[d].split("="),
                    g = decodeURIComponent(f[0]),
                    h = decodeURIComponent(f[1]);
                2 == f.length && g && h && (a[g] = a[g] || h);
            }
            b = "/" + c.join("/");
            sc.test(b) || N("invalid_prefix");
            c = 0;
            for (d = tc.length; c < d; ++c) tc[c].test(b) && N("invalid_prefix");
            c = Ec(a, "k", !0);
            d = Ec(a, "am");
            e = Ec(a, "rs");
            a = Ec(a, "t");
            return { pathPrefix: b, version: c, U: d, $: e, ba: a };
        },
        Cc = function (a) {
            for (var b = [], c = 0, d = a.length; c < d; ++c) {
                var e = a[c].replace(/\./g, "_").replace(/-/g, "_");
                wc.test(e) && b.push(e);
            }
            return b.join(",");
        },
        Ec = function (a, b, c) {
            a = a[b];
            !a && c && N("missing: " + b);
            if (a) {
                if (uc.test(a)) return a;
                N("invalid: " + b);
            }
            return null;
        },
        zc = /^https?:\/\/[a-z0-9_.-]+\.google(rs)?\.com(:\d+)?\/[a-zA-Z0-9_.,!=\-\/]+$/,
        yc = /\/cb=/g,
        xc = /\/\//g,
        Fc = function () {
            var a = fc(zb.href);
            if (!a) throw Error("Bad hint");
            return a;
        };
    qc.m = function (a, b, c, d) {
        (a = a[0]) || N("missing_hint");
        return "https://apis.google.com" + Dc(a, b, c, d);
    };
    var Gc = decodeURI("%73cript"),
        Hc = /^[-+_0-9\/A-Za-z]+={0,2}$/,
        Ic = function (a, b) {
            for (var c = [], d = 0; d < a.length; ++d) {
                var e = a[d];
                e && 0 > Cb.call(b, e) && c.push(e);
            }
            return c;
        },
        Jc = function () {
            var a = L.nonce;
            return void 0 !== a
                ? a && a === String(a) && a.match(Hc)
                    ? a
                    : (L.nonce = null)
                : D.querySelector
                ? (a = D.querySelector("script[nonce]"))
                    ? ((a = a.nonce || a.getAttribute("nonce") || ""), a && a === String(a) && a.match(Hc) ? (L.nonce = a) : (L.nonce = null))
                    : null
                : null;
        },
        Mc = function (a) {
            if ("loading" != D.readyState) Kc(a);
            else {
                var b = Jc(),
                    c = "";
                null !== b && (c = ' nonce="' + b + '"');
                a = "<" + Gc + ' src="' + encodeURI(a) + '"' + c + "></" + Gc + ">";
                D.write(Lc ? Lc.createHTML(a) : a);
            }
        },
        Kc = function (a) {
            var b = D.createElement(Gc);
            b.setAttribute("src", Lc ? Lc.createScriptURL(a) : a);
            a = Jc();
            null !== a && b.setAttribute("nonce", a);
            b.async = "true";
            (a = D.getElementsByTagName(Gc)[0]) ? a.parentNode.insertBefore(b, a) : (D.head || D.body || D.documentElement).appendChild(b);
        },
        Nc = function (a, b) {
            var c = b && b._c;
            if (c)
                for (var d = 0; d < rc.length; d++) {
                    var e = rc[d][0],
                        f = rc[d][1];
                    f && G(c, e) && f(c[e], a, b);
                }
        },
        Pc = function (a, b, c) {
            Oc(function () {
                var d = b === fc(zb.href) ? E(J, "_", F()) : F();
                d = E(jc(b), "_", d);
                a(d);
            }, c);
        },
        Rc = function (a, b) {
            var c = b || {};
            "function" == typeof b && ((c = {}), (c.callback = b));
            Nc(a, c);
            b = a ? a.split(":") : [];
            var d = c.h || Fc(),
                e = E(L, "ah", F());
            if (e["::"] && b.length) {
                a = [];
                for (var f = null; (f = b.shift()); ) {
                    var g = f.split(".");
                    g = e[f] || e[(g[1] && "ns:" + g[0]) || ""] || d;
                    var h = (a.length && a[a.length - 1]) || null,
                        k = h;
                    (h && h.hint == g) || ((k = { hint: g, features: [] }), a.push(k));
                    k.features.push(f);
                }
                var l = a.length;
                if (1 < l) {
                    var m = c.callback;
                    m &&
                        (c.callback = function () {
                            0 == --l && m();
                        });
                }
                for (; (b = a.shift()); ) Qc(b.features, c, b.hint);
            } else Qc(b || [], c, d);
        },
        Qc = function (a, b, c) {
            a = Db(a) || [];
            var d = b.callback,
                e = b.config,
                f = b.timeout,
                g = b.ontimeout,
                h = b.onerror,
                k = void 0;
            "function" == typeof h && (k = h);
            var l = null,
                m = !1;
            if ((f && !g) || (!f && g)) throw "Timeout requires both the timeout parameter and ontimeout parameter to be set";
            h = E(jc(c), "r", []).sort();
            var t = E(jc(c), "L", []).sort(),
                u = [].concat(h),
                q = function (P, ea) {
                    if (m) return 0;
                    C.clearTimeout(l);
                    t.push.apply(t, z);
                    var fa = ((J || {}).config || {}).update;
                    fa ? fa(e) : e && E(L, "cu", []).push(e);
                    if (ea) {
                        pc("me0", P, u);
                        try {
                            Pc(ea, c, k);
                        } finally {
                            pc("me1", P, u);
                        }
                    }
                    return 1;
                };
            0 < f &&
                (l = C.setTimeout(function () {
                    m = !0;
                    g();
                }, f));
            var z = Ic(a, t);
            if (z.length) {
                z = Ic(a, h);
                var A = E(L, "CP", []),
                    v = A.length;
                A[v] = function (P) {
                    if (!P) return 0;
                    pc("ml1", z, u);
                    var ea = function (Ba) {
                            A[v] = null;
                            q(z, P) &&
                                ic(function () {
                                    d && d();
                                    Ba();
                                });
                        },
                        fa = function () {
                            var Ba = A[v + 1];
                            Ba && Ba();
                        };
                    0 < v && A[v - 1]
                        ? (A[v] = function () {
                              ea(fa);
                          })
                        : ea(fa);
                };
                if (z.length) {
                    var Ca = "loaded_" + L.I++;
                    J[Ca] = function (P) {
                        A[v](P);
                        J[Ca] = null;
                    };
                    a = Ac(c, z, "gapi." + Ca, h);
                    h.push.apply(h, z);
                    pc("ml0", z, u);
                    b.sync || C.___gapisync ? Mc(a) : Kc(a);
                } else A[v](Ab);
            } else q(z) && d && d();
        },
        Lc = sa("gapi#gapi");
    var Oc = function (a, b) {
        if (L.hee && 0 < L.hel)
            try {
                return a();
            } catch (c) {
                b && b(c),
                    L.hel--,
                    Rc("debug_error", function () {
                        try {
                            window.___jsl.hefn(c);
                        } catch (d) {
                            throw c;
                        }
                    });
            }
        else
            try {
                return a();
            } catch (c) {
                throw (b && b(c), c);
            }
    };
    J.load = function (a, b) {
        return Oc(function () {
            return Rc(a, b);
        });
    };
    var Sc = function (a) {
            var b = (window.___jsl = window.___jsl || {});
            b[a] = b[a] || [];
            return b[a];
        },
        Tc = function (a) {
            var b = (window.___jsl = window.___jsl || {});
            b.cfg = (!a && b.cfg) || {};
            return b.cfg;
        },
        Uc = function (a) {
            return "object" === typeof a && /\[native code\]/.test(a.push);
        },
        O = function (a, b, c) {
            if (b && "object" === typeof b)
                for (var d in b)
                    !Object.prototype.hasOwnProperty.call(b, d) ||
                        (c && "___goc" === d && "undefined" === typeof b[d]) ||
                        (a[d] && b[d] && "object" === typeof a[d] && "object" === typeof b[d] && !Uc(a[d]) && !Uc(b[d]) ? O(a[d], b[d]) : b[d] && "object" === typeof b[d] ? ((a[d] = Uc(b[d]) ? [] : {}), O(a[d], b[d])) : (a[d] = b[d]));
        },
        Vc = function (a) {
            if (a && !/^\s+$/.test(a)) {
                for (; 0 == a.charCodeAt(a.length - 1); ) a = a.substring(0, a.length - 1);
                try {
                    var b = window.JSON.parse(a);
                } catch (c) {}
                if ("object" === typeof b) return b;
                try {
                    b = new Function("return (" + a + "\n)")();
                } catch (c) {}
                if ("object" === typeof b) return b;
                try {
                    b = new Function("return ({" + a + "\n})")();
                } catch (c) {}
                return "object" === typeof b ? b : {};
            }
        },
        Wc = function (a, b) {
            var c = { ___goc: void 0 };
            a.length && a[a.length - 1] && Object.hasOwnProperty.call(a[a.length - 1], "___goc") && "undefined" === typeof a[a.length - 1].___goc && (c = a.pop());
            O(c, b);
            a.push(c);
        },
        Xc = function (a) {
            Tc(!0);
            var b = window.___gcfg,
                c = Sc("cu"),
                d = window.___gu;
            b && b !== d && (Wc(c, b), (window.___gu = b));
            b = Sc("cu");
            var e = document.scripts || document.getElementsByTagName("script") || [];
            d = [];
            var f = [];
            f.push.apply(f, Sc("us"));
            for (var g = 0; g < e.length; ++g) for (var h = e[g], k = 0; k < f.length; ++k) h.src && 0 == h.src.indexOf(f[k]) && d.push(h);
            0 == d.length && 0 < e.length && e[e.length - 1].src && d.push(e[e.length - 1]);
            for (e = 0; e < d.length; ++e)
                d[e].getAttribute("gapi_processed") || (d[e].setAttribute("gapi_processed", !0), (f = d[e]) ? ((g = f.nodeType), (f = 3 == g || 4 == g ? f.nodeValue : f.textContent || "")) : (f = void 0), (f = Vc(f)) && b.push(f));
            a && Wc(c, a);
            d = Sc("cd");
            a = 0;
            for (b = d.length; a < b; ++a) O(Tc(), d[a], !0);
            d = Sc("ci");
            a = 0;
            for (b = d.length; a < b; ++a) O(Tc(), d[a], !0);
            a = 0;
            for (b = c.length; a < b; ++a) O(Tc(), c[a], !0);
        },
        Q = function (a) {
            var b = Tc();
            if (!a) return b;
            a = a.split("/");
            for (var c = 0, d = a.length; b && "object" === typeof b && c < d; ++c) b = b[a[c]];
            return c === a.length && void 0 !== b ? b : void 0;
        },
        Yc = function (a, b) {
            var c;
            if ("string" === typeof a) {
                var d = (c = {});
                a = a.split("/");
                for (var e = 0, f = a.length; e < f - 1; ++e) {
                    var g = {};
                    d = d[a[e]] = g;
                }
                d[a[e]] = b;
            } else c = a;
            Xc(c);
        };
    var Zc = function () {
        var a = window.__GOOGLEAPIS;
        a && (a.googleapis && !a["googleapis.config"] && (a["googleapis.config"] = a.googleapis), E(L, "ci", []).push(a), (window.__GOOGLEAPIS = void 0));
    };
    var $c = { callback: 1, clientid: 1, cookiepolicy: 1, openidrealm: -1, includegrantedscopes: -1, requestvisibleactions: 1, scope: 1 },
        ad = !1,
        bd = F(),
        cd = function () {
            if (!ad) {
                for (var a = document.getElementsByTagName("meta"), b = 0; b < a.length; ++b) {
                    var c = a[b].name.toLowerCase();
                    if (0 == c.lastIndexOf("google-signin-", 0)) {
                        c = c.substring(14);
                        var d = a[b].content;
                        $c[c] && d && (bd[c] = d);
                    }
                }
                if (window.self !== window.top) {
                    a = document.location.toString();
                    for (var e in $c) 0 < $c[e] && (b = K(a, e, "")) && (bd[e] = b);
                }
                ad = !0;
            }
            e = F();
            H(bd, e);
            return e;
        },
        dd = function (a) {
            return !!(a.clientid && a.scope && a.callback);
        };
    var ed = window.console,
        fd = function (a) {
            ed && ed.log && ed.log(a);
        };
    var gd = function () {
            return !!L.oa;
        },
        hd = function () {};
    var R = E(L, "rw", F()),
        id = function (a) {
            for (var b in R) a(R[b]);
        },
        jd = function (a, b) {
            (a = R[a]) && a.state < b && (a.state = b);
        };
    var S = function (a) {
        var b = (window.___jsl = window.___jsl || {});
        b.cfg = b.cfg || {};
        b = b.cfg;
        if (!a) return b;
        a = a.split("/");
        for (var c = 0, d = a.length; b && "object" === typeof b && c < d; ++c) b = b[a[c]];
        return c === a.length && void 0 !== b ? b : void 0;
    };
    var kd = /^https?:\/\/(?:\w|[\-\.])+\.google\.(?:\w|[\-:\.])+(?:\/[^\?#]*)?\/u\/(\d)\//,
        ld = /^https?:\/\/(?:\w|[\-\.])+\.google\.(?:\w|[\-:\.])+(?:\/[^\?#]*)?\/b\/(\d{10,21})\//,
        md = function (a) {
            var b = S("googleapis.config/sessionIndex");
            "string" === typeof b && 254 < b.length && (b = null);
            null == b && (b = window.__X_GOOG_AUTHUSER);
            "string" === typeof b && 254 < b.length && (b = null);
            if (null == b) {
                var c = window.google;
                c && (b = c.authuser);
            }
            "string" === typeof b && 254 < b.length && (b = null);
            null == b && ((a = a || window.location.href), (b = K(a, "authuser") || null), null == b && (b = (b = a.match(kd)) ? b[1] : null));
            if (null == b) return null;
            b = String(b);
            254 < b.length && (b = null);
            return b;
        },
        nd = function (a) {
            var b = S("googleapis.config/sessionDelegate");
            "string" === typeof b && 21 < b.length && (b = null);
            null == b && (b = (a = (a || window.location.href).match(ld)) ? a[1] : null);
            if (null == b) return null;
            b = String(b);
            21 < b.length && (b = null);
            return b;
        };
    var od,
        T,
        U = void 0,
        V = function (a) {
            try {
                return p.JSON.parse.call(p.JSON, a);
            } catch (b) {
                return !1;
            }
        },
        W = function (a) {
            return Object.prototype.toString.call(a);
        },
        pd = W(0),
        qd = W(new Date(0)),
        rd = W(!0),
        sd = W(""),
        td = W({}),
        ud = W([]),
        X = function (a, b) {
            if (b) for (var c = 0, d = b.length; c < d; ++c) if (a === b[c]) throw new TypeError("Converting circular structure to JSON");
            d = typeof a;
            if ("undefined" !== d) {
                c = Array.prototype.slice.call(b || [], 0);
                c[c.length] = a;
                b = [];
                var e = W(a);
                if (
                    null != a &&
                    "function" === typeof a.toJSON &&
                    (Object.prototype.hasOwnProperty.call(a, "toJSON") ||
                        ((e !== ud || (a.constructor !== Array && a.constructor !== Object)) && (e !== td || (a.constructor !== Array && a.constructor !== Object)) && e !== sd && e !== pd && e !== rd && e !== qd))
                )
                    return X(a.toJSON.call(a), c);
                if (null == a) b[b.length] = "null";
                else if (e === pd) (a = Number(a)), isNaN(a) || isNaN(a - a) ? (a = "null") : -0 === a && 0 > 1 / a && (a = "-0"), (b[b.length] = String(a));
                else if (e === rd) b[b.length] = String(!!Number(a));
                else {
                    if (e === qd) return X(a.toISOString.call(a), c);
                    if (e === ud && W(a.length) === pd) {
                        b[b.length] = "[";
                        var f = 0;
                        for (d = Number(a.length) >> 0; f < d; ++f) f && (b[b.length] = ","), (b[b.length] = X(a[f], c) || "null");
                        b[b.length] = "]";
                    } else if (e == sd && W(a.length) === pd) {
                        b[b.length] = '"';
                        f = 0;
                        for (c = Number(a.length) >> 0; f < c; ++f)
                            (d = String.prototype.charAt.call(a, f)),
                                (e = String.prototype.charCodeAt.call(a, f)),
                                (b[b.length] =
                                    "\b" === d
                                        ? "\\b"
                                        : "\f" === d
                                        ? "\\f"
                                        : "\n" === d
                                        ? "\\n"
                                        : "\r" === d
                                        ? "\\r"
                                        : "\t" === d
                                        ? "\\t"
                                        : "\\" === d || '"' === d
                                        ? "\\" + d
                                        : 31 >= e
                                        ? "\\u" + (e + 65536).toString(16).substr(1)
                                        : 32 <= e && 65535 >= e
                                        ? d
                                        : "\ufffd");
                        b[b.length] = '"';
                    } else if ("object" === d) {
                        b[b.length] = "{";
                        d = 0;
                        for (f in a) Object.prototype.hasOwnProperty.call(a, f) && ((e = X(a[f], c)), void 0 !== e && (d++ && (b[b.length] = ","), (b[b.length] = X(f)), (b[b.length] = ":"), (b[b.length] = e)));
                        b[b.length] = "}";
                    } else return;
                }
                return b.join("");
            }
        },
        vd = /[\0-\x07\x0b\x0e-\x1f]/,
        wd = /^([^"]*"([^\\"]|\\.)*")*[^"]*"([^"\\]|\\.)*[\0-\x1f]/,
        xd = /^([^"]*"([^\\"]|\\.)*")*[^"]*"([^"\\]|\\.)*\\[^\\\/"bfnrtu]/,
        yd = /^([^"]*"([^\\"]|\\.)*")*[^"]*"([^"\\]|\\.)*\\u([0-9a-fA-F]{0,3}[^0-9a-fA-F])/,
        zd = /"([^\0-\x1f\\"]|\\[\\\/"bfnrt]|\\u[0-9a-fA-F]{4})*"/g,
        Ad = /-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][-+]?[0-9]+)?/g,
        Bd = /[ \t\n\r]+/g,
        Cd = /[^"]:/,
        Dd = /""/g,
        Ed = /true|false|null/g,
        Fd = /00/,
        Gd = /[\{]([^0\}]|0[^:])/,
        Hd = /(^|\[)[,:]|[,:](\]|\}|[,:]|$)/,
        Id = /[^\[,:][\[\{]/,
        Jd = /^(\{|\}|\[|\]|,|:|0)+/,
        Kd = /\u2028/g,
        Ld = /\u2029/g,
        Md = function (a) {
            a = String(a);
            if (vd.test(a) || wd.test(a) || xd.test(a) || yd.test(a)) return !1;
            var b = a.replace(zd, '""');
            b = b.replace(Ad, "0");
            b = b.replace(Bd, "");
            if (Cd.test(b)) return !1;
            b = b.replace(Dd, "0");
            b = b.replace(Ed, "0");
            if (Fd.test(b) || Gd.test(b) || Hd.test(b) || Id.test(b) || !b || (b = b.replace(Jd, ""))) return !1;
            a = a.replace(Kd, "\\u2028").replace(Ld, "\\u2029");
            b = void 0;
            try {
                b = U ? [V(a)] : eval("(function (var_args) {\n  return Array.prototype.slice.call(arguments, 0);\n})(\n" + a + "\n)");
            } catch (c) {
                return !1;
            }
            return b && 1 === b.length ? b[0] : !1;
        },
        Nd = function () {
            var a = ((p.document || {}).scripts || []).length;
            if ((void 0 === od || void 0 === U || T !== a) && -1 !== T) {
                od = U = !1;
                T = -1;
                try {
                    try {
                        U = !!p.JSON && '{"a":[3,true,"1970-01-01T00:00:00.000Z"]}' === p.JSON.stringify.call(p.JSON, { a: [3, !0, new Date(0)], c: function () {} }) && !0 === V("true") && 3 === V('[{"a":3}]')[0].a;
                    } catch (b) {}
                    od = U && !V("[00]") && !V('"\u0007"') && !V('"\\0"') && !V('"\\v"');
                } finally {
                    T = a;
                }
            }
        },
        Od = function (a) {
            if (-1 === T) return !1;
            Nd();
            return (od ? V : Md)(a);
        },
        Pd = function (a) {
            if (-1 !== T) return Nd(), U ? p.JSON.stringify.call(p.JSON, a) : X(a);
        },
        Qd = !Date.prototype.toISOString || "function" !== typeof Date.prototype.toISOString || "1970-01-01T00:00:00.000Z" !== new Date(0).toISOString(),
        Rd = function () {
            var a = Date.prototype.getUTCFullYear.call(this);
            return [
                0 > a ? "-" + String(1e6 - a).substr(1) : 9999 >= a ? String(1e4 + a).substr(1) : "+" + String(1e6 + a).substr(1),
                "-",
                String(101 + Date.prototype.getUTCMonth.call(this)).substr(1),
                "-",
                String(100 + Date.prototype.getUTCDate.call(this)).substr(1),
                "T",
                String(100 + Date.prototype.getUTCHours.call(this)).substr(1),
                ":",
                String(100 + Date.prototype.getUTCMinutes.call(this)).substr(1),
                ":",
                String(100 + Date.prototype.getUTCSeconds.call(this)).substr(1),
                ".",
                String(1e3 + Date.prototype.getUTCMilliseconds.call(this)).substr(1),
                "Z",
            ].join("");
        };
    Date.prototype.toISOString = Qd ? Rd : Date.prototype.toISOString;
    var Sd = function () {
        this.l = -1;
    };
    var Td = function () {
        this.l = 64;
        this.g = [];
        this.L = [];
        this.ea = [];
        this.H = [];
        this.H[0] = 128;
        for (var a = 1; a < this.l; ++a) this.H[a] = 0;
        this.J = this.v = 0;
        this.reset();
    };
    qa(Td, Sd);
    Td.prototype.reset = function () {
        this.g[0] = 1732584193;
        this.g[1] = 4023233417;
        this.g[2] = 2562383102;
        this.g[3] = 271733878;
        this.g[4] = 3285377520;
        this.J = this.v = 0;
    };
    var Ud = function (a, b, c) {
        c || (c = 0);
        var d = a.ea;
        if ("string" === typeof b) for (var e = 0; 16 > e; e++) (d[e] = (b.charCodeAt(c) << 24) | (b.charCodeAt(c + 1) << 16) | (b.charCodeAt(c + 2) << 8) | b.charCodeAt(c + 3)), (c += 4);
        else for (e = 0; 16 > e; e++) (d[e] = (b[c] << 24) | (b[c + 1] << 16) | (b[c + 2] << 8) | b[c + 3]), (c += 4);
        for (e = 16; 80 > e; e++) {
            var f = d[e - 3] ^ d[e - 8] ^ d[e - 14] ^ d[e - 16];
            d[e] = ((f << 1) | (f >>> 31)) & 4294967295;
        }
        b = a.g[0];
        c = a.g[1];
        var g = a.g[2],
            h = a.g[3],
            k = a.g[4];
        for (e = 0; 80 > e; e++) {
            if (40 > e)
                if (20 > e) {
                    f = h ^ (c & (g ^ h));
                    var l = 1518500249;
                } else (f = c ^ g ^ h), (l = 1859775393);
            else 60 > e ? ((f = (c & g) | (h & (c | g))), (l = 2400959708)) : ((f = c ^ g ^ h), (l = 3395469782));
            f = (((b << 5) | (b >>> 27)) + f + k + l + d[e]) & 4294967295;
            k = h;
            h = g;
            g = ((c << 30) | (c >>> 2)) & 4294967295;
            c = b;
            b = f;
        }
        a.g[0] = (a.g[0] + b) & 4294967295;
        a.g[1] = (a.g[1] + c) & 4294967295;
        a.g[2] = (a.g[2] + g) & 4294967295;
        a.g[3] = (a.g[3] + h) & 4294967295;
        a.g[4] = (a.g[4] + k) & 4294967295;
    };
    Td.prototype.update = function (a, b) {
        if (null != a) {
            void 0 === b && (b = a.length);
            for (var c = b - this.l, d = 0, e = this.L, f = this.v; d < b; ) {
                if (0 == f) for (; d <= c; ) Ud(this, a, d), (d += this.l);
                if ("string" === typeof a)
                    for (; d < b; ) {
                        if (((e[f] = a.charCodeAt(d)), ++f, ++d, f == this.l)) {
                            Ud(this, e);
                            f = 0;
                            break;
                        }
                    }
                else
                    for (; d < b; )
                        if (((e[f] = a[d]), ++f, ++d, f == this.l)) {
                            Ud(this, e);
                            f = 0;
                            break;
                        }
            }
            this.v = f;
            this.J += b;
        }
    };
    Td.prototype.digest = function () {
        var a = [],
            b = 8 * this.J;
        56 > this.v ? this.update(this.H, 56 - this.v) : this.update(this.H, this.l - (this.v - 56));
        for (var c = this.l - 1; 56 <= c; c--) (this.L[c] = b & 255), (b /= 256);
        Ud(this, this.L);
        for (c = b = 0; 5 > c; c++) for (var d = 24; 0 <= d; d -= 8) (a[b] = (this.g[c] >> d) & 255), ++b;
        return a;
    };
    var Vd = function () {
        this.R = new Td();
    };
    Vd.prototype.reset = function () {
        this.R.reset();
    };
    var Wd = C.crypto,
        Xd = !1,
        Yd = 0,
        Zd = 0,
        $d = 1,
        ae = 0,
        be = "",
        ce = function (a) {
            a = a || C.event;
            var b = (a.screenX + a.clientX) << 16;
            b += a.screenY + a.clientY;
            b *= new Date().getTime() % 1e6;
            $d = ($d * b) % ae;
            0 < Yd && ++Zd == Yd && Zb("mousemove", ce, "remove", "de");
        },
        de = function (a) {
            var b = new Vd();
            a = unescape(encodeURIComponent(a));
            for (var c = [], d = 0, e = a.length; d < e; ++d) c.push(a.charCodeAt(d));
            b.R.update(c);
            b = b.R.digest();
            a = "";
            for (c = 0; c < b.length; c++) a += "0123456789ABCDEF".charAt(Math.floor(b[c] / 16)) + "0123456789ABCDEF".charAt(b[c] % 16);
            return a;
        };
    Xd = !!Wd && "function" == typeof Wd.getRandomValues;
    Xd ||
        ((ae = 1e6 * (screen.width * screen.width + screen.height)),
        (be = de(D.cookie + "|" + D.location + "|" + new Date().getTime() + "|" + Math.random())),
        (Yd = S("random/maxObserveMousemove") || 0),
        0 != Yd && Zb("mousemove", ce, "add", "at"));
    var ee = function () {
            var a = L.onl;
            if (!a) {
                a = F();
                L.onl = a;
                var b = F();
                a.e = function (c) {
                    var d = b[c];
                    d && (delete b[c], d());
                };
                a.a = function (c, d) {
                    b[c] = d;
                };
                a.r = function (c) {
                    delete b[c];
                };
            }
            return a;
        },
        fe = function (a, b) {
            b = b.onload;
            return "function" === typeof b ? (ee().a(a, b), b) : null;
        },
        ge = function (a) {
            I(/^\w+$/.test(a), "Unsupported id - " + a);
            return 'onload="window.___jsl.onl.e(&#34;' + a + '&#34;)"';
        },
        he = function (a) {
            ee().r(a);
        };
    var ie = { allowtransparency: "true", frameborder: "0", hspace: "0", marginheight: "0", marginwidth: "0", scrolling: "no", style: "", tabindex: "0", vspace: "0", width: "100%" },
        je = { allowtransparency: !0, onload: !0 },
        ke = 0,
        le = function (a) {
            I(!a || Xb.test(a), "Illegal url for new iframe - " + a);
        },
        me = function (a, b, c, d, e) {
            le(c.src);
            var f,
                g = fe(d, c),
                h = g ? ge(d) : "";
            try {
                document.all && (f = a.createElement('<iframe frameborder="' + Jb(String(c.frameborder)) + '" scrolling="' + Jb(String(c.scrolling)) + '" ' + h + ' name="' + Jb(String(c.name)) + '"/>'));
            } catch (l) {
            } finally {
                f ||
                    ((f = (a ? new yb(xb(a)) : ta || (ta = new yb())).ga("IFRAME")),
                    g &&
                        ((f.onload = function () {
                            f.onload = null;
                            g.call(this);
                        }),
                        he(d)));
            }
            f.setAttribute("ng-non-bindable", "");
            for (var k in c) (a = c[k]), "style" === k && "object" === typeof a ? H(a, f.style) : je[k] || f.setAttribute(k, String(a));
            (k = (e && e.beforeNode) || null) || (e && e.dontclear) || dc(b);
            b.insertBefore(f, k);
            f = k ? k.previousSibling : b.lastChild;
            c.allowtransparency && (f.allowTransparency = !0);
            return f;
        };
    var ne = /^:[\w]+$/,
        oe = /:([a-zA-Z_]+):/g,
        pe = function () {
            var a = md() || "0",
                b = nd();
            var c = md(void 0) || a;
            var d = nd(void 0),
                e = "";
            c && (e += "u/" + encodeURIComponent(String(c)) + "/");
            d && (e += "b/" + encodeURIComponent(String(d)) + "/");
            c = e || null;
            (e = (d = !1 === S("isLoggedIn")) ? "_/im/" : "") && (c = "");
            var f = S("iframes/:socialhost:"),
                g = S("iframes/:im_socialhost:");
            return (Yb = { socialhost: f, ctx_socialhost: d ? g : f, session_index: a, session_delegate: b, session_prefix: c, im_prefix: e });
        },
        qe = function (a, b) {
            return pe()[b] || "";
        },
        re = function (a) {
            return function (b, c) {
                return a ? pe()[c] || a[c] || "" : pe()[c] || "";
            };
        };
    var se = function (a) {
            var b;
            a.match(/^https?%3A/i) && (b = decodeURIComponent(a));
            return Wb(document, b ? b : a);
        },
        te = function (a) {
            a = a || "canonical";
            for (var b = document.getElementsByTagName("link"), c = 0, d = b.length; c < d; c++) {
                var e = b[c],
                    f = e.getAttribute("rel");
                if (f && f.toLowerCase() == a && (e = e.getAttribute("href")) && (e = se(e)) && null != e.match(/^https?:\/\/[\w\-_\.]+/i)) return e;
            }
            return window.location.href;
        };
    var ue = { se: "0" },
        ve = { post: !0 },
        we = { style: "position:absolute;top:-10000px;width:450px;margin:0px;border-style:none" },
        xe = "onPlusOne _ready _close _open _resizeMe _renderstart oncircled drefresh erefresh".split(" "),
        ye = E(L, "WI", F()),
        ze = function (a, b, c) {
            var d;
            var e = {};
            var f = (d = a);
            "plus" == a && b.action && ((d = a + "_" + b.action), (f = a + "/" + b.action));
            (d = Q("iframes/" + d + "/url")) || (d = ":im_socialhost:/:session_prefix::im_prefix:_/widget/render/" + f + "?usegapi=1");
            for (var g in ue) e[g] = g + "/" + (b[g] || ue[g]) + "/";
            e = Wb(D, d.replace(oe, re(e)));
            g = "iframes/" + a + "/params/";
            f = {};
            H(b, f);
            (d = Q("lang") || Q("gwidget/lang")) && (f.hl = d);
            ve[a] || (f.origin = window.location.origin || window.location.protocol + "//" + window.location.host);
            f.exp = Q(g + "exp");
            if ((g = Q(g + "location")))
                for (d = 0; d < g.length; d++) {
                    var h = g[d];
                    f[h] = C.location[h];
                }
            switch (a) {
                case "plus":
                case "follow":
                    g = f.href;
                    d = b.action ? void 0 : "publisher";
                    g = (g = "string" == typeof g ? g : void 0) ? se(g) : te(d);
                    f.url = g;
                    delete f.href;
                    break;
                case "plusone":
                    g = (g = b.href) ? se(g) : te();
                    f.url = g;
                    g = b.db;
                    d = Q();
                    null == g && d && ((g = d.db), null == g && (g = d.gwidget && d.gwidget.db));
                    f.db = g || void 0;
                    g = b.ecp;
                    d = Q();
                    null == g && d && ((g = d.ecp), null == g && (g = d.gwidget && d.gwidget.ecp));
                    f.ecp = g || void 0;
                    delete f.href;
                    break;
                case "signin":
                    f.url = te();
            }
            L.ILI && (f.iloader = "1");
            delete f["data-onload"];
            delete f.rd;
            for (var k in ue) f[k] && delete f[k];
            f.gsrc = Q("iframes/:source:");
            k = Q("inline/css");
            "undefined" !== typeof k && 0 < c && k >= c && (f.ic = "1");
            k = /^#|^fr-/;
            c = {};
            for (var l in f) G(f, l) && k.test(l) && ((c[l.replace(k, "")] = f[l]), delete f[l]);
            l = "q" == Q("iframes/" + a + "/params/si") ? f : c;
            k = cd();
            for (var m in k) !G(k, m) || G(f, m) || G(c, m) || (l[m] = k[m]);
            m = [].concat(xe);
            (l = Q("iframes/" + a + "/methods")) && "object" === typeof l && Bb.test(l.push) && (m = m.concat(l));
            for (var t in b) G(b, t) && /^on/.test(t) && ("plus" != a || "onconnect" != t) && (m.push(t), delete f[t]);
            delete f.callback;
            c._methods = m.join(",");
            return Ub(e, f, c);
        },
        Ae = ["style", "data-gapiscan"],
        Ce = function (a) {
            for (var b = F(), c = 0 != a.nodeName.toLowerCase().indexOf("g:"), d = 0, e = a.attributes.length; d < e; d++) {
                var f = a.attributes[d],
                    g = f.name,
                    h = f.value;
                0 <= Cb.call(Ae, g) || (c && 0 != g.indexOf("data-")) || "null" === h || ("specified" in f && !f.specified) || (c && (g = g.substr(5)), (b[g.toLowerCase()] = h));
            }
            a = a.style;
            (c = Be(a && a.height)) && (b.height = String(c));
            (a = Be(a && a.width)) && (b.width = String(a));
            return b;
        },
        Be = function (a) {
            var b = void 0;
            "number" === typeof a ? (b = a) : "string" === typeof a && (b = parseInt(a, 10));
            return b;
        },
        Ee = function () {
            var a = L.drw;
            id(function (b) {
                if (a !== b.id && 4 != b.state && "share" != b.type) {
                    var c = b.id,
                        d = b.type,
                        e = b.url;
                    b = b.userParams;
                    var f = D.getElementById(c);
                    if (f) {
                        var g = ze(d, b, 0);
                        g
                            ? ((f = f.parentNode),
                              e.replace(/#.*/, "").replace(/(\?|&)ic=1/, "") !== g.replace(/#.*/, "").replace(/(\?|&)ic=1/, "") &&
                                  ((b.dontclear = !0), (b.rd = !0), (b.ri = !0), (b.type = d), De(f, b), (d = R[f.lastChild.id]) && (d.oid = c), jd(c, 4)))
                            : delete R[c];
                    } else delete R[c];
                }
            });
        };
    var Fe,
        Ge,
        Y,
        He,
        Ie,
        Je = /(?:^|\s)g-((\S)*)(?:$|\s)/,
        Ke = { plusone: !0, autocomplete: !0, profile: !0, signin: !0, signin2: !0 };
    Fe = E(L, "SW", F());
    Ge = E(L, "SA", F());
    Y = E(L, "SM", F());
    He = E(L, "FW", []);
    Ie = null;
    var Me = function (a, b) {
            Le(void 0, !1, a, b);
        },
        Le = function (a, b, c, d) {
            M("ps0", !0);
            c = ("string" === typeof c ? document.getElementById(c) : c) || D;
            var e = D.documentMode;
            if (c.querySelectorAll && (!e || 8 < e)) {
                e = d ? [d] : Kb(Fe).concat(Kb(Ge)).concat(Kb(Y));
                for (var f = [], g = 0; g < e.length; g++) {
                    var h = e[g];
                    f.push(".g-" + h, "g\\:" + h);
                }
                e = c.querySelectorAll(f.join(","));
            } else e = c.getElementsByTagName("*");
            c = F();
            for (f = 0; f < e.length; f++) {
                g = e[f];
                var k = g;
                h = d;
                var l = k.nodeName.toLowerCase(),
                    m = void 0;
                if (k.getAttribute("data-gapiscan")) h = null;
                else {
                    var t = l.indexOf("g:");
                    0 == t ? (m = l.substr(2)) : (t = (t = String(k.className || k.getAttribute("class"))) && Je.exec(t)) && (m = t[1]);
                    h = !m || !(Fe[m] || Ge[m] || Y[m]) || (h && m !== h) ? null : m;
                }
                h && (Ke[h] || 0 == g.nodeName.toLowerCase().indexOf("g:") || 0 != Kb(Ce(g)).length) && (g.setAttribute("data-gapiscan", !0), E(c, h, []).push(g));
            }
            if (b) for (var u in c) for (b = c[u], d = 0; d < b.length; d++) b[d].setAttribute("data-onload", !0);
            for (var q in c) He.push(q);
            M("ps1", !0);
            if ((u = He.join(":")) || a)
                try {
                    J.load(u, a);
                } catch (A) {
                    fd(A);
                    return;
                }
            if (Ne(Ie || {}))
                for (var z in c) {
                    a = c[z];
                    q = 0;
                    for (b = a.length; q < b; q++) a[q].removeAttribute("data-gapiscan");
                    Oe(z);
                }
            else {
                d = [];
                for (z in c) for (a = c[z], q = 0, b = a.length; q < b; q++) (e = a[q]), Pe(z, e, Ce(e), d, b);
                Qe(u, d);
            }
        },
        Re = function (a) {
            var b = E(J, a, {});
            b.go ||
                ((b.go = function (c) {
                    return Me(c, a);
                }),
                (b.render = function (c, d) {
                    d = d || {};
                    d.type = a;
                    return De(c, d);
                }));
        },
        Se = function (a) {
            Fe[a] = !0;
        },
        Te = function (a) {
            Ge[a] = !0;
        },
        Ue = function (a) {
            Y[a] = !0;
        };
    var Oe = function (a, b) {
            var c = hc(a);
            b && c
                ? (c(b), (c = b.iframeNode) && c.setAttribute("data-gapiattached", !0))
                : J.load(a, function () {
                      var d = hc(a),
                          e = b && b.iframeNode,
                          f = b && b.userParams;
                      e && d ? (d(b), e.setAttribute("data-gapiattached", !0)) : ((d = J[a].go), "signin2" == a ? d(e, f) : d(e && e.parentNode, f));
                  });
        },
        Ne = function () {
            return !1;
        },
        Qe = function () {},
        Pe = function (a, b, c, d, e, f, g) {
            switch (Ve(b, a, f)) {
                case 0:
                    a = Y[a] ? a + "_annotation" : a;
                    d = {};
                    d.iframeNode = b;
                    d.userParams = c;
                    Oe(a, d);
                    break;
                case 1:
                    if (b.parentNode) {
                        for (var h in c) {
                            if ((f = G(c, h))) (f = c[h]), (f = !!f && "object" === typeof f && (!f.toString || f.toString === Object.prototype.toString || f.toString === Array.prototype.toString));
                            if (f)
                                try {
                                    c[h] = Pd(c[h]);
                                } catch (Ca) {
                                    delete c[h];
                                }
                        }
                        f = !0;
                        c.dontclear && (f = !1);
                        delete c.dontclear;
                        hd();
                        h = ze(a, c, e);
                        e = g || {};
                        e.allowPost = 1;
                        e.attributes = we;
                        e.dontclear = !f;
                        g = {};
                        g.userParams = c;
                        g.url = h;
                        g.type = a;
                        if (c.rd) var k = b;
                        else (k = document.createElement("div")), b.setAttribute("data-gapistub", !0), (k.style.cssText = "position:absolute;width:450px;left:-10000px;"), b.parentNode.insertBefore(k, b);
                        g.siteElement = k;
                        k.id || ((b = k), E(ye, a, 0), (f = "___" + a + "_" + ye[a]++), (b.id = f));
                        b = F();
                        b[">type"] = a;
                        H(c, b);
                        f = h;
                        c = k;
                        h = e || {};
                        b = h.attributes || {};
                        I(!(h.allowPost || h.forcePost) || !b.onload, "onload is not supported by post iframe (allowPost or forcePost)");
                        e = b = f;
                        ne.test(b) && ((e = S("iframes/" + e.substring(1) + "/url")), I(!!e, "Unknown iframe url config for - " + b));
                        f = Wb(D, e.replace(oe, qe));
                        b = c.ownerDocument || D;
                        e = h;
                        var l = 0;
                        do k = e.id || ["I", ke++, "_", new Date().getTime()].join("");
                        while (b.getElementById(k) && 5 > ++l);
                        I(5 > l, "Error creating iframe id");
                        e = k;
                        k = h;
                        l = {};
                        var m = {};
                        b.documentMode && 9 > b.documentMode && (l.hostiemode = b.documentMode);
                        H(k.queryParams || {}, l);
                        H(k.fragmentParams || {}, m);
                        var t = k.pfname;
                        var u = F();
                        S("iframes/dropLegacyIdParam") || (u.id = e);
                        u._gfid = e;
                        u.parent = b.location.protocol + "//" + b.location.host;
                        var q = K(b.location.href, "parent");
                        t = t || "";
                        !t && q && ((q = K(b.location.href, "_gfid", "") || K(b.location.href, "id", "")), (t = K(b.location.href, "pfname", "")), (t = q ? t + "/" + q : ""));
                        t || ((q = Od(K(b.location.href, "jcp", ""))) && "object" == typeof q && (t = (t = q.id) ? q.pfname + "/" + t : ""));
                        u.pfname = t;
                        k.connectWithJsonParam && ((q = {}), (q.jcp = Pd(u)), (u = q));
                        q = K(f, "rpctoken") || l.rpctoken || m.rpctoken;
                        if (!q) {
                            if (!(q = k.rpctoken)) {
                                q = String;
                                t = Math;
                                var z = t.round;
                                if (Xd) {
                                    var A = new C.Uint32Array(1);
                                    Wd.getRandomValues(A);
                                    A = Number("0." + A[0]);
                                } else (A = $d), (A += parseInt(be.substr(0, 20), 16)), (be = de(be)), (A /= ae + Math.pow(16, 20));
                                q = q(z.call(t, 1e8 * A));
                            }
                            u.rpctoken = q;
                        }
                        k.rpctoken = q;
                        H(u, k.connectWithQueryParams ? l : m);
                        q = b.location.href;
                        u = F();
                        (t = K(q, "_bsh", L.bsh)) && (u._bsh = t);
                        (q = fc(q)) && (u.jsh = q);
                        k.hintInFragment ? H(u, m) : H(u, l);
                        l = Ub(f, l, m, k.paramsSerializer);
                        f = h;
                        m = F();
                        H(ie, m);
                        H(f.attributes, m);
                        m.name = m.id = e;
                        m.src = l;
                        h.eurl = l;
                        h = (k = h) || {};
                        f = !!h.allowPost;
                        if (h.forcePost || (f && 2e3 < l.length)) {
                            f = Rb(l);
                            m.src = "";
                            k.dropDataPostorigin || (m["data-postorigin"] = l);
                            h = me(b, c, m, e);
                            if (-1 != navigator.userAgent.indexOf("WebKit")) {
                                var v = h.contentWindow.document;
                                v.open();
                                l = v.createElement("div");
                                m = {};
                                u = e + "_inner";
                                m.name = u;
                                m.src = "";
                                m.style = "display:none";
                                me(b, l, m, u, k);
                            }
                            l = (k = f.query[0]) ? k.split("&") : [];
                            k = [];
                            for (m = 0; m < l.length; m++) (u = l[m].split("=", 2)), k.push([decodeURIComponent(u[0]), decodeURIComponent(u[1])]);
                            f.query = [];
                            l = Sb(f);
                            I(Xb.test(l), "Invalid URL: " + l);
                            f = b.createElement("form");
                            f.method = "POST";
                            f.target = e;
                            f.style.display = "none";
                            e = l instanceof x ? l : Ua(l);
                            $a(f, "HTMLFormElement").action = Sa(e);
                            for (e = 0; e < k.length; e++) (l = b.createElement("input")), (l.type = "hidden"), (l.name = k[e][0]), (l.value = k[e][1]), f.appendChild(l);
                            c.appendChild(f);
                            f.submit();
                            f.parentNode.removeChild(f);
                            v && v.close();
                            v = h;
                        } else v = me(b, c, m, e, k);
                        g.iframeNode = v;
                        g.id = v.getAttribute("id");
                        v = g.id;
                        c = F();
                        c.id = v;
                        c.userParams = g.userParams;
                        c.url = g.url;
                        c.type = g.type;
                        c.state = 1;
                        R[v] = c;
                        v = g;
                    } else v = null;
                    v && ((g = v.id) && d.push(g), Oe(a, v));
            }
        },
        Ve = function (a, b, c) {
            if (a && 1 === a.nodeType && b) {
                if (c) return 1;
                if (Y[b]) {
                    if (ec[a.nodeName.toLowerCase()]) return (a = a.innerHTML) && a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "") ? 0 : 1;
                } else {
                    if (Ge[b]) return 0;
                    if (Fe[b]) return 1;
                }
            }
            return null;
        },
        De = function (a, b) {
            var c = b.type;
            delete b.type;
            var d = ("string" === typeof a ? document.getElementById(a) : a) || void 0;
            if (d) {
                a = {};
                for (var e in b) G(b, e) && (a[e.toLowerCase()] = b[e]);
                a.rd = 1;
                (b = !!a.ri) && delete a.ri;
                e = [];
                Pe(c, d, a, e, 0, b, void 0);
                Qe(c, e);
            } else fd("string" === "gapi." + c + ".render: missing element " + typeof a ? a : "");
        };
    E(J, "platform", {}).go = Me;
    Ne = function (a) {
        for (var b = ["_c", "jsl", "h"], c = 0; c < b.length && a; c++) a = a[b[c]];
        b = fc(zb.href);
        return !a || (0 != a.indexOf("n;") && 0 != b.indexOf("n;") && a !== b);
    };
    Qe = function (a, b) {
        We(a, b);
    };
    var ac = function (a) {
            Le(a, !0);
        },
        Xe = function (a, b) {
            b = b || [];
            for (var c = 0; c < b.length; ++c) a(b[c]);
            for (a = 0; a < b.length; a++) Re(b[a]);
        };
    rc.push([
        "platform",
        function (a, b, c) {
            Ie = c;
            b && He.push(b);
            Xe(Se, a);
            Xe(Te, c._c.annotation);
            Xe(Ue, c._c.bimodal);
            Zc();
            Xc();
            if ("explicit" != Q("parsetags")) {
                gc(a);
                dd(cd()) && !Q("disableRealtimeCallback") && hd();
                if (c && (a = c.callback)) {
                    var d = Lb(a);
                    delete c.callback;
                }
                cc(function () {
                    ac(d);
                });
            }
        },
    ]);
    J._pl = !0;
    var Ye = function (a) {
        a = (a = R[a]) ? a.oid : void 0;
        if (a) {
            var b = D.getElementById(a);
            b && b.parentNode.removeChild(b);
            delete R[a];
            Ye(a);
        }
    };
    var Ze = /^\{h:'/,
        $e = /^!_/,
        af = "",
        We = function (a, b) {
            function c() {
                Zb("message", d, "remove", "de");
            }
            function d(f) {
                var g = f.data,
                    h = f.origin;
                if (bf(g, b)) {
                    var k = e;
                    e = !1;
                    k && M("rqe");
                    cf(a, function () {
                        k && M("rqd");
                        c();
                        for (var l = E(L, "RPMQ", []), m = 0; m < l.length; m++) l[m]({ data: g, origin: h });
                    });
                }
            }
            if (0 !== b.length) {
                af = K(zb.href, "pfname", "");
                var e = !0;
                Zb("message", d, "add", "at");
                Rc(a, c);
            }
        },
        bf = function (a, b) {
            a = String(a);
            if (Ze.test(a)) return !0;
            var c = !1;
            $e.test(a) && ((c = !0), (a = a.substr(2)));
            if (!/^\{/.test(a)) return !1;
            var d = Od(a);
            if (!d) return !1;
            a = d.f;
            if (d.s && a && -1 != Cb.call(b, a)) {
                if ("_renderstart" === d.s || d.s === af + "/" + a + "::_renderstart")
                    if (((d = d.a && d.a[c ? 0 : 1]), (b = D.getElementById(a)), jd(a, 2), d && b && d.width && d.height)) {
                        a: {
                            c = b.parentNode;
                            a = d || {};
                            if (gd()) {
                                var e = b.id;
                                if (e) {
                                    d = (d = R[e]) ? d.state : void 0;
                                    if (1 === d || 4 === d) break a;
                                    Ye(e);
                                }
                            }
                            (d = c.nextSibling) && d.getAttribute && d.getAttribute("data-gapistub") && (c.parentNode.removeChild(d), (c.style.cssText = ""));
                            d = a.width;
                            var f = a.height,
                                g = c.style;
                            g.textIndent = "0";
                            g.margin = "0";
                            g.padding = "0";
                            g.background = "transparent";
                            g.borderStyle = "none";
                            g.cssFloat = "none";
                            g.styleFloat = "none";
                            g.lineHeight = "normal";
                            g.fontSize = "1px";
                            g.verticalAlign = "baseline";
                            c = c.style;
                            c.display = "inline-block";
                            g = b.style;
                            g.position = "static";
                            g.left = "0";
                            g.top = "0";
                            g.visibility = "visible";
                            d && (c.width = g.width = d + "px");
                            f && (c.height = g.height = f + "px");
                            a.verticalAlign && (c.verticalAlign = a.verticalAlign);
                            e && jd(e, 3);
                        }
                        b["data-csi-wdt"] = new Date().getTime();
                    }
                return !0;
            }
            return !1;
        },
        cf = function (a, b) {
            Rc(a, b);
        };
    var df = function (a, b) {
        this.N = a;
        a = b || {};
        this.ha = Number(a.maxAge) || 0;
        this.W = a.domain;
        this.Y = a.path;
        this.ia = !!a.secure;
    };
    df.prototype.read = function () {
        for (var a = this.N + "=", b = document.cookie.split(/;\s*/), c = 0; c < b.length; ++c) {
            var d = b[c];
            if (0 == d.indexOf(a)) return d.substr(a.length);
        }
    };
    df.prototype.write = function (a, b) {
        if (!ef.test(this.N)) throw "Invalid cookie name";
        if (!ff.test(a)) throw "Invalid cookie value";
        a = this.N + "=" + a;
        this.W && (a += ";domain=" + this.W);
        this.Y && (a += ";path=" + this.Y);
        b = "number" === typeof b ? b : this.ha;
        if (0 <= b) {
            var c = new Date();
            c.setSeconds(c.getSeconds() + b);
            a += ";expires=" + c.toUTCString();
        }
        this.ia && (a += ";secure");
        document.cookie = a;
        return !0;
    };
    df.prototype.clear = function () {
        this.write("", 0);
    };
    var ff = /^[-+/_=.:|%&a-zA-Z0-9@]*$/,
        ef = /^[A-Z_][A-Z0-9_]{0,63}$/;
    df.iterate = function (a) {
        for (var b = document.cookie.split(/;\s*/), c = 0; c < b.length; ++c) {
            var d = b[c].split("="),
                e = d.shift();
            a(e, d.join("="));
        }
    };
    var gf = function (a) {
        this.G = a;
    };
    gf.prototype.read = function () {
        if (Z.hasOwnProperty(this.G)) return Z[this.G];
    };
    gf.prototype.write = function (a) {
        Z[this.G] = a;
        return !0;
    };
    gf.prototype.clear = function () {
        delete Z[this.G];
    };
    var Z = {};
    gf.iterate = function (a) {
        for (var b in Z) Z.hasOwnProperty(b) && a(b, Z[b]);
    };
    var hf = "https:" === window.location.protocol,
        jf = hf || "http:" === window.location.protocol ? df : gf,
        kf = function (a) {
            var b = a.substr(1),
                c = "",
                d = window.location.hostname;
            if ("" !== b) {
                c = parseInt(b, 10);
                if (isNaN(c)) return null;
                b = d.split(".");
                if (b.length < c - 1) return null;
                b.length == c - 1 && (d = "." + d);
            } else d = "";
            return { j: "S" == a.charAt(0), domain: d, o: c };
        },
        lf = function () {
            var a,
                b = null;
            jf.iterate(function (c, d) {
                0 === c.indexOf("G_AUTHUSER_") && ((c = kf(c.substring(11))), !a || (c.j && !a.j) || (c.j == a.j && c.o > a.o)) && ((a = c), (b = d));
            });
            return { fa: a, K: b };
        };
    function mf(a) {
        if (0 !== a.indexOf("GCSC")) return null;
        var b = { X: !1 };
        a = a.substr(4);
        if (!a) return b;
        var c = a.charAt(0);
        a = a.substr(1);
        var d = a.lastIndexOf("_");
        if (-1 == d) return b;
        var e = kf(a.substr(d + 1));
        if (null == e) return b;
        a = a.substring(0, d);
        if ("_" !== a.charAt(0)) return b;
        d = "E" === c && e.j;
        return (!d && ("U" !== c || e.j)) || (d && !hf) ? b : { X: !0, j: d, la: a.substr(1), domain: e.domain, o: e.o };
    }
    var nf = function (a) {
            if (!a) return [];
            a = a.split("=");
            return a[1] ? a[1].split("|") : [];
        },
        of = function (a) {
            a = a.split(":");
            return { clientId: a[0].split("=")[1], ka: nf(a[1]), na: nf(a[2]), ma: nf(a[3]) };
        },
        pf = function () {
            var a = lf(),
                b = a.fa;
            a = a.K;
            if (null !== a) {
                var c;
                jf.iterate(function (f, g) {
                    (f = mf(f)) && f.X && f.j == b.j && f.o == b.o && (c = g);
                });
                if (c) {
                    var d = of(c),
                        e = d && d.ka[Number(a)];
                    d = d && d.clientId;
                    if (e) return { K: a, ja: e, clientId: d };
                }
            }
            return null;
        };
    var rf = function () {
        this.V = qf;
    };
    n = rf.prototype;
    n.aa = function () {
        this.M || ((this.A = 0), (this.M = !0), this.Z());
    };
    n.Z = function () {
        this.M && (this.V() ? (this.A = this.T) : (this.A = Math.min(2 * (this.A || this.T), 120)), window.setTimeout(pa(this.Z, this), 1e3 * this.A));
    };
    n.A = 0;
    n.T = 2;
    n.V = null;
    n.M = !1;
    for (var sf = 0; 64 > sf; ++sf);
    var tf = null;
    gd = function () {
        return (L.oa = !0);
    };
    hd = function () {
        L.oa = !0;
        var a = pf();
        (a = a && a.K) && Yc("googleapis.config/sessionIndex", a);
        tf || (tf = E(L, "ss", new rf()));
        a = tf;
        a.aa && a.aa();
    };
    var qf = function () {
        var a = pf(),
            b = (a && a.ja) || null,
            c = a && a.clientId;
        Rc("auth", {
            callback: function () {
                var d = C.gapi.auth,
                    e = { client_id: c, session_state: b };
                d.checkSessionState(e, function (f) {
                    var g = e.session_state,
                        h = Q("isLoggedIn");
                    f = Q("debug/forceIm") ? !1 : (g && f) || (!g && !f);
                    if ((h = h != f)) Yc("isLoggedIn", f), hd(), Ee(), f || ((f = d.signOut) ? f() : (f = d.setToken) && f(null));
                    f = cd();
                    var k = Q("savedUserState");
                    g = d._guss(f.cookiepolicy);
                    k = k != g && "undefined" != typeof k;
                    Yc("savedUserState", g);
                    (h || k) && dd(f) && !Q("disableRealtimeCallback") && d._pimf(f, !0);
                });
            },
        });
        return !0;
    };
    M("bs0", !0, window.gapi._bs);
    M("bs1", !0);
    delete window.gapi._bs;
}.call(this));
gapi.load("", {
    callback: window["gapi_onload"],
    _c: {
        jsl: {
            ci: {
                deviceType: "desktop",
                "oauth-flow": {
                    authUrl: "https://accounts.google.com/o/oauth2/auth",
                    proxyUrl: "https://accounts.google.com/o/oauth2/postmessageRelay",
                    disableOpt: true,
                    idpIframeUrl: "https://accounts.google.com/o/oauth2/iframe",
                    usegapi: false,
                },
                debug: { reportExceptionRate: 0.05, forceIm: false, rethrowException: false, host: "https://apis.google.com" },
                enableMultilogin: true,
                "googleapis.config": { auth: { useFirstPartyAuthV2: true } },
                isPlusUser: false,
                inline: { css: 1 },
                disableRealtimeCallback: false,
                drive_share: { skipInitCommand: true },
                csi: { rate: 0.01 },
                client: { cors: false },
                isLoggedIn: true,
                signInDeprecation: { rate: 0.0 },
                include_granted_scopes: true,
                llang: "en",
                iframes: {
                    youtube: { params: { location: ["search", "hash"] }, url: ":socialhost:/:session_prefix:_/widget/render/youtube?usegapi\u003d1", methods: ["scroll", "openwindow"] },
                    ytsubscribe: { url: "https://www.youtube.com/subscribe_embed?usegapi\u003d1" },
                    plus_circle: { params: { url: "" }, url: ":socialhost:/:session_prefix::se:_/widget/plus/circle?usegapi\u003d1" },
                    plus_share: { params: { url: "" }, url: ":socialhost:/:session_prefix::se:_/+1/sharebutton?plusShare\u003dtrue\u0026usegapi\u003d1" },
                    rbr_s: { params: { url: "" }, url: ":socialhost:/:session_prefix::se:_/widget/render/recobarsimplescroller" },
                    ":source:": "3p",
                    playemm: { url: "https://play.google.com/work/embedded/search?usegapi\u003d1\u0026usegapi\u003d1" },
                    savetoandroidpay: { url: "https://pay.google.com/gp/v/widget/save" },
                    blogger: { params: { location: ["search", "hash"] }, url: ":socialhost:/:session_prefix:_/widget/render/blogger?usegapi\u003d1", methods: ["scroll", "openwindow"] },
                    evwidget: { params: { url: "" }, url: ":socialhost:/:session_prefix:_/events/widget?usegapi\u003d1" },
                    partnersbadge: { url: "https://www.gstatic.com/partners/badge/templates/badge.html?usegapi\u003d1" },
                    dataconnector: { url: "https://dataconnector.corp.google.com/:session_prefix:ui/widgetview?usegapi\u003d1" },
                    surveyoptin: { url: "https://www.google.com/shopping/customerreviews/optin?usegapi\u003d1" },
                    ":socialhost:": "https://apis.google.com",
                    shortlists: { url: "" },
                    hangout: { url: "https://talkgadget.google.com/:session_prefix:talkgadget/_/widget" },
                    plus_followers: { params: { url: "" }, url: ":socialhost:/_/im/_/widget/render/plus/followers?usegapi\u003d1" },
                    post: { params: { url: "" }, url: ":socialhost:/:session_prefix::im_prefix:_/widget/render/post?usegapi\u003d1" },
                    ":gplus_url:": "https://plus.google.com",
                    signin: { params: { url: "" }, url: ":socialhost:/:session_prefix:_/widget/render/signin?usegapi\u003d1", methods: ["onauth"] },
                    rbr_i: { params: { url: "" }, url: ":socialhost:/:session_prefix::se:_/widget/render/recobarinvitation" },
                    share: { url: ":socialhost:/:session_prefix::im_prefix:_/widget/render/share?usegapi\u003d1" },
                    plusone: { params: { count: "", size: "", url: "" }, url: ":socialhost:/:session_prefix::se:_/+1/fastbutton?usegapi\u003d1" },
                    comments: { params: { location: ["search", "hash"] }, url: ":socialhost:/:session_prefix:_/widget/render/comments?usegapi\u003d1", methods: ["scroll", "openwindow"] },
                    ":im_socialhost:": "https://plus.googleapis.com",
                    backdrop: { url: "https://clients3.google.com/cast/chromecast/home/widget/backdrop?usegapi\u003d1" },
                    visibility: { params: { url: "" }, url: ":socialhost:/:session_prefix:_/widget/render/visibility?usegapi\u003d1" },
                    autocomplete: { params: { url: "" }, url: ":socialhost:/:session_prefix:_/widget/render/autocomplete" },
                    additnow: { url: "https://apis.google.com/marketplace/button?usegapi\u003d1", methods: ["launchurl"] },
                    ":signuphost:": "https://plus.google.com",
                    ratingbadge: { url: "https://www.google.com/shopping/customerreviews/badge?usegapi\u003d1" },
                    appcirclepicker: { url: ":socialhost:/:session_prefix:_/widget/render/appcirclepicker" },
                    follow: { url: ":socialhost:/:session_prefix:_/widget/render/follow?usegapi\u003d1" },
                    community: { url: ":ctx_socialhost:/:session_prefix::im_prefix:_/widget/render/community?usegapi\u003d1" },
                    sharetoclassroom: { url: "https://classroom.google.com/sharewidget?usegapi\u003d1" },
                    ytshare: { params: { url: "" }, url: ":socialhost:/:session_prefix:_/widget/render/ytshare?usegapi\u003d1" },
                    plus: { url: ":socialhost:/:session_prefix:_/widget/render/badge?usegapi\u003d1" },
                    family_creation: { params: { url: "" }, url: "https://families.google.com/webcreation?usegapi\u003d1\u0026usegapi\u003d1" },
                    commentcount: { url: ":socialhost:/:session_prefix:_/widget/render/commentcount?usegapi\u003d1" },
                    configurator: { url: ":socialhost:/:session_prefix:_/plusbuttonconfigurator?usegapi\u003d1" },
                    zoomableimage: { url: "https://ssl.gstatic.com/microscope/embed/" },
                    appfinder: { url: "https://workspace.google.com/:session_prefix:marketplace/appfinder?usegapi\u003d1" },
                    savetowallet: { url: "https://pay.google.com/gp/v/widget/save" },
                    person: { url: ":socialhost:/:session_prefix:_/widget/render/person?usegapi\u003d1" },
                    savetodrive: { url: "https://drive.google.com/savetodrivebutton?usegapi\u003d1", methods: ["save"] },
                    page: { url: ":socialhost:/:session_prefix:_/widget/render/page?usegapi\u003d1" },
                    card: { url: ":socialhost:/:session_prefix:_/hovercard/card" },
                },
            },
            h: "m;/_/scs/apps-static/_/js/k\u003doz.gapi.en.vQiXRrxCe40.O/am\u003dAQ/d\u003d1/rs\u003dAGLTcCMBxIGVyXSdvvcs43a64yHt_P7dfg/m\u003d__features__",
            u: "https://apis.google.com/js/platform.js",
            hee: true,
            fp: "18156f23e78d108a015d5f3c37a78a91a7028365",
            dpo: false,
        },
        platform: [
            "additnow",
            "backdrop",
            "blogger",
            "comments",
            "commentcount",
            "community",
            "donation",
            "family_creation",
            "follow",
            "hangout",
            "health",
            "page",
            "partnersbadge",
            "person",
            "playemm",
            "playreview",
            "plus",
            "plusone",
            "post",
            "ratingbadge",
            "savetoandroidpay",
            "savetodrive",
            "savetowallet",
            "sharetoclassroom",
            "shortlists",
            "signin2",
            "surveyoptin",
            "visibility",
            "youtube",
            "ytsubscribe",
            "zoomableimage",
        ],
        fp: "18156f23e78d108a015d5f3c37a78a91a7028365",
        annotation: ["interactivepost", "recobar", "signin2", "autocomplete", "profile"],
        bimodal: ["signin", "share"],
    },
});
