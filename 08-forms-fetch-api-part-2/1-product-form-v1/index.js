import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  constructor (productId) {
    this.productId = productId || null;
    this.editableData = {};
    this._submitFormHandler = this.submitFormHandler.bind(this);
    this._formElementChangeHandler = this.formElementChangeHandler.bind(this);
  }

  createEventListeners() {
    this.subElements.productForm.addEventListener('submit', this._submitFormHandler);
    this.subElements.productForm.addEventListener('change', this._formElementChangeHandler);
  }

  removeEventListeners() {
    this.subElements.productForm.removeEventListener('submit', this._submitFormHandler);
    this.subElements.productForm.removeEventListener('change', this._formElementChangeHandler);
  }

  async fetchCategories() {
    const url = new URL('api/rest/categories', BACKEND_URL);
    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');

    const data = await fetchJson(url);

    return data;
  }

  async fetchProductData() {
    if (!this.productId) return;

    const url = new URL('api/rest/products', BACKEND_URL);
    url.searchParams.set('id', this.productId);
    const data = await fetchJson(url);
    this.editableData = data[0]

    return this.editableData
  }

  async pushProductData() {
    const url = new URL('api/rest/products', BACKEND_URL);
    const data = await fetchJson(url, { method: 'PUT', body: JSON.stringify(this.editableData) });

    return data
  }

  async fillFormFields() {
    const { productForm } = this.subElements;
    await this.fetchProductData();

    for (const key in this.editableData) {
      if (key === 'images') { this.fillImages(productForm); continue; }

      const element = productForm.querySelector(`[name="${key}"]`);
      if (element) element.value = this.editableData[key].toString()
    }
  }

  async fillCategories() {
    const subcategory = this.subElements.productForm.querySelector('#subcategory');
    const data = await this.fetchCategories();

    const categories = data.map(({ title, subcategories }) => {
      return Array.from(subcategories).map((sub) => {
        return `<option value="${sub.id}">${title} > ${sub.title}</option>`;
      }).join('');
    }).join('');

    subcategory.innerHTML = categories;
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;

    return element.firstElementChild;
  }
  createTemplate() {
    return(`
      <div class="product-form">
        ${this.createFormTemplate()}
      </div>`
    )
  }

  createFormTemplate() {
    return(`
      <form data-element="productForm" class="form-grid">
          ${this.createProductTitleElement()}
          ${this.createProductDescriptionElement()}
          ${this.createProductPhotosListElement()}
          ${this.createProductCategoryElement()}
          ${this.createProductPricesElement()}
          ${this.createProductQuantityElement()}
          ${this.createProductStatusElement()}
          ${this.createFormSubmitElement()}
      </form>
      `
    )
  }

  createProductTitleElement() {
    return(`
        <div class="form-group form-group__half_left">
          <fieldset>
            <label class="form-label">Название товара</label>
            <input required="" type="text" name="title" id="title" class="form-control" placeholder="Название товара">
          </fieldset>
        </div>`
      )
  }

  createProductDescriptionElement() {
    return(`
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" id="description" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      </div>`
    )
  }

  createProductPhotoItemElement(image){
    return(`
      <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="${image.url}">
        <input type="hidden" name="source" value="${image.source}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
          <span>${image.source}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      </li>`
    )
  }

  createProductPhotosListElement() {
    return(`
        <div class="form-group form-group__wide" data-element="sortable-list-container">
          <label class="form-label">Фото</label>
          <div data-element="imageListContainer">
            <ul class="sortable-list">
            </ul>
          </div>
          <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
        </div>
      `
    )
  }

  fillImages(productForm) {
    const images = this.editableData['images'];
    const container = productForm.querySelector('[data-element="imageListContainer"] ul');
    const imagesList = images.map((image) => {
      return this.createProductPhotoItemElement(image);
    }).join('');

    container.innerHTML = imagesList;
  }

  createProductCategoryElement() {
    return(`
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" id="subcategory" name="subcategory">
        </select>
      </div>`
    )
  }

  createProductPricesElement() {
    return(`
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" id="price" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" id="discount" name="discount" class="form-control" placeholder="0">
        </fieldset>
      </div>`
    )
  }

  createProductQuantityElement() {
    return(`
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" id="quantity" class="form-control" name="quantity" placeholder="1">
      </div>`
    )
  }

  createProductStatusElement() {
    return(`
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" id="status" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>`
    )
  }

  createFormSubmitElement() {
    return(`
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>`
    )
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((acc, elem) => {
      acc[elem.dataset.element] = elem;

      return acc;
    }, {})
  }

  async render () {
    this.element = this.createElement(this.createTemplate());
    this.subElements = this.getSubElements(this.element);
    this.fillCategories();
    this.createEventListeners();

    if (this.productId) await this.fillFormFields();

    return this.element;
  }

  async submitFormHandler(event) {
    event.preventDefault();

    await this.onSubmit();
  }

  formElementChangeHandler(event) {
    event.preventDefault();
    const element = event.target;
    this.editableData[element.name] = escapeHtml(element.value);
  }

  async onSubmit() {
    try {
      await this.pushProductData();
      this.save();
    } catch (error) {
      console.error(error);
    }
  }

  save() {
    const productSavedEvent = new CustomEvent('product-updated', {
      bubbles: true,
      detail: this.editableData
    });

    this.element.dispatchEvent(productSavedEvent);
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
  }
}
