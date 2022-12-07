import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BemCompParams, BemParams} from '@core/block/bem';
import {BlockProps, BlockEvents} from '@core/block';
import Spinner from '@lib-components/spinner';
import tpl from './tpl.hbs';
import './style.scss';

export type ButtonProps = BlockProps & 
{
    label : string,
    isLink? : boolean,
    href? : string,
    name? : string,
    importance? : 'primary' | 'secondary',
    size? : 'big',
    width? : 'full',
    showLoader? : boolean,
    disabled? : boolean
};
export default class Button extends ComponentBlock 
{
    constructor (props : ButtonProps, events? : BlockEvents)
    {
        Button._processProps(props);

        const attrs : { 
            href? : string, 
            name? : string
        } = {};   

        let node = 'button';
        
        if (props.isLink)
        {
            node = 'a';
            attrs.href = props.href ? props.href : '#';
        }
        else if (props.name)
        {
            attrs.name = props.name;
        }
        super(props, events, {node, attrs});

        if ('disabled' in props)
        {
            this._processDisabledState(!!props.disabled);
        }
    }
    setProps (nextProps: Partial< ButtonProps >) 
    {
        Button._processProps(nextProps);

        if ('disabled' in nextProps)
        {
            this._processDisabledState(!!nextProps.disabled);
        }
        super.setProps(nextProps);
    }
    protected static _processProps (props : Partial< ButtonProps >)
    {
        if ('showLoader' in props)
        {
            props.loader = props.showLoader ? new Spinner({ size: 'small' }) : null;
        }
        return props;
    }
    protected _prepareBemParams (params : BemCompParams)
    {
        const props = params.props as ButtonProps;
        const bem : BemParams = { 
            name: 'button', 
            mods: {block: []} 
        };
        ['importance', 'size', 'width'].forEach(mod => 
        {
            if (mod in props && bem?.mods?.block)
            {
                bem.mods.block.push([ mod, props[mod] ]);
            }
        });   
        return bem;
    }
    protected _processDisabledState (disabled : boolean)
    {
        if (disabled)
        {
            this._element.setAttribute('disabled', 'disabled');
        }
        else
            this._element.removeAttribute('disabled');
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
