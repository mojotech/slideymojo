(function($) {
  $.fn.slideyMojo = function(shownItems) {

    that = $(this);

    var initSlider = function(shownItems) {

        var setupUiSlider = function() {
            that.SM.progressWrap.slider({
              value: 0,
              step: .1,
              min: 0,
              max: (that.SM.listItems.length / shownItems) - 1,
              slide: function(event, ui) {
                fixPositioning();
                that.SM.pageCount = Math.round(ui.value);
              },
              stop: function(event, ui) {
                var rounded = Math.round(ui.value);
                fixPositioning();
                that.SM.progressWrap.slider("option", "value", rounded);
                that.SM.pageCount = Math.round(ui.value);
              }
            });
            var newWidth = (shownItems / that.SM.listItems.length) * 100 + '%';
            that.SM.progressWrap.children('a').css('width', newWidth);
          }
        var setupBindings = function() {
            $(window).load(function() {
              resizeSlider(shownItems);
            });

            $(window).resize(function() {
              resizeSlider(shownItems);
            });
          }
        var setupVars = function() {
            that.SM = {};
            that.SM.list = that.find('ul');
            that.SM.listWrap = that.SM.list.parent();
            that.SM.listItems = that.find('ul li');
            that.SM.progressWrap = that.find('.sm-progress');
            that.SM.nextButton = that.find('.next');
            that.SM.prevButton = that.find('.prev');
            that.SM.pageCount = 0;
          }
        var setupButtons = function(shownItems) {
            that.SM.pageCount = 0;

            that.SM.nextButton.click(function() {
              if (that.SM.pageCount < (that.SM.listItems.length) / shownItems - 1) {
                that.SM.pageCount++;
                fixPositioning();
                that.SM.progressWrap.slider("option", "value", that.SM.pageCount);
              }
            });

            that.SM.prevButton.click(function() {
              if (that.SM.pageCount > 0) {
                that.SM.pageCount--;
                fixPositioning();
                that.SM.progressWrap.slider("option", "value", that.SM.pageCount);
              }
            });
          }

        setupVars();
        setupButtons(shownItems);
        setupBindings();
        setupUiSlider();

      }

    var resizeSlider = function() {
        that.SM.listItems.width((that.SM.listWrap.width() / shownItems) - 22);
        fixPositioning();
      }
    var fixPositioning = function() {
      var newLeft = 0 - ((that.SM.listItems.width() * (that.SM.pageCount * shownItems)) + (32 * (that.SM.pageCount * shownItems)));
      that.SM.list.css('left', newLeft);
    }

    initSlider(shownItems);

  };
})(jQuery);