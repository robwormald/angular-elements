import nge from '../../custom_element_adapter'
import {NgProgressBarNgFactory} from '../../ngfactory/src/demos/progress-bar/ng-progress-bar.ngfactory'
import {ProgressBar} from './progress-bar'

nge.define(NgProgressBarNgFactory);
customElements.define('progress-bar', ProgressBar);
