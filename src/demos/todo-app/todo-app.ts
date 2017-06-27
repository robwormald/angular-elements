import {Component, HostListener, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core'

@Component({
	selector: 'todo-app',
	template: `
	  <h1>Todo App</h1>
	  <input type="text">
	  <todo-list [todos]=""></todo-list>
	`,
	encapsulation: ViewEncapsulation.Native,
	styles: [
		`
		:host {
			display: block;
			height: 300px;
			width: 300px;
			border: 1px solid black;
		}`
	]
})
export class TodoApp {
	//these are exposed to the outside world
	@Input() todos = []; //
	@Output() actions = new EventEmitter();
}
