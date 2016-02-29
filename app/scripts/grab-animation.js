'use strict';

var GrabAnimation, GrabAnimationDefault;  

GrabAnimationDefault = {
  grabables: $('.js-grab-animation'),
  animationHeight: 0,
  scrollDetector: $(document.createElement('DIV')).addClass('js-animation-grabber'),
  animationSteps: 3,
  animationLastStage: 0,
  exit: function ($elm) {
    $elm.removeClass('grab-animation_-current');
  },
  enter: function ($elm) {
    $elm.addClass('grab-animation_-current');
  },
  currentSection: undefined
};
GrabAnimation = Object.create(GrabAnimationDefault);

GrabAnimation.createScrollDetector = function () {
  var _this = this;
  this.scrollDetector.addClass('js-detect-scroll');
  this.scrollDetector.append($(document.createElement('DIV')));
  this.scrollDetector.find('div').css({
    height: this.animationHeight+'px'
  });
  this.scrollDetector.scroll(function () {
    if ($(this).scrollTop() + $(window).height() >= _this.animationHeight || $(window).scrollTop() < _this.currentSection.offset().top) {
      _this.removeScrollDetectEvent.call(_this);
    }
    else {
      _this.animateSection.call(_this, $(this));
    }
  });
}

GrabAnimation.animateSection = function ($elm) {
  var step, prevSection, animationSection;

  step = parseInt(($elm.scrollTop() + $(window).height()) / (this.animationHeight / this.animationSteps)) + 1;
  prevSection = this.grabables.children('[data-stage="'+this.animationLastStage+'"]');
  animationSection = this.grabables.children('[data-stage="'+step+'"]');
  this.animationLastStage = step;
  this.exit(prevSection);
  this.enter(animationSection);
}

GrabAnimation.addScrollDetectEvent = function () {
  $('body').append(this.scrollDetector);
}

GrabAnimation.removeScrollDetectEvent = function () {
  this.scrollDetector = $('.js-animation-grabber').detach();
}

GrabAnimation.init = function () {
  var _this = this;
  this.animationHeight = (this.animationSteps+1)*$(window).height();
  this.createScrollDetector.call(this);
  
  $(window).scroll(function () {
    _this.grabables.each(function () {
      _this.currentSection = $(this);
      if ($(window).scrollTop() >= _this.currentSection.offset().top && $(window).scrollTop() <= _this.currentSection.offset().top + 10) {
        _this.addScrollDetectEvent.call(_this);
        return;
      }
    });
  });
}

module.exports = GrabAnimation;
