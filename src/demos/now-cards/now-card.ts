import {Component, HostBinding, Input} from '@angular/core'

@Component({
	selector: 'now-card',
	template: `
	<ng-container [ngSwitch]="cardType">
		<div class="card-image" *ngSwitchCase="'image'">
			<img src="https://lorempixel.com/100/190/nature/6">
		</div>
		<div class="card-stacked">
			<div class="card-content">
				<p>I am a very simple card. I am good at containing small bits of information.</p>
			</div>
			<div class="card-action">
				<a href="#">This is a link</a>
			</div>
		</div>

		<div class="card-content white-text" *ngSwitchCase="'simple'">
      <span class="card-title">Card Title</span>
      <p>I am a very simple card. I am good at containing small bits of information.
      I am convenient because I require little markup to use effectively.</p>
    </div>
    <div class="card-action">
      <a href="#">This is a link</a>
      <a href="#">This is a link</a>
    </div>
	</ng-container>
	`,
	styles: [
    `:host {
      background-color: blue;
    }`
	]
})
export class NowCard {
	@Input() cardType = 'simple';
	@HostBinding('class.card')
	isCard(){ return true }

	@HostBinding('class.horizontal')
	isHorizontal(){ return true }
}
