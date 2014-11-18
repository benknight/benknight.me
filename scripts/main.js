(function () {

    // We set height to mimick `height: 100vh` in CSS, which is
    // unfortunately not reliable.
    // See: https://code.google.com/p/chromium/issues/detail?id=428132

    var mediaQueryList = window.matchMedia('(orientation: portrait)');

    function setMaxHeight (mediaQueryList) {
      var vh = window.innerHeight;
      var vw = window.innerWidth;
      var $siteHeader = $('.site-header');

      if (mediaQueryList.matches) {
        $siteHeader.css('height', Math.max(vh, vw));
      } else {
        $siteHeader.css('height', Math.min(vh, vw));
      }
    }

    setMaxHeight(mediaQueryList);
    mediaQueryList.addListener(setMaxHeight);

})();