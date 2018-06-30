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
      '<li ><a data-type="copy">复制</a></li>',
      '<li ><a data-type="paste">粘贴</a></li>',
      '</ul>',
      '</div>'
    ].join('');
    var self = this;
    var menu = $(html).hide().appendTo(this.container);
    menu.find('[data-type]').each(function (index, domEle) {
      let type = $(domEle).attr('data-type');
      $(domEle).on('click', self.menuClick.bind(self, type, $(domEle)))
    });
    return menu;;
  }

  show(event) {
    if(!this.copyCell){
      this.menu.find('[data-type="paste"]').addClass('disabled')
    }else{
      this.menu.find('[data-type="paste"]').removeClass('disabled')
    }
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
  menuClick(type, domEle) {
    console.log(type);
    if(type == 'copy'){
      this.copyCell = this.sheet.multiSelectStartCell;
    }else if(type == 'paste' && !domEle.hasClass('disabled')){
      this.sheet.multiSelectStartCell.updateValue(this.copyCell.value);
    }
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
