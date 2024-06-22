export default class DoubleSlider {
  constructor({ min, max, selected, formatValue = val => '$' + val } = {}) {
    this.min = min || 0;
    this.max = max || 200;
    this.range = this.max - this.min;
    this.selected = selected || { from: this.min, to: this.max };
    this.from = this.selected.from;
    this.to = this.selected.to;
    this.formatValue = formatValue;
    this.leftBoundary = this.leftThumbPositionCalculation();
    this.rightBoundary = this.rightThumbPositionCalculation();

    this.element = this.createElement(this.createTemplateElement());
    this.slider = this.element.querySelector('.range-slider__inner');
    this.sliderProgress = this.element.querySelector('.range-slider__progress');
    this.leftThumb = this.element.querySelector('.range-slider__thumb-left');
    this.rightThumb = this.element.querySelector('.range-slider__thumb-right');

    this.createEventListeners();
  }

  createEventListeners() {
    this.leftThumb.ondragstart = () => false;
    this.rightThumb.ondragstart = () => false;

    this.leftThumb.addEventListener('pointerdown', this.onMouseDownLeftThumb);
    this.rightThumb.addEventListener('pointerdown', this.onMouseDownRightThumb);
  }

  onMouseDownLeftThumb = (event) => {
    event.preventDefault();

    let shiftX = event.clientX - this.leftThumb.getBoundingClientRect().left;

    const onMouseMoveLeftThumb = (event) => {
      debugger;
      let newLeft = event.clientX - shiftX - this.slider.getBoundingClientRect().left;
      let newLeftPercent = newLeft / this.slider.getBoundingClientRect().width * 100;

      if (newLeftPercent > (100 - this.rightBoundary)) {
        newLeftPercent = 100 - this.rightBoundary;
      } else if (newLeftPercent < 0) {
        newLeftPercent = 0;
      }

      this.leftBoundary = newLeftPercent;
      this.leftThumb.style.left = newLeftPercent + '%';
      this.sliderProgress.style.left = newLeftPercent + '%';
      this.from = Math.round(this.min + newLeftPercent / 100 * this.range);
      this.element.querySelector('[data-element="from"]').textContent = this.formatValue(this.from);
    };

    const onMouseUpLeftThumb = () => {
      document.removeEventListener('pointermove', onMouseMoveLeftThumb);
      document.removeEventListener('pointerup', onMouseUpLeftThumb);

      this.dispatchEvent();
    };

    document.addEventListener('pointermove', onMouseMoveLeftThumb);
    document.addEventListener('pointerup', onMouseUpLeftThumb);
  };

  onMouseDownRightThumb = (event) => {
    event.preventDefault();
    let shiftX = this.rightThumb.getBoundingClientRect().right - event.clientX;

    const onMouseMoveRightThumb  = (event) => {
      let newRight = this.slider.getBoundingClientRect().right - event.clientX - shiftX;
      let newRightPercent = newRight / this.slider.getBoundingClientRect().width * 100;

      if (newRightPercent > (100 - this.leftBoundary)) {
        newRightPercent = 100 - this.leftBoundary;
      } else if (newRightPercent < 0) {
        newRightPercent = 0;
      }

      this.rightBoundary = newRightPercent;
      this.rightThumb.style.right = newRightPercent + '%';
      this.sliderProgress.style.right = newRightPercent + '%';
      this.to = Math.round(this.max - newRightPercent / 100 * this.range);
      this.element.querySelector('[data-element="to"]').textContent = this.formatValue(this.to);
    };

    const onMouseUpRightThumb  = () => {
      document.removeEventListener('pointermove', onMouseMoveRightThumb );
      document.removeEventListener('pointerup', onMouseUpRightThumb );
      this.dispatchEvent();
    };

    document.addEventListener('pointermove', onMouseMoveRightThumb );
    document.addEventListener('pointerup', onMouseUpRightThumb );
  };

  createTemplateElement() {
    return(`
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.from)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${this.leftBoundary}%; right: ${this.rightBoundary}%"></span>
          <span class="range-slider__thumb-left" style="left: ${this.leftBoundary}%"></span>
          <span class="range-slider__thumb-right" style="right: ${this.rightBoundary}%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.to)}</span>
      </div>`
    );
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;

    return element.firstElementChild;
  }

  leftThumbPositionCalculation() {
    return (this.from - this.min) / this.range * 100;
  }

  rightThumbPositionCalculation() {
    let basePercent = (this.to - this.min) / this.range * 100;
    return 100 - basePercent;
  }

  dispatchEvent() {
    const newCustomEvent = new CustomEvent('range-select', {
      bubbles: true,
      detail: { from: this.from, to: this.to }
    });

    this.element.dispatchEvent(newCustomEvent);
  }

  removeEventListeners() {
    this.leftThumb.removeEventListener('pointerdown', this.onMouseDownLeftThumb);
    this.rightThumb.removeEventListener('pointerdown', this.onMouseDownRightThumb);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
  }
}
