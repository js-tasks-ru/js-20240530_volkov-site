import ColumnChart from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';
import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChartV2 extends ColumnChart {
  constructor({ url, range, label, link } = {}) {
    super({ label, link });
    this.url = url || '';
    this.range = range || { from: new Date(), to: new Date() };
    
    this.subElements = this.getSubElements();
    this.initDataLoading();
  }

  async initDataLoading() {
    this.data = await this.getData();
    this.updateElements();

    return this.data;
  }

  async getData() {
    const params = new URLSearchParams({from: this.range.from.toISOString(), to: this.range.to.toISOString()});
    const data = await fetchJson(`${BACKEND_URL}/${this.url}?${params.toString()}`);

    return data;
  }

  updateElements() {
    this.subElements.header.innerHTML = this.renderChartHeader();
    this.subElements.body.innerHTML = this.renderChartData();
    this.element.classList.remove('column-chart_loading');
  }

  renderChartHeader() {
    return this.formatHeading(Object.values(this.data).reduce((acc, item) => acc + item, 0));
  }

  getColumnProps() {
    if (Array.isArray(this.data) && this.data.length === 0) {
      return [];
    }

    const values = Object.values(this.data);
    const maxValue = Math.max(...values);
    const scale = 50 / maxValue;
  
    return values.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');

    return [...elements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;

      return acc;
    }, {});
  }

  update(from, to) {
    this.range.from = from;
    this.range.to = to;

    return this.initDataLoading();
  }
}
