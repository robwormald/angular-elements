import {Component, Input, Output, EventEmitter,  ɵg, IterableDiffers} from '@angular/core'

export function _iterableDiffersFactory(){
  return ɵg;
}

@Component({
	selector: 'todo-list',
	template: `
		<ul>
			<li *ngFor="let todo of todos">
			{{todo.text}} - <button (click)="complete(todo)">x</button>
			</li>
		</ul>
	`,
	providers: [],
	styles: [`:host { display: block }`]
})
export class TodoList {
	@Input() todos: any[]
	@Output() completeTodo = new EventEmitter();

	complete(todo:any){
		this.completeTodo.emit(todo);
	}
}
