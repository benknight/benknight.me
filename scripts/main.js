(function () {

    // We set height to mimic `height: 100vh` in CSS, which is
    // unfortunately not reliable.
    // See: https://code.google.com/p/chromium/issues/detail?id=428132

    var OFFSET = 40;
    var mediaQueryList = window.matchMedia('(orientation: portrait)');
    var $siteHeader = $('.site-header');

    function setMaxHeight(mediaQueryList) {
      var vh = window.innerHeight;
      var vw = window.innerWidth;

      if (mediaQueryList.matches) {
        $siteHeader.css('height', Math.max(vh, vw) - OFFSET);
      } else {
        $siteHeader.css('height', Math.min(vh, vw) - OFFSET);
      }
    }

    setMaxHeight(mediaQueryList);
    mediaQueryList.addListener(setMaxHeight);

    if (window.document.body.animate) {
      var animation = $siteHeader.get(0).animate(
        [{ filter: 'hue-rotate(0deg)' }, { filter: 'hue-rotate(360deg)' }],
        { duration: 12000, delay: 1500, iterations: Infinity },
      );

      $siteHeader.on('mouseleave', function () {
        animation.pause();
      });

      $siteHeader.on('mouseenter', function () {
        animation.play();
      });
    }

    // Scrolling behavior
    // Used to track the enabling of hover effects
    // var enableTimer = 0;

    /*
     * Listen for a scroll and use that to remove
     * the possibility of hover effects
     */
    // window.addEventListener('scroll', function() {
    //   clearTimeout(enableTimer);
    //   removeHoverClass();
    //   enableTimer = setTimeout(addHoverClass, 200); // 200 is a bit snappier
    // }, false);

    /**
     * Removes the hover class from the body. Hover styles
     * are reliant on this class being present
     */
    // function removeHoverClass() {
    //   document.body.style.pointerEvents = 'none';
    // }

    /**
     * Adds the hover class to the body. Hover styles
     * are reliant on this class being present
     */
    // function addHoverClass() {
    //   document.body.style.pointerEvents = 'auto';
    // }

})();
