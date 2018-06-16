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
      onMouseMove: this.mouseMove.bind(this),
      onMouseDown: this.mouseDown.bind(this),
      onMouseUp: this.mouseUp.bind(this),
      onMouseClick: this.mouseClick.bind(this),
      onMouseDbClick: this.onMouseDbClick.bind(this),
      onScroll: this.onScroll.bind(this),
      width: this.width,
      height: this.height
    });

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
    this.scrollBar = new ScrollBar(target, this, this.width, this.height);

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

  mouseDown(x, y) {
    // when header isResizing do nothing
    if (this.columnHeaderRow.isResizing) {
      return;
    }
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

  mouseMove(x, y) {
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
    // when header isResizing do nothing
    if (this.columnHeaderRow.isResizing) {
      return;
    }
    if (this.columnHeaderRow.isCollision(x, y)) {
      this.columnHeaderRow.mouseUp(x, y);
    }
    else {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].isCollision(x, y)) {
          this.rows[i].mouseUp(x, y);
        }
      }
    }
  }

  mouseClick(x, y) {
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].isCollision(x, y)) {
        this.rows[i].mouseClick(x, y);
      }
    }
  }

  onMouseDbClick(x, y) {
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

    //Scroll bars

    //Multiselect borderWidth
    if (this.showMultiSelect) {
      let minRow = this.rows[this.selectMinRowIndex];
      let maxRow = this.rows[this.selectMaxRowIndex];

      let x = minRow.cells[this.selectMinColIndex].x + this.scrollX;
      let y = minRow.y + this.scrollY;

      let width = 0;

      for (let i = this.selectMinColIndex; i <= this.selectMaxColIndex; i++) {
        width += minRow.cells[i].width;
      }

      let height = 0;

      for (let i = this.selectMinRowIndex; i <= this.selectMaxRowIndex; i++) {
        height += this.rows[i].height;
      }

      this.context.drawRect(x, y, width, height, {
        borderColor: '#4285f4',
        fillColor: 'rgba(236, 243, 255, 0.5)',
        borderWidth: 2
      });
    }
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

  startMultiSelect() {
    this.clearMultiSelect();
    this.isMultiSelecting = true;
    this.showMultiSelect = true;
  }

  endMultiSelect() {
    this.isMultiSelecting = false;
  }

  clearMultiSelect() {
    this.showMultiSelect = false;
    this.selectMinRowIndex = -1;
    this.selectMaxRowIndex = -1;
    this.selectMinColIndex = -1;
    this.selectMaxColIndex = -1;
  }

  multiSelectSize() {
    return (this.selectMaxRowIndex - this.selectMinRowIndex + 1) * (this.selectMaxColIndex - this.selectMinColIndex + 1);
  }

  updateSelection(rowIndex, colIndex) {
    if (this.isMultiSelecting) {
      if (this.selectMinRowIndex == -1 || rowIndex < this.selectMinRowIndex) {
        this.selectMinRowIndex = rowIndex;
      }

      if (this.selectMaxRowIndex == -1 || rowIndex > this.selectMaxRowIndex) {
        this.selectMaxRowIndex = rowIndex;
      }

      if (this.selectMinColIndex == -1 || colIndex < this.selectMinColIndex) {
        this.selectMinColIndex = colIndex;
      }

      if (this.selectMaxColIndex == -1 || colIndex > this.selectMaxColIndex) {
        this.selectMaxColIndex = colIndex;
      }

      this.deselectAllCells();

      for (let i = this.selectMinRowIndex; i <= this.selectMaxRowIndex; i++) {
        this.rows[i].updateSelection(this.selectMinColIndex, this.selectMaxColIndex);
      }
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
}

export {
  Sheet
};
