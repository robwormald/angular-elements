import {NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import {TodoApp} from './todo-app'
import {TodoList} from './todo-list'
import {NgDirectivesModule} from '../../directives/ng_directives'

@NgModule({
  id: 'todo-app',
  imports: [NgDirectivesModule],
	declarations: [TodoApp, TodoList],
	schemas: []
})
export class TodoAppModule {}
