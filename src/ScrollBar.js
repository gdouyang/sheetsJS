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

    this.calculateScrollSize();
  }

  init() {
    var S = this,
      sheet = this.sheet,
      namespace = this.namespace,
      s = { x: this.scrollx, y: this.scrolly };

    var handleMouseScroll = function (event) {
      S.isVerticalScroll(event) ?
        s.y.isBarVisible && s.y.mousewheel(event) :
        s.x.isBarVisible && s.x.mousewheel(event);
    };

    $(document).on('MozMousePixelScroll.scrollbar_0', handleMouseScroll);
    $(document).on('mousewheel.scrollbar_0', handleMouseScroll);

    // init scrollbars & recalculate sizes
    $.each(s, function (d, scrollx) {

      var scrollToValue = 0;
      if (!scrollx.scroll) {

        scrollx.scroll = S._getScroll('scroll' + d).addClass('scroll-' + d);

        scrollx.scroll.addClass('scroll-element_arrows_visible');

        scrollx.mousewheel = function (event) {

          if (!scrollx.isBarVisible || (d === 'x' && S.isVerticalScroll(event))) {
            return true;
          }
          if (d === 'y' && !S.isVerticalScroll(event)) {
            s.x.mousewheel(event);
            return true;
          }

          var delta = event.originalEvent.wheelDelta * -1 || event.originalEvent.detail;
          var maxScrollValue = scrollx.size - scrollx.visible - scrollx.offset;

          if ((delta > 0 && scrollToValue < maxScrollValue) || (delta < 0 && scrollToValue > 0)) {
            console.info("scrollToValue="+scrollToValue+",delta="+delta);
            scrollToValue = scrollToValue + delta;
            if (scrollToValue < 0)
              scrollToValue = 0;
            if (scrollToValue > maxScrollValue)
              scrollToValue = maxScrollValue;

            S.doScroll(d, scrollToValue);
          }

          event.preventDefault();
          return false;
        };

        // handle arrows & scroll inner mousedown event
        scrollx.scroll.find('.scroll-arrow, .scroll-element_track')
          .on('mousedown' + namespace, function (event) {

            if (event.which != 1) // lmb
              return true;

            var scrollForward = 1;

            var data = {
              "eventOffset": event[(d === 'x') ? 'pageX' : 'pageY'],
              "maxScrollValue": scrollx.size - scrollx.visible - scrollx.offset,
              "scrollbarOffset": scrollx.scroll.bar.offset()[(d === 'x') ? 'left' : 'top'],
              "scrollbarSize": scrollx.scroll.bar[(d === 'x') ? 'outerWidth' : 'outerHeight'](),
              "scrollPostion": (d === 'x') ? Math.abs(sheet.scrollX) : Math.abs(sheet.scrollY)
            };
            var scrollStep = 30, stepScrolling = true;

            if ($(this).hasClass('scroll-arrow')) {
              scrollForward = $(this).hasClass("scroll-arrow_more") ? 1 : -1;
              scrollStep = o.scrollStep * scrollForward;
              scrollToValue = scrollForward > 0 ? data.maxScrollValue : 0;
            } else {
              scrollForward = (data.eventOffset > (data.scrollbarOffset + data.scrollbarSize) ? 1
                : (data.eventOffset < data.scrollbarOffset ? -1 : 0));
              scrollStep = Math.round(scrollx.visible * 0.75) * scrollForward;
              scrollToValue = (data.eventOffset - data.scrollbarOffset -
                (stepScrolling ? (scrollForward == 1 ? data.scrollbarSize : 0)
                  : Math.round(data.scrollbarSize / 2)));
              scrollToValue = data.scrollPostion + (scrollToValue / scrollx.kx);
            }

            scrollToValue = stepScrolling ? (data.scrollPostion + scrollStep) : scrollToValue;

            S.doScroll(d, scrollToValue);

            return S._handleMouseDown(null, event);;
          });

        // handle scrollbar drag'n'drop
        scrollx.scroll.bar.on('mousedown' + namespace, function (event) {

          if (event.which != 1) // lmb
            return true;

          var eventPosition = event[(d === 'x') ? 'pageX' : 'pageY'];
          var initOffset = (d === 'x') ? sheet.scrollX : sheet.scrollY;
          //console.info('initOffset=' + initOffset)
          scrollx.scroll.addClass('scroll-draggable');

          $(document).on('mousemove' + namespace, function (event) {
            var movePos = event[(d === 'x') ? 'pageX' : 'pageY'];
            //console.info('movePos='+movePos +',eventPosition='+eventPosition)
            var diff = parseInt((movePos - eventPosition) / scrollx.kx, 10);
            var offset_ = Math.abs(initOffset) + diff;

            S.doScroll(d, offset_);
            scrollToValue = offset_;
          });

          return S._handleMouseDown(function () {
            scrollx.scroll.removeClass('scroll-draggable');
          }, event);
        });
      }
    });
  }

  calculateScrollSize() {
    var sheet = this.sheet,
      s = { x: this.scrollx, y: this.scrolly };
    // calculate init sizes
    $.each(s, function (d, scrollx) {
      $.extend(scrollx, (d == "x") ? {
        "offset": parseInt(Math.abs(sheet.scrollX), 10) || 0,
        "size": sheet.getContentWidth(),
        "visible": sheet.width,
        "isBarVisible": true
      } : {
          "offset": parseInt(Math.abs(sheet.scrollY), 10) || 0,
          "size": sheet.getContentHeight(),
          "visible": sheet.height,
          "isBarVisible": true
        });
    });

    // calculate scroll size
    $.each(s, function (d, scrollx) {

      var cssOffset = (d === 'x') ? 'left' : 'top';
      var cssFullSize = (d === 'x') ? 'outerWidth' : 'outerHeight';
      var cssSize = (d === 'x') ? 'width' : 'height';
      var offset = Math.abs(parseInt((d === 'x') ? sheet.scrollX : sheet.scrollY, 10) || 0);

      var AreaSize = scrollx.size;
      var AreaVisible = scrollx.visible + offset;
      if (AreaVisible >= AreaSize) {
        scrollx.isBarVisible = false;
        scrollx.scroll.bar.hide();
        sheet.scrollX = 0;
      } else {
        scrollx.scroll.bar.show();
        var scrollSize = scrollx.scroll.size[cssFullSize]() + (parseInt(scrollx.scroll.size.css(cssOffset), 10) || 0);

        scrollx.scrollbarSize = parseInt(scrollSize * AreaVisible / AreaSize, 10);
        scrollx.scroll.bar.css(cssSize, scrollx.scrollbarSize + 'px');

        scrollx.scrollbarSize = scrollx.scroll.bar[cssFullSize]();
        scrollx.kx = ((scrollSize - scrollx.scrollbarSize) / (AreaSize - AreaVisible)) || 1;
        scrollx.maxScrollOffset = AreaSize - AreaVisible;
      }
    });
  }

  _getScroll(scroll) {
    var html = [
      '<div class="scroll-element scroll-element_arrows_visible scroll-scrollx_visible scroll-scrolly_visible">',
      '<div class="scroll-element_corner"></div>',
      '<div class="scroll-arrow scroll-arrow_less"></div>',
      '<div class="scroll-arrow scroll-arrow_more"></div>',
      '<div class="scroll-element_outer">',
      '<div class="scroll-element_size"></div>', // required! used for scrollbar size calculation !
      '<div class="scroll-element_inner-wrapper">',
      '<div class="scroll-element_inner scroll-element_track">', // used for handling scrollbar click
      '<div class="scroll-element_inner-bottom"></div>',
      '</div>',
      '</div>',
      '<div class="scroll-bar">', // required
      '<div class="scroll-bar_body">',
      '<div class="scroll-bar_body-inner"></div>',
      '</div>',
      '<div class="scroll-bar_bottom"></div>',
      '<div class="scroll-bar_center"></div>',
      '</div>',
      '</div>',
      '</div>'
    ].join('');
    scroll = $(html).appendTo(this.wrapper);
    $.extend(scroll, {
      bar: scroll.find('.scroll-bar'),
      size: scroll.find('.scroll-element_size'),
      track: scroll.find('.scroll-element_track')
    });
    return scroll;
  }

  doScroll(d, offset_) {
    console.info("offset_=" + offset_)
    if (offset_ < 0) {
      offset_ = 0;
    }
    var cssOffset = (d === 'x') ? 'left' : 'top';
    var scrollx = (d === 'x') ? this.scrollx : this.scrolly;
    if (scrollx.isBarVisible) {
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
      absOffset = Math.abs(offset_);
      scrollx.scroll.bar.css(cssOffset, absOffset * scrollx.kx + 'px');
      // callback
      this.onScroll && this.onScroll();
    }
  }

  isVerticalScroll(event) {
    var e = event.originalEvent;
    if (e.axis && e.axis === e.HORIZONTAL_AXIS)
      return false;
    if (e.wheelDeltaX)
      return false;
    return true;
  }

  _handleMouseDown(callback_, event_) {

    var namespace = this.namespace;

    $(document).on('blur' + namespace, function () {
      $(document).add('body').off(namespace);
      callback_ && callback_();
    });
    $(document).on('dragstart' + namespace, function (event) {
      event.preventDefault();
      return false;
    });
    $(document).on('mouseup' + namespace, function () {
      $(document).add('body').off(namespace);
      callback_ && callback_();
    });
    $('body').on('selectstart' + namespace, function (event) {
      event.preventDefault();
      return false;
    });

    event_ && event_.preventDefault();
    return false;
  }

}

export default ScrollBar;
