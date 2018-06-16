import ScreenComponent from './ScreenComponent';
import ColumnHeader from './ColumnHeader';
import {CELL_WIDTH, CELL_HEIGHT, ROW_HEADER_WIDTH} from './constants';

class ColumnHeaderRow extends ScreenComponent {
  constructor(sheet, x, y, colCount, options) {
    super(sheet, x, y, ROW_HEADER_WIDTH + colCount * CELL_WIDTH, CELL_HEIGHT);

    this.columnHeaders = [];

    let headerX = ROW_HEADER_WIDTH;

    for(let i = 0; i < colCount; i++) {
      this.columnHeaders.push(new ColumnHeader(i, sheet, headerX, this.y, CELL_WIDTH, CELL_HEIGHT, {
        color: 'black',
        backGroundColor: 'lightGray',
        borderColor: 'black',
        borderWidth: 1
      }));

      headerX += CELL_WIDTH;
    }
  }

  draw() {
    for(let i = 0; i < this.columnHeaders.length; i++) {
      const columnHeader = this.columnHeaders[i];

      if(columnHeader.isVisibleOnScreen()) {
        columnHeader.draw();
      }
    }
  }

  resizeCol(colIndex, newWidth) {
    let columnHeader = this.columnHeaders[colIndex];
    let oldWidth = columnHeader.width;

    columnHeader.width = newWidth;
    columnHeader.repaint();

    for(let i = colIndex + 1; i < this.columnHeaders.length; i++) {
      this.columnHeaders[i].x += (newWidth - oldWidth);
    }
    this.width += (newWidth - oldWidth);
  }

  mouseMove(x, y) {
    if(this.isResizing) {
      let xDelta = x - this.resizeStartX;
      this.resizeElement.css('left', (this.resizeStartCssLeft + xDelta)+'px');
    }
    else {
      for(let i = 0; i < this.columnHeaders.length; i++) {
        let columnHeader = this.columnHeaders[i];

        if(x > columnHeader.x + this.sheet.scrollX + columnHeader.width - 5 && x < columnHeader.x + this.sheet.scrollX + columnHeader.width + 5) {
          document.body.style.cursor = 'col-resize';
          this.resizeHeader = columnHeader;
        }
      }
    }
  }

  mouseDown(x, y) {
    if(this.resizeHeader) {
      this.resizeStartX = x;
      this.resizeStartWidth = this.resizeHeader.width;
      this.resizeStartCssLeft = (this.sheet.scrollX + this.resizeHeader.x + this.resizeHeader.width);
      this.isResizing = true;
      // use resizeElement where be better
      this.resizeElement = $("<div>", {
        id: "resize-line",
        style:
          "position: fixed;" +
          "left: " + this.resizeStartCssLeft + "px;" +
          "top: " + (this.sheet.scrollY + this.resizeHeader.y) + "px;" +
          "border: 1px solid #4285f4; height: " + (this.sheet.height) + "px;"
      });
      // use body mouseup event, the resize-line will cover canvas mouseup event
      $("body").append(this.resizeElement).one('mouseup', this.mouseUp.bind(this));

    }
  }

  mouseUp(x, y) {
    // resize column
    let left = this.resizeElement.offset().left;
    this.sheet.resizeCol(this.resizeHeader.index, this.resizeStartWidth + (left - this.resizeStartCssLeft));
    // clear
    this.resizeHeader = undefined;
    this.isResizing = false;
    this.resizeElement.remove();
  }

  mouseClick(x, y) {
    for(let i = 0; i < this.columnHeaders.length; i++) {
      if(this.columnHeaders[i].isCollision(x, y)) {
        this.columnHeaders[i].mouseClick(x, y);
      }
    }
  }
}

export default ColumnHeaderRow;
