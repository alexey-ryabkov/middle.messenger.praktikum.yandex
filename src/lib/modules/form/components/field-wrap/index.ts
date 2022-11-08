import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BlockProps} from '@models/block';
import Icon, { IconVar } from '@lib-components/icon';
// import InputText from '@lib-components/input-text';
import {FormField} from '@models/types';
import tpl from './tpl.hbs';


export type FormFieldWrapProps = BlockProps & {
    field : FormField,
    error? : string
};
export default class FormFieldWrap extends ComponentBlock 
{
    constructor (props : FormFieldWrapProps)
    {
        props = FormFieldWrap._prepareProps(props); 

        super({ 
            props, 
            bem: { 
                name: '_formFieldWrap', 
                mix: { block: [['form', 'fieldWrap']] }
            }});
    }
    setProps(nextProps: any): void 
    {
        super.setProps( FormFieldWrap._prepareProps(nextProps) );    
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
    protected static _prepareProps (props : any)
    {
        if (props.error)
        {
            const icon = new Icon({ variant: IconVar.flag, size: 'small' });

            icon.bemMix(['notification', 'icon']);

            props.notification = {
                icon, 
                text: props.error
            }
        } 
        else
            props.notification = '';

        return props;
    }    
}
