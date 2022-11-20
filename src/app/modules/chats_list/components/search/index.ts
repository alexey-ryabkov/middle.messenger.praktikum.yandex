import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BlockProps, BlockEvents} from '@core/block';
import {BemParams} from '@core/block/bem';
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
            placeholder: 'Поиск по чатам' 

        }, events);

        const bem = { name: 'search', mix: { block: [[ 'inputText', [['iconed']] ]] }} as BemParams;

        super({ props: {icon, input}, bem });
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
