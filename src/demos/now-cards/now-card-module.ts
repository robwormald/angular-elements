import {NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import {NowCard} from './now-card'
import {NgSwitch, NgSwitchDefault, NgSwitchCase} from '../../directives/ng_switch'

@NgModule({
	declarations: [NowCard, NgSwitch, NgSwitchDefault, NgSwitchCase],
	schemas: []
})
export class NowCardModule {}
