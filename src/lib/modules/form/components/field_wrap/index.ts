import Templator from '@core/templator';
import {FormField} from '@core/types';
import {BlockProps} from '@core/block';
import ComponentBlock from '@core/block/component';
import {BemParams} from '@core/block/bem';
import NotificationMsg, {NotificationLevel} from '@lib-components/notification';
import mount from '@lib-utils/mount';
import tpl from './tpl.hbs';

export type FormFieldWrapProps = BlockProps & {
    field : FormField,
    error? : string,
    notification? : NotificationMsg | null
};
export default class FormFieldWrap extends ComponentBlock 
{
    constructor (props : FormFieldWrapProps)
    {
        super( props );
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
        this._processErrors(nextProps);
        super.setProps(nextProps);  
    }    
    protected _processErrors (props : Partial< FormFieldWrapProps >)
    {
        if ('error' in props)
        {
            let notification = this.props.notification;
            
            const text = props.error;
            if (text)
            {
                if (!notification)
                {
                    notification = new NotificationMsg({ text, level: NotificationLevel.error });
                    notification.bemMix(['form', 'fieldNotification']);
                    mount(notification.element, this.element);
                }
                else
                    notification.setProps({ text });
            }
            else if (notification)
            {
                notification.element.remove();
                notification = null;
            }
            props.notification = notification;
        }
        return props;
    }
    componentDidUpdate ()
    {
        // we don`t need re-render this comp by props change, changes handling directly with children
        // (see FormFieldWrap._processErrors for field notify and Form.setProps for field value)
        return false;
    }  
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
