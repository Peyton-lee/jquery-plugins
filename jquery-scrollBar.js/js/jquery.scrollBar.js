(function($) {
	"use strict";

	/**
	 * ScrollBar {func}
	 * @param {object} element $(el)
	 * @param {object} options
	 */
	function ScrollBar(el, options) {
		this.$element = el;
		this.$html = el.html();
		this.options = $.extend({}, $.fn.ScrollBar.options, options);
		this.components = {
			html: "<div class='scroll-content'></div>",
			slotY: "<div class='scroll-slotY'></div>",
			scrollbarY: "<div class='scroll-barY'></div>"
		}
		this.isMove = false;
		this.times = null;
		this.offset = {
			x: null,
			y: null
		};
		this.page = {
			x: null,
			y: null
		}

		this.DOM = function() {
			return {
				content: this.$element.find('.scroll-content'),
				scrollSlotY: this.$element.find('.scroll-slotY'),
				scrollBarY: this.$element.find('.scroll-barY')
			}
		}

		// init func 
		this.init = $.proxy(function() {
			this.copyContent(this.$html);
			this.addClass(this.options.type);
			this.addScrollBar(this.options.theme);
			this.eventBind();
			this.count()
		}, this)()
	}

	// scroll prototype obj
	var scrollPrototype = {
		constructor: ScrollBar,

		copyContent: function(html) {
			this.$element.html('');
			var dom = this.$element.find('.scroll-content');
			dom.length == 0 ? this.$element.append(this.components.html) : dom.html(this.components.html);
			this.DOM().content.html(html);
		},

		addClass: function(type) {
			var _class = {
				"x": "scroll-x",
				"y": "scroll-y"
			}[type] || "scroll-xy";
			this.$element.addClass(_class)
		},

		addScrollBar: function(theme) {
			this.$element.append(this.components.slotY + this.components.scrollbarY);
			this.$element.addClass(theme);
		},

		count: function() {
			var y = this.$element.height();
			var real_y = this.$element[0].scrollHeight;
			this.times = y / real_y;
			y = y * this.times;
			this.DOM().scrollBarY.css({
				height: y + 'px',
				top: 0
			})
		},

		mouseover: function() {
			this.DOM().scrollSlotY.show();
			this.DOM().scrollBarY.show();
		},

		mouseout: function() {
			!this.isMove && this.DOM().scrollSlotY.hide();
			!this.isMove && this.DOM().scrollBarY.hide();
		},

		mousedown: function(e) {
			e.preventDefault();
			this.isMove = true;
			this.offset.y = this.DOM().scrollBarY.offset().top - this.$element.offset().top;
			this.page.y = e.pageY;
		},

		mousemove: function(e) {
			if(!this.isMove)
				return;

			var y = e.pageY - this.page.y + this.offset.y;
			y < 0 && (y = 0);
			var max_height = this.$element.height() - this.DOM().scrollBarY.height();
			y > max_height && (y = max_height);

			this.DOM().scrollBarY.css({
				top: y + 'px'
			});

			y = -y / this.times;
			this.DOM().content.css({
				top: y + 'px',
				left: 0
			})
		},

		mouseup: function(e) {
			this.isMove = false;
		},

		mousewheel: function(event) {
			var e = event || window.event
			var $el = $(event.currentTarget)
			var y = e.screenY / this.options.speed;
			var top = $el.css("top")
			var _y = parseInt(top.slice(0, top.lastIndexOf("px")));
			var delta = -event.originalEvent.wheelDelta || event.originalEvent.detail;
			if(delta > 0) {
				// scroll down
				y = _y - y
				var g = this.$element.height() - $el.height();
				y < g && (y = g)
			} else {
				// scroll up
				y = _y + y
				y > 0 && (y = 0)
			}
			
			this.DOM().content.css({
				top: y + 'px',
				left: 0
			});
			y = -y * this.times;
			this.DOM().scrollBarY.css({
				top: y + 'px'
			});
		},

		reset: function(html) {
			this.copyContent(html);
			this.addScrollBar(this.options.theme);
			this.eventBind();
			this.count();
		},

		eventBind: function() {
			this.$element.on({
				mouseover: $.proxy(this.mouseover, this),
				mouseout: $.proxy(this.mouseout, this)
			});

			this.DOM().scrollBarY.on({
				mousedown: $.proxy(this.mousedown, this)
			});

			this.DOM().content.on({
				mousewheel: $.proxy(this.mousewheel, this),
				DOMMouseScroll: $.proxy(this.mousewheel, this)
			});

			$(document).on({
				mousemove: $.proxy(this.mousemove, this),
				mouseup: $.proxy(this.mouseup, this)
			});
		}
	}

	ScrollBar.prototype = scrollPrototype;

	// Binding of jQuery by $.fn
	$.fn.ScrollBar = function(options) {
		this.scroller = new ScrollBar(this, options);
		return this
	}

	// default options
	$.fn.ScrollBar.options = {
		type: "y", // y, x, xy 
		theme: "grey",
		speed: 5
	}

})(jQuery)