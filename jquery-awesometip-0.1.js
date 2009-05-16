/*
 * Awesome Tip v0.1 - jQuery JavaScript Plugin
 * Code: http://github.com/paulelliott/jquery-awesometip/tree/master
 * Docs: http://plugins.jquery.com/project/awesometip
 *
 * Copyright (c) 2009 Paul Elliott with RedLine IT
 * Dual licensed under the MIT and GPL licenses.
 */
(function($) {
  $.fn.extend({
    awesometip: function(options) {
      //You can override any of these when calling awesometip({ ... })
      var settings = $.extend({
        content: "",
        alignment: "top",
        formFocus: true,
        effect: "",
        effectOptions: {},
        effectSpeed: 500,
        spacing: 5,
        oncreate: function() {},
        prehover: function() {},
        posthover: function() {}
      }, options);
    
      //Iterate through each of the triggers.
      this.each(function() {
        var trigger = $(this);
        trigger.addClass('awesometip-trigger');

        //Add the HTML to the end of the DOM.
        var index = $("div.awesometip-container").length;
        $("body").append("<div id='awesometip-" + index + "' class='awesometip-container' style='display:none;position:absolute;'>" + settings.content + "</div>");
        var tooltip = $("div#awesometip-" + index);
      
        //Call the oncreate handler.
        settings.oncreate(trigger, tooltip);

        //Add the mouse in and out listeners.
        if (settings.formFocus && trigger.is(":input")) {
          trigger.focus(function() { show(trigger, tooltip, settings); }).blur(function() { hide(trigger, tooltip, settings); });
        } else {
          trigger.hover(
            function() { show(trigger, tooltip, settings); },
            function() { hide(trigger, tooltip, settings); }
          );
        }
      });
    
      return this;
    }
  });
  
  //Sets the position of the tooltip based on the position of the trigger and desired alignment.
  function setPosition(trigger, tooltip, settings) {
    var offset = getNewOffset(trigger, tooltip, settings);
    
    //If the offset puts the tip off the screen, move it to the opposite side of the trigger.
    var alignment = '';
    if (offset.top < 0) {
      alignment = 'bottom';
    } else if (offset.left < 0) {
      alignment = 'right';
    } else if (offset.top + tooltip.height() > $(window).height()) {
      alignment = 'top';
    } else if (offset.left + tooltip.width() > $(window).width()) {
      alignment = 'left';
    }

    if (alignment) {
      offset = getNewOffset(trigger, tooltip, $.extend({}, settings, {'alignment': alignment}));
    }

    tooltip.css(offset);
  };

  //Calculates the offset of the tooltip based on the position of the trigger and specified alignment.
  function getNewOffset(trigger, tooltip, settings) {
    var offset = trigger.offset();

    //Set the alignment to the desired side of the trigger.
    if (settings.alignment == 'top') {
      offset.top = offset.top - tooltip.height() - settings.spacing;
    } else if (settings.alignment == 'bottom') {
      offset.top = offset.top + trigger.height() + settings.spacing;
    } else if (settings.alignment == 'left') {
      offset.left = offset.left - tooltip.width() - settings.spacing;
    } else if (settings.alignment == 'right') {
      offset.left = offset.left + trigger.width() + settings.spacing;
    }
    
    return offset;
  };

  function show(trigger, tooltip, settings) {
    setPosition(trigger, tooltip, settings);

    settings.prehover(trigger, tooltip);

    if (!settings.effect) {
      tooltip.show();
    } else if (settings.effect == 'fade') {
      tooltip.fadeIn(settings.effectSpeed);
    } else {
      tooltip.show(settings.effect, settings.effectOptions, settings.effectSpeed);
    }
  };
  
  function hide(trigger, tooltip, settings) {
    if (!settings.effect) {
      tooltip.hide();
    } else if (settings.effect == 'fade') {
      tooltip.fadeOut(settings.effectSpeed);
    } else {
      tooltip.hide(settings.effect, settings.effectOptions, settings.effectSpeed);
    }

    settings.posthover(trigger, tooltip);
  };
})(jQuery);
