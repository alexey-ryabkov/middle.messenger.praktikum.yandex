import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BemParams} from '@core/block/bem';
import {BlockProps} from '@core/block';
import tpl from './tpl.hbs';
import './style.scss';

export enum MessageTypes {
    text = 'text',
    photo = 'photo'
}
export type MessageProps = BlockProps & 
{
    msg : string,
    datetime : string,    
    of : 'you' | 'chat',
    type? : MessageTypes,
    tag? : string
};
export default class MessageComponent extends ComponentBlock 
{
    constructor (props : MessageProps)
    {
        const node = props?.tag ?? 'div';
        
        const bem : BemParams = { 
            name: 'message', 
            mix: { block: [['icontainer', [['bg', 'grayLight'], ['size', 'small']] ]] },
            mods: { block: [] }
        };

        if (!props.type)
        {
            props.type = MessageTypes.text;
        }
        bem?.mods?.block?.push(['type', props.type]);
        bem?.mods?.block?.push(['of', props.of]);

        super({ node, props, bem });
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
