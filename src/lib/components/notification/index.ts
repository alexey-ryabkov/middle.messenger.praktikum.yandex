import Templator from '@core/templator';
// import {BlockEvents} from '@core/block';
import {BlockProps} from '@core/block';
import {BemParams} from '@core/block/bem';
import ComponentBlock from '@core/block/component';
import Icon, {IconVar} from '@lib-components/icon';
import tpl from './tpl.hbs';
import './style.scss';


export enum NotificationLevel 
{
    error = 'error',
    warning = 'warning',
    info = 'info',
    help = 'help',
}
const level2icon : Record< NotificationLevel, IconVar > = 
{
    error: IconVar.flag,
    warning: IconVar.flag,
    info: IconVar.circle_info,
    help: IconVar.circle_question,
}

export type NotificationProps = BlockProps & 
{
    text : string,
    level? : NotificationLevel,
};

export default class NotificationMsg extends ComponentBlock
{
    constructor (props : NotificationProps)
    {
        const bem : BemParams = { name: 'notification', mods: {block: []} };

        const {text, level} = props;

        let icon : Icon | null = null;
        if (level)
        {
            icon = new Icon({ variant: level2icon[level] }); 
            icon.bemMix([ 'notification', 'icon' ]);    
            
            if (bem?.mods?.block)
            {
                bem.mods.block.push([ 'lvl', level ]);
            }
        }        
        super({ props: {text, icon}, bem });
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
