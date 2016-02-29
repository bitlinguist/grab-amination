'use strict';

var GrabAnimation, GrabAnimationDefault;  

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
  animOffset: 300,
  animating: false,
  currentSection: undefined,
  grabbedInterval: false,
  exit: function ($elm) {
    $elm.removeClass('grab-animation_-current');
  },
  enter: function ($elm) {
    $elm.addClass('grab-animation_-current');
  }
};
GrabAnimation = Object.create(GrabAnimationDefault);

GrabAnimation.calcScrDirr = function() {
  if (this.lastScr > this.currScr) {
    this.scrDirr = 'up';
  } else if (this.lastScr < this.currScr) {
    this.scrDirr = 'down';
  }
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
}
GrabAnimation.animateSection
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

  varianceDown = this.currScr <= $elm.offset().top;
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
        if (!_this.grabbedInterval) {
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
