import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BlockEvents, BlockProps} from '@models/block';
import {InputTextField} from '@models/types';
import InputText from '@lib-components/input-text';
import FormFieldWrap from './components/field-wrap';
import Button from '@lib-components/button';
import {FieldValidatorDef, FormFieldDef, validateField} from '@lib-utils/form_validation';
import tpl from './tpl.hbs';
import './style.scss';

export type FormField = InputTextField & 
{
    label : string,
    validatorDefs? : FieldValidatorDef[] 
}; 
export type FormProps = BlockProps & 
{
    formFields : FormField[],
    action? : string,
    method? : string,
    btnLabel : string,
    onSuccess? : () => void,
    link? : {url : string, title : string},    
};
export type FormLinkDef = [string, string];

function validate (
    fieldWrap : FormFieldWrap, 
    fieldDef : FormFieldDef,
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

        props.formFields.forEach(formField => 
        {
            const {label, validatorDefs} = formField;

            let events : BlockEvents = [];
            if (validatorDefs)
            {
                events = [
                    ['focus', (event : Event) => 
                    {
                        const fieldElement = <HTMLInputElement> event.target;
    
                        if (fieldElement.value.trim())
                        {
                            validate(fieldWrap, [fieldElement, label], validatorDefs);
                        }
                    }],
                    ['blur', (event : Event) => validate(fieldWrap, [<HTMLInputElement> event.target, label], validatorDefs)]
                ];
            }

            const field = new InputText(formField, events);
            const fieldWrap = new FormFieldWrap({ field });
    
            fields[label] = fieldWrap;
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
            props: {fields: {...fields}, button, link}, 
            attrs: {action, method}, 

            events: ['submit', (event : Event) => 
            {
                event.preventDefault();
                //console.log('form submit!!!', event);

                // console.log(fields);

                // TODO кажется мой def_props заменяет пропсы на разментку в компоненте. даже несмотря на то что я копирую...

                const fieldValues : Record< string, string > = {};
                
                let i = 0;
                let errors : string[] = [];
                
                Object.entries(fields).forEach(([label, fieldWrap ]) => 
                {
                    const fieldWrapProps = (fieldWrap as FormFieldWrap).props;
                    const fieldComp = fieldWrapProps.field;
                    // FIXME 
                    fieldComp.processElems();

                    const fieldElement = fieldComp.elems['input'];
                    const validatorDefs = props.formFields[ i++ ].validatorDefs;

                    if (validatorDefs)
                    {
                        errors = errors.concat(validate(<FormFieldWrap>fieldWrap, [fieldElement, label], validatorDefs));
                        fieldValues[ fieldElement.name ] = fieldElement.value;
                    }
                });

                if (!errors.length)
                {
                    if (onSuccess)
                    {
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
