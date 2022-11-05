import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BlockProps, BlockEvents} from '@models/block';
import {BemParams} from '@models/bem_block';
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
            plaseholder: 'Поиск по чатам' 

        }, events);

        const bem = { name: 'search', mix: { block: [[ 'inputText', [['iconed']] ]] }} as BemParams;

        super({ node: input.element, props: {icon, input}, bem });

        this.mount();
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
