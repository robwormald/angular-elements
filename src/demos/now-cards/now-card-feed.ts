import {Component, ViewEncapsulation, IterableDiffers} from '@angular/core'

@Component({
  selector: 'now-cards-feed',
  template: `
  <div id="container" class="col s12 m7">
		<slot (slotchange)="onCardsChange($event)"></slot>
	</div>
  `,
  encapsulation: ViewEncapsulation.Native
})
export class NowCardFeed {

  onCardsChange(event:any):boolean {
    console.log('cards change', event);
    return false;
  }
}
