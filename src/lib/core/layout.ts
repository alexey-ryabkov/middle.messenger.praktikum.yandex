import {App, AppContainer} from '@core/types';
import {BlockProps, BlockEvents} from '@core/block';
import {BemCompParams} from '@core/block/bem';
import ComponentBlock from '@core/block/component';
import Block from '@core/block';
import {plural2Arr} from '@lib-utils-kit';

export type LayoutProps = BlockProps & {areas? : Record< string, Block >};

export default abstract class Layout extends ComponentBlock
{
    protected _container : AppContainer;
    protected _events : BlockEvents;
    
    constructor (app : App, params : BemCompParams)
    {
        params.node = app.root; 
        super(params);

        this._container = app.container;

        if (params.events)
        {
            this._events = params.events;
        }
    }
    set areas (areas : Record< string, Block | string >) // layout areas, for example {content: ..., sidebar: ...}
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
