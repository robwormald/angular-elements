import {Component, NgModule, ViewEncapsulation, Input, HostBinding} from '@angular/core'

@Component({
  selector: `ng-progress-bar`,
  template: `
    <div class="progress" role="progressbar" [attr.aria-valuenow]="progress" aria-valuemin="0" aria-valuemax="100">
      <div class="bar" [style.width.%]="progress"></div>
      <div class="label">{{progress}}%</div>
    </div>
  `,
  styles: [`
    :host { display: inline-block; width: 5rem; height: 1rem; }
    .progress { display: inline-block; position: relative; border: solid 1px #000; padding: 1px; width: 100%; height: 100%; }
    .progress > .bar { background: #9cf; height: 100%; }
    .progress > .label { position: absolute; top: 0; left: 0; width: 100%;
      text-align: center; font-size: 0.8rem; line-height: 1.1rem; }
  `],
  encapsulation: ViewEncapsulation.Native
})
export class NgProgressBar {
  @HostBinding('attr.aria-valuenow')
  @Input() progress:number = 0;
}

@NgModule({
  declarations: [NgProgressBar]
})
export class NgProgressBarModule {}
