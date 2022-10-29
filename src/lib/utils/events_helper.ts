import {SingleOrPlural, EventLsnr} from '../models/types';
import {plural2Arr} from '.';

export interface HTMLElementEvnts 
{
    addEvntLsnrs : (lsnrs : SingleOrPlural<EventLsnr>) => void,
    removeEvntLsnrs : (lsnrs : SingleOrPlural<EventLsnr>) => void,
    clearEvnt : (name : string) => void,
    clearEvntLsnrs : () => void
}
const EventsHelperMixin : HTMLElementEvnts = 
{
    addEvntLsnrs (lsnrs : SingleOrPlural<EventLsnr>) 
    {       
        plural2Arr(lsnrs).forEach(lsnr => 
        {
            this._element.addEventListener(lsnr.name, lsnr.handler);
            this._cache.add(lsnr);
        });        
    },
    removeEvntLsnrs (lsnrs : SingleOrPlural<EventLsnr>)
    {
        plural2Arr(lsnrs).forEach(lsnr => 
        {
            this._element.removeEventListener(lsnr.name, lsnr.handler);
            this._cache.delete(lsnr);
        });  
    },
    clearEvnt (name : string)
    {
        this._cache.forEach(lsnr => 
        {
            if (name == lsnr.name)
            {
                this._element.removeEventListener(name, lsnr.handler);
            }
        });
    },
    clearEvntLsnrs ()
    {
        this._cache.forEach(lsnr => 
        {
            this._element.removeEventListener(lsnr.name, lsnr.handler);
        });
        this._cache.clear();
    }
}
export default EventsHelperMixin;

// class DomElementEvents
// {
//     protected _cache : Set<EventLsnr>; 

//     constructor (protected _element : HTMLElement, lsnrs? : SingleOrPlural<EventLsnr>)
//     {
//         this._cache = new Set<EventLsnr>();
//         if (lsnrs)
//         {
//             this.attach(lsnrs);
//         }
//     }
//     attach (lsnrs : SingleOrPlural<EventLsnr>) 
//     {       
//         plural2Arr(lsnrs).forEach(lsnr => 
//         {
//             this._element.addEventListener(lsnr.name, lsnr.handler);
//             this._cache.add(lsnr);
//         });        
//     }
//     detach (lsnrs : SingleOrPlural<EventLsnr>)
//     {
//         plural2Arr(lsnrs).forEach(lsnr => 
//         {
//             this._element.removeEventListener(lsnr.name, lsnr.handler);
//             this._cache.delete(lsnr);
//         });  
//     }
//     detachEvent (name : string)
//     {
//         this._cache.forEach(lsnr => 
//         {
//             if (name == lsnr.name)
//             {
//                 this._element.removeEventListener(name, lsnr.handler);
//             }
//         });
//     }
//     clear ()
//     {
//         this._cache.forEach(lsnr => 
//         {
//             this._element.removeEventListener(lsnr.name, lsnr.handler);
//         });
//         this._cache.clear();
//     }
// }
