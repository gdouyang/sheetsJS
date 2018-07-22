(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["sheets"] = factory();
	else
		root["sheets"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Sheet.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Cell.js":
/*!*********************!*\
  !*** ./src/Cell.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ScreenComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ScreenComponent */ "./src/ScreenComponent.js");
/* harmony import */ var _Context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Context */ "./src/Context.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/util.js");





class Cell extends _ScreenComponent__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(index, rowIndex, sheet, x, y, width, height, options) {
    super(sheet, x, y, width, height);

    this.index = index;
    this.rowIndex = rowIndex;
    this.text = "";

    Object.assign(this, {
      color: 'black',
      backGroundColor: 'white',
      borderColor: 'darkGray',
      borderWidth: 1
    }, options);

    this.dependentCells = [];
  }
  getRow(index) {
    if (index === null) {
      index = this.rowIndex;
    }
    return this.sheet.rows[index];
  }
  registerDependentValueCell(cell) {
    for (let i = 0; i < this.dependentCells.length; i++) {
      let cell2 = this.dependentCells[i];
      if (cell2.rowIndex == cell.rowIndex && cell2.index == cell.index) {
        return;
      }
    }
    this.dependentCells.push(cell);
  }

  updateValue(value) {
    this.value = value;

    //TODO: Should nulls be displayed the same as undefined (i.e. blank)?
    if (value === undefined || value === null) {
      return;
    }

    const getIndividualArgValue = (arg) => {
      let colAlphaMatch = arg.match(/[A-Z]+/);

      if (/[A-Z]+/.test(arg)) {
        //Cell reference
        let colAlpha = colAlphaMatch[0];
        let col = Object(_util__WEBPACK_IMPORTED_MODULE_3__["aToI"])(colAlpha);
        let row = arg.match(/\d+/)[0] - 1;

        let cell = this.sheet.getCell(row, col);
        cell.registerDependentValueCell(this);
        return cell.value;
      }
      else {
        //Number literal (we assume)
        return arg;
      }
    };

    if (value.indexOf("=") == 0) {
      try {
        let functionName = value.substr(1).split('(')[0];
        let args = value.substr(1).split('(')[1].replace(')', '').split(',');

        let argValues = [];

        for (let i = 0; i < args.length; i++) {
          let arg = args[i].trim();

          if (arg.indexOf(":") !== -1) {
            let rangeIndexes = arg.split(':');

            //TODO: This is not actually a range right now
            for (let j = 0; j < rangeIndexes.length; j++) {
              argValues.push(getIndividualArgValue(rangeIndexes[j]));
            }
          }
          else {
            argValues.push(getIndividualArgValue(arg));
          }
        }
        functionName = functionName.toUpperCase();
        let result = formulajs[functionName].apply(null, argValues);

        this.text = result;
      } catch (error) {
        console.error(error);
        alert('Formula Error');
        throw error;
      }
    }
    else {
      this.text = value;
    }

    if (!this.isTextBufferInitialized) {
      this.textBufferCanvas = document.createElement('canvas');

      this.textBufferContext = new _Context__WEBPACK_IMPORTED_MODULE_1__["default"](this.textBufferCanvas, {
        width: this.width,
        height: this.height
      });

      this.isTextBufferInitialized = true;
    }

    this.isNumeric = this.text && /^\d*(\.\d+)?$/.test(this.text);

    this.repaint();

  }

  repaint() {
    if (this.isTextBufferInitialized) {
      this.textBufferContext = new _Context__WEBPACK_IMPORTED_MODULE_1__["default"](this.textBufferCanvas, {
        width: this.width,
        height: this.height
      });

      this.textBufferContext.clear();

      this.textBufferContext.drawRect(0, 0, this.width, this.height, {
        fillColor: this.backGroundColor,
        borderColor: this.borderColor,
        borderWidth: this.borderWidth
      });

      //TODO: Formatting

      this.textBufferContext.drawText(this.text, this.isNumeric ? this.width : 0, this.height / 2, {
        font: this.height * 0.8 + 'px Sans',
        color: this.color,
        align: this.isNumeric ? 'end' : 'start',
        baseLine: 'middle'
      });
    }

    if (this.isEditing) {
      if (this.width > 4) {
        this.inputElement.width(this.width - 4);
      }
      else {
        this.blur();
      }
    }
    for (let i = 0; i < this.dependentCells.length; i++) {
      let depCell = this.dependentCells[i];
      depCell.updateValue(depCell.value);
    }
  }

  draw() {
    if (!this.isTextBufferInitialized) {
      this.sheet.context.drawRect(this.sheet.scrollX + this.x, this.sheet.scrollY + this.y, this.width, this.height, {
        fillColor: this.backGroundColor,
        borderColor: this.borderColor,
        borderWidth: this.borderWidth
      });
    }
    else {
      this.sheet.context.drawImage(this.textBufferCanvas, this.x + this.sheet.scrollX, this.y + this.sheet.scrollY, this.width, this.height);
    }

    if (this.isEditing) {
      if (this.sheet.scrollX + this.x < _constants__WEBPACK_IMPORTED_MODULE_2__["ROW_HEADER_WIDTH"] || this.sheet.scrollX + this.x > this.sheet.width - this.width || this.sheet.scrollY + this.y < 20 || this.sheet.scrollY + this.y > this.sheet.height - this.height) {
        this.inputElement.hide();
      }
      else {
        this.inputElement.show();
        this.inputElement.css("left", this.sheet.scrollX + this.x + "px");
        this.inputElement.css("top", this.sheet.scrollY + this.y + "px");
        this.inputElement.focus();
      }
    }
  }

  blur() {
    if (this.isEditing) {
      this.isEditing = false;
      try {
        this.updateValue(this.inputElement.val());
      } catch (error) {
        console.error(error);
      }
      this.inputElement.remove();
      this.inputElement = undefined;
    }
  }

  mouseDown(x, y) {
    this.sheet.startMultiSelect(this);
  }

  mouseMove(x, y) {
    if (this.sheet.isMultiSelecting) {
      this.sheet.updateSelection(this.rowIndex, this.index);
    }
  }

  mouseUp(x, y) {
    if (this.sheet.multiSelectSize() == 1) {
      this.sheet.clearMultiSelect();
    }

    this.sheet.endMultiSelect();
  }

  onMouseDbClick(x, y) {
    this.edit();
  }

  onKeydown(e) {
    let keyCode = e.keyCode || e.which;
    if (e.target.id == 'cell-input') {
      this.sheet.multiSelectElement.hide();
      return;
    }
    let _rowIndex = -1;
    let _colIndex = -1;
    if (keyCode === 13) {
      //Enter, edit
      this.edit();
    }
    else if (keyCode === 9) {
      //Tab, go to next column
      _rowIndex = this.rowIndex;
      _colIndex = this.index + (e.shiftKey ? -1 : 1);
    }
    else if (keyCode === 37) {
      //Left arrow
      _rowIndex = this.rowIndex;
      _colIndex = this.index - 1;
    }
    else if (keyCode === 39) {
      //Right arrow
      _rowIndex = this.rowIndex;
      _colIndex = this.index + 1;
    }
    else if (keyCode === 38) {
      //Up arrow
      _rowIndex = this.rowIndex - 1;
      _colIndex = this.index;
    }
    else if (keyCode === 40) {
      //Down arrow
      _rowIndex = this.rowIndex + 1;
      _colIndex = this.index;
    }
    if (_rowIndex != -1 && _colIndex != -1) {
      let _row = this.getRow(_rowIndex);
      if (_row) {
        _row.getCell(_colIndex) && this.sheet.startMultiSelect(_row.getCell(_colIndex));
        this.sheet.endMultiSelect();
      }
    }
  }

  edit() {
    this.sheet.clearEditingCell();
    this.sheet.editingCell = this;
    this.isEditing = true;
    this.inputElement = $("<input>", {
      type: "text",
      id: "cell-input",
      style:
        "text-align: " + (this.isNumeric ? "right" : "left") + ";" +
        "position: fixed;" +
        "left: " + this.sheet.scrollX + this.x + "px;" +
        "top: " + this.sheet.scrollY + this.y + "px;" +
        "width: " + (this.width - 4) + "px; height: " + (this.height - 4) + "px;"
    });

    $("body").append(this.inputElement);

    this.inputElement.val(this.value);

    this.inputElement.keydown((e) => {
      let keyCode = e.keyCode || e.which;

      //TODO: auto scroll if moving to cell would make the input disappear
      let _rowIndex = -1;
      let _colIndex = -1;
      if (keyCode === 13) {
        this.updateValue(this.inputElement.val());

        if (this.isNumeric) {
          this.inputElement.css("text-align", this.isNumeric ? "right" : "left")
        }
        //Enter, go to next row
        _rowIndex = this.rowIndex + (e.shiftKey ? -1 : 1);
        _colIndex = this.index;
      }
      else if (keyCode === 9) {
        //Tab, go to next column
        _rowIndex = this.rowIndex;
        _colIndex = this.index + (e.shiftKey ? -1 : 1);
        e.preventDefault();
      }

      if (_rowIndex != -1 && _colIndex != -1) {
        this.blur();
        let _row = this.getRow(_rowIndex);
        _row && _row.getCell(_colIndex) && _row.getCell(_colIndex).edit();
      }
    });

    this.inputElement.bind('paste', (e) => {
      var pastedData = e.originalEvent.clipboardData.getData('text');

    });

    this.inputElement.focus();
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Cell);


