import {Component, HostListener, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef, IterableDiffers} from '@angular/core'

export class TodoService {
	todos:any[] = [];
	addTodo(newTodoText:string){
		this.todos = this.todos.concat([{text: 'new todo text', completed: false}])
	}
	completeTodo(completedTodo:any){
		this.todos = this.todos.map(todo => todo === completedTodo ? Object.assign({}, todo, {completed: true}) : todo )
	}
}

@Component({
	selector: 'todo-app',
	template: `
	  <h1>Todo App</h1>
	  <input type="text" #todoInput>
	  <button (click)="addTodo(todoInput)"></button>
	  <todo-list [todos]="todoService.todos"></todo-list>
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
	],
	providers: [TodoService]
})
export class TodoApp {
	constructor(public todoService:TodoService, private cdr:ChangeDetectorRef){}
	//these are exposed to the outside world
	@Input() todos = []; //
	@Output() actions = new EventEmitter();

	//these are internal to the component.
	addTodo(input:HTMLInputElement){
       this.todoService.addTodo(input.value);
	   this.cdr.detectChanges();
	}

	completeTodo(todo:any){
		this.todoService.completeTodo(todo);
		this.cdr.detectChanges();
	}
}
