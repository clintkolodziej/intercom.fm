//
// Flamebug.PopupPanel
//

(function($){

	//
	// flamebug Namespace
	// 

	if(!$.flamebug){

		$.flamebug = new Object();

	};

	//
	// flamebug.PopupPanel Plugin
	// 

	$.flamebug.PopupPanel = function(el, options){

		var base = this;					// use base to avoid scope issues (instead of 'this')
		base.$el = $(el);					// jQuery version of the element
		base.el = el;						// DOM version of the element
		base.$el.data("flamebug.PopupPanel", base);		// reverse reference to the DOM object

		//
		// init: Initialize
		//

		base.init = function(){

			base.setupOptions();
			base.cacheElements();

			base.createOverlay();
			base.createPanel();

			base.attachEvents();
		};

		//
		// setupOptions: Set up options for the plugin
		//

		base.setupOptions = function(){

			base.options = $.extend({}, $.flamebug.PopupPanel.defaults, options);
		
		};

		//
		// cacheElements: Cache basic elements for performance
		//

		base.cacheElements = function() {

			base.$link = $('a[href="#' + base.$el.attr("id") + '"]');
			base.$panel = base.$el;

			base.$body = $("body");	//if not using ASP.NET use this line
			//base.$body = $("form");		//if using ASP.NET use this line

			base.windowHeight = $(window).height();
			base.windowWidth = $(window).width();
			base.documentHeight = $(document).height();
			base.documentWidth = $(document).width();

			//get function callbacks from the data attributes on the popup element
			base.options.showCallback = window[base.$el.attr("data-show-callback")];
			base.options.hideCallback = window[base.$el.attr("data-hide-callback")];

		};

		//
		// attachEvents: Attach the click event to the disclosure
		//

		base.attachEvents = function() {

			// clicking the link will open the popuppanel
			base.$link.click(function() {       
  
				if(base.panelVisible)
					base.hide();
				else
					base.show();

				return false;
				
			});

			// clicking the close link will close the popuppanel
			base.$close.click(function() {       
  
				if(base.panelVisible)
					base.hide();

				return false;
				
			});

			// clicking the overlay will close the popuppanel
			base.$overlay.click(function() {       
  
				if(base.panelVisible)
					base.hide();

				return false;
				
			});

			// scrolling the window will re-center the popuppanel
			if(base.options.centerOnScroll)
			{
				$(window).scroll(function() {

  					if(base.panelVisible)
						base.centerPanel();

					return false;
				});
			}

			// resizing the window will re-center the popuppanel
			if(base.options.centerOnResize)
			{
				$(window).resize(function() {

					base.windowHeight = $(window).height();		//make sure the window height is updated
					base.windowWidth = $(window).width();		//make sure the window height is updated
					base.documentHeight = $(document).height();	//make sure the document height is updated due to reflow
					base.documentWidth = $(document).width();	//make sure the document width is updated due to reflow

  					if(base.panelVisible)
					{
						base.centerPanel();
						base.resizeOverlay();
					}

					return false;
				});
			}
		};

		//
		// createOverlay: Create the overlay under the body element
		//

		base.createOverlay = function() {

			var $overlay = $(".fb-popuppanel-overlay");

			if($overlay.length == 0)
			{
				base.$overlay = $('<div class="fb-popuppanel-overlay"></div>');	//add an overlay

				$(base.$body).append(base.$overlay);				//append the overlay to the body element
			}
			else
			{
				base.$overlay = $overlay;
			}
		};

		//
		// resizeOverlay: Size the overlay to fill the browser viewport
		//

		base.resizeOverlay = function() {

			var overlayHeight = base.documentHeight;
				
			if(base.windowHeight > overlayHeight)
				overlayHeight = base.windowHeight;

			if(base.panelHeight > overlayHeight)
				overlayHeight = base.panelHeight;

			base.$overlay.height(overlayHeight);
		};

		//
		// showOverlay: Show the overlay
		//

		base.showOverlay = function(){

			base.resizeOverlay();

			if(base.options.fadeOverlayIn)
				base.$overlay.fadeIn(base.options.fadeOverlayInSpeed);
			else
				base.$overlay.show();
			
		};

		//
		// hideOverlay: Hide the overlay
		//

		base.hideOverlay = function(){

			if(base.options.fadeOverlayOut)
				base.$overlay.fadeOut(base.options.fadeOverlayOutSpeed);
			else
				base.$overlay.hide();

		};

		//
		// createPanel: Create the panel under the body element
		//

		base.createPanel = function() {

			base.$panel.appendTo(base.$body);					//append the panel to the body element

			base.$close = $('<a class="fb-popuppanel-close" title="close"></a>')	//add a close button link
			base.$panel.prepend(base.$close);					//prepend the close link to the panel

			base.panelHeight = base.$panel.outerHeight();
			base.panelWidth = base.$panel.outerWidth();
			base.panelVisible = false;
		};

		//
		// centerPanel: Center the panel in the viewport
		//

		base.centerPanel = function() {

			var height = base.documentHeight;
			var width = base.windowWidth;

			if(height > base.windowHeight)
				height = base.windowHeight;

			var top = ((height - base.panelHeight) / 2) + $(document).scrollTop();
			var left = (width - base.panelWidth) / 2;

			if(top < 0)
				top = 0;

			base.$panel.css({
				"top" : top,
				"left" : left
			});
		};

		//
		// showPanel: Show the target panel
		//

		base.showPanel = function(){

			base.centerPanel();

			if(base.options.fadePanelIn)
				base.$panel.fadeIn(base.options.fadePanelInSpeed);
			else
				base.$panel.show();
			
			base.documentHeight = $(document).height();	//make sure the document height is updated due to reflow
			base.documentWidth = $(document).width();	//make sure the document width is updated due to reflow

			base.panelVisible = true;

		};

		//
		// hidePanel: Hide the target panel
		//

		base.hidePanel = function(){

			if(base.options.fadePanelOut)
				base.$panel.fadeOut(base.options.fadePanelOutSpeed);
			else
				base.$panel.hide();

			base.panelVisible = false;

		};

		//
		// show: Show the target panel and overlay
		//

		base.show = function(){

			base.showPanel();
			base.showOverlay();
			base.options.showCallback();

		};

		//
		// hide: hide the target panel and overlay
		//

		base.hide = function(){

			base.hidePanel();
			base.hideOverlay();
			base.options.hideCallback();

		};

		base.init(); // trigger the initialization
		
	};

	//
	// defaults: Setup the default options for the plugin
	// 

	$.flamebug.PopupPanel.defaults = {

		fadeOverlayIn: true,		// fade in the overlay instead of just showing it
		fadeOverlayInSpeed: "fast",	// speed to fade in the overlay

		fadeOverlayOut: false,		// fade in the overlay instead of just showing it
		fadeOverlayOutSpeed: "fast",	// speed to fade out the overlay

		fadePanelIn: false,		// fade in the panel instead of just showing it
		fadePanelInSpeed: "fast",	// speed to fade in the panel

		fadePanelOut: false,		// fade in the panel instead of just showing it
		fadePanelOutSpeed: "fast",	// speed to fade out the panel

		centerOnScroll: false,		// center the panel when the window is scrolled
		centerOnResize: true,		// center the panel when the window is resized

		showCallback: null,
        hideCallback: null
	};

	//
	// setup the options provided by the instance
	// 

	$.fn.flamebug_PopupPanel = function(options){

		return this.each(function(){

			(new $.flamebug.PopupPanel(this, options));

		});

	};

	//
	// getter function
	// 

	$.fn.getflamebug_PopupPanel = function(){

		this.data("flamebug.PopupPanel");

	};

})(jQuery);

//
// Auto Plugin elements with .fb-popuppanel class
//

$(function () {

	$(".fb-popuppanel").flamebug_PopupPanel();

});