/***/ }),

/***/ "./src/ColumnHeader.js":
/*!*****************************!*\
  !*** ./src/ColumnHeader.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ScreenComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ScreenComponent */ "./src/ScreenComponent.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/util.js");



class ColumnHeader extends _ScreenComponent__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(index, sheet, x, y, width, height, options) {
    super(sheet, x, y, width, height, options);

    this.index = index;

    Object.assign(this, {
      color: 'black',
      backGroundColor: 'lightGray',
      borderColor: 'darkGray',
      borderWidth: 1
    }, options);

    this.updateText(Object(_util__WEBPACK_IMPORTED_MODULE_1__["iToA"])(this.index));
  }

  isVisibleOnScreen() {
    return !(this.x + this.sheet.scrollX + this.width < 0 || this.x + this.sheet.scrollX > this.sheet.width ||
      this.y + this.height < 0 || this.y  > this.sheet.height);
  }

  updateText(value) {
    this.text = value;

    this.repaint();
  }

  repaint() {
    this.textBufferCanvas = document.createElement('canvas');
    this.textBufferContext = this.textBufferCanvas.getContext('2d');

    this.textBufferCanvas.width = this.width * 2;
    this.textBufferCanvas.height = this.height * 2;
    this.textBufferCanvas.style.width = this.width;
    this.textBufferCanvas.style.height = this.height;

    this.textBufferContext.scale(2, 2);

    this.textBufferContext.font = this.height * 0.8 + 'px Sans';
    this.textBufferContext.fillStyle = this.color;
    this.textBufferContext.textAlign = 'center';
    this.textBufferContext.textBaseline = 'middle';

    this.textBufferContext.fillText(this.text, this.width / 2, this.height / 2);
  }

  draw() {
    this.sheet.context.drawRect(this.x + this.sheet.scrollX, this.y, this.width, this.height, {
      fillColor: this.backGroundColor,
      borderColor: this.borderColor,
      borderWidth: this.borderWidth
    });

    this.sheet.context.drawImage(this.textBufferCanvas, this.x + this.sheet.scrollX, this.y, this.width, this.height);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (ColumnHeader);


/***/ }),

