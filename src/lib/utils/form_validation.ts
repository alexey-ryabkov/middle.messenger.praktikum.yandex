import {FormField} from "@models/types";

export type FieldValidator = (field : FormField, errorStack? : string[], params? : object) => boolean;

export type FieldValidatorDef = [string[], FieldValidator, object?]; // [events, validatorFunc, validatorParams]

export type FormFieldDef = [FormField, FieldValidatorDef[]?]; 

export function validateField (field : FormField, validatorDefs : FieldValidatorDef[], errorStack : string[] = [])
{
    return validatorDefs.every(validatorDef => 
    {
        const [, validator, params] = validatorDef;
        
        return validator(field, errorStack, params);
     });
}
export function isEmptyValidator (field : FormField, errorStack : string[] = []) : boolean
{
    const isValid = !!field.value?.trim();

    if (!isValid)
    {
        errorStack.push(`Поле "${field.label}" должно быть заполнено`);
    }
    return isValid;
}
export function lengthValidator (field : FormField, errorStack : string[] = [], length : [number, number]) : boolean // length : [min, max]
{
    const value = field.value?.trim();
    const isValid = !!value && value.length >= length[0] && value.length <= length[1];

    if (!isValid)
    {
        errorStack.push(`Длина значения для поля "${field.label}" некорректна, диапазон ${length}`);
    }
    return isValid;
}
export function regexpValidator (field : FormField, errorStack : string[] = [], params : { regexp: RegExp, error?: string }) : boolean 
{
    const value = field.value?.trim();
    const {
        regexp, 
        error = `Поле "${field.label}" заполнено некорректно`
    } = params;

    const isValid = !!value && regexp.test(value);
    if (!isValid)
    {
        errorStack.push(error); 
    }
    return isValid;
}
export function nameValidator (field : FormField, errorStack : string[] = []) 
{
    return regexpValidator(field, errorStack, { regexp: /^[A-ZА-Я][a-zA-Zа-яА-Я-]+$/ });
}
export function loginValidator (field : FormField, errorStack : string[] = []) 
{
    return regexpValidator(field, errorStack, { regexp: /^[a-z_-]*[0-9]?[a-z_-]+$/i });
}
export function phoneValidator (field : FormField, errorStack : string[] = []) 
{
    return regexpValidator(field, errorStack, { regexp: /^\+?[0-9]+$/ });
}
export function emailValidator (field : FormField, errorStack : string[] = [])
{
    return regexpValidator(field, errorStack, { regexp: /^[\w-]+@[\w-]+\.[a-z]+$/i });
}
export function passwordValidator (field : FormField, errorStack : string[] = [])
{
    return regexpValidator(field, errorStack, { regexp: /(?:[0-9].*[A-Z])|(?:[A-Z].*[0-9])/ });
}
