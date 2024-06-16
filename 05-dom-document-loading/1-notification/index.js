export default class NotificationMessage {
  static activeNotification;

  constructor(message = 'Success', params = {}) {
    this.message = message;
    this.duration = params.duration || 2000;
    this.type = params.type || 'success';
    this.element = this.createElement(this.createTemplate());
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;

    return element.firstElementChild;
  }

  createTemplate() {
    return (`
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">${this.message}</div>
        </div>
      </div>`
    )
  }

  renderNotification(content) {
    document.body.append(content);
    NotificationMessage.activeNotification = this;
  }

  show(wrapper = null) {
    if (NotificationMessage.activeNotification) NotificationMessage.activeNotification.destroy();

    const content = wrapper ? wrapper.append(this.element) : this.element;

    this.renderNotification(content);
    this.auto_destroy();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    NotificationMessage.activeNotification = null;
  }

  auto_destroy() {
    setTimeout(() => { this.destroy() }, this.duration);
  }
}