/***/ "./src/ColumnHeaderRow.js":
/*!********************************!*\
  !*** ./src/ColumnHeaderRow.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ScreenComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ScreenComponent */ "./src/ScreenComponent.js");
/* harmony import */ var _ColumnHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ColumnHeader */ "./src/ColumnHeader.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/constants.js");




class ColumnHeaderRow extends _ScreenComponent__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(sheet, x, y, colCount, options) {
    super(sheet, x, y, _constants__WEBPACK_IMPORTED_MODULE_2__["ROW_HEADER_WIDTH"] + colCount * _constants__WEBPACK_IMPORTED_MODULE_2__["CELL_WIDTH"], _constants__WEBPACK_IMPORTED_MODULE_2__["CELL_HEIGHT"]);

    this.columnHeaders = [];

    let headerX = _constants__WEBPACK_IMPORTED_MODULE_2__["ROW_HEADER_WIDTH"];

    for(let i = 0; i < colCount; i++) {
      this.columnHeaders.push(new _ColumnHeader__WEBPACK_IMPORTED_MODULE_1__["default"](i, sheet, headerX, this.y, _constants__WEBPACK_IMPORTED_MODULE_2__["CELL_WIDTH"], _constants__WEBPACK_IMPORTED_MODULE_2__["CELL_HEIGHT"], {
        color: 'black',
        backGroundColor: 'lightGray',
        borderColor: 'black',
        borderWidth: 1
      }));

      headerX += _constants__WEBPACK_IMPORTED_MODULE_2__["CELL_WIDTH"];
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

/* harmony default export */ __webpack_exports__["default"] = (ColumnHeaderRow);


/***/ }),

