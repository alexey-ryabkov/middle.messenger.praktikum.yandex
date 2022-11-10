import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BlockProps} from '@models/block';
import Icon, { IconVar } from '@lib-components/icon';
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
        FormFieldWrap._prepareProps(nextProps);
        
        // TODO make notification subcomponent instead this 

        const notificationProps = nextProps.notification;

        let notificationElem = this.element.querySelector('.notification');
        let notificationTxtElem = this.element.querySelector('.notification__text');
      
        if (notificationElem)
        {
            if (!notificationProps)
            {
                notificationElem.remove();
            }
            else if (notificationTxtElem)
            {   
                notificationTxtElem.textContent = notificationProps.text;
            }
        }
        else
        {
            if (notificationProps)
            {
                notificationElem = document.createElement('div');
                notificationElem.className = 'form__fieldNotification notification notification--lvl_error';

                notificationTxtElem = document.createElement('div');
                notificationTxtElem.className = 'notification__text';
                notificationTxtElem.textContent = notificationProps.text;

                notificationElem.append(notificationProps.icon.element);
                notificationElem.append(notificationTxtElem);

                this.element.append(notificationElem);
            }
        }
        super.setProps(nextProps);  
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
    componentDidUpdate ()
    {
        return false;
    }  
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
