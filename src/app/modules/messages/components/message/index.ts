import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BemCompParams, BemParams} from '@core/block/bem';
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
        if (!props.type)
        {
            props.type = MessageTypes.text;
        }
        super(props, [], { node: props?.tag ?? 'div' });
    }
    protected _prepareBemParams (params : BemCompParams)
    {
        const props = params.props as MessageProps;
        const bem : BemParams = { 
            name: 'message', 
            mix: { block: [['icontainer', [['bg', 'grayLight'], ['size', 'small']] ]] },
            mods: { block: [] }
        };   
        bem?.mods?.block?.push(['type', props.type]);
        bem?.mods?.block?.push(['of', props.of]);

        return bem;
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