/***/ "./src/Context.js":
/*!************************!*\
  !*** ./src/Context.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

class Context {
  constructor(target, options) {
    options = Object.assign({
      onMouseMove: (x, y) => { },
      onMouseDown: (x, y) => { },
      onMouseUp: (x, y) => { },
      onMouseClick: (x, y) => { },
      onScroll: (dx, dy) => { },
      useCanvasScroll: true
    }, options);

    target.width = options.width * 2;
    target.height = options.height * 2;
    target.style.width = options.width + "px";
    target.style.height = options.height + "px";
    this.target = target;
    this.ctx = target.getContext("2d");
    this.ctx.scale(2, 2);

    var self = this;

    const getMouseCoords = function (e) {
      var rect = self.ctx.canvas.getBoundingClientRect();

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    this.ctx.canvas.onmousemove = function (e) {
      var coords = getMouseCoords(e);
      options.onMouseMove(coords.x, coords.y);
      e.preventDefault();
    };

    this.ctx.canvas.onmousedown = function (e) {
      var coords = getMouseCoords(e);
      options.onMouseDown(coords.x, coords.y);
      e.preventDefault();
    };

    this.ctx.canvas.onmouseup = function (e) {
      var coords = getMouseCoords(e);
      options.onMouseUp(coords.x, coords.y);
      e.preventDefault();
    };

    this.ctx.canvas.onclick = function (e) {
      var coords = getMouseCoords(e);
      options.onMouseClick(coords.x, coords.y);
      e.preventDefault();
    };

    this.ctx.canvas.ondblclick = function (e) {
      var coords = getMouseCoords(e);
      options.onMouseDbClick(coords.x, coords.y);
      e.preventDefault();
    };

    this.ctx.canvas.onmousewheel = function (e) {
      if (options.useCanvasScroll) {
        options.onScroll(e.deltaX, e.deltaY);
        e.preventDefault();
      }
    };

    // this.textBufferCanvas = document.createElement('canvas');
    // this.textBufferContext = this.textBufferCanvas.getContext('2d');
  }

  drawLine(points, options) {
    options = Object.assign({
      width: 1,
      color: 'black',
      cap: 'square',
      lineJoin: 'miter'
    }, options);

    this.ctx.beginPath();
    this.ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i][0], points[i][1]);
    }
    this.ctx.lineWidth = options.width;
    this.ctx.strokeStyle = options.color;
    this.ctx.lineCap = options.cap;
    this.ctx.lineJoin = options.lineJoin;
    this.ctx.stroke();
  }

  drawRect(x, y, width, height, options) {
    options = Object.assign({
      borderWidth: 1,
      borderColor: undefined,
      fillColor: undefined
    }, options);

    this.ctx.beginPath();

    if (options.fillColor) {
      this.ctx.fillStyle = options.fillColor;
    }

    if (options.borderColor) {
      this.ctx.lineWidth = options.borderWidth;
      this.ctx.strokeStyle = options.borderColor;
    }

    this.ctx.rect(x, y, width, height);

    if (options.fillColor) {
      this.ctx.fill();
    }

    if (options.borderColor) {
      this.ctx.stroke();
    }
  }

  drawText(text, x, y, options) {
    options = Object.assign({
      font: '14px Sans',
      color: 'white',
      align: 'center',
      baseLine: 'middle'
    }, options);

    this.ctx.font = options.font;
    this.ctx.fillStyle = options.color;
    this.ctx.textAlign = options.align;
    this.ctx.textBaseline = options.baseLine;

    this.ctx.fillText(text, x, y);
  }

  drawImage(img, x, y, width, height) {
    this.ctx.drawImage(img, x, y, width, height);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Context);


/***/ }),

