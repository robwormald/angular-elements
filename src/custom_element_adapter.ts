import * as core from '@angular/core'
//hack to boot up services :D
core.ɵclearProviderOverrides();
let renderer: SimpleRendererFactory;

//Custom Element wrapper that acts as injector + host element
class NgElement<T> extends HTMLElement implements core.Injector, core.NgModuleRef<any> {
	componentRef: core.ComponentRef<T>;
	moduleType: any;
	constructor(private componentFactory: core.ComponentFactory<T>, private parentInjector?: core.Injector) {
		super();

		if (!renderer) {
			renderer = new SimpleRendererFactory();
		}
	}

	get(token: any, notFoundValue: any = core.Injector.THROW_IF_NOT_FOUND): any {
		switch (token) {
			case core.RendererFactory2:
				return renderer;
			case core.Sanitizer:
			case core.ErrorHandler:
				return null;
			case core.NgModuleRef:
				return this;
		}
		return core.Injector.NULL.get(token, notFoundValue);
	}
	connectedCallback() {
		this.bootstrap();
	}
	disconnectedCallback() {
		this.componentRef.destroy();
	}

	bootstrap() {
		const element = this;
		this.componentRef =
			this.componentFactory.create(this.parentInjector ? this.parentInjector : core.Injector.NULL, [Array.of(this.children)], this, this);

		const listeners = this.componentFactory.outputs.map((output) => {
			const emitter: core.EventEmitter<any> = (this.componentRef.instance as any)[output.templateName];
			return emitter.subscribe((payload: any) => this.dispatchEvent(new CustomEvent(output.propName, { detail: payload })));
		});

		const inputs = this.componentFactory.inputs.forEach(input => {
			Object.defineProperty(element, input.propName, {
				set(value) {
					(element.componentRef.instance as any)[input.templateName] = value;
					element.componentFactoryResolver.changeDetectorRef.detectChanges();
				},
				get() {
					return (element.componentRef.instance as any)[input.templateName];
				}
			})
		})



		this.componentRef.onDestroy(() => listeners.forEach(l => l.unsubscribe()));
		requestAnimationFrame(() => this.tick());
	}

	tick() { this.componentRef.changeDetectorRef.detectChanges(); }

	get injector() { return this; }
	get componentFactoryResolver(): any { return null!; }
	get instance() { return this; }
	destroy() { }
	onDestroy(callback: () => void) { }
}

export function defineNgElement<T>(componentFactory: core.ComponentFactory<T>) {

	const outputs = componentFactory.outputs;





	const NgElementCtor = class extends NgElement<T> {
		constructor() {
			super(componentFactory);
		}
	}

	customElements.define(componentFactory.selector, NgElementCtor);
}


export const NAMESPACE_URIS: { [ns: string]: string } = {
	'svg': 'http://www.w3.org/2000/svg',
	'xhtml': 'http://www.w3.org/1999/xhtml',
	'xlink': 'http://www.w3.org/1999/xlink',
	'xml': 'http://www.w3.org/XML/1998/namespace',
	'xmlns': 'http://www.w3.org/2000/xmlns/',
};

function decoratePreventDefault(eventHandler: Function): Function {
	return (event: any) => {
		const allowDefaultBehavior = eventHandler(event);
		if (allowDefaultBehavior === false) {
			// TODO(tbosch): move preventDefault into event plugins...
			event.preventDefault();
			event.returnValue = false;
		}
	};
}

export class SimpleRendererFactory implements core.RendererFactory2 {
	private rendererByCompId = new Map<string, core.Renderer2>();
	private defaultRenderer: core.Renderer2;

	constructor() {
		this.defaultRenderer = new SimpleRenderer();
	};

	createRenderer(element: any, type: core.RendererType2 | null): core.Renderer2 {
		if (type && type.encapsulation === core.ViewEncapsulation.Native) {
			return new ShadowDomRenderer(element, type);
		}
		return new SimpleRenderer()
	}
}

class SimpleRenderer implements core.Renderer2 {
	data: { [key: string]: any } = Object.create(null);

	constructor() { }

	destroy(): void { }

	destroyNode: null;

	createElement(name: string, namespace?: string): any {
		if (namespace) {
			return document.createElementNS(NAMESPACE_URIS[namespace], name);
		}

		return document.createElement(name);
	}

	createComment(value: string): any { return document.createComment(value); }

	createText(value: string): any { return document.createTextNode(value); }

