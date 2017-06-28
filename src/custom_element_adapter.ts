import * as core from '@angular/core'
import { SimpleRendererFactory } from './simple_renderer'

//hack to boot up services :D
//TODO: ask tbosch about correct way to do this?
core.ɵclearProviderOverrides();

let renderer: SimpleRendererFactory;

//Custom Element wrapper that acts as injector + host element
//TODO: maybe this should implement ComponentRef instead/also
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
    //create an instance of angular component
    //TODO: figure out semantics of connect/disconnect and how it relates to component/module destruction
		this.componentRef =
			this.componentFactory.create(this.parentInjector ? this.parentInjector : core.Injector.NULL, [Array.of(this.children)], this, this);

    //wire up the component's @Outputs to dispatchEvent()
		const listeners = this.componentFactory.outputs.map((output) => {
			const emitter: core.EventEmitter<any> = (this.componentRef.instance as any)[output.templateName];
			return emitter.subscribe((payload: any) => this.dispatchEvent(new CustomEvent(output.propName, { detail: payload })));
		});

    //define properties for component's @Inputs
		const inputs = this.componentFactory.inputs.forEach(input => {
      //TODO: this is gross. figure out a better way to handle this
			Object.defineProperty(element, input.propName, {
				set(value) {
					(element.componentRef.instance as any)[input.templateName] = value;
					//TODO: consider batching these somehow. this is in the wrong place.
          element.componentFactoryResolver.changeDetectorRef.detectChanges();
				},
				get() {
					return (element.componentRef.instance as any)[input.templateName];
				}
			})
		})
    //cleanup the component
    this.componentRef.onDestroy(() => listeners.forEach(l => l.unsubscribe()));
		requestAnimationFrame(() => this.tick());
	}

	tick() { this.componentRef.changeDetectorRef.detectChanges(); }

	get injector() { return this; }
  //TODO: wire up to customElements.get ?
	get componentFactoryResolver(): any { return null!; }
	get instance() { return this; }
	destroy() { }
	onDestroy(callback: () => void) { }
}

function defineNgElement<T>(componentFactory: core.ComponentFactory<T>) {
  const NgElementCtor = class extends NgElement<T> {
		constructor() {
			super(componentFactory);
		}
	}
  customElements.define(componentFactory.selector, NgElementCtor);
}

export default {
  define: defineNgElement
}