/***/ "./src/ContextMenu.js":
/*!****************************!*\
  !*** ./src/ContextMenu.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (ContextMenu);


/***/ }),

/***/ "./src/Row.js":
/*!********************!*\
  !*** ./src/Row.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ScreenComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ScreenComponent */ "./src/ScreenComponent.js");
/* harmony import */ var _RowHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RowHeader */ "./src/RowHeader.js");
/* harmony import */ var _Cell__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Cell */ "./src/Cell.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "./src/constants.js");





class Row extends _ScreenComponent__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(index, sheet, x, y, colCount, options) {
    //TODO: Calculate width, also update width on column resize
    //TODO: Pass in width and height as options
    super(sheet, x, y, _constants__WEBPACK_IMPORTED_MODULE_3__["ROW_HEADER_WIDTH"] + colCount * _constants__WEBPACK_IMPORTED_MODULE_3__["CELL_WIDTH"], _constants__WEBPACK_IMPORTED_MODULE_3__["CELL_HEIGHT"]);

    this.index = index;

    //Header cell
    this.rowHeader = new _RowHeader__WEBPACK_IMPORTED_MODULE_1__["default"](0, index, sheet, 0, this.y, _constants__WEBPACK_IMPORTED_MODULE_3__["ROW_HEADER_WIDTH"], _constants__WEBPACK_IMPORTED_MODULE_3__["CELL_HEIGHT"], {
      color: 'black',
      backGroundColor: 'lightGray',
      borderColor: 'black',
      borderWidth: 1
    });

    //Data cells
    this.cells = [];

    let cellX = _constants__WEBPACK_IMPORTED_MODULE_3__["ROW_HEADER_WIDTH"];

    for (let i = 0; i < colCount; i++) {
      this.cells.push(new _Cell__WEBPACK_IMPORTED_MODULE_2__["default"](i, index, sheet, cellX, this.y, _constants__WEBPACK_IMPORTED_MODULE_3__["CELL_WIDTH"], _constants__WEBPACK_IMPORTED_MODULE_3__["CELL_HEIGHT"], options));
      cellX += _constants__WEBPACK_IMPORTED_MODULE_3__["CELL_WIDTH"];
    }
  }

  getCell(celIndex) {
    return this.cells[celIndex];
  }

  draw() {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];

      if (cell.isVisibleOnScreen()) {
        cell.draw();
      }
    }

    this.rowHeader.draw();
  }

  resizeCol(colIndex, newWidth) {
    let cell = this.cells[colIndex]
    let oldWidth = cell.width;

    cell.width = newWidth;
    cell.repaint();

    for (let i = colIndex + 1; i < this.cells.length; i++) {
      this.cells[i].x += (newWidth - oldWidth);
    }
    this.width += (newWidth - oldWidth);
  }

  mouseDown(x, y) {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].isCollision(x, y)) {
        this.cells[i].mouseDown(x, y);
      }
    }
  }

  mouseMove(x, y) {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].isCollision(x, y)) {
        this.cells[i].mouseMove(x, y);
      }
    }
  }

  mouseUp(x, y) {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].isCollision(x, y)) {
        this.cells[i].mouseUp(x, y);
      }
    }
  }

  onMouseDbClick(x, y) {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].isCollision(x, y)) {
        this.cells[i].onMouseDbClick(x, y);
      }
    }
  }

  onkeydown(x, y, event) {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].isCollision(x, y)) {
        this.cells[i].onkeydown(x, y, event);
      }
    }
  }

  /**
   * get the row selection size(width and height)
   * @param {*} minColIndex 
   * @param {*} maxColIndex 
   */
  getSelectionSize(minColIndex, maxColIndex) {
    let obj = { width: 0, height: this.height };
    for (let i = minColIndex; i <= maxColIndex; i++) {
      //this.cells[i].isSelected = true;
      obj.width += this.cells[i].width;
    }
    return obj;
  }

  getCell(colIndex) {
    return this.cells[colIndex];
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Row);


