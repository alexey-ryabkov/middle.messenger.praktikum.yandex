import Templator from '@core/templator';
import {BlockProps} from '@core/block';
import ComponentBlock from '@core/block/component';
import {BemCompParams, BemParams} from '@core/block/bem';
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
        super( FormFieldWrap._prepareProps(props) );
    }
    protected _prepareBemParams ()
    {
        const bem : BemParams = { 
            name: '_formFieldWrap', 
            mix: { block: [['form', 'fieldWrap']] }
        };
        return bem;
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
