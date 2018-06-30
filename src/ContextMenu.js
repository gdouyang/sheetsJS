/**
 * ScrollBar reference jquery.scrollbar
 */
class ContextMenu {
  constructor(sheet) {
    this.sheet = sheet;
    this.container = $('body');
    this.menu = this._init();
    $('body').on('contextmenu', function (e) { e.preventDefault(); })
  }

  _init() {
    var html = [
      '<div class="context-menu">',
      '<ul>',
      '<li data-type="copy"><a >复制</a></li>',
      '<li data-type="paste"><a >粘贴</a></li>',
      '</ul>',
      '</div>'
    ].join('');
    var self = this;
    var menu = $(html).hide().appendTo(this.container);
    menu.find('[data-type]').each(function (index, domEle) {
      let type = $(domEle).attr('data-type');
      $(domEle).on('click', self.menuClick.bind(self, type))
    });
    return menu;;
  }

  show(event) {
    let x = event.clientX;
    let y = event.clientY;
    this.menu.css({
      "left": x + "px",
      "top": y + "px"
    }).show();
    event.preventDefault();
  }
  hide() {
    this.menu.hide();
  }
  menuClick(type) {
    console.log(type);
    this.hide();
  }
  isCollision(event){
    var v = '.context-menu';
    if($( event.target ).closest( $(v) ).length){
      return true;
    }
    this.hide();
    return false;
  }
}

export default ContextMenu;
