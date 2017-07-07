import {Component, Input, Output, EventEmitter} from '@angular/core'

@Component({
	selector: 'todo-list',
	template: `
		<ul>
			<li *ngFor="let todo of todos">
			{{todo.text}} - <button (click)="completeTodo.emit(todo)">x</button>
			</li>
		</ul>
	`,
	providers: [],
	styles: [`:host { display: block }`]
})
export class TodoList {
	@Input() todos: any[]
	@Output() completeTodo = new EventEmitter();
}
