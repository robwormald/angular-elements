import {Component, HostListener, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef, IterableDiffers} from '@angular/core'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'

export class TodoService {
	todos:BehaviorSubject<any[]> = new BehaviorSubject([])
	addTodo(newTodoText:string){
		this.todos.next(this.todos.value.concat([{text: 'new todo text', completed: false}]))
	}
	completeTodo(completedTodo:any){
		this.todos.next(this.todos.value.filter(todo => todo !== completedTodo))
	}
}

@Component({
	selector: 'todo-app',
	template: `
	  <h1>Todo App</h1>
	  <input type="text" #todoInput>
	  <button (click)="addTodo(todoInput)"></button>
	  <todo-list [todos]="todoService.todos | push" (completeTodo)="completeTodo($event)"></todo-list>
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
	constructor(public todoService:TodoService, private cdr:ChangeDetectorRef){

  }

	//these are internal to the component.
	addTodo(input:HTMLInputElement){
    this.todoService.addTodo(input.value);
    input.value = '';
	  //this.cdr.detectChanges();
	}

	completeTodo(todo:any){
	  this.todoService.completeTodo(todo);
	  //this.cdr.detectChanges();
	}
}
