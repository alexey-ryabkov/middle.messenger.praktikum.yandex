import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BlockProps} from '@models/block';
import {EventLsnr, FormField} from '@models/types';
import Button from '@lib-components/button';
import FormFieldWrap from './components/field-wrap';
import {FieldValidatorDef, FormFieldDef, validateField} from '@lib-utils/form_validation';
import tpl from './tpl.hbs';
import './style.scss';

export type FormProps = BlockProps & 
{
    formFields : FormFieldDef[],
    action? : string,
    method? : string,
    btnLabel : string,
    onSuccess? : () => void,
    link? : {url : string, title : string},    
};

function validate (
    fieldWrap : FormFieldWrap, 
    fieldDef : FormField,
    validatorDefs : FieldValidatorDef[])
{
    const errors : string[] = [];

    if (!validateField( fieldDef, validatorDefs, errors ))
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
        const {action = '#', method = 'post', onSuccess, link} = props;        
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
            props: {fields, button, link}, 
            attrs: {action, method}, 

            events: ['submit', (event : Event) => 
            {
                event.preventDefault();

                const fieldValues : Record< string, string > = {};
                
                let i = 0;
                let errors : string[] = [];
                
                Object.entries(fields).forEach(([, fieldWrap ]) => 
                {
                    const field = fieldWrap.props.field;

                    // FIXME 
                    field.processElems();

                    const fieldElement = field.elems['input'];
                    const [, validatorDefs] = formFields[ i++ ];

                    if (validatorDefs)
                    {
                        errors = errors.concat( validate(fieldWrap, field, validatorDefs) );
                        fieldValues[ fieldElement.name ] = fieldElement.value;
                    }
                });

                if (!errors.length)
                {
                    if (onSuccess)
                    {
                        console.log(fieldValues);
                        alert( Object.entries(fieldValues).map (([name, value]) => `${name}: ${value ? value : '–'}` ).join("\n") );
                        onSuccess();
                    }
                    else
                        console.log(fieldValues);                   
                }
            }],
            bem: {name: 'form'} 
        });
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
