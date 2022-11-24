import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BlockProps} from '@core/block';
import {EventLsnr, FormField} from '@core/types';
import Button from '@lib-components/button';
import NotificationMsg, {NotificationLevel} from '@lib-components/notification';
import FormFieldWrap from './components/field_wrap';
import {FormFieldValidatorDef, FormFieldDef, validateFromField} from '@lib-utils/form_validation';
import tpl from './tpl.hbs';
import './style.scss';


export type FormProps = BlockProps & 
{
    formFields : FormFieldDef[],
    action? : string,
    method? : string,
    btnLabel : string,
    onSubmit : (data : FormData) => void,
    link? : {url : string, title : string},
    error? : string,
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
    constructor (props : FormProps)
    {
        Form._prepareProps(props);

        const {action = '#', method = 'post', onSubmit, link, notification} = props;        
        const fields : Record< string, FormFieldWrap > = {};

        const formFields = props.formFields;
        
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
                    
                    // TODO not all fields can be validatable 
                    field.setValidationHandlers(validationHandlers);
                });
            }    
            fields[field.label] = fieldWrap;
        });

        const button = new Button({ 
            label: props.btnLabel,
            width: 'full',
            importance: 'primary',
            size: 'big'
        });
        button.bemMix(['form', 'submitButton']);

        super({ 
            node: 'form', 
            // FIXME now have to do copy of fields 
            props: {notification, fields : {...fields}, button, link}, 
            attrs: {action, method}, 

            events: ['submit', (event : Event) => 
            {
                event.preventDefault();

                // const fieldValues : Record< string, string > = {};
                
                let i = 0;
                let errors : string[] = [];
                
                Object.entries(fields).forEach(([, fieldWrap ]) => 
                {
                    const field = fieldWrap.props.field;

                    // FIXME now have to call it manually 
                    field.processElems();

                    const fieldElement = field.elems['input'];
                    const [, validatorDefs] = formFields[ i++ ];

                    if (validatorDefs)
                    {
                        errors = errors.concat( validate(fieldWrap, field, validatorDefs) );
                        // fieldValues[ fieldElement.name ] = fieldElement.value;
                    }
                });

                const formData = new FormData(this._formElement);

                if (!errors.length)
                {
                    onSubmit(formData);     
                }
            }],
            bem: {name: 'form'} 
        });
    }    
    setProps (nextProps: Partial< FormProps >)
    {
        Form._prepareProps(nextProps);
        super.setProps(nextProps);  
    } 
    protected get _formElement ()
    {
        const element = <unknown>this._element;
        return element as HTMLFormElement;
    } 
    protected static _prepareProps (props : Partial< FormProps >)
    {
        if (props.error)
        {
            props.notification = new NotificationMsg({ text: props.error, level: NotificationLevel.error });
            props.notification.bemMix(['form', 'submitNotification']);
        }
        else
            props.notification = null;

        return props;
    }   
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
