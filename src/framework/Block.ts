import { EventBus } from "./EventBus";

export class Block {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render"
  };

_element = null;
_meta = null;

/** JSDoc
   * @param {string} tagName
   * @param {Object} props
   *
   * @returns {void}
   */
constructor(tagName = "div", props = {}) {
  const eventBus = new EventBus();
  this._meta = {
    tagName,
    props
  };

  this.props = this._makePropsProxy(props);

  this.eventBus = () => eventBus;

  this._registerEvents(eventBus);
  eventBus.emit(Block.EVENTS.INIT);
}

_registerEvents(eventBus) {
  eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
  eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
  eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
  eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
}

_createResources() {
  const { tagName } = this._meta;
  this._element = this._createDocumentElement(tagName);
}

init() {
  this._createResources();
}

_componentDidMount() {
  this.componentDidMount();
}

// Может переопределять пользователь, необязательно трогать
componentDidMount(oldProps) {
  this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
}

dispatchComponentDidMount() {
  this.eventBus().emit(Block.EVENTS.FLOW_CDM);
}

_componentDidUpdate(oldProps, newProps) {
  const hasChanged = this.componentDidUpdate(oldProps, newProps);
  if (hasChanged) {
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }
}

// Может переопределять пользователь, необязательно трогать
componentDidUpdate(oldProps, newProps) {
  // return oldProps === newProps;
  return true;
}

setProps = nextProps => {
  if (!nextProps) {
    return;
  }

  Object.assign(this.props, nextProps);
};

get element() {
  return this._element;
}

_render() {
  const block = this.render();
  // Этот небезопасный метод для упрощения логики
  // Используйте шаблонизатор из npm или напишите свой безопасный
  // Нужно не в строку компилировать (или делать это правильно),
  // либо сразу в DOM-элементы возвращать из compile DOM-ноду
  this._element.innerHTML = block;
}

// Может переопределять пользователь, необязательно трогать
render() {}

getContent() {
  return this.element;
}

_makePropsProxy(props) {
  // Можно и так передать this
  // Такой способ больше не применяется с приходом ES6+
  const self = this;

  return new Proxy(props, {
    set(target, prop, value) {
      target[prop] = typeof value === 'function' ? value.bind(self) : value;
      self.eventBus().emit(Block.EVENTS.FLOW_CDU);
      return true;
    },
    deleteProperty(target, prop) {
      throw new Error('нет доступа');
    }
  })

  return props;
}

_createDocumentElement(tagName) {
  // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
  return document.createElement(tagName);
}

show() {
  this.element.style.display = 'block';
  this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
}

hide() {
  this.element.style.display = 'none';
  this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
}
}
