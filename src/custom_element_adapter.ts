import * as core from '@angular/core'
import { SimpleRendererFactory } from './simple_renderer'

//hack to boot up services :D
//TODO: ask tbosch about correct way to do this?
core.ɵclearProviderOverrides();

const santizer:core.Sanitizer = {
  sanitize: (ctx, v:any) => v
}

let renderer: SimpleRendererFactory;

//Custom Element wrapper that acts as injector + host element
//TODO: maybe this should implement ComponentRef instead/also
class NgElement<T> extends HTMLElement implements core.Injector, core.NgModuleRef<any> {
	componentFactory: core.ComponentFactory<T>;
  componentRef: core.ComponentRef<T> | undefined;
	moduleType: any;
	constructor(private parentInjector?: core.Injector) {
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
        return santizer;
			case core.ErrorHandler:
				return null;
			case core.NgModuleRef:
				return this;
		}
    if(this.parentInjector){
      return this.parentInjector.get(token, notFoundValue);
    }
		return core.Injector.NULL.get(token, notFoundValue);
	}
	connectedCallback() {
		this.bootstrap();
	}
	disconnectedCallback() {
		this.teardown();
	}


	bootstrap() {
		const element = this;
    if(element.componentRef){
      return;
    }
    //create an instance of angular component
    //TODO: figure out semantics of connect/disconnect and how it relates to component/module destruction
		element.componentRef =
			element.componentFactory.create(this.parentInjector ? this.parentInjector : core.Injector.NULL, [Array.of(this.children)], this, this);
    if(!element.componentRef){
      throw new Error('component could not be created!')
    }
    //wire up the component's @Outputs to dispatchEvent()
		const listeners = this.componentFactory.outputs.map((output) => {
			const emitter: core.EventEmitter<any> = (element.componentRef!.instance as any)[output.templateName];
			return emitter.subscribe((payload: any) => this.dispatchEvent(new CustomEvent(output.propName, { detail: payload })));
		});

    //define properties for component's @Inputs
		const inputs = this.componentFactory.inputs.forEach(input => {
      //TODO: this is gross. figure out a better way to handle this
			Object.defineProperty(element, input.propName, {
				set(value) {
					(element.componentRef!.instance as any)[input.templateName] = value;
					//TODO: consider batching these somehow. this is in the wrong place.
          element.componentRef!.changeDetectorRef.detectChanges();
				},
				get() {
					return (element.componentRef!.instance as any)[input.templateName];
				}
			})
		})
    //cleanup the component
    element.componentRef!.onDestroy(() => listeners.forEach(l => l.unsubscribe()));
		requestAnimationFrame(() => this.tick());
	}

  teardown(){}

	tick() { if(this.componentRef) { this.componentRef.changeDetectorRef.detectChanges(); } }

	get injector() { return this; }
  //TODO: wire up to customElements.get ?
	get componentFactoryResolver(): any { return null!; }
	get instance() { return this; }
	destroy() { }
	onDestroy(callback: () => void) { }
}

function defineNgElement<T>(componentFactory: core.ComponentFactory<T>) {
  const NgElementCtor = class extends NgElement<T> {
		constructor(parentInjector?:core.Injector) {
			super(parentInjector);
		}
	}

  NgElementCtor.prototype.componentFactory = componentFactory;

  customElements.define(componentFactory.selector, NgElementCtor);
}

export default {
  define: defineNgElement
}
