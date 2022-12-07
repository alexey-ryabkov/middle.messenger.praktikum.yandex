import Templator from '@core/templator';
import {BlockProps} from '@core/block';
import {BemCompParams, BemParams} from '@core/block/bem';
import ComponentBlock from '@core/block/component';
import tpl from './tpl.hbs';
import './style.scss';


export type SpinnerProps = BlockProps & 
{
    size? : 'small' | 'regular' | 'large',
    color? : 'light' | 'dark',  
    centered? : true,
};

export default class Spinner extends ComponentBlock
{
    constructor (props : SpinnerProps = {})
    {
        super(props);
    }
    protected _prepareBemParams (params : BemCompParams)
    {
        const props = params.props as SpinnerProps;
        const bem : BemParams = { 
            name: 'spinner', 
            mods: {block: []}
        };
        const {size, color = 'light', centered} = props;

        if (bem?.mods?.block)
        {
            if (size)
            {
                bem.mods.block.push([ 'size', size ]);
            }
            if (centered)
            {
                bem.mods.block.push([ 'centered' ]);
            }
            bem.mods.block.push([ 'color', color ]);
        } 
        return bem;
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
