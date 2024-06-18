export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement(this.createTemplate());
    this.subElements = this.getSubElements();
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;

    return element.firstElementChild;
  }

  createTableHeaderColumn({ id, title, sortable }) {
    return(`
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
          <span>${title}</span>
        </div>`
    )
  }

  createDataColumn(config, item) {
    if (config.template) return config.template(item);

    return `<div class="sortable-table__cell">${item[config.id]}</div>`
  }

  createTableItem(item) {
    return(`
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.headerConfig.map((config) => this.createDataColumn(config, item) ).join('')}
      </a>`
    )
  }

  createTableHeader() {
    return(`
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(columnData => this.createTableHeaderColumn(columnData)).join('')}
      </div>`
    )
  }

  createTableBody() {
    if (this.data.length === 0) return this.createTableEmptySection();

    return(`
      <div data-element="body" class="sortable-table__body">
        ${this.data.map(item => this.createTableItem(item)).join('')}
      </div>`
    )
  }

  createTable() {
    return(`
        ${this.createTableHeader()}
        ${this.createTableBody()}
      `
    )
  }

  createTableEmptySection() {
    return(`
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>`
    )
  }

  createTemplate() {
    return(`
        <div data-element="productsContainer" class="products-list__container">
          <div class="sortable-table">
            ${this.createTable()}
          </div>
        </div>`
    )
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');

    return [...elements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;

      return acc;
    }, {});
  }

  sort(field, order) {
    const localeRules = ['ru-RU-u-kf-upper', 'en-US-u-kf-upper'];
    const column = this.headerConfig.find(item => item.id === field);

    this.data.sort((a, b) => {
      if (column.sortType === 'string') {
        return order === 'asc' ? a[field].localeCompare(b[field], localeRules) : b[field].localeCompare(a[field], localeRules);
      } else {
        return order === 'asc' ? a[field] - b[field] : b[field] - a[field];
      }
    });

    this.subElements.body.innerHTML = this.data.map(item => this.createTableItem(item)).join('');
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

