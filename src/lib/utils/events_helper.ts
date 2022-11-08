import {SingleOrPlural, EventLsnr} from '@models/types';
import {plural2Arr} from '.';

export interface HTMLElementEvnts 
{
    addEventExtListeners : (lsnrs : SingleOrPlural<EventLsnr>) => void,
    removeEventExtListeners : (lsnrs : SingleOrPlural<EventLsnr>) => void,
    clearEvent : (name : string) => void,
    clearEventExtListeners : () => void
}
const EventsHelperMixin = 
{
    _evntsCache: new Set<EventLsnr>(),
    addEventExtListeners (lsnrs : SingleOrPlural<EventLsnr>) 
    {
        if ('string' == typeof lsnrs[0])
        {
            this.addEventListener(lsnrs[0], lsnrs[1]);
            this._evntsCache.add(lsnrs);
        }
        else
            (lsnrs as EventLsnr[]).forEach(lsnr => 
            {           
                this.addEventListener(lsnr[0], lsnr[1]);
                this._evntsCache.add(lsnr);
            });        
    },
    removeEventExtListeners (lsnrs : SingleOrPlural<EventLsnr>)
    {
        if ('string' == typeof lsnrs[0])
        {
            this.removeEventListener(lsnrs[0], lsnrs[1]);
            this._evntsCache.delete(lsnrs);
        }
        else
            (lsnrs as EventLsnr[]).forEach(lsnr => 
            {           
                this.removeEventListener(lsnr[0], lsnr[1]);
                this._evntsCache.delete(lsnr);
            }); 
    },
    clearEvent (name : string)
    {
        this._evntsCache.forEach((lsnr : EventLsnr) => 
        {
            if (name == lsnr[0])
            {
                this.removeEventListener(name, lsnr[1]);
            }
        });
    },
    clearEventExtListeners ()
    {
        this._evntsCache.forEach((lsnr : EventLsnr) => 
        {
            this.removeEventListener(lsnr[0], lsnr[1]);
        });
        this._evntsCache.clear();
    }
}
export default EventsHelperMixin;
