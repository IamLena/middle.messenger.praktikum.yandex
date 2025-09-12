import { NO_ACCESS, NO_ELEMENT } from '../errorConsts';
import { EventBus, type EventsToPass } from './EventBus';
import {v4 as makeUUID} from 'uuid';
import Handlebars from 'handlebars';

type AnyProps = Record<string, any>;
type ChildenAsProps = Record<string, Block>;
type ListsAsProps = Record<string, any[]>;
type BlockProps = AnyProps;
export class Block {
  static EVENTS = {
    INIT: "init",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  };

  protected _element: HTMLElement | null = null;
  protected _id: string = makeUUID();
  protected events: EventsToPass = {};
  protected props: AnyProps;
  protected children: ChildenAsProps;
  protected lists: ListsAsProps;
  protected eventBus: () => EventBus;
  
  /**
   * создает евент бас - единственный на экземпляр
   * регистрирует события жизненного цикла
   * вызывает инит и передает туда все пропсы
   * @param props - объект параметров любого типа
   */
  constructor(props: BlockProps = {}) {
    const eventBus = new EventBus();
    this.eventBus = () => eventBus;
    this._registerEvents();
    
    this.props = {};
    this.children = {};
    this.lists = {};

    eventBus.emit(Block.EVENTS.INIT, props);
  }

  /**
   * регистрирует события жизненного цикла компонента и их хендлеры
   */
  _registerEvents() {
    const eventBus = this.eventBus();
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  /**
   * инициализация компонента, парсинг параметров
   * оборачиваем параметры в прокси, чтобы отлавливать изменения
   * запускаем рендеринг
   * @param props - объект параметров любого типа
   */
  public init(props: BlockProps = {}) {
    const { children, lists } = this._parseProps(props);
    this.children = children;
    this.lists = lists;

    this.props = this._makePropsProxy({ ...props });
    console.log('init', this.props);

    this.events = this.props.events || {};
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  /**
   * подготовка к рендерингу, парсинг параметров
   * отделяем вложенные компоненты и списки однородных элементов
   * @param props - все параметры компонента
   * @returns
   */
  private _parseProps(props: BlockProps = {}) {
    const children: ChildenAsProps = {};
    const lists: ListsAsProps = {};

    Object.entries(props).forEach(([key, value])=> {
      if (value instanceof Block) {
        children[key] = value;
      } else if (Array.isArray(value)) {
        lists[key] = value;
      }
    })
    
    return { children, lists };
  }

  /**
   * оборачивает объект в прокси
   * тригерит componentDidUpdate при сете пропсов и запрещает удаление
   * @param props - любой объект
   * @returns прокси объекта
   */
  private _makePropsProxy(props: AnyProps) {
    const eventBus = this.eventBus();
    const children = this.children;
    const lists = this.lists;

    return new Proxy(props, {
      get(target: any, prop: string) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: any, prop: string, value: any) {
        console.log('set new value', prop, value);
        const oldTarget = { ...target };
        target[prop] = value;
        console.log('triger update');
        if (value instanceof Block) {
          children[prop] = value;
        } else if (Array.isArray(value)) {
          lists[prop] = value;
        }
        eventBus.emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error(NO_ACCESS('for deleting properties of Block'));
      },
    });
  }

  /**
   * тригерится событием изменения параметров
   * вызывает componentDidUpdate (возможно переопределенный сверху)
   * запускает ререндер
   * @param oldProps параметры до изменения
   * @param newProps параметры после изменения
   */
  private _componentDidUpdate(oldProps: AnyProps, newProps: AnyProps) {
    const hasChanged = this.componentDidUpdate(oldProps, newProps);
    if (hasChanged) {
      this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  /**
   * метод возможно переопределенный сверху
   * может иметь логику обработки изменений
   * @param oldProps параметры до изменения
   * @param newProps параметры после изменения
   * @returns признак нужен ли ререндер
   */
  protected componentDidUpdate(oldProps: AnyProps, newProps: AnyProps): boolean {
    console.log('componentDidUpdate', oldProps, newProps);
    return true;
  }

  _render() {
    // тут будем накапливать заглушки и паременты для подставления в шаблон
    const propsAndStubs = { ...this.props };

    // вложенные Block-компоненты заменяем заглушками - дивами с айди вида child._id
    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    // списки однородных элементов заменяем заглушками - дивами с айди вида __l_${this._id}
    Object.entries(this.lists).forEach(([key]) => {
      propsAndStubs[key] = `<div data-id="__l_${this._id}"></div>`;
    });

    // создаем элемент <template /> - его содержимое вставим в DOM после
    // this.render() - возвращает шаблон компонента (самый верхнеуровневый)
    // внутрь template вставляем компиляюцию шаблонизатора с применением параметров propsAndStubs
    // на этом этапе вместо вложенных компонентов имеем заглушки
    const fragment = this._createDocumentElement('template');
    console.log('propsAndStubs', propsAndStubs);
    fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);

    // заменяем заглушки вложенных детей на компоненты
    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      if (stub) {
        stub.replaceWith(child.getContent());
      }
    });

    // заменяем заглушки вложенных списков на компоненты
    Object.entries(this.lists).forEach(([_, child]) => {
      const stub = fragment.content.querySelector(`[data-id="__l_${this._id}"]`);
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
      // изменяем компонент в DOM
      this._element.replaceWith(newElement);
    }
    // изменяем переменную компонента
    this._element = newElement;

    // когда элементы в доме, нужно навесить на них eventListener'ы
    this._addEvents();
  }

  private _addEvents() {
    if (!this._element) {
      throw new Error(NO_ELEMENT);
    }
    Object.keys(this.events).forEach(eventName => {
      this._element!.addEventListener(eventName, this.events[eventName]);
    })
  }

  private _createDocumentElement(tagName: string): HTMLTemplateElement {
    return document.createElement(tagName) as HTMLTemplateElement;
  }

  // переопределяется в наследниках на строку-шаблон
  public render(): string {
    return '';
  }

  getContent(): HTMLElement {
    if (!this._element) {
      throw new Error(NO_ELEMENT);
    }
    return this._element;
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
