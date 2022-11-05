import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BemParams} from '@models/bem_block';
import {BlockProps} from '@models/block';
import tpl from './tpl.hbs';
import './style.scss';

const template = new Templator(tpl);

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
    tag? : 'string'
};
export default class Message extends ComponentBlock 
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
        return template;
    }
}
