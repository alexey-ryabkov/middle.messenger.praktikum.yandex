import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BlockProps} from '@core/block';
import NotificationMsg, {NotificationLevel} from '@lib-components/notification';
import {FormField} from '@core/types';
import tpl from './tpl.hbs';


export type FormFieldWrapProps = BlockProps & {
    field : FormField,
    error? : string
};
export default class FormFieldWrap extends ComponentBlock 
{
    constructor (props : FormFieldWrapProps)
    {
        super({ 
            props: FormFieldWrap._prepareProps(props), 
            bem: { 
                name: '_formFieldWrap', 
                mix: { block: [['form', 'fieldWrap']] }
            }});
    }
    setProps (nextProps: Partial< FormFieldWrapProps >)
    {
        FormFieldWrap._prepareProps(nextProps);
        super.setProps(nextProps);  
    }    
    protected static _prepareProps (props : Partial< FormFieldWrapProps >)
    {
        if (props.error)
        {
            props.notification = new NotificationMsg({ text: props.error, level: NotificationLevel.error });
            props.notification.bemMix(['form', 'fieldNotification']);
        }
        else
            props.notification = null;

        return props;
    } 
    // componentDidUpdate ()
    // {
    //     return false;
    // }  
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
