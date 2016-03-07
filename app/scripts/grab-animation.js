'use strict';

var GrabAnimation, GrabAnimationDefault, GrabAnimationGlobs, globKeys;
GrabAnimationGlobs = {
  animating: false,
  disabled: false
}

GrabAnimationDefault = {
  grabables: $('.js-grab-animation'),
  animationHeight: 0,
  scrollDetector: $(document.createElement('DIV')).addClass('js-animation-grabber'),
  animationSteps: 3,
  animationLastStage: 0,
  lastScr: 0,
  currScr: 0,
  scrDirr: false,
  grabbedForAnimation: false,
  animOffset: 150,
  animating: false,
  currentSection: undefined,
  grabbedInterval: false,
  exit: function ($elms) {
    $elms.each(function () {
      var clss, $elm;
      $elm = $(this);
      clss = $elm.data('stage-class');
      if (typeof clss === 'undefined') {
        clss = 'grab-animation_-current';
      }
      $elm.removeClass(clss);
    });
  },
  enter: function ($elms) {
    $elms.each(function () {
      var clss, $elm;
      $elm = $(this);
      clss = $elm.data('stage-class');
      if (typeof clss === 'undefined') {
        clss = 'grab-animation_-current';
      }
      $elm.addClass(clss);
    });
  }
};

globKeys = Object.keys(GrabAnimationGlobs);
for(var i = 0, length1 = globKeys.length; i < length1; i++){
  GrabAnimationDefault[globKeys[i]] = GrabAnimationGlobs[globKeys[i]];
}

GrabAnimation = Object.create(GrabAnimationDefault);

GrabAnimation.calcScrDirr = function() {
  if (this.lastScr > this.currScr) {
    this.scrDirr = 'up';
  } else if (this.lastScr < this.currScr) {
    this.scrDirr = 'down';
  }
}

GrabAnimation.applyReclick = function () {
  var _this;
  _this = this;
  this.scrollDetector.click(function (e) {
    _this.maskReclick.call(_this, e);
  });
}

GrabAnimation.maskReclick = function (event) {
  event.preventDefault();

  this.scrollDetector.addClass('grab-animation-underlay');
  $(document.elementFromPoint(event.clientX, event.clientY)).trigger('click');
  this.scrollDetector.removeClass('grab-animation-underlay');
}



GrabAnimation.createScrollDetector = function () {
  var _this = this;
  this.scrollDetector.addClass('js-detect-scroll');
  this.scrollDetector.append($(document.createElement('DIV')));
  this.scrollDetector.find('div').css({
    height: this.animationHeight+'px'
  });
  this.scrollDetector.scroll(function () {
    _this.animateSection.call(_this, $(this));
  });
  this.applyReclick.call(this);
}

GrabAnimation.animateSection = function ($elm) {
  var step, prevSection, animationSection;

  step = parseInt(($elm.scrollTop() + $(window).height()) / (this.animationHeight / this.animationSteps)) + 1;
  if (this.animationLastStage !== step) {
    prevSection = this.grabables.children('[data-stage="'+this.animationLastStage+'"]');
    animationSection = this.grabables.children('[data-stage="'+step+'"]');
    this.animationLastStage = step;
    this.exit(prevSection);
    this.enter(animationSection);
  }
}

GrabAnimation.addScrollDetectEvent = function () {
  $('body').append(this.scrollDetector);
  if (this.scrDirr == 'up') {
    this.scrollDetector.scrollTop(this.animationHeight);
  }
  this.animating = false;
  this.afterScrEvt.call(this);
}

GrabAnimation.removeScrollDetectEvent = function () {
  $('.js-animation-grabber').detach();
}

GrabAnimation.afterScrEvt = function () {
  this.lastScr = this.currScr;

  if (this.grabbedForAnimation) {
    this.grabbedForAnimation = false;
  }
}

GrabAnimation.animationMain = function ($elm) {
  var varianceDown, varianceUp;

  if (this.currScr > this.currentSection.offset().top + 80 || this.currScr < this.currentSection.offset().top - 80) {
    this.removeScrollDetectEvent.call(this);
  }

  varianceDown = this.currScr <= $elm.offset().top - this.animOffset;
  varianceUp = this.currScr >= $elm.offset().top + this.animOffset;

  if (varianceDown || varianceUp) {
    this.grabbedInterval = false;
  }

  this.afterScrEvt.call(this);
}

GrabAnimation.initAnimation = function ($elm) {
  var _grabCompFunc, _this;

  _this = this;
  _grabCompFunc = _this.addScrollDetectEvent;

  this.animating = true;
  this.grabbedForAnimation = true;
  this.currentSection = $elm;

  $('body, html').stop().animate({
    scrollTop: $elm.offset().top
  }, 250, function () {
    _grabCompFunc.call(_this);
  });
}

GrabAnimation.grabMain = function ($elm) {
  var varianceDown, varianceUp;
  varianceDown = this.currScr >= $elm.offset().top - this.animOffset;
  varianceUp = this.currScr <= $elm.offset().top + this.animOffset;

  if (varianceDown && varianceUp) {
    this.grabbedInterval = true;    
    this.initAnimation.call(this, $elm);
  }
}

GrabAnimation.getInstance = function () {
  var _this = this;

  return {
    disableGrab: function () {
      _this.disabled = true;
    },
    enableGrab: function () {
      _this.disabled = false;
    }
  }
}

GrabAnimation.init = function () {
  var _this = this;
  this.animationHeight = (this.animationSteps+1)*$(window).height();
  this.createScrollDetector.call(this);
  this.lastScr = $(window).scrollTop();
  
  $(window).scroll(function () {
    if (!_this.animating) {
      _this.currScr = $(window).scrollTop();
      _this.calcScrDirr.call(_this);
      _this.grabables.each(function () {
        if (!_this.grabbedInterval  && !_this.disabled) {
          _this.grabMain.call(_this, $(this));
        }
        else {
          _this.animationMain.call(_this, $(this));
        }
      });
    }
  });
}

module.exports = GrabAnimation;
