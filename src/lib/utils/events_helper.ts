import {SingleOrPlural, EventLsnr} from '../@models/types';
import {plural2Arr} from '.';

export interface HTMLElementEvnts 
{
    addEvntLsnrs : (lsnrs : SingleOrPlural<EventLsnr>) => void,
    removeEvntLsnrs : (lsnrs : SingleOrPlural<EventLsnr>) => void,
    clearEvnt : (name : string) => void,
    clearEvntLsnrs : () => void
}
const EventsHelperMixin = 
{
    _evntsCache: new Set<EventLsnr>(),
    addEvntLsnrs (lsnrs : SingleOrPlural<EventLsnr>) 
    {       
        plural2Arr(lsnrs).forEach(lsnr => 
        {
            this._element.addEventListener(lsnr.name, lsnr.handler);
            this._evntsCache.add(lsnr);
        });        
    },
    removeEvntLsnrs (lsnrs : SingleOrPlural<EventLsnr>)
    {
        plural2Arr(lsnrs).forEach(lsnr => 
        {
            this._element.removeEventListener(lsnr.name, lsnr.handler);
            this._evntsCache.delete(lsnr);
        });  
    },
    clearEvnt (name : string)
    {
        this._evntsCache.forEach(lsnr => 
        {
            if (name == lsnr.name)
            {
                this._element.removeEventListener(name, lsnr.handler);
            }
        });
    },
    clearEvntLsnrs ()
    {
        this._evntsCache.forEach(lsnr => 
        {
            this._element.removeEventListener(lsnr.name, lsnr.handler);
        });
        this._evntsCache.clear();
    }
}
export default EventsHelperMixin;
