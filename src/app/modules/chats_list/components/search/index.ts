import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BlockProps} from '@models/block';
import InputText from '@lib-components/input-text';
import Icon, {IconVar} from '@lib-components/icon';
import tpl from './tpl.hbs';

const template = new Templator(tpl);

export type SearchProps = BlockProps & 
{
    inputName : string
};
export default class SearchComponent extends ComponentBlock 
{
    constructor (props : SearchProps)
    {
        const icon = new Icon({ variant: IconVar.search });
        
        const input = new InputText({ 
            name: props.inputName, 
            plaseholder: 'Поиск по чатам' 

        }, ['keyup', () => console.log('type in search phrase')]);
        
        icon.bemMix([ 'inputText', 'icon' ]);

        super({ props: {icon, input}, bem: {name: 'search'} });
    }
    protected get _template () 
    {
        return template;
    }
}
