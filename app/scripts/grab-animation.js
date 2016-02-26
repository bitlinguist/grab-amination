var GrabAnimation;    

(function () {
  var GrabAnimationDefault;  
  GrabAnimationDefault = {
    grabables: $('.js-grab-animation'),
    animationHeight: 1000,
    scrollDetector: $(document.createElement('DIV')).addClass('js-animation-grabber')
  };
  GrabAnimation = Object.create(GrabAnimationDefault);
  
  GrabAnimation.createScrollDetector = function () {
    this.scrollDetector.addClass('js-detect-scroll');
    this.scrollDetector.append($(document.createElement('DIV')));
    this.scrollDetector.find('div').css({
      height: this.animationHeight+'px'
    });
  }
  
  GrabAnimation.addScrollDetectEvent = function () {
    $('body').prepend(this.scrollDetector);
  }
  
  GrabAnimation.removeScrollDetectEvent = function () {
    this.scrollDetector = $('.js-animation-grabber').detach();
  }
  
  GrabAnimation.init = function () {
    this.createScrollDetector.call(this);
    
    $(window).scroll(function () {
      this.grabables.each(function () {
        if ($(window).scrollTop() >= $(this).offset().top) {
          this.addScrollDetectEvent.call(this);
        }
      });
    });
  }
}).call(this);
(function () {
  var grabAnimation;
  grabAnimation = Object.create(GrabAnimation);
  grabAnimation.init();  
})();