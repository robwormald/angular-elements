import {Directive, HostListener, ɵg, IterableDiffer, IterableDiffers, ElementRef, ChangeDetectorRef, ViewContainerRef} from '@angular/core'

export function _iterableDiffersFactory(){
  return ɵg;
}

@Directive({
  selector: 'slot',
  providers: [{provide: IterableDiffers, useFactory: _iterableDiffersFactory}]
})
export class NgSlot {
  _differ:IterableDiffer<HTMLElement[]>;
  constructor(private _differs:IterableDiffers, private _host:ElementRef, private _vcr:ViewContainerRef){
    const differ = _differs.find([]);
    this._differ = differ.create();
  }

  @HostListener('slotchange', ['$event.target'])
  onSlotChange(e:any){
    const nodes = e.assignedNodes();
    const changes = this._differ.diff(nodes);
    if(changes){
      changes.forEachAddedItem(addedItem => {

      })
      changes.forEachRemovedItem(addedItem => {
        console.log('added', addedItem);
      })
    }
    return false;
  }
}
