import {NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import {TodoApp} from './todo-app'
import {TodoList} from './todo-list'
import {NgForOf} from '../../directives/ng_for'

@NgModule({
	declarations: [TodoApp, TodoList, NgForOf],
	schemas: []
})
export class TodoAppModule {}
