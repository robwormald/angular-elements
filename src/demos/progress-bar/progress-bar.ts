export class ProgressBar extends HTMLElement {
  _progressElement: HTMLDivElement;
  _label: HTMLDivElement
  _bar: HTMLDivElement
  constructor() {
      super();
      const shadowRoot = this.attachShadow({mode: 'closed'});
      shadowRoot.innerHTML = `
        <style>
          :host { display: inline-block; width: 5rem; height: 1rem; }
          .progress { display: inline-block; position: relative; border: solid 1px #000; padding: 1px; width: 100%; height: 100%; }
          .progress > .bar { background: #9cf; height: 100%; }
          .progress > .label { position: absolute; top: 0; left: 0; width: 100%;
              text-align: center; font-size: 0.8rem; line-height: 1.1rem; }
        </style>
        <div class="progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          <div class="bar" style="width: 0px;"></div>
          <div class="label">0%</div>
        </div>
      `;
      this._progressElement = shadowRoot.querySelector('.progress')! as HTMLDivElement;
      this._label = shadowRoot.querySelector('.label')! as HTMLDivElement;
      this._bar = shadowRoot.querySelector('.bar')! as HTMLDivElement;
  }

  get progress() {
    return this._progressElement.getAttribute('aria-valuenow') || '';
  }
  set progress(newPercentage:string) {
    if(newPercentage){
      this._progressElement.setAttribute('aria-valuenow', newPercentage);
      this._label.textContent = newPercentage + '%';
      this._bar.style.width = newPercentage + '%';
    }
  }
};
