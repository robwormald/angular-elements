import {Component, Input, Output, EventEmitter} from '@angular/core'

@Component({
	selector: 'todo-list',
	template: 'todo count: {{ todos ? todos.length : 0 }}'
})
export class TodoList {
	@Input() todos: any[]
	@Output() action = new EventEmitter()

	ngOnInit(){
		setInterval(() => this.action.emit(Date.now()), 500);
	}
}
