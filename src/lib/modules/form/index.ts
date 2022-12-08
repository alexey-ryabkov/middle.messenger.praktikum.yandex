import Templator from '@core/templator';
import {BlockProps} from '@core/block';
import {BemParams} from '@core/block/bem';
import ComponentBlock from '@core/block/component';
import {EventLsnr, FormField, PlainObject} from '@core/types';
import Button from '@lib-components/button';
import NotificationMsg, {NotificationLevel} from '@lib-components/notification';
import FormFieldWrap from './components/field_wrap';
import {FormFieldValidatorDef, FormFieldDef, validateFromField} from '@lib-utils/form_validation';
import {getUserError} from '@app-utils-kit';
import tpl from './tpl.hbs';
import './style.scss';

export type FormFieldValue = string | number | null;
export type FormProps = BlockProps & 
{
    formFields : FormFieldDef[],
    fieldsValues? : PlainObject< FormFieldValue >
    action? : string,
    method? : string,
    btnLabel : string,
    onSubmit : (data : FormData) => Promise< unknown >,
    link? : {url : string, title : string},
    error? : string,
    message? : string,
};

function validate (
    fieldWrap : FormFieldWrap, 
    fieldDef : FormField,
    validatorDefs : FormFieldValidatorDef[])
{
    const errors : string[] = [];

    if (!validateFromField( fieldDef, validatorDefs, errors ))
    {
        fieldWrap.setProps({ error: errors.join(' / ') })
    }
    else 
        fieldWrap.setProps({ error: '' });

    return errors;
}

export default class Form extends ComponentBlock 
{
    protected static readonly _SUCCESS_MSG_VISIBLE_TIME = 5000;

    constructor (props : FormProps)
    {
        const {formFields, action = '#', method = 'post', onSubmit, link, notification} = props;
        
        Form._prepareProps(props);        

        const fieldWraps : PlainObject< FormFieldWrap > = {};
        const fields : PlainObject< FormField > = {};
        
        formFields.forEach(formField => 
        {
            const [field, validatorDefs] = formField;
            const fieldWrap = new FormFieldWrap({ field });

            if (validatorDefs)
            {
                const validationHandlers : EventLsnr[] = [];

                validatorDefs.forEach(validatorDef => 
                {
                    const [fieldEvents] = validatorDef;

                    fieldEvents.forEach(( event ) => 
                    {
                        validationHandlers.push([ event, () => validate(fieldWrap, field, validatorDefs) ]);
                    });
                    
                    field.setValidationHandlers(validationHandlers);
                });
            }    
            fieldWraps[field.label] = fieldWrap;
            fields[field.name] = field;
        });

        const button = new Button({ 
            label: props.btnLabel,
            width: 'full',
            importance: 'primary',
            size: 'big'
        });
        button.bemMix(['form', 'submitButton']);

        super(
            // FIXME now have to do copy of fields 
            {notification, fieldWraps : {...fieldWraps}, fields, button, link}, 

            ['submit', (event : Event) => 
            {
                event.preventDefault();

                let i = 0;
                let errors : string[] = [];
                
                Object.entries(fieldWraps).forEach(([, fieldWrap ]) => 
                {
                    const field = fieldWrap.props.field;

                    // FIXME now have to call it manually 
                    field.processElems();

                    const [, validatorDefs] = formFields[ i++ ];

                    if (validatorDefs)
                    {
                        errors = errors.concat( validate(fieldWrap, field, validatorDefs) );
                    }
                });

                const formData = new FormData( this._formElement );

                if (!errors.length)
                {
                    const button = this.props.button as Button;
                    button.setProps({ showLoader: true, disabled: true });

                    onSubmit( formData )
                        .then( () => 
                        {
                            this.setProps({ message: 'Изменения успешно сохранены' });
                            
                            // TODO use updated:openedPage store event for hide notifications after user left page
                            setTimeout(() =>
                            {
                                this.setProps({ message: '' });
                            },
                            Form._SUCCESS_MSG_VISIBLE_TIME);
                        })
                        .catch( error =>
                        {
                            error = getUserError(error);
                            if (!error)
                            {
                                error = 'При отправке формы возникла неизвестная ошибка';
                            }
                            this.setProps({ error });
                        })
                        .finally( () => button.setProps({ showLoader: false, disabled: false }) );
                }
            }],
            {
                node: 'form', 
                attrs: {action, method}, 
            });
    }
    setProps (nextProps: Partial< FormProps >)
    {
        const {notification} = Form._prepareProps(nextProps);

        if (nextProps.fieldsValues)
        {
            Object.entries(nextProps.fieldsValues).forEach(([name, value]) => 
            {
                if (name in this.props.fields)
                {
                    const field = this.props.fields[name];
                    field.value = value;
                }
            });
        }
        super.setProps({notification});  
    }     
    protected static _prepareProps (props : Partial< FormProps >)
    {
        if ('error' in props || 'message' in props)
        {
            if (props.error || props.message)
            {   
                props.notification = new NotificationMsg({ 
                    text: (props.error ? props.error : props.message) as string, 
                    level: props.error ? NotificationLevel.error : NotificationLevel.success
                });
                props.notification.bemMix(['form', 'submitNotification']);
            }
            else
                props.notification = null;
        }
        return props;
    } 
    protected get _formElement ()
    {
        const element = <unknown>this._element;
        return element as HTMLFormElement;
    } 
    protected _prepareBemParams ()
    {
        const bem : BemParams = {name: 'form'};
        return bem;
    }  
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
