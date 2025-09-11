import { EventBus, type EventsToPass } from './EventBus';
import {v4 as makeUUID} from 'uuid';
import Handlebars from 'handlebars';

type AnyProps = Record<string, any>;
type PrimitiveAsProps = AnyProps;
// Record<string, string | number | boolean | null | undefined | AnyProps >; // ?
type ChildenAsProps = Record<string, Block>;
type ListsAsProps = Record<string, any[]>;
type BlockProps = AnyProps; //PrimitiveAsProps & ChildenAsProps & ListsAsProps;

export class Block {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  };

  protected _element: HTMLElement | null = null;
  protected _id: string = makeUUID();
  protected events: EventsToPass = {};
  protected primitiveProps: PrimitiveAsProps;
  protected children: ChildenAsProps;
  protected lists: ListsAsProps;
  protected eventBus: () => EventBus;

  
  constructor(props: BlockProps = {}) {
    const eventBus = new EventBus();
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    
    this.primitiveProps = {};
    this.children = {};
    this.lists = {};

    eventBus.emit(Block.EVENTS.INIT, props);
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  public init({events = {}, ...props}: BlockProps = {}) {
    const { primitiveProps, children, lists } = this._parseProps(props);

    this.events = events;
    this.primitiveProps = this._makePropsProxy({ ...primitiveProps });
    this.children = children; // should _makePropsProxy to rerender when child changed?
    this.lists = this._makePropsProxy({ ...lists });
    console.log('init', this);
  }

  private _parseProps(props: BlockProps = {}) {
    const primitiveProps: PrimitiveAsProps = {};
    const children: ChildenAsProps = {};
    const lists: ListsAsProps = {};

    console.log('props to parse', props);
    Object.entries(props).forEach(([key, value])=> {
      if (value instanceof Block) {
        children[key] = value;
      } else if (Array.isArray(value)) {
        lists[key] = value;
      } else {
        primitiveProps[key] = value;
      }
    })
    
    return { primitiveProps, children, lists };
  }

  private _makePropsProxy(props: AnyProps) {
    const eventBus = this.eventBus();

    return new Proxy(props, {
      get(target: any, prop: string) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: any, prop: string, value: any) {
        const oldTarget = { ...target };
        target[prop] = typeof value === 'function' ? value.bind(target) : value;
        eventBus.emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('No access');
      },
    });
  }

  public dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidMount(): void {
    this.componentDidMount();
    Object.values(this.children).forEach(child => {child.dispatchComponentDidMount();});
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  protected componentDidMount(): void {}

  private _componentDidUpdate(oldProps: AnyProps, newProps: AnyProps) {
    const hasChanged = this.componentDidUpdate(oldProps, newProps);
    if (hasChanged) {
      this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  protected componentDidUpdate(oldProps: AnyProps, newProps: AnyProps): boolean {
    console.log(oldProps, newProps);
    // нужно ли ререндерить
    return true;
  }

  // cannot use for changing children or lists
  public setProps(nextProps: PrimitiveAsProps): void {
    Object.assign(this.primitiveProps, nextProps);
  };

  _render() {
    console.log('Render');
    const propsAndStubs = { ...this.primitiveProps };
    const tmpId =  makeUUID();
    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    Object.entries(this.lists).forEach(([key]) => {
      propsAndStubs[key] = `<div data-id="__l_${tmpId}"></div>`;
    });

    const fragment = this._createDocumentElement('template');
    console.log('propsAndStubs', propsAndStubs);
    fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);

    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      if (stub) {
        stub.replaceWith(child.getContent());
      }
    });

    Object.entries(this.lists).forEach(([_, child]) => {
      const stub = fragment.content.querySelector(`[data-id="__l_${tmpId}"]`);
      if (stub) {
        const listCont = this._createDocumentElement('template');
        child.forEach(item => {
          if (item instanceof Block) {
            listCont.content.append(item.getContent());
          } else {
            listCont.content.append(`${item}`);
          }
        });

        stub.replaceWith(listCont.content);
      }
    });

    const newElement = fragment.content.firstElementChild as HTMLElement;
    if (this._element && newElement) {
      this._element.replaceWith(newElement);
    }
    this._element = newElement;
    this._addEvents();
  }

  private _createDocumentElement(tagName: string): HTMLTemplateElement {
    return document.createElement(tagName) as HTMLTemplateElement;
  }

  public render(): string {
    return '';
  }

  getContent(): HTMLElement {
    if (!this._element) {
      throw new Error('Element is not created');
    }
    return this._element;
  }

  private _addEvents() {
    if (!this._element) {
      throw new Error('Element is not created');
    }
    Object.keys(this.events).forEach(eventName => {
      this._element!.addEventListener(eventName, this.events[eventName]);
    })
  }

  public show(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = 'block';
    }
  }

  public hide(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = 'none';
    }
  }
}
