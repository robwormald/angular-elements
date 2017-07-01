import {NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
import {NowCard} from './now-card'
import {NowCardFeed} from './now-card-feed'
import {NgDirectivesModule} from '../../directives/ng_directives'

@NgModule({
  imports: [NgDirectivesModule],
	declarations: [NowCard, NowCardFeed],
  entryComponents: [NowCard],
	schemas: []
})
export class NowCardModule {}
