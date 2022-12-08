import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BlockProps, BlockEvents} from '@core/block';
import {BemCompParams, BemParams} from '@core/block/bem';
import InputText from '@lib-components/input-text';
import Icon, {IconVar} from '@lib-components/icon';
import tpl from './tpl.hbs';

export type SearchProps = BlockProps & 
{
    inputName : string
};
export default class SearchComponent extends ComponentBlock 
{
    constructor (props : SearchProps, events? : BlockEvents)
    {
        const icon = new Icon({ variant: IconVar.search });        
        icon.bemMix([ 'inputText', 'icon' ]);
        
        const input = new InputText({ 
            name: props.inputName, 
            label: '',
            placeholder: 'Поиск по чатам' 
        }, 
        events);

        super({ icon, input });
    }
    protected _prepareBemParams (params : BemCompParams)
    {
        const props = params.props as SearchProps;
        const bem : BemParams = { 
            name: 'search', 
            mix: { block: [[ 'inputText', [['iconed']] ]] }
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
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
