import {Pipe, ChangeDetectorRef, SkipSelf, Host, ViewContainerRef, Injector} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import {Subscription} from 'rxjs/Subscription'

@Pipe({
  name: 'push',
  pure: false
})
export class PushPipe {
  private _currentStream:Observable<any>;
  private _currentValue:any;
  private _activeSubscription:Subscription;
  constructor(private _cdr:ChangeDetectorRef){}
  transform(stream: Observable<any> | null, transforms?:(s:Observable<any>) => Observable<any>){
    if(!this._currentStream && stream){
      this._createSubscription(stream);
    }
    return this._currentValue;
  }
  private _createSubscription(stream:Observable<any>){
    if(this._activeSubscription){
      this._activeSubscription.unsubscribe();
    }
    this._currentStream = stream;
    this._activeSubscription = this._currentStream
      .subscribe(value => this._onValueChange(value))
  }

  private _onValueChange(newValue:any){
    if(newValue !== this._currentValue){
        this._currentValue = newValue;
        requestAnimationFrame(() => this._cdr.detectChanges());
      }
  }
}
