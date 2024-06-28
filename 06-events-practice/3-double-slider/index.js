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

    this.leftThumb.addEventListener('pointerdown', this.pointerDownHandler);
    this.rightThumb.addEventListener('pointerdown', this.pointerDownHandler);
  }

  pointerDownHandler = (event) => {
    event.preventDefault();

    this.shiftX = event.target === this.leftThumb
      ? event.clientX - this.leftThumb.getBoundingClientRect().left
      : this.rightThumb.getBoundingClientRect().right - event.clientX;

    this.modificator = event.target === this.leftThumb ? 'left' : 'right';

    const onMouseMoveHandler = (event) => {
      let thumbPosition;

      thumbPosition = this.modificator === 'left'
        ? event.clientX - this.shiftX - this.slider.getBoundingClientRect().left
        : this.slider.getBoundingClientRect().right - event.clientX - this.shiftX;

      let newPercent = thumbPosition / this.slider.getBoundingClientRect().width * 100;

      const inversedMod = this.modificator === 'left' ? 'right' : 'left'; 
      if (newPercent > (100 - this[`${inversedMod}Boundary`])) {
        newPercent = 100 - this[`${inversedMod}Boundary`];
      } else if (newPercent < 0) {
        newPercent = 0;
      }

      this[`${this.modificator}Boundary`] = newPercent;
      this[`${this.modificator}Thumb`].style[this.modificator] = newPercent + '%';
      this.sliderProgress.style[this.modificator] = newPercent + '%';

      if (this.modificator === 'left') {
        this.from = Math.round(this.min + newPercent / 100 * this.range);
        this.element.querySelector('[data-element="from"]').textContent = this.formatValue(this.from);
      } else {
        this.to = Math.round(this.max - newPercent / 100 * this.range);
        this.element.querySelector('[data-element="to"]').textContent = this.formatValue(this.to);
      }
    }

    const onMouseMove = (event) => onMouseMoveHandler(event);

    const onMouseUp = () => {
      document.removeEventListener('pointermove', onMouseMove);
      document.removeEventListener('pointerup', onMouseUp);

      this.dispatchEvent();
    };

    document.addEventListener('pointermove', onMouseMove);
    document.addEventListener('pointerup', onMouseUp);
  }

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
    const basePercent = (this.to - this.min) / this.range * 100;
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
    this.leftThumb.removeEventListener('pointerdown', this.pointerDownHandler);
    this.rightThumb.removeEventListener('pointerdown', this.pointerDownHandler);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
  }
}
