(function($) {
  $.fn.slideyMojo = function(shownItems) {

    var self = $(this);
    var SM = {self : $(this)};

    var initSlider = function() {

        var setupUiSlider = function() {
            SM.progressWrap.slider({
              value: 0,
              step: .1,
              min: 0,
              max: (SM.listItems.length / SM.shownItems) - 1,
              slide: function(event, ui) {
                fixPositioning();
                SM.pageCount = Math.round(ui.value);
              },
              stop: function(event, ui) {
                var rounded = Math.round(ui.value);
                fixPositioning();
                SM.progressWrap.slider("option", "value", rounded);
                SM.pageCount = Math.round(ui.value);
              }
            });
          }
        var setupBindings = function() {
            $(window).load(function() {
              resizeSlider(SM.shownItems);
            });

            $(window).resize(function() {
              resizeSlider(SM.shownItems);
            });

            $(window).load(function(){
              showSelf();
            });
          }
        var setupVars = function() {
            SM.list = SM.self.find('ul');
            SM.listWrap = SM.list.parent();
            SM.listItems = SM.self.find('ul li');
            SM.controlsWrapper = SM.self.find('.sm-controls');
            SM.progressWrap = SM.self.find('.sm-progress');
            SM.nextButton = SM.self.find('.sm-next');
            SM.prevButton = SM.self.find('.sm-prev');
            SM.margin = 32;
            SM.pageCount = 0;
            SM.shownItems = shownItems || 3;
          }
        var setupButtons = function() {
            SM.pageCount = 0;
            SM.nextButton.click(function() {
              if (SM.pageCount < (SM.listItems.length) / SM.shownItems - 1) {
                SM.pageCount++;
                fixPositioning();
                SM.progressWrap.slider("option", "value", SM.pageCount);
              }
            });
            SM.prevButton.click(function() {
              if (SM.pageCount) {
                SM.pageCount--;
                fixPositioning();
                SM.progressWrap.slider("option", "value", SM.pageCount);
              }
            });
          }
        var setupDragging = function() {
          SM.list.draggable({
            axis: 'x',
            start: function() {
              SM.list.addClass('sm-nodrag');
            },
            drag: function(e, ui) {
              if(!(ui.originalPosition.left < ui.position.left && (SM.pageCount > 0)) && !(ui.originalPosition.left > ui.position.left && (SM.pageCount < (SM.listItems.length / SM.shownItems)-1))){
                e.preventDefault();
              }
              else {
                var sliderOldLeft = parseInt(SM.progressWrap.children('a').css('left'), 10);
                SM.progressWrap.find('a').addClass('sm-nodrag');
                SM.progressWrap.find('a').css('left', -1*ui.position.left);
                SM.progressWrap.find('a').removeClass('sm-nodrag');
                console.log(sliderOldLeft);
              }
            },
            stop: function(e, ui) {
              SM.list.removeClass('sm-nodrag');
              if(Math.abs(ui.originalPosition.left-ui.position.left) >= $(window).width()*0.2){
                if(ui.originalPosition.left > ui.position.left){
                  SM.nextButton.click();
                }
                else {
                  SM.prevButton.click();
                }
              } 
              else {
                SM.list.css('left', ui.originalPosition.left);
              }
            }
          });
        }

        setupVars();
        setupButtons(SM.shownItems);
        setupBindings();
        setupUiSlider();
        setupDragging();
      }

    var showSelf = function() {
      $('.sm').css('opacity', '1');
    }
    var resizeSlider = function() {
        SM.listItems.width((SM.listWrap.width() / SM.shownItems) - SM.margin);
        fixPositioning();
        var newWidth = (SM.shownItems / SM.listItems.length) * SM.self.width();
        SM.progressWrap.children('a').css('width', newWidth);
        var progressNewWidth = 100-((SM.shownItems / SM.listItems.length) * 100) + '%';
        SM.progressWrap.css('width', progressNewWidth);
        var newProgressWrapperWidth = SM.self.width() - SM.controlsWrapper.width() - SM.margin/2;
        SM.progressWrap.parent().width(newProgressWrapperWidth);
      }
    var fixPositioning = function() {
      var newLeft = -((SM.listItems.width() * (SM.pageCount * SM.shownItems)) + (SM.margin * (SM.pageCount * SM.shownItems)));
      SM.list.css('left', newLeft);
      //dispatch event here
    }

    initSlider(shownItems);

  };
})(jQuery);