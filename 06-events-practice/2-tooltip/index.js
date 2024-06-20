class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) return Tooltip.instance;

    Tooltip.instance = this;
    this.element = null;
  }

  initialize () {
    this.createEventListeners();
  }

  createEventListeners() {
    document.addEventListener('pointerover', this.handlePointerOverEvent);
    document.addEventListener('pointerout', this.handlePointerOutEvent);
    document.addEventListener('pointermove', this.handlePointerMoveEvent);
  }

  removeEventListeners() {
    document.removeEventListener('pointerover', this.handlePointerOverEvent);
    document.removeEventListener('pointerout', this.handlePointerOutEvent);
    document.removeEventListener('pointermove', this.handlePointerMoveEvent);
  }

  handlePointerOverEvent = (e) => {
    if (this.isTooltipElement(e)) this.render(e.target.dataset.tooltip);
  }
  
  handlePointerOutEvent = (e) => {
    if (this.isTooltipElement(e) && this.element) this.remove();
  }

  handlePointerMoveEvent = (e) => {
    if (this.element && this.isTooltipElement(e)) {
      this.element.style.left = e.clientX + 10 + 'px';
      this.element.style.top = e.clientY + 10 + 'px';
    }
  }

  isTooltipElement(e) {
    return e.target.dataset.tooltip !== undefined
  }

  render(text) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'tooltip';
    nodeElement.innerHTML = text;

    document.body.append(nodeElement);
    this.element = nodeElement;
}
  remove() {
    if (this.element) this.element.remove();
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
  }
}

export default Tooltip;
