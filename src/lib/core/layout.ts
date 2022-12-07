import {ContainarableApp, AppContainer} from '@core/types';
import {BlockProps, BlockEvents} from '@core/block';
import ComponentBlock, {ComponentParams} from '@core/block/component';
import Block from '@core/block';
import {plural2Arr} from '@lib-utils-kit';

export type LayoutProps = BlockProps & {areas? : Record< string, Block >};

export default abstract class Layout extends ComponentBlock
{
    protected _container : AppContainer;
    protected _events : BlockEvents;
    
    constructor (
        app : ContainarableApp, 
        props? : LayoutProps, 
        events : BlockEvents = [], 
        params : ComponentParams = {})
    {
        params.node = app.root; 

        super(props, events, params);

        this._container = app.container;
        this._events = events;
    }
    // layout areas, for example {content: ..., sidebar: ...}
    set areas (areas : Record< string, Block | string >) 
    {
        this.setProps({areas}); 
    }
    unmount ()
    {
        if (this._events)
        {
            plural2Arr(this._events).forEach(lsnr => 
            {
                this.element.removeEventExtListeners(lsnr);
            })
        } 
        this._container.workarea.innerHTML = '';
        this._container.bemUnmix([this.bemName]);
    }
    protected _render() 
    {
        this._container.workarea.innerHTML = '';
        this._container.workarea.appendChild(this.render());

        this.processElems();
        this._processElemCssCls();
        this._processElemsDomEvents();
    }  
}
