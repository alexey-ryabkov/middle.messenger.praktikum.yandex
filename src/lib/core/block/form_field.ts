import ComponentBlock from "@core/block/component";
import {BlockProps, HTMLElementExt} from "@core/block";
import {EventLsnr, FormField, SingleOrPlural} from "@core/types";

export type FormFieldProps = BlockProps & { 
    name : string,    
    label : string,
    value? : string,
}
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
    setValidationHandlers (lsnrs : SingleOrPlural< EventLsnr >) : void 
    {
        const input = <unknown> this._input;
        (input as HTMLElementExt).addEventExtListeners(lsnrs);
    }
    abstract get value () : string;
    abstract set value (value : string); 
    protected abstract get _input () : HTMLInputElement;
}