	appendChild(parent: any, newChild: any): void { parent.appendChild(newChild); }

	insertBefore(parent: any, newChild: any, refChild: any): void {
		if (parent) {
			parent.insertBefore(newChild, refChild);
		}
	}

	removeChild(parent: any, oldChild: any): void {
		if (parent) {
			parent.removeChild(oldChild);
		}
	}

	selectRootElement(selectorOrNode: string | any): any {
		console.log('select', selectorOrNode)
		let el: any = typeof selectorOrNode === 'string' ? document.querySelector(selectorOrNode) :
			selectorOrNode;
		if (!el) {
			throw new Error(`The selector "${selectorOrNode}" did not match any elements`);
		}
		el.textContent = '';
		return el;
	}

	parentNode(node: any): any { return node.parentNode; }

	nextSibling(node: any): any { return node.nextSibling; }

	setAttribute(el: any, name: string, value: string, namespace?: string): void {
		if (namespace) {
			name = `${namespace}:${name}`;
			const namespaceUri = NAMESPACE_URIS[namespace];
			if (namespaceUri) {
				el.setAttributeNS(namespaceUri, name, value);
			} else {
				el.setAttribute(name, value);
			}
		} else {
			el.setAttribute(name, value);
		}
	}

	removeAttribute(el: any, name: string, namespace?: string): void {
		if (namespace) {
			const namespaceUri = NAMESPACE_URIS[namespace];
			if (namespaceUri) {
				el.removeAttributeNS(namespaceUri, name);
			} else {
				el.removeAttribute(`${namespace}:${name}`);
			}
		} else {
			el.removeAttribute(name);
		}
	}

	addClass(el: any, name: string): void { el.classList.add(name); }

	removeClass(el: any, name: string): void { el.classList.remove(name); }

	setStyle(el: any, style: string, value: any, flags: core.RendererStyleFlags2): void {
		if (flags & core.RendererStyleFlags2.DashCase) {
			el.style.setProperty(
				style, value, !!(flags & core.RendererStyleFlags2.Important) ? 'important' : '');
		} else {
			el.style[style] = value;
		}
	}

	removeStyle(el: any, style: string, flags: core.RendererStyleFlags2): void {
		if (flags & core.RendererStyleFlags2.DashCase) {
			el.style.removeProperty(style);
		} else {
			// IE requires '' instead of null
			// see https://github.com/angular/angular/issues/7916
			el.style[style] = '';
		}
	}

	setProperty(el: any, name: string, value: any): void {
		el[name] = value;
	}

	setValue(node: any, value: string): void { node.nodeValue = value; }

	listen(target: 'window' | 'document' | 'body' | any, event: string, callback: (event: any) => boolean):
		() => void {
		// TODO
		target.addEventListener(event, callback);
		return () => target.removeEventListener(event, callback);
	}
}

const COMPONENT_REGEX = /%COMP%/g;

export function flattenStyles(
    compId: string, styles: Array<any|any[]>, target: string[]): string[] {
  for (let i = 0; i < styles.length; i++) {
    let style = styles[i];

    if (Array.isArray(style)) {
      flattenStyles(compId, style, target);
    } else {
      style = style.replace(COMPONENT_REGEX, compId);
      target.push(style);
    }
  }
  return target;
}

class ShadowDomRenderer extends SimpleRenderer {
	private shadowRoot: any;

	constructor(private hostEl: any, private component: core.RendererType2) {
		super();
		this.shadowRoot = (hostEl as any).attachShadow({ mode: 'open' });

		const styles = flattenStyles(component.id, component.styles, []);
		for (let i = 0; i < styles.length; i++) {
		  const styleEl = document.createElement('style');
		  styleEl.textContent = styles[i];
		  this.shadowRoot.appendChild(styleEl);
		}
	}

	private nodeOrShadowRoot(node: any): any { return node === this.hostEl ? this.shadowRoot : node; }

	destroy() { /**this.sharedStylesHost.removeHost(this.shadowRoot); **/ }

	appendChild(parent: any, newChild: any): void {
		return super.appendChild(this.nodeOrShadowRoot(parent), newChild);
	}
	insertBefore(parent: any, newChild: any, refChild: any): void {
		return super.insertBefore(this.nodeOrShadowRoot(parent), newChild, refChild);
	}
	removeChild(parent: any, oldChild: any): void {
		return super.removeChild(this.nodeOrShadowRoot(parent), oldChild);
	}
	parentNode(node: any): any {
		return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(node)));
	}
}
