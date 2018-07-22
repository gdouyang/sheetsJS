/**
 * ScrollBar reference jquery.scrollbar
 */
class ScrollBar {
  constructor(target, sheet, options) {
    this.wrapper = target;
    this.sheet = sheet;
    this.namespace = '.scrollbar_1';
    this.scrollx = {};
    this.scrolly = {};
    if (options) {
      this.onScroll = options.onScroll;
    }

    this.init();

  }

  init() {
    var S = this,
      sheet = this.sheet,
      namespace = '.scrollbar_1',
      s = { x: this.scrollx, y: this.scrolly },
      w = $(this.wrapper);

    // init scrollbars & recalculate sizes
    S._createScroll();

    this.wrapper.addEventListener('scroll', (event) => {
      console.info('ffffff')
    });
    var handleMouseScroll = function (event) {
      S.isVerticalScroll(event) ? s.y.mousewheel(event) : s.x.mousewheel(event);
    };
    $(document).on('MozMousePixelScroll' + namespace, handleMouseScroll);
    $(document).on('mousewheel' + namespace, handleMouseScroll);

    $.each(s, function (d, scrollx) {
      var scrollOffset = (d === 'x') ? 'scrollLeft' : 'scrollTop';
      scrollx.scroll.on('scroll', function (event) {
        var offset = $(this)[scrollOffset]();
        S.doScroll(d, offset);
        event.preventDefault();
        return false;
      });
      //
      scrollx.scrollToValue = 0;
      scrollx.mousewheel = function (event) {

        if ((d === 'x' && S.isVerticalScroll(event))) {
          return true;
        }
        if (d === 'y' && !S.isVerticalScroll(event)) {
          s.x.mousewheel(event);
          return true;
        }
        var delta = event.originalEvent.wheelDelta * -1 || event.originalEvent.detail;
        if (d === 'x') {
          delta = event.originalEvent.deltaX;
          console.info('deltaX' + event.originalEvent.deltaX)
        }
        var scrollToValue = this.scrollToValue;
        if ((delta > 0) || (delta < 0 && scrollToValue > 0)) {
          scrollToValue = scrollToValue + delta;
          if (scrollToValue < 0)
            scrollToValue = 0;

          this.scroll[scrollOffset](scrollToValue);
          // 重新设置真实位置
          this.scrollToValue = this.scroll[scrollOffset]();
        }

        event.preventDefault();
        return false;
      };
    });
  }

  _createScroll() {
    var scrollyHtml = [
      '<div class="native-scrollbar native-scrollbar-ltr native-scrollbar-y" ',
      'style="height: ' + this.sheet.height + 'px; left: ' + this.sheet.width + 'px; top: 0px; z-index:1;">',
      '<div style="width: 1px; height: ' + this.sheet.getContentHeight() + 'px;"></div>',
      '</div>'
    ].join('');
    var scrollxHtml = [
      '<div class="native-scrollbar native-scrollbar-ltr native-scrollbar-x" ',
      'style="width: ' + this.sheet.width + 'px; left: 0px; top: ' + this.sheet.height + 'px; z-index:1;">',
      '<div style="width: ' + this.sheet.getContentWidth() + 'px; height: 1px;"></div>',
      '</div>'
    ].join('');
    this.scrollx.scroll = $(scrollxHtml).appendTo(this.wrapper);
    this.scrolly.scroll = $(scrollyHtml).appendTo(this.wrapper);
  }

  doScroll(d, offset_) {
    console.info("offset_=" + offset_)
    if (offset_ < 0) {
      offset_ = 0;
    }
    var absOffset = Math.abs(offset_);
    if (d === 'x') {
      if (this.sheet.getContentWidth() - absOffset < this.sheet.width) {
        offset_ = this.sheet.getContentWidth() - this.sheet.width + 50;
      }
      this.sheet.scrollX = -offset_;
    } else if (d === 'y') {
      if ((this.sheet.getContentHeight() - absOffset) < this.sheet.height) {
        offset_ = this.sheet.getContentHeight() - this.sheet.height + 50;
      }
      this.sheet.scrollY = -offset_;
    }
    // callback
    this.onScroll && this.onScroll();
  }

  isVerticalScroll(event) {
    var e = event.originalEvent;
    if (e.axis && e.axis === e.HORIZONTAL_AXIS)
      return false;
    if (e.wheelDeltaX)
      return false;
    return true;
  }
  /**
   * 是否为滚动条
   * @param {*} event 
   */
  isScrollBar(event) {
    if ($(event.target).is('.native-scrollbar')) {
      return true;
    }
    return false;
  }
}

export default ScrollBar;
