! function($) {
    ! function($, window, undefined) {
        "use strict";

        function $proxy(t, e) {
            return "function" == typeof $.proxy ? $.proxy(t, e) : function(i) {
                t.call(e, i)
            }
        }

        function $data(t, e, i) {
            return "function" == typeof $.data ? $.data(t, e, i) : i ? void 0 : $(t).hasClass("rs-control")
        }

        function $isPlainObject(t) {
            if ("function" == typeof $.isPlainObject) return $.isPlainObject(t);
            var e = JSON.stringify(t);
            return "object" == typeof t && t.length === undefined && e.length > 2 && "{" === e.substr(0, 1) && "}" === e.substr(e.length - 1)
        }

        function isNumber(t) {
            return t = parseFloat(t), "number" == typeof t && !isNaN(t)
        }

        function createElement(t) {
            var e = t.split(".");
            return $(document.createElement(e[0])).addClass(e[1] || "")
        }

        function getdistance(t, e) {
            return Math.sqrt((t.x - e.x) * (t.x - e.x) + (t.y - e.y) * (t.y - e.y))
        }

        function setTransform(t, e) {
            return t.css("-webkit-transform", "rotate(" + e + "deg)"), t.css("-moz-transform", "rotate(" + e + "deg)"), t.css("-ms-transform", "rotate(" + e + "deg)"), t.css("-o-transform", "rotate(" + e + "deg)"), t.css("transform", "rotate(" + e + "deg)"), t
        }

        function RoundSlider(t, e) {
            t.id && (window[t.id] = this), this.control = $(t), this.options = $.extend({}, this.defaults, e), this._raise("beforeCreate") !== !1 ? (this._init(), this._raise("create")) : this._removeData()
        }

        function CreateRoundSlider(t, e) {
            for (var i, s, n = 0; n < this.length; n++)
                if (i = this[n], s = $data(i, pluginName)) {
                    if ($isPlainObject(t)) "function" == typeof s.option ? s.option(t) : i.id && window[i.id] && "function" == typeof window[i.id].option && window[i.id].option(t);
                    else if ("string" == typeof t && "function" == typeof s[t]) {
                        if (("option" == t || t.startsWith("get")) && e[2] === undefined) return s[t](e[1]);
                        s[t](e[1], e[2])
                    }
                } else $data(i, pluginName, new RoundSlider(i, t));
            return this
        }
        var pluginName = "roundSlider";
        $.fn[pluginName] = function(t) {
            return CreateRoundSlider.call(this, t, arguments)
        }, RoundSlider.prototype = {
            pluginName: pluginName,
            version: "1.0",
            options: {},
            defaults: {
                min: 0,
                max: 100,
                step: 1,
                value: null,
                radius: 85,
                width: 18,
                handleSize: "+0",
                startAngle: 0,
                endAngle: "+360",
                animation: !0,
                showTooltip: !0,
                editableTooltip: !0,
                readOnly: !1,
                disabled: !1,
                keyboardAction: !0,
                mouseScrollAction: !1,
                sliderType: "default",
                circleShape: "full",
                handleShape: "round",
                beforeCreate: null,
                create: null,
                start: null,
                drag: null,
                change: null,
                stop: null,
                tooltipFormat: null
            },
            _props: function() {
                return {
                    numberType: ["min", "max", "step", "radius", "width", "startAngle"],
                    booleanType: ["animation", "showTooltip", "editableTooltip", "readOnly", "disabled", "keyboardAction", "mouseScrollAction"],
                    stringType: ["sliderType", "circleShape", "handleShape"]
                }
            },
            control: null,
            _init: function() {
                this._initialize(), this._update(), this._render()
            },
            _initialize: function() {
                this._isBrowserSupport = this._isBrowserSupported(), this._isBrowserSupport && (this._originalObj = this.control.clone(), this._isReadOnly = !1, this._checkDataType(), this._refreshCircleShape())
            },
            _render: function() {
                if (this.container = createElement("div.rs-container"), this.innerContainer = createElement("div.rs-inner-container"), this.block = createElement("div.rs-block rs-outer rs-border"), this.container.append(this.innerContainer.append(this.block)), this.control.addClass("rs-control").empty().append(this.container), this._setRadius(), this._isBrowserSupport) this._createLayers(), this._setProperties(), this._setValue(), this._bindControlEvents("_bind"), this._checkIE();
                else {
                    var t = createElement("div.rs-msg");
                    t.html("function" == typeof this._throwError ? this._throwError() : this._throwError), this.control.empty().addClass("rs-error").append(t)
                }
            },
            _update: function() {
                this._validateSliderType(), this._updateStartEnd(), this._validateStartEnd(), this._handle1 = this._handle2 = this._handleDefaults(), this._analyzeModelValue(), this._validateModelValue()
            },
            _createLayers: function() {
                var t, e = this.options.width,
                    i = this._start;
                t = createElement("div.rs-path rs-transition"), this._rangeSlider || this._showRange ? (this.block1 = t.clone().addClass("rs-range-color").rsRotate(i), this.block2 = t.clone().addClass("rs-range-color").css("opacity", "0").rsRotate(i), this.block3 = t.clone().addClass("rs-path-color").rsRotate(i), this.block4 = t.addClass("rs-path-color").css({
                    opacity: "1",
                    "z-index": "1"
                }).rsRotate(i - 180), this.block.append(this.block1, this.block2, this.block3, this.block4).addClass("rs-split")) : this.block.append(t.addClass("rs-path-color")), this.lastBlock = createElement("span.rs-block").css({
                    padding: e
                }), this.innerBlock = createElement("div.rs-inner rs-bg-color rs-border"), this.lastBlock.append(this.innerBlock), this.block.append(this.lastBlock), this._appendHandle(), this._appendOverlay(), this._appendHiddenField()
            },
            _setProperties: function() {
                this._prechange = this._predrag = this.options.value, this._setHandleShape(), this._addAnimation(), this._appendTooltip(), this.options.showTooltip || this._removeTooltip(), this.options.disabled ? this.disable() : this.options.readOnly && this._readOnly(!0), this.options.mouseScrollAction && this._bindScrollEvents("_bind")
            },
            _setValue: function() {
                if (this._rangeSlider) this._setHandleValue(1), this._setHandleValue(2);
                else {
                    this._showRange && this._setHandleValue(1);
                    var t = "default" == this.options.sliderType ? this._active || 1 : parseFloat(this.bar.children().attr("index"));
                    this._setHandleValue(t)
                }
            },
            _appendTooltip: function() {
                0 === this.container.children(".rs-tooltip").length && (this.tooltip = createElement("span.rs-tooltip rs-tooltip-text"), this.container.append(this.tooltip), this._tooltipEditable(), this._updateTooltip())
            },
            _removeTooltip: function() {
                0 != this.container.children(".rs-tooltip").length && this.tooltip && this.tooltip.remove()
            },
            _tooltipEditable: function() {
                if (this.tooltip && this.options.showTooltip) {
                    var t;
                    this.options.editableTooltip ? (this.tooltip.addClass("edit"), t = "_bind") : (this.tooltip.removeClass("edit"), t = "_unbind"), this[t](this.tooltip, "click", this._editTooltip)
                }
            },
            _editTooltip: function() {
                this.tooltip.hasClass("edit") && !this._isReadOnly && (this.input = createElement("input.rs-input rs-tooltip-text").css({
                    height: this.tooltip.outerHeight(),
                    width: this.tooltip.outerWidth()
                }), this.tooltip.html(this.input).removeClass("edit").addClass("hover"), this.input.val(this._getTooltipValue(!0)).focus(), this._bind(this.input, "blur", this._focusOut), this._bind(this.input, "change", this._focusOut))
            },
            _focusOut: function(t) {
                "change" == t.type ? (this.options.value = this.input.val().replace("-", ","), this._analyzeModelValue(), this._validateModelValue(), this._setValue(), this.input.val(this._getTooltipValue(!0))) : this.tooltip.addClass("edit").removeClass("hover"), this._raiseEvent("change")
            },
            _setHandleShape: function() {
                var t = this.options.handleShape;
                this._handles().removeClass("rs-handle-dot rs-handle-square"), "dot" == t ? this._handles().addClass("rs-handle-dot") : "square" == t ? this._handles().addClass("rs-handle-square") : this.options.handleShape = this.defaults.handleShape
            },
            _setHandleValue: function(t) {
                this._active = t;
                var e = this["_handle" + t];
                "min-range" != this.options.sliderType && (this.bar = this._activeHandleBar()), this._changeSliderValue(e.value, e.angle)
            },
            _setAnimation: function() {
                this.options.animation ? this._addAnimation() : this._removeAnimation()
            },
            _addAnimation: function() {
                this.options.animation && this.control.addClass("rs-animation")
            },
            _removeAnimation: function() {
                this.control.removeClass("rs-animation")
            },
            _setRadius: function() {
                var t, e, i = this.options.radius,
                    s = 2 * i,
                    n = this.options.circleShape,
                    a = s,
                    o = s;
                if (this.container.removeClass().addClass("rs-container"), 0 === n.indexOf("half")) {
                    switch (n) {
                        case "half-top":
                        case "half-bottom":
                            a = i, o = s;
                            break;
                        case "half-left":
                        case "half-right":
                            a = s, o = i
                    }
                    this.container.addClass(n.replace("half-", "") + " half")
                } else 0 === n.indexOf("quarter") ? (a = o = i, t = n.split("-"), this.container.addClass(t[0] + " " + t[1] + " " + t[2])) : this.container.addClass("full " + n);
                e = {
                    height: a,
                    width: o
                }, this.control.css(e), this.container.css(e)
            },
            _border: function() {
                return 2 * parseFloat(this.block.css("border-top-width"))
            },
            _appendHandle: function() {
                (this._rangeSlider || !this._showRange) && this._createHandle(1), (this._rangeSlider || this._showRange) && this._createHandle(2), this._startLine = this._addSeperator(this._start, "rs-start"), this._endLine = this._addSeperator(this._start + this._end, "rs-end")
            },
            _addSeperator: function(t, e) {
                var i = createElement("span.rs-seperator").css({
                        width: this.options.width,
                        "margin-left": this._border() / 2
                    }),
                    s = createElement("span.rs-bar rs-transition " + e).append(i).rsRotate(t);
                return this.container.append(s), s
            },
            _updateSeperator: function() {
                this._startLine.rsRotate(this._start), this._endLine.rsRotate(this._start + this._end)
            },
            _createHandle: function(t) {
                var e, i = createElement("div.rs-handle rs-move");
                i.attr({
                    index: t,
                    tabIndex: "0"
                });
                var s = this.control[0].id,
                    s = s ? s + "_" : "",
                    n = s + "handle" + ("range" == this.options.sliderType ? "_" + (1 == t ? "start" : "end") : "");
                return i.attr({
                    role: "slider",
                    "aria-label": n
                }), e = createElement("div.rs-bar rs-transition").css("z-index", "4").append(i).rsRotate(this._start), e.addClass("range" == this.options.sliderType && 2 == t ? "rs-second" : "rs-first"), this.container.append(e), this._refreshHandle(), this.bar = e, this._active = t, 1 != t && 2 != t && (this["_handle" + t] = this._handleDefaults()), this._bind(i, "focus", this._handleFocus), this._bind(i, "blur", this._handleBlur), i
            },
            _refreshHandle: function() {
                var hSize = this.options.handleSize,
                    h, w, isSquare = !0,
                    s, diff;
                if ("string" == typeof hSize && isNumber(hSize))
                    if ("+" === hSize.charAt(0) || "-" === hSize.charAt(0)) try {
                        hSize = eval(this.options.width + hSize.charAt(0) + Math.abs(parseFloat(hSize)))
                    } catch (e) {
                        console.warn(e)
                    } else hSize.indexOf(",") && (s = hSize.split(","), isNumber(s[0]) && isNumber(s[1]) && (w = parseFloat(s[0]), h = parseFloat(s[1]), isSquare = !1));
                isSquare && (h = w = isNumber(hSize) ? parseFloat(hSize) : this.options.width), diff = (this.options.width + this._border() - w) / 2, this._handles().css({
                    height: h,
                    width: w,
                    margin: -h / 2 + "px 0 0 " + diff + "px"
                })
            },
            _handleDefaults: function() {
                return {
                    angle: this._valueToAngle(this.options.min),
                    value: this.options.min
                }
            },
            _handles: function() {
                return this.container.children("div.rs-bar").find(".rs-handle")
            },
            _activeHandleBar: function() {
                return $(this.container.children("div.rs-bar")[this._active - 1])
            },
            _handleArgs: function() {
                var t = this["_handle" + this._active];
                return {
                    element: this._activeHandleBar().children(),
                    index: this._active,
                    value: t ? t.value : null,
                    angle: t ? t.angle : null
                }
            },
            _raiseEvent: function(t) {
                return this._updateTooltip(), "change" == t && this._updateHidden(), this["_pre" + t] !== this.options.value ? (this["_pre" + t] = this.options.value, this._raise(t, {
                    value: this.options.value,
                    handle: this._handleArgs()
                })) : void 0
            },
            _elementDown: function(t) {
                var e, i, s, n, a;
                if (!this._isReadOnly)
                    if (e = $(t.target), e.hasClass("rs-handle")) this._handleDown(t);
                    else {
                        var o = this._getXY(t),
                            r = this._getCenterPoint(),
                            l = getdistance(o, r),
                            h = this.block.outerWidth() / 2,
                            d = h - (this.options.width + this._border());
                        l >= d && h >= l && (t.preventDefault(), i = this.control.find(".rs-handle.rs-focus"), this.control.attr("tabindex", "0").focus().removeAttr("tabindex"), s = this._getAngleValue(o, r), n = s.angle, a = s.value, this._rangeSlider && (i = this.control.find(".rs-handle.rs-focus"), this._active = 1 == i.length ? parseFloat(i.attr("index")) : this._handle2.value - a < a - this._handle1.value ? 2 : 1, this.bar = this._activeHandleBar()), this._changeSliderValue(a, n), this._raiseEvent("change"))
                    }
            },
            _handleDown: function(t) {
                t.preventDefault();
                var e = $(t.target);
                e.focus(), this._removeAnimation(), this._bindMouseEvents("_bind"), this.bar = e.parent(), this._active = parseFloat(e.attr("index")), this._handles().removeClass("rs-move"), this._raise("start", {
                    handle: this._handleArgs()
                })
            },
            _handleMove: function(t) {
                t.preventDefault();
                var e, i, s = this._getXY(t),
                    n = this._getCenterPoint(),
                    a = this._getAngleValue(s, n);
                e = a.angle, i = a.value, this._changeSliderValue(i, e), this._raiseEvent("drag")
            },
            _handleUp: function() {
                this._handles().addClass("rs-move"), this._bindMouseEvents("_unbind"), this._addAnimation(), this._raiseEvent("change"), this._raise("stop", {
                    handle: this._handleArgs()
                })
            },
            _handleFocus: function(t) {
                if (!this._isReadOnly) {
                    var e = $(t.target);
                    this._handles().removeClass("rs-focus"), e.addClass("rs-focus"), this.bar = e.parent(), this._active = parseFloat(e.attr("index")), this.options.keyboardAction && (this._bindKeyboardEvents("_unbind"), this._bindKeyboardEvents("_bind")), this.control.find("div.rs-bar").css("z-index", "4"), this.bar.css("z-index", "5")
                }
            },
            _handleBlur: function() {
                this._handles().removeClass("rs-focus"), this.options.keyboardAction && this._bindKeyboardEvents("_unbind")
            },
            _handleKeyDown: function(t) {
                var e, i, s, n;
                this._isReadOnly || (e = t.keyCode, 27 == e && this._handles().blur(), e >= 35 && 40 >= e && (e >= 37 && 40 >= e && this._removeAnimation(), i = this["_handle" + this._active], t.preventDefault(), 38 == e || 37 == e ? s = this._round(this._limitValue(i.value + this.options.step)) : 39 == e || 40 == e ? s = this._round(this._limitValue(i.value - this._getMinusStep(i.value))) : 36 == e ? s = this._getKeyValue("Home") : 35 == e && (s = this._getKeyValue("End")), n = this._valueToAngle(s), this._changeSliderValue(s, n), this._raiseEvent("change")))
            },
            _handleKeyUp: function() {
                this._addAnimation()
            },
            _getMinusStep: function(t) {
                if (t == this.options.max) {
                    var e = (this.options.max - this.options.min) % this.options.step;
                    return 0 == e ? this.options.step : e
                }
                return this.options.step
            },
            _getKeyValue: function(t) {
                return this._rangeSlider ? "Home" == t ? 1 == this._active ? this.options.min : this._handle1.value : 1 == this._active ? this._handle2.value : this.options.max : "Home" == t ? this.options.min : this.options.max
            },
            _elementScroll: function(t) {
                if (!this._isReadOnly) {
                    t.preventDefault();
                    var e, i, s, n, a = t.originalEvent || t;
                    n = a.wheelDelta ? a.wheelDelta / 60 : a.detail ? -a.detail / 2 : 0, 0 != n && (this._updateActiveHandle(t), e = this["_handle" + this._active], i = e.value + (n > 0 ? this.options.step : -this._getMinusStep(e.value)), i = this._limitValue(i), s = this._valueToAngle(i), this._removeAnimation(), this._changeSliderValue(i, s), this._raiseEvent("change"), this._addAnimation())
                }
            },
            _updateActiveHandle: function(t) {
                var e = $(t.target);
                e.hasClass("rs-handle") && e.parent().parent()[0] == this.control[0] && (this.bar = e.parent(), this._active = parseFloat(e.attr("index"))), this.bar.find(".rs-handle").hasClass("rs-focus") || this.bar.find(".rs-handle").focus()
            },
            _bindControlEvents: function(t) {
                this[t](this.control, "mousedown", this._elementDown), this[t](this.control, "touchstart", this._elementDown)
            },
            _bindScrollEvents: function(t) {
                this[t](this.control, "mousewheel", this._elementScroll), this[t](this.control, "DOMMouseScroll", this._elementScroll)
            },
            _bindMouseEvents: function(t) {
                this[t]($(document), "mousemove", this._handleMove), this[t]($(document), "mouseup", this._handleUp), this[t]($(document), "mouseleave", this._handleUp), this[t]($(document), "touchmove", this._handleMove), this[t]($(document), "touchend", this._handleUp), this[t]($(document), "touchcancel", this._handleUp)
            },
            _bindKeyboardEvents: function(t) {
                this[t]($(document), "keydown", this._handleKeyDown), this[t]($(document), "keyup", this._handleKeyUp)
            },
            _changeSliderValue: function(t, e) {
                var i = this._oriAngle(e),
                    s = this._limitAngle(e);
                if (this._rangeSlider || this._showRange) {
                    if (1 == this._active && i <= this._oriAngle(this._handle2.angle) || 2 == this._active && i >= this._oriAngle(this._handle1.angle)) {
                        this["_handle" + this._active] = {
                            angle: e,
                            value: t
                        }, this.options.value = this._rangeSlider ? this._handle1.value + "," + this._handle2.value : t, this.bar.rsRotate(s), this._updateARIA(t);
                        var n = this._oriAngle(this._handle2.angle) - this._oriAngle(this._handle1.angle),
                            a = "1",
                            o = "0";
                        180 >= n && (a = "0", o = "1"), this.block2.css("opacity", a), this.block3.css("opacity", o), (1 == this._active ? this.block4 : this.block2).rsRotate(s - 180), (1 == this._active ? this.block1 : this.block3).rsRotate(s)
                    }
                } else this["_handle" + this._active] = {
                    angle: e,
                    value: t
                }, this.options.value = t, this.bar.rsRotate(s), this._updateARIA(t)
            },
            _updateARIA: function(t) {
                var e, i = this.options.min,
                    s = this.options.max;
                this.bar.children().attr({
                    "aria-valuenow": t
                }), "range" == this.options.sliderType ? (e = this._handles(), e.eq(0).attr({
                    "aria-valuemin": i
                }), e.eq(1).attr({
                    "aria-valuemax": s
                }), 1 == this._active ? e.eq(1).attr({
                    "aria-valuemin": t
                }) : e.eq(0).attr({
                    "aria-valuemax": t
                })) : this.bar.children().attr({
                    "aria-valuemin": i,
                    "aria-valuemax": s
                })
            },
            _getXY: function(t) {
                return -1 == t.type.indexOf("mouse") && (t = (t.originalEvent || t).changedTouches[0]), {
                    x: t.pageX,
                    y: t.pageY
                }
            },
            _getCenterPoint: function() {
                var t = this.block.offset();
                return {
                    x: t.left + this.block.outerWidth() / 2,
                    y: t.top + this.block.outerHeight() / 2
                }
            },
            _getAngleValue: function(t, e) {
                var i = Math.atan2(t.y - e.y, e.x - t.x),
                    s = -i / (Math.PI / 180);
                return s < this._start && (s += 360), s = this._checkAngle(s), this._processStepByAngle(s)
            },
            _checkAngle: function(t) {
                var e, i = this._oriAngle(t);
                return i > this._end && (e = this._oriAngle(this["_handle" + this._active].angle), t = this._start + (e <= this._end - e ? 0 : this._end)), t
            },
            _processStepByAngle: function(t) {
                var e = this._angleToValue(t);
                return this._processStepByValue(e)
            },
            _processStepByValue: function(t) {
                var e, i, s, n, a, o, r = this.options.step;
                return e = (t - this.options.min) % r, i = t - e, s = this._limitValue(i + r), n = this._limitValue(i - r), a = t >= i ? s - t > t - i ? i : s : i - t > t - n ? i : n, a = this._round(a), o = this._valueToAngle(a), {
                    value: a,
                    angle: o
                }
            },
            _round: function(t) {
                var e = this.options.step.toString().split(".");
                return e[1] ? parseFloat(t.toFixed(e[1].length)) : Math.round(t)
            },
            _oriAngle: function(t) {
                var e = t - this._start;
                return 0 > e && (e += 360), e
            },
            _limitAngle: function(t) {
                return t > 360 + this._start && (t -= 360), t < this._start && (t += 360), t
            },
            _limitValue: function(t) {
                return t < this.options.min && (t = this.options.min), t > this.options.max && (t = this.options.max), t
            },
            _angleToValue: function(t) {
                var e = this.options;
                return this._oriAngle(t) / this._end * (e.max - e.min) + e.min
            },
            _valueToAngle: function(t) {
                var e = this.options;
                return (t - e.min) / (e.max - e.min) * this._end + this._start
            },
            _appendHiddenField: function() {
                this._hiddenField = createElement("input").attr({
                    type: "hidden",
                    name: this.control[0].id || "",
                    value: this.options.value
                }), this.control.append(this._hiddenField)
            },
            _updateHidden: function() {
                this._hiddenField.val(this.options.value)
            },
            _updateTooltip: function() {
                this.tooltip && !this.tooltip.hasClass("hover") && this.tooltip.html(this._getTooltipValue()), this._updateTooltipPos()
            },
            _updateTooltipPos: function() {
                this.tooltip && this.tooltip.css(this._getTooltipPos())
            },
            _getTooltipPos: function() {
                var t, e = this.options.circleShape;
                if ("full" == e || "pie" == e || 0 === e.indexOf("custom")) return {
                    "margin-top": -this.tooltip.outerHeight() / 2,
                    "margin-left": -this.tooltip.outerWidth() / 2
                };
                if (-1 != e.indexOf("half")) {
                    switch (e) {
                        case "half-top":
                        case "half-bottom":
                            t = {
                                "margin-left": -this.tooltip.outerWidth() / 2
                            };
                            break;
                        case "half-left":
                        case "half-right":
                            t = {
                                "margin-top": -this.tooltip.outerHeight() / 2
                            }
                    }
                    return t
                }
                return {}
            },
            _getTooltipValue: function(t) {
                if (this._rangeSlider) {
                    var e = this.options.value.split(",");
                    return t ? e[0] + " - " + e[1] : this._tooltipValue(e[0]) + " - " + this._tooltipValue(e[1])
                }
                return t ? this.options.value : this._tooltipValue(this.options.value)
            },
            _tooltipValue: function(t) {
                var e = this._raise("tooltipFormat", {
                    value: t,
                    handle: this._handleArgs()
                });
                return null != e && "boolean" != typeof e ? e : t
            },
            _validateStartAngle: function() {
                var t = this.options.startAngle;
                return t = (isNumber(t) ? parseFloat(t) : 0) % 360, 0 > t && (t += 360), this.options.startAngle = t, t
            },
            _validateEndAngle: function() {
                var end = this.options.endAngle;
                if ("string" == typeof end && isNumber(end) && ("+" === end.charAt(0) || "-" === end.charAt(0))) try {
                    end = eval(this.options.startAngle + end.charAt(0) + Math.abs(parseFloat(end)))
                } catch (e) {
                    console.warn(e)
                }
                return end = (isNumber(end) ? parseFloat(end) : 360) % 360, end <= this.options.startAngle && (end += 360), end
            },
            _refreshCircleShape: function() {
                var t, e = this.options.circleShape,
                    i = ["half-top", "half-bottom", "half-left", "half-right", "quarter-top-left", "quarter-top-right", "quarter-bottom-right", "quarter-bottom-left", "pie", "custom-half", "custom-quarter"]; - 1 == i.indexOf(e) && (t = ["h1", "h2", "h3", "h4", "q1", "q2", "q3", "q4", "3/4", "ch", "cq"].indexOf(e), e = -1 != t ? i[t] : "half" == e ? "half-top" : "quarter" == e ? "quarter-top-left" : "full"), this.options.circleShape = e
            },
            _appendOverlay: function() {
                var t = this.options.circleShape;
                "pie" == t ? this._checkOverlay(".rs-overlay", 270) : ("custom-half" == t || "custom-quarter" == t) && (this._checkOverlay(".rs-overlay1", 180), "custom-quarter" == t && this._checkOverlay(".rs-overlay2", this._end))
            },
            _checkOverlay: function(t, e) {
                var i = this.container.children(t);
                0 == i.length && (i = createElement("div" + t + " rs-transition rs-bg-color"), this.container.append(i)), i.rsRotate(this._start + e)
            },
            _checkDataType: function() {
                var t, e, i, s = this.options,
                    n = this._props();
                for (t in n.numberType) e = n.numberType[t], i = s[e], s[e] = isNumber(i) ? parseFloat(i) : this.defaults[e];
                for (t in n.booleanType) e = n.booleanType[t], i = s[e], s[e] = "false" == i ? !1 : !!i;
                for (t in n.stringType) e = n.stringType[t], i = s[e], s[e] = ("" + i).toLowerCase()
            },
            _validateSliderType: function() {
                var t = this.options.sliderType.toLowerCase();
                this._rangeSlider = this._showRange = !1, "range" == t ? this._rangeSlider = this._showRange = !0 : -1 != t.indexOf("min") ? (this._showRange = !0, t = "min-range") : t = "default", this.options.sliderType = t
            },
            _updateStartEnd: function() {
                var t = this.options.circleShape;
                "full" != t && (-1 != t.indexOf("quarter") ? this.options.endAngle = "+90" : -1 != t.indexOf("half") ? this.options.endAngle = "+180" : "pie" == t && (this.options.endAngle = "+270"), "quarter-top-left" == t || "half-top" == t ? this.options.startAngle = 0 : "quarter-top-right" == t || "half-right" == t ? this.options.startAngle = 90 : "quarter-bottom-right" == t || "half-bottom" == t ? this.options.startAngle = 180 : ("quarter-bottom-left" == t || "half-left" == t) && (this.options.startAngle = 270))
            },
            _validateStartEnd: function() {
                this._start = this._validateStartAngle(), this._end = this._validateEndAngle();
                var t = this._start < this._end ? 0 : 360;
                this._end += t - this._start
            },
            _analyzeModelValue: function() {
                var t, e, i = this.options.value,
                    s = this.options.min,
                    n = this.options.max,
                    a = "string" == typeof i ? i.split(",") : [i];
                this._rangeSlider ? e = "string" == typeof i ? a.length >= 2 ? (isNumber(a[0]) ? a[0] : s) + "," + (isNumber(a[1]) ? a[1] : n) : isNumber(a[0]) ? s + "," + a[0] : s + "," + s : isNumber(i) ? s + "," + i : s + "," + s : "string" == typeof i ? (t = a.pop(), e = isNumber(t) ? parseFloat(t) : s) : e = isNumber(i) ? parseFloat(i) : s, this.options.value = e
            },
            _validateModelValue: function() {
                var t, e = this.options.value;
                if (this._rangeSlider) {
                    var i = e.split(","),
                        s = parseFloat(i[0]),
                        n = parseFloat(i[1]);
                    s = this._limitValue(s), n = this._limitValue(n), s > n && (n = s), this._handle1 = this._processStepByValue(s), this._handle2 = this._processStepByValue(n), this.options.value = this._handle1.value + "," + this._handle2.value
                } else t = this._showRange ? 2 : this._active || 1, this["_handle" + t] = this._processStepByValue(this._limitValue(e)), this._showRange && (this._handle1 = this._handleDefaults()), this.options.value = this["_handle" + t].value
            },
            _isBrowserSupported: function() {
                for (var t = ["borderRadius", "WebkitBorderRadius", "MozBorderRadius", "OBorderRadius", "msBorderRadius", "KhtmlBorderRadius"], e = 0; e < t.length; e++)
                    if (document.body.style[t[e]] !== undefined) return !0
            },
            _throwError: function() {
                return "This browser doesn't support the border-radious property."
            },
            _checkIE: function() {
                var t = window.navigator.userAgent;
                (t.indexOf("MSIE ") >= 0 || t.indexOf("Trident/") >= 0) && this.control.css({
                    "-ms-touch-action": "none",
                    "touch-action": "none"
                })
            },
            _raise: function(t, e) {
                var i = this.options[t],
                    s = !0;
                return e = e || {}, i && (e.type = t, "string" == typeof i && (i = window[i]), $.isFunction(i) && (s = i.call(this, e), s = s === !1 ? !1 : s)), this.control.trigger($.Event ? $.Event(t, e) : t), s
            },
            _bind: function(t, e, i) {
                $(t).bind(e, $proxy(i, this))
            },
            _unbind: function(t, e, i) {
                $.proxy ? $(t).unbind(e, $.proxy(i, this)) : $(t).unbind(e)
            },
            _getInstance: function() {
                return $data(this.control[0], pluginName)
            },
            _removeData: function() {
                var t = this.control[0];
                $.removeData && $.removeData(t, pluginName), t.id && delete window[t.id]
            },
            _destroyControl: function() {
                this.control.empty().removeClass("rs-control").height("").width(""), this._removeAnimation(), this._bindControlEvents("_unbind")
            },
            _updateWidth: function() {
                this.lastBlock.css("padding", this.options.width), this._refreshHandle()
            },
            _readOnly: function(t) {
                this._isReadOnly = t, this.container.removeClass("rs-readonly"), t && this.container.addClass("rs-readonly")
            },
            _get: function(t) {
                return this.options[t]
            },
            _set: function(t, e) {
                var i = this._props();
                if (-1 != $.inArray(t, i.numberType)) {
                    if (!isNumber(e)) return;
                    e = parseFloat(e)
                } else -1 != $.inArray(t, i.booleanType) ? e = "false" == e ? !1 : !!e : -1 != $.inArray(t, i.stringType) && (e = e.toLowerCase());
                if (this.options[t] != e) {
                    switch (this.options[t] = e, t) {
                        case "startAngle":
                        case "endAngle":
                            this._validateStartEnd(), this._updateSeperator(), this._appendOverlay();
                        case "min":
                        case "max":
                        case "step":
                        case "value":
                            this._analyzeModelValue(), this._validateModelValue(), this._setValue(), this._updateHidden(), this._updateTooltip();
                            break;
                        case "radius":
                            this._setRadius(), this._updateTooltipPos();
                            break;
                        case "width":
                            this._removeAnimation(), this._updateWidth(), this._updateTooltipPos(), this._addAnimation(), this.container.children().find(".rs-seperator").css({
                                width: this.options.width,
                                "margin-left": this._border() / 2
                            });
                            break;
                        case "handleSize":
                            this._refreshHandle();
                            break;
                        case "handleShape":
                            this._setHandleShape();
                            break;
                        case "animation":
                            this._setAnimation();
                            break;
                        case "showTooltip":
                            this.options.showTooltip ? this._appendTooltip() : this._removeTooltip();
                            break;
                        case "editableTooltip":
                            this._tooltipEditable(), this._updateTooltipPos();
                            break;
                        case "disabled":
                            this.options.disabled ? this.disable() : this.enable();
                            break;
                        case "readOnly":
                            this.options.readOnly ? this._readOnly(!0) : !this.options.disabled && this._readOnly(!1);
                            break;
                        case "mouseScrollAction":
                            this._bindScrollEvents(this.options.mouseScrollAction ? "_bind" : "_unbind");
                            break;
                        case "circleShape":
                            this._refreshCircleShape(), "full" == this.options.circleShape && (this.options.startAngle = 0, this.options.endAngle = "+360");
                        case "sliderType":
                            this._destroyControl(), this._init()
                    }
                    return this
                }
            },
            option: function(t, e) {
                if (this._getInstance() && this._isBrowserSupport) {
                    if ($isPlainObject(t)) {
                        (t.min !== undefined || t.max !== undefined) && (t.min !== undefined && (this.options.min = t.min, delete t.min), t.max !== undefined && (this.options.max = t.max, delete t.max), t.value == undefined && this._set("value", this.options.value));
                        for (var i in t) this._set(i, t[i])
                    } else if (t && "string" == typeof t) {
                        if (e === undefined) return this._get(t);
                        this._set(t, e)
                    }
                    return this
                }
            },
            getValue: function(t) {
                if ("range" == this.options.sliderType && t && isNumber(t)) {
                    var e = parseFloat(t);
                    if (1 == e || 2 == e) return this["_handle" + e].value
                }
                return this._get("value")
            },
            setValue: function(t, e) {
                if (t && isNumber(t)) {
                    if (e && isNumber(e))
                        if ("range" == this.options.sliderType) {
                            var i = parseFloat(e),
                                s = parseFloat(t);
                            1 == i ? t = s + "," + this._handle2.value : 2 == i && (t = this._handle1.value + "," + s)
                        } else "default" == this.options.sliderType && (this._active = e);
                    this._set("value", t)
                }
            },
            disable: function() {
                this.options.disabled = !0, this.container.addClass("rs-disabled"), this._readOnly(!0)
            },
            enable: function() {
                this.options.disabled = !1, this.container.removeClass("rs-disabled"), this.options.readOnly || this._readOnly(!1)
            },
            destroy: function() {
                this._getInstance() && (this._destroyControl(), this._removeData(), this._originalObj.insertAfter(this.control), this.control.remove())
            }
        }, $.fn.rsRotate = function(t) {
            return setTransform(this, t)
        }, "undefined" == typeof $.fn.outerHeight && ($.fn.outerHeight = function() {
            return this[0].offsetHeight
        }, $.fn.outerWidth = function() {
            return this[0].offsetWidth
        }), "undefined" == typeof $.fn.hasClass && ($.fn.hasClass = function(t) {
            return -1 !== this[0].className.split(" ").indexOf(t)
        }), "undefined" == typeof $.fn.offset && ($.fn.offset = function() {
            return {
                left: this[0].offsetLeft,
                top: this[0].offsetTop
            }
        }), $.fn[pluginName].prototype = RoundSlider.prototype
    }(jQuery, window);
    var trackID = 1,
        hashVal = window.location.hash.toString();
    $(".dsp").append('<div class="blur"></div><div class="mS"><div class="top"><div class="trackTitle"></div><div class="trackSinger"></div></div><div class="mdd"><div class="centered-vertically"></div><div class="play"><div class="seekbar"></div><div class="playpausebtn"></div><div class="frontTiming">00:00 / 00:00</div></div></div></div><div class="dsh"><div class="repeat"></div><div class="sound shake"></div><div class="stop"></div><div class="links-button"><div href="/" class="links-toggle"></div><div class="icons-holder smaller"><ul class="small"><li class="source-apple"></li><li class="source-amazon"></li><li class="source-download"></li></ul></div></div><div class="share-button"><div href="/" class="social-toggle"></div><div class="icons-holder"><ul><li class="social-twitter"><a href="/"></a></li><li class="social-facebook"><a href="/"></a></li><li class="social-email"><a href="/"></a></li></ul></div></div></div>'), $.fn.MusicPlayer = function(t) {
        function e() {
            var t = v.currentTime * (100 / v.duration);
            $("#" + m).roundSlider("option", "value", t)
        }

        function i(t) {
            var e = t.value;
            $("#" + m).roundSlider("option", "value", e), g = v.duration * (e / 100), v.currentTime = g
        }

        function s() {
            var t = "<div class='live' style='width: 50px'></div>";
            $(".repeat, .stop, .links-button", f).remove(), $(".sound", f).after(t), $(".live", f).append("<div class='bliking'></div><div class='icon'></div>"), $(".seekbar", f).remove()
        }

        function n() {
            $(".links-button", f).remove(), $(".stop", f).after("<div class='soundcloud' style='width:32px'><a href='" + k.soundcloud_URL + "' target='_blank' title='Source: SoundCloud.com'></a></div>")
        }

        function a(t) {
            if ("Infinity" == t) return "<span class='infinity'>âˆž</span>";
            var e = Math.floor(t / 60),
                i = Math.floor(t - 60 * e);
            return 10 > i && (i = "0" + i), 10 > e && (e = "0" + e), e + ":" + i
        }

        function o(t, e) {
            $(t).toggleClass("playing", e)
        }

        function r() {
            var t, e;
            $(".dsp").each(function() {
                if (t = $(this).attr("id"), e = window.location.hash, idLendth = e.search(t), "-1" != idLendth) {
                    idLendth = t.length + 1;
                    var i = e.indexOf(t.charAt(0)) - 1;
                    e = e.substring(i, idLendth + i), window.location.hash = window.location.hash.toString().replace(e, "")
                }
            })
        }

        function l() {
            r();
            var t = window.location.hash.toString();
            return t = "#" + $(f).attr("id"), window.location + t
        }

        function h(t) {
            var e = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(t);
            $("li.social-facebook").find("a").attr("href", e)
        }

        function d(t) {
            var e = "https://twitter.com/home?status=" + encodeURIComponent(t);
            $("li.social-twitter").find("a").attr("href", e)
        }

        function c(t) {
            var e = k.artist,
                i = k.title;
            "soundcloud" == k.type && (i = $(".trackTitle", f).attr("data-title"), e = $(".trackSinger", f).attr("data-artist"));
            var s = i + " by " + e,
                n = "Check out the track " + i + " by " + e + " on " + t,
                a = "mailto:?subject=" + s + "&body=" + n;
            $(".social-email > a", f).on("click", function(t) {
                t.preventDefault(), window.location = a
            })
        }

        function p() {
            $(".icons-holder", f).hasClass("open-menu") && $(".icons-holder", f).removeClass("open-menu")
        }

        function _() {
            "yes" == k.downloadable ? $(".source-download", f).append("<a href='" + y + "' class='download' target='_blank' title='Downlod it' download></a>") : $(".source-download", f).css("display", "none"), k.amazon_music.length > 0 ? $(".source-amazon", f).append("<a href='" + k.amazon_music + "' class='amazon' target='_blank' title='Listen it on Amazon'></a>") : $(".source-amazon", f).css("display", "none"), k.apple_music.length > 0 ? $(".source-apple", f).append("<a href='" + k.apple_music + "' class='apple' target='_blank' title='Listen it on Apple Music'></a>") : $(".source-apple", f).css("display", "none"), "yes" == k.downloadable || k.amazon_music.length > 0 || k.apple_music.length > 0 || $(".links-button", f).remove()
        }
        var f, v, m, g, b, y, k = $.extend({
            type: "music player",
            size: "",
            title: "Title",
            artist: "",
            artwork: " ",
            track_URL: " ",
            downloadable: "",
            apple_music: "",
            amazon_music: "",
            soundcloud_ID: "",
            soundcloud_URL: "",
            blur: "7"
        }, t);
        f = this, b = $(".playpausebtn", f), v = new Audio, y = k.track_URL, this.on("click", ".playpausebtn", function() {
            v.paused ? (v.play(), $(".playpausebtn.playing").click(), $(f).addClass("bekhon"), $(".dsp").removeClass("nakhon ")) : (v.pause(), $(f).addClass("nakhon"), $(".dsp").removeClass("bekhon"))
        }), $(v).on("playing", function() {
            $(b).toggleClass("active", !0), o(b, !0)
        }), $(v).on("timeupdate", function() {
            $(".mdd .play .frontTiming", f).html(a(this.currentTime) + " / " + a(this.duration)), e()
        }), $(v).on("pause", function() {
            b.toggleClass("active", !1), o(b, !1)
        }), $(v).on("ended", function() {
            v.currentTime = 0
        }), "-1" != hashVal.search($(f).attr("id")) && (v.autoplay = !0), this.each(function() {
            var t = k.type;
            if ("radio" == t) v.src = k.track_URL, $(".trackTitle", f).text(k.title), $(".trackSinger", f).text(k.artist), $(".blur", f).css("background-image", "url(" + k.artwork + ")"), s();
            else if ("soundcloud" == t) {
                var e = k.soundcloud_ID,
                    i = k.soundcloud_URL;
                SC.initialize({
                    client_id: e
                }), SC.resolve(i).then(function(t) {
                    v.src = t.uri + "/stream?client_id=" + e, $(".trackTitle", f).text(t.title).attr("data-title", t.title), $(".trackSinger", f).text(t.user.username).attr("data-artist", t.user.username), $(".blur", f).css("background-image", "url(" + t.artwork_url.replace("-large.", "-t500x500.") + ")")
                }), n()
            } else v.src = k.track_URL, $(".trackTitle", f).text(k.title),
                $(".trackSinger", f).text(k.artist), $(".blur", f).css("background-image", "url(" + k.artwork + ")");
            $(this).attr("data-trackid", trackID), trackID++, m = "SliderFor" + $(this).attr("id"), $(this).find(".seekbar").attr("id", m), _(), $(".blur", f).css({
                filter: "blur(" + k.blur + "px)",
                "-webkit-filter": "blur(" + k.blur + "px)",
                "-moz-filter": "blur(" + k.blur + "px)",
                "-ms-filter": "blur(" + k.blur + "px)",
                "-o-filter": "blur(" + k.blur + "px)"
            })
        }), $(".stop", f).on("click", function() {
            p(), v.pause(), v.currentTime = 0
        }), $(".sound", f).on("click", function() {
            p(), v.muted ? (v.muted = !1, $(this, f).css("background-image", "url(img/volume-high.png)")) : (v.muted = !0, $(this, f).css("background-image", "url(img/volume-low.png)"))
        }), $(".repeat", f).on("click", function() {
            p(), $(this, f).toggleClass("active"), $(this, f).hasClass("active") ? (v.loop = !0, $(this, f).css({
                "background-color": "rgba(255,255,255,0.3)",
                "-webkit-transform": "rotate(180deg)",
                "-o-transform": "rotate(180deg)",
                "-ms-transform": "rotate(180deg)",
                "-moz-transform": "rotate(180deg)",
                transform: "rotate(180deg)"
            })) : (v.loop = !1, $(this, f).css({
                "background-color": "transparent",
                "-webkit-transform": "rotate(0)",
                "-o-transform": "rotate(0)",
                "-ms-transform": "rotate(0)",
                "-moz-transform": "rotate(0)",
                transform: "rotate(0)"
            }), $(this, f).css("-webkit-transform", ""))
        }), $(".share-button", f).on("click", function() {
            var t = l();
            h(t), d(t), u(t), c(t)
        }), $(".play", f).hover(function() {
            p()
        }), $("#" + m).roundSlider({
            width: 8,
            radius: "70",
            handleSize: "15,15",
            value: 0,
            max: "100",
            startAngle: 90,
            step: "0.005",
            showTooltip: !1,
            editableTooltip: !1,
            sliderType: "min-range",
            drag: function(t) {
                i(t)
            },
            change: function(t) {
                i(t)
            }
        }), "small" == k.size ? ($(f).addClass("kochik"), $(".play", f).addClass("kochik"), $(".dsh", f).addClass("kochik"), $(".playpausebtn", f).addClass("kochik"), $(".trackTitle, .trackSinger", f).addClass("kochik"), $(".mdd", f).addClass("kochik"), $("div.dsh > div:not(.centered-vertically)", f).addClass("kochik"), $(".links-toggle, .social-toggle", f).addClass("kochik"), $(".icons-holder > ul", f).addClass("kochik"), $("#" + m).roundSlider({
            radius: "35",
            handleSize: "10,10"
        })) : "medium" == k.size && ($(f).addClass("medium"), $(".dsh", f).addClass("medium"), $(".mdd", f).addClass("medium"), $(".links-toggle, .social-toggle", f).addClass("medium"), $(".icons-holder > ul", f).addClass("medium"), $(".trackTitle, .trackSinger", f).addClass("medium"), $(".play", f).addClass("medium"), $(".playpausebtn", f).addClass("medium"), $("#" + m).roundSlider({
            radius: "55",
            handleSize: "15,15"
        })), $(f).on("click", ".social-toggle", function() {
            $(this, f).next().toggleClass("open-menu"), $(".links-toggle", f).next().hasClass("open-menu") && $(".links-toggle", f).next().removeClass("open-menu")
        }), $(f).on("click", ".links-toggle", function() {
            $(".social-toggle", f).next().hasClass("open-menu") && $(".social-toggle", f).next().removeClass("open-menu"), $(this, f).next().toggleClass("open-menu")
        }), $(window).keypress(function(t) {
            0 !== t.keyCode && 32 !== t.keyCode || (t.preventDefault(), $(f).hasClass("bekhon") ? (v.pause(), $(f).removeClass("bekhon"), $(f).addClass("nakhon")) : $(f).hasClass("nakhon") && (v.play(), $(f).removeClass("nakhon"), $(f).addClass("bekhon")))
        })
    }
}(jQuery);