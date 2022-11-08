import {FormField, SingleOrPlural} from "@models/types";

export type FormFieldDef_dep = [HTMLInputElement, string?]; // [element, label]

export type FieldValidator_dep = (field : FormFieldDef_dep, errorStack? : string[], params? : any) => boolean;

export type FieldValidatorDef_dep = [FieldValidator_dep, object?]; // [validatorFunc, validatorParams]

export type FieldValidator = (field : FormField, errorStack? : string[], params? : object) => boolean;

export type FieldValidatorDef = [FieldValidator, SingleOrPlural< string >, object?]; // [validatorFunc, events, validatorParams]

export type FormFieldDef = [FormField, FieldValidatorDef[]?]; 

export function isEmptyValidator (field : FormFieldDef_dep, errorStack : string[] = []) : boolean
{
    const isValid = !!field[0].value.trim();

    if (!isValid)
    {
        errorStack.push(`Поле "${field[1] ? field[1] : field[0].name}" должно быть заполнено`);
    }
    return isValid;
}
export function lengthValidator (field : FormFieldDef_dep, errorStack : string[] = [], length : [number, number]) : boolean // length : [min, max]
{
    const value = field[0].value.trim();
    const isValid = value.length >= length[0] && value.length <= length[1];

    if (!isValid)
    {
        errorStack.push(`Длина значения для поля "${field[1] ? field[1] : field[0].name}" некорректна, диапазон ${length}`);
    }
    return isValid;
}
export function phoneValidator (field : FormFieldDef_dep, errorStack : string[] = []) : boolean
{
    const value = field[0].value.trim();
    const isValid = /^\+?[0-9\s)(-]+$/.test(value);

    if (!isValid)
    {
        errorStack.push(`Длина значения для поля "${field[1] ? field[1] : field[0].name}" некорректна, диапазон ${length}`);
    }
    return isValid;
}
export function validateField (field : FormFieldDef_dep, validatorDefs : FieldValidatorDef_dep[], errorStack : string[] = [])
{
    return validatorDefs.every(validatorDef => 
    {
        const validator = validatorDef[0];
        const params = validatorDef[1];

        return validator(field, errorStack, params);
     });
}
