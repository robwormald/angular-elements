import {NgModule} from '@angular/core'
import {NgForOf} from './ng_for'
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from './ng_switch'
import {NgSlot} from './ng_slot'
import {PushPipe} from './push_pipe'

@NgModule({
  declarations: [NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgSlot, PushPipe],
  exports: [NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgSlot, PushPipe]
})
export class NgDirectivesModule {}
