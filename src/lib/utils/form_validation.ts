import {FormField} from "@models/types";

export type FieldValidator = (field : FormField, errorStack? : string[], params? : object) => boolean;

export type FieldValidatorDef = [string[], FieldValidator, object?]; // [events, validatorFunc, validatorParams]

export type FormFieldDef = [FormField, FieldValidatorDef[]?]; 

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
export function phoneValidator (field : FormField, errorStack : string[] = []) : boolean
{
    const value = field.value?.trim();
    const isValid = !!value && /^\+?[0-9\s)(-]+$/.test(value);

    if (!isValid)
    {
        errorStack.push(`Длина значения для поля "${field.label}" некорректна, диапазон ${length}`);
    }
    return isValid;
}
export function validateField (field : FormField, validatorDefs : FieldValidatorDef[], errorStack : string[] = [])
{
    return validatorDefs.every(validatorDef => 
    {
        const [, validator, params] = validatorDef;
        
        return validator(field, errorStack, params);
     });
}
