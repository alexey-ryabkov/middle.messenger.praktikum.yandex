import Templator from '@core/templator';
import {BlockProps} from '@core/block';
import {BemParams} from '@core/block/bem';
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
        const {size, color = 'light', centered} = props;
        const bem : BemParams = { name: 'spinner', mods: {block: []} };

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
        super({ bem });
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
