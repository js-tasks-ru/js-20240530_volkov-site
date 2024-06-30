import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';
import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTableV3 extends SortableTableV2 {
  constructor(headersConfig, { url, isSortLocally } = {}) {
    super(headersConfig, { data: [], sorted: { id: headersConfig.find(item => item.sortable).id, order: 'asc' } });
    this.isSortLocally = isSortLocally || false;
    this.url = new URL(url, BACKEND_URL);
    this.start = 0;
    this.end = 30;
    this.cache = {};

    this.initDataLoading();
    this.createScrollListener();
  }

  handleScroll = (e) => {
    e.preventDefault();
    const { bottom } = document.documentElement.getBoundingClientRect();

    if (bottom < document.documentElement.clientHeight + 100) {
      this.loadMore();
      this.removeScrollListener();
      setTimeout(() => this.createScrollListener(), 1000);
    }
  }

  createScrollListener() {  
    document.addEventListener('scroll', this.handleScroll);
  }

  removeScrollListener() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  async initDataLoading(loadMore = false) {
    this.data = await this.getData();
    this.updateElements(loadMore);

    return this.data;
  }

  async getData() {
    this.url.searchParams.set('_start', this.start);
    this.url.searchParams.set('_end', this.end);

    const cacheKey = this.url.toString();
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    const data = await fetchJson(this.url);

    this.cache[cacheKey] = data;
    setTimeout(() => this.clearCache(cacheKey), 10000);

    return data;
  }

  createTableBody() {
    if (this.data.length === 0) return this.createTableEmptySection();

    return this.data.map(item => this.createTableItem(item)).join('');
  }

  updateElements(loadMore = false) {
    if (loadMore) {
      this.subElements.body.insertAdjacentHTML('beforeend', this.createTableBody());
    } else {
      this.subElements.body.innerHTML = this.createTableBody();
    }
  }

  sort(id, order ) {
     if (this.isSortLocally) {
      this.sortOnClient(id, order);
    } else {
      this.sortOnServer(id, order);
    }
  }

  sortOnClient(id, order) {
    super.sort(id, order);
  }

  sortOnServer(id, order) {
    if (!this.url) return;

    this.url.searchParams.set('_sort', id);
    this.url.searchParams.set('_order', order);

    this.initDataLoading();
  }

  async render() {
    await this.initDataLoading();
  }

  loadMore() {
    this.start = this.end;
    this.end += 30;

    this.initDataLoading(true);
  }

  clearCache(cacheKey) {
    delete this.cache[cacheKey];
  }

  remove() {
    this.removeScrollListener();
    super.remove();
  }
}