/***/ }),

/***/ "./src/RowHeader.js":
/*!**************************!*\
  !*** ./src/RowHeader.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ScreenComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ScreenComponent */ "./src/ScreenComponent.js");


class RowHeader extends _ScreenComponent__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(index, rowIndex, sheet, x, y, width, height, options) {
    super(sheet, x, y, width, height, options);

    this.rowIndex = rowIndex;

    Object.assign(this, {
      color: 'black',
      backGroundColor: 'lightGray',
      borderColor: 'darkGray',
      borderWidth: 1
    }, options);

    this.textBufferCanvas = document.createElement('canvas');
    this.textBufferContext = this.textBufferCanvas.getContext('2d');

    this.textBufferCanvas.width = this.width * 2;
    this.textBufferCanvas.height = this.height * 2;
    this.textBufferCanvas.style.width = this.width;
    this.textBufferCanvas.style.height = this.height;

    this.textBufferContext.scale(2, 2);

    this.textBufferContext.font = this.height * 0.8  + 'px Sans';
    this.textBufferContext.fillStyle = this.color;
    this.textBufferContext.textAlign = 'center';
    this.textBufferContext.textBaseline = 'middle';

    this.updateText(rowIndex + 1);
  }

  updateText(text) {
    this.text = text;
    this.textBufferContext.fillText(this.text, this.width / 2, this.height / 2);
  }

  draw() {
    this.sheet.context.drawRect(this.x, this.sheet.scrollY + this.y, this.width, this.height, {
      fillColor: this.backGroundColor,
      borderColor: this.borderColor,
      borderWidth: this.borderWidth
    });

    this.sheet.context.drawImage(this.textBufferCanvas, this.x, this.y + this.sheet.scrollY, this.width, this.height);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (RowHeader);


/***/ }),

/***/ "./src/ScreenComponent.js":
/*!********************************!*\
  !*** ./src/ScreenComponent.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class ScreenComponent {
  constructor(sheet, x, y, width, height) {
    this.sheet = sheet;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    // console.log("ScreenComponent:draw()");
  }

  isVisibleOnScreen() {
    return !(this.x + this.sheet.scrollX + this.width < 0 || this.x + this.sheet.scrollX > this.sheet.width ||
      this.y + this.sheet.scrollY + this.height < 0 || this.y + this.sheet.scrollY > this.sheet.height);
  }

  isCollision(canvasX, canvasY) {
    return canvasX > this.x + this.sheet.scrollX &&
      canvasX < this.x + this.sheet.scrollX + this.width &&
      canvasY > this.y + this.sheet.scrollY &&
      canvasY < this.y + this.sheet.scrollY + this.height;
  }
}

/* harmony default export */ __webpack_exports__["default"] = (ScreenComponent);


/***/ }),

/***/ "./src/ScrollBar.js":
/*!**************************!*\
  !*** ./src/ScrollBar.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (ScrollBar);


/***/ }),

/***/ "./src/Sheet.js":
/*!**********************!*\
  !*** ./src/Sheet.js ***!
  \**********************/
