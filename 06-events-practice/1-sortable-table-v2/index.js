import SortableTable from '../../05-dom-document-loading/2-sortable-table-v1/index.js'

export default class SortableTableV2 extends SortableTable {
  constructor(headersConfig, { data = [], sorted = {} } = {}) {
    super(headersConfig, data);
    this.dataElementHeader = this.element.querySelector("div[data-element='header']");
    this.sorted = sorted;
    this.arrowNodeElement = null;

    this.createEventListeners();
    this.setDefaultSortingOrder()
  }

  handleColumnClick = (e) => {
    e.preventDefault();

    const column = e.target.closest('[data-sortable="true"]');
    if (!column) return;

    column.dataset.order = column.dataset.order === 'desc' ? 'asc' : 'desc';
    if (!column.querySelector('[data-element="arrow"]')) column.append(this.arrowNodeElement);

    this.sort(column.dataset.id, column.dataset.order);
  }

  createEventListeners() {  
    this.dataElementHeader.addEventListener('pointerdown', this.handleColumnClick);
  }

  removeEventListeners() {
    this.dataElementHeader.removeEventListener('pointerdown', this.handleColumnClick);
  }

  createSortingArrow() {
    return(`
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>`
    )
  }

  setDefaultSortingOrder() {
    const columnForDefaultOrdering = this.element.querySelector(`[data-id="${this.sorted.id}"]`)

    columnForDefaultOrdering.dataset.order = this.sorted.order;
    columnForDefaultOrdering.insertAdjacentHTML('beforeend', this.createSortingArrow());

    this.arrowNodeElement = columnForDefaultOrdering.querySelector('[data-element="arrow"]');
    this.sort(this.sorted.id, this.sorted.order);
  }

  destroy() {
    this.removeEventListeners();
    super.destroy();
  }
}
