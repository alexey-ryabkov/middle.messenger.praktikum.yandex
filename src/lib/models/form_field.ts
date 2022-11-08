import ComponentBlock from "@models/component_block";
import {BlockProps} from "@models/block";
import {FormField} from "@models/types";

export type FormFieldProps = BlockProps & FormField;

export default abstract class FormFieldComponent extends ComponentBlock implements FormField 
{
    get name () : string
    {
        return this.props.name;
    }
    get label () : string 
    {
        return this.props.label ? this.props.label : this.props.name;
    }
    abstract get value () : string;
    abstract set value (value : string); 
}
