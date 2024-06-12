export default class ColumnChart {
  chartHeight = 50;

  constructor({ data = [], label = '', value = 0, link = '', formatHeading = value => value } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.element = this.createElement(this.renderChartTemplate());
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;

    return element.firstElementChild;
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;
  
    return this.data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  renderLinkTemplate() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
  }

  renderChartData() {
    const columnProps = this.getColumnProps();

    return columnProps.map(({ value, percent }) => {
      return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
    }).join('');
  }

  renderChartTemplate() {
    return (
      `<div class="column-chart ${!this.data.length && 'column-chart_loading'}" style="--chart-height: 50">
        <div class="column-chart__title">
          ${this.label}
          ${this.renderLinkTemplate()}
        </div>
        <div class="column-chart__container">
          <div  data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
          <div data-element="body" class="column-chart__chart">${this.renderChartData()}</div>
        </div>
      </div>`
    );
  }

  update(newData) {
    this.data = newData;
    const body = this.element.querySelector('[data-element="body"]');

    body ? body.innerHTML = this.renderChartData() : console.log('Can not update chart data. Body element not found.');
  }

  remove() {
    this.element.remove();
  }

  destroy(){
    this.remove();
  };
  
}