/*! exports provided: Sheet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sheet", function() { return Sheet; });
/* harmony import */ var _Context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Context */ "./src/Context.js");
/* harmony import */ var _Row__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Row */ "./src/Row.js");
/* harmony import */ var _ColumnHeaderRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ColumnHeaderRow */ "./src/ColumnHeaderRow.js");
/* harmony import */ var _ScrollBar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ScrollBar */ "./src/ScrollBar.js");
/* harmony import */ var _ContextMenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ContextMenu */ "./src/ContextMenu.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./constants */ "./src/constants.js");







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

    this.context = new _Context__WEBPACK_IMPORTED_MODULE_0__["default"](canvas, {
      //onScroll: this.onScroll.bind(this),
      width: this.width,
      height: this.height
    });
    $(document).on('mousemove', this.mouseMove.bind(this));
    $(document).on('mousedown', this.mouseDown.bind(this));
    $(document).on('dblclick', this.onMouseDbClick.bind(this));

    //Column headerX
    this.columnHeaderRow = new _ColumnHeaderRow__WEBPACK_IMPORTED_MODULE_2__["default"](this, 0, 0, this.colCount);

    //Data rows
    this.rows = [];

    let rowY = _constants__WEBPACK_IMPORTED_MODULE_5__["CELL_HEIGHT"];

    for (let i = 0; i < this.rowCount; i++) {
      this.rows.push(new _Row__WEBPACK_IMPORTED_MODULE_1__["default"](i, this, 0, rowY, this.colCount));
      rowY += _constants__WEBPACK_IMPORTED_MODULE_5__["CELL_HEIGHT"];
    }

    this.mainLoop();

    //Scroll bars
    this.scrollBar = new _ScrollBar__WEBPACK_IMPORTED_MODULE_3__["default"](target, this, { onScroll: this.updateSelection.bind(this) });
    // contextMenu
    this.contextMenu = new _ContextMenu__WEBPACK_IMPORTED_MODULE_4__["default"](this);
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

    if (this.scrollBar.isScrollBar(event)) { return };
    if (this.contextMenu.isCollision(event)) { return };
    // when header isResizing do nothing
    if (this.columnHeaderRow.isResizing) { return; }
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
      // if right btn click show context menu
      if (event.which == 3) { this.contextMenu.show(event); }
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
    this.context.drawRect(0, 0, _constants__WEBPACK_IMPORTED_MODULE_5__["ROW_HEADER_WIDTH"], _constants__WEBPACK_IMPORTED_MODULE_5__["CELL_HEIGHT"], {
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

  clearEditingCell() {
    if (this.editingCell) {
      this.editingCell.blur();
    }
  }

  startMultiSelect(cell) {
    this.clearEditingCell();
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
    if (this.multiSelectStartCell) {
      if (rowIndex == null) {
        rowIndex = this.selectMaxRowIndex;
      }
      if (colIndex == null) {
        colIndex = this.selectMaxColIndex;
      }
      // console.info("" + rowIndex + "-" + colIndex)
      this.selectMaxRowIndex = rowIndex;
      this.selectMaxColIndex = colIndex;

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




/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/*! exports provided: ROW_HEADER_WIDTH, CELL_WIDTH, CELL_HEIGHT */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ROW_HEADER_WIDTH", function() { return ROW_HEADER_WIDTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CELL_WIDTH", function() { return CELL_WIDTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CELL_HEIGHT", function() { return CELL_HEIGHT; });
const ROW_HEADER_WIDTH = 40;
const CELL_WIDTH = 70;
const CELL_HEIGHT = 20;


/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! exports provided: iToA, aToI */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iToA", function() { return iToA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "aToI", function() { return aToI; });
const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; //0 = A, 25 = Z

const iToA = (i) => {
  let current = i;

  let a = "";

  while(current > -1) {
    let digit = current % 26;
    a = alpha[digit] + "" + a;

    //This is not a straight number base conversion, we need to
    //treat A as
    current = Math.floor(current / 26) - 1;
  }

  return a;
}

const aToI = (a) => {
  let index = (alpha.indexOf(a[0]) + 1) * Math.pow(26, a.length - 1) - 1;

  for(let i = a.length - 1; i > 0; i--) {
    index += (alpha.indexOf(a[i]) + 1) * Math.pow(26, a.length - i - 1);
  }

  return index;
};


/***/ })

/******/ });
});
//# sourceMappingURL=sheets.js.map