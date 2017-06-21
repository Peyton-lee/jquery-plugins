(function($) {

	"use strict"; // strict mode

	// class IMG
	function IMG(options) {
		this.options = $.extend({}, $.fn.ImgRender.Default, options)
		this.firstArr = [] // count top
		this.$Box = $(this.options.id)
		this.picHTML = '<div class="IMG_pic"><img src="" alt/></div>'
		this.boxW = Math.floor(this.$Box.width() / this.options.columns) // box width

		this.Init() // start
	}

	// prototype of class IMG
	IMG.prototype = {
		constructor: IMG,
		Init: function() {
			var that = this
			var $der = $.Deferred()
			var count = 0
			
			$.each(this.options.data.slice(0, this.options.columns), function(index, val) {
				var dom = $(that.picHTML)
				that._appendDom(dom, val)
					.find('img').on('load', function() {
						count++
						that.firstArr[index] = dom.outerHeight()
						count == that.options.columns && $der.resolve()
					})
			})

			$der.then(function() {
				that.reset(that.options.data.slice(that.options.columns))
			})
		},
		
		// new picBox and img tag append to mian box
		// @param : dom {jquery object}
		// @param: val {object} img information
		_appendDom: function(dom, val) {
			return dom.css({
					'padding': this.options.padding + 'px',
					'display': 'block'
				})
				.find('img').width(this.boxW - this.options.padding * 2).attr('src', val.src)
				.end().appendTo(this.$Box)
		},

		// export reset func
		// @param : data {[]object}
		reset: function(data) {
			var that = this
			$.each(data, function(index, val) {
				var dom = $(that.picHTML)
				that._appendDom(dom, val)
					.find('img').on('load', function() {
						var lastSm = Math.min.apply(null, that.firstArr)
						var smIndex = $.inArray(lastSm, that.firstArr)
						dom.css({
							position: "absolute",
							top: lastSm + "px",
							left: smIndex * that.boxW + "px"
						})
						that.firstArr[smIndex] += dom.outerHeight()
					})
			})
		}
	}

	// $.fn define plugin
	$.fn.ImgRender = function(options) {
		if(!options.data) {
			console.error("option data is undefined!")	
			return
		}
		var _imgs = new IMG(options)
		return {
			reset: function(data) {
				_imgs.reset(data)
			}
		}
	}

	// default options
	$.fn.ImgRender.Default = {
		id: "#main",
		columns: 5,
		padding: 5
	}

})(jQuery);