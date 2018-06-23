import Context from './Context';
import Row from './Row';
import ColumnHeaderRow from './ColumnHeaderRow';
import ScrollBar from './ScrollBar';
import { CELL_WIDTH, CELL_HEIGHT, ROW_HEADER_WIDTH } from './constants';

class Sheet {
  constructor(target, options) {
    this.scrollY = 0;
    this.scrollX = 0;

    this.selectMinRowIndex = -1;
    this.selectMaxRowIndex = -1;
    this.selectMinColIndex = -1;
    this.selectMaxColIndex = -1;

    Object.assign(this, {
      width: undefined,
      height: undefined,
      rowCount: 10,
      colCount: 5,
    }, options);
    // create canvas and append to target
    var canvas = document.createElement("canvas");
    target.appendChild(canvas);

    this.context = new Context(canvas, {
      //onMouseMove: this.mouseMove.bind(this),
      //onMouseDown: this.mouseDown.bind(this),
      // onMouseUp: this.mouseUp.bind(this),
      // onMouseDbClick: this.onMouseDbClick.bind(this),
      onScroll: this.onScroll.bind(this),
      width: this.width,
      height: this.height
    });
    $("body").on('mousemove', this.mouseMove.bind(this));
    $("body").on('mousedown', this.mouseDown.bind(this));
    $("body").on('dblclick', this.onMouseDbClick.bind(this));

    //Column headerX
    this.columnHeaderRow = new ColumnHeaderRow(this, 0, 0, this.colCount);

    //Data rows
    this.rows = [];

    let rowY = CELL_HEIGHT;

    for (let i = 0; i < this.rowCount; i++) {
      this.rows.push(new Row(i, this, 0, rowY, this.colCount));
      rowY += CELL_HEIGHT;
    }

    this.mainLoop();

    //Scroll bars
    this.scrollBar = new ScrollBar(target, this, this.width, this.height);
    //Selection
    this.createMultiSelection();

    window.addEventListener("keydown", (e) => {
      if (this.selectMinRowIndex != -1 && this.selectMinColIndex != -1) {
        this.rows[this.selectMinRowIndex].cells[this.selectMinColIndex].onKeydown(e);
      }

    }, false);
  }

  mainLoop() {
    this.draw();
    requestAnimationFrame(this.mainLoop.bind(this));
  }

  mouseDown(event) {
    // when header isResizing do nothing
    if (this.columnHeaderRow.isResizing) {
      return;
    }
    let x = event.clientX;
    let y = event.clientY;
    if (this.columnHeaderRow.isCollision(x, y)) {
      this.columnHeaderRow.mouseDown(x, y);
    }
    else {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].isCollision(x, y)) {
          this.rows[i].mouseDown(x, y);
        }
      }
    }
  }

  mouseMove(event) {
    let x = event.clientX;
    let y = event.clientY;
    document.body.style.cursor = 'default';
    // when is header Collision or header isResizing
    if (this.columnHeaderRow.isCollision(x, y) || this.columnHeaderRow.isResizing) {
      this.columnHeaderRow.mouseMove(x, y);
    }
    else {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].isCollision(x, y)) {
          this.rows[i].mouseMove(x, y);
        }
      }
    }
  }

  mouseUp(x, y) {
    this.endMultiSelect();
  }

  onMouseDbClick(event) {
    let x = event.clientX;
    let y = event.clientY;
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].isCollision(x, y)) {
        this.rows[i].onMouseDbClick(x, y);
      }
    }
  }

  onScroll(dx, dy) {
    var scrollY = this.scrollY;
    if (dy > 0) {
      scrollY -= 5 * dy;
    }
    else if (dy < 0) {
      if (scrollY <= -5 * -dy) {
        scrollY -= 5 * dy;
      }
    }

    this.scrollBar.doScroll('y', scrollY);

    var scrollX = this.scrollX;
    if (dx > 0) {
      scrollX -= 5 * dx;
    }
    else if (dx < 0) {
      if (scrollX <= -5 * -dx) {
        scrollX -= 5 * dx;
      }
    }
    this.scrollBar.doScroll('x', scrollX);
  }

  draw() {
    //Background and border
    this.context.drawRect(0, 0, this.width, this.height, {
      borderColor: 'darkGray',
      borderWidth: 3,
      fillColor: 'lightGray'
    });

    //Header

    //Rows
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];

      if (row.isVisibleOnScreen()) {
        this.rows[i].draw();
      }
    }

    //Column headers
    this.columnHeaderRow.draw();
    this.context.drawRect(0, 0, ROW_HEADER_WIDTH, CELL_HEIGHT, {
      borderColor: 'black',
      borderWidth: 1,
      fillColor: 'darkGray'
    });

  }

  resizeRow(rowIndex, delta) {
    this.rows[rowIndex].height += delta;

    for (let i = rowIndex + 1; i < this.rows.length; i++) {
      this.rows[i].y += delta;
    }
  }

  resizeCol(colIndex, newWidth) {
    if (newWidth < 10) {
      return;
    }

    this.columnHeaderRow.resizeCol(colIndex, newWidth);

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].resizeCol(colIndex, newWidth);
    }
    this.scrollBar.calculateScrollSize();
  }

  deselectAllCells() {
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].deselectAllCells();
    }
  }

  startMultiSelect(cell) {
    this.clearMultiSelect();
    this.isMultiSelecting = true;
    this.showMultiSelect = true;
    this.multiSelectStartCell = cell;
    this.updateSelection(cell.rowIndex, cell.index);
  }

  endMultiSelect() {
    this.isMultiSelecting = false;
  }

  clearMultiSelect() {
    this.showMultiSelect = false;
    this.selectMinColIndex = -1;
    this.selectMaxColIndex = -1;
    this.multiSelectStartCell = null;
  }

  multiSelectSize() {
    return (this.selectMaxRowIndex - this.selectMinRowIndex + 1) * (this.selectMaxColIndex - this.selectMinColIndex + 1);
  }

  updateSelection(rowIndex, colIndex) {
    if (this.isMultiSelecting) {
      console.info("" + rowIndex + "-" + colIndex)
      this.selectMaxRowIndex = rowIndex;
      this.selectMaxColIndex = colIndex;

      //this.deselectAllCells();
      this.selectMinRowIndex = this.multiSelectStartCell.rowIndex;
      if (this.selectMinRowIndex > this.selectMaxRowIndex) {
        this.selectMaxRowIndex = this.selectMinRowIndex;
        this.selectMinRowIndex = rowIndex;
      }
      this.selectMinColIndex = this.multiSelectStartCell.index;
      if (this.selectMinColIndex > this.selectMaxColIndex) {
        this.selectMaxColIndex = this.selectMinColIndex;
        this.selectMinColIndex = colIndex;
      }

      let selection = { width: 0, height: 0 };
      for (let i = this.selectMinRowIndex; i <= this.selectMaxRowIndex; i++) {

        let selec = this.rows[i].getSelectionSize(this.selectMinColIndex, this.selectMaxColIndex);
        selection.width = selec.width;
        selection.height += selec.height;
      }
      let minSelectCell = this.rows[this.selectMinRowIndex].getCell(this.selectMinColIndex);
      this.multiSelectElement.css({
        "left": this.scrollX + minSelectCell.x + "px",
        "top": this.scrollY + minSelectCell.y + "px",
        "width": (selection.width - 3) + "px",
        "height": (selection.height - 3) + "px"
      }).show();
    }
  }
  getLastRow() {
    return this.rows[this.rows.length - 1];
  }
  getCell(rowIndex, colIndex) {
    return this.rows[rowIndex].getCell(colIndex);
  }
  getContentWidth() {
    return this.columnHeaderRow.width;
  }
  getContentHeight() {
    return this.getLastRow().y
  }
  createMultiSelection() {
    this.multiSelectElement = $("<div>", {
      id: "multi-selection",
      style:
        "position: fixed;" +
        "left: 0px;" +
        "top: 0px;" +
        "border: 2px solid #4285f4; display:none;" +
        "background-color: rgba(236, 243, 255, 0.5);" +
        "width: 0px; height: 0px;"
    });
    // use body mouseup event, the multi-selection will cover canvas mouseup event
    $("body").append(this.multiSelectElement).on('mouseup', this.mouseUp.bind(this));
  }
}

export {
  Sheet
};
