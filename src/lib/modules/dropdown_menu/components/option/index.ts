import {EventHandler, Handler} from '@core/types';
import Templator from '@core/templator';
import {BlockEvents, BlockProps} from '@core/block';
import ComponentBlock from '@core/block/component';
import {BemParams} from '@core/block/bem';
import Icon, {IconVar} from '@lib-components/icon';
import tpl from './tpl.hbs';

export type DropdownMenuOptionProps = BlockProps & {
    title : string,
    icon? : IconVar,
    url? : string,
    action? : Handler,
    // action? : EventHandler,
};

export default class DropdownMenuOption extends ComponentBlock 
{
    constructor (props : DropdownMenuOptionProps)
    {
        const {title, icon: iconVariant, url = '#', action} = props;
        
        const events : BlockEvents = action ? ['click', event => 
        {
            event.preventDefault();
            action();
        }] : [];

        let icon;
        if (iconVariant)
        {
            icon = new Icon({ 
                variant: iconVariant, 
                size: 'small', 
            });
            icon.bemMix(['dropdownMenu', 'menuOptIcon']);    
        }
        super( {title, icon, url}, events, {node: 'li'} );
    }
    protected _prepareBemParams ()
    {
        const bem : BemParams = { 
            name: 'dropdownMenuOption', 
            mix: { block: [['dropdownMenu', 'menuOpt']] }
        };
        return bem;
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
