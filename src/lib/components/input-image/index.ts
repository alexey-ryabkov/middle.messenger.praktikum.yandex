import Templator from '@core/templator';
import {BemCompParams, BemParams} from '@core/block/bem';
import FormFieldComponent, {FormFieldProps} from '@core/block/form_field';
import Avatar from '@lib-components/avatar';
import {freezeEvent} from '@lib-utils-kit';
import tpl from './tpl.hbs';
import './style.scss';

export type InputImageProps = FormFieldProps & {
    image? : string | null
};
export default class InputImage extends FormFieldComponent 
{
    constructor (props : InputImageProps)
    {
        InputImage._processProps(props);

        super(props);

        this._processBlockBem();
    }    
    protected _prepareBemParams (params : BemCompParams)
    {
        const props = params.props as InputImageProps;
        const bem : BemParams = { 
            name: 'inputImage', 
            mods: {block: []}, 
            events: {block: []} 
        };
        if (!props.avatar && bem?.mods?.block)
        {
            bem.mods.block.push(['empty']);
        }
        if (bem?.events?.block)
        {
            bem.events.block = 
            [
                ['dragenter', (event : Event) => 
                {
                    freezeEvent(event);
                    this._toggleDropZone(true);
                }],
                ['dragover', (event : Event) => 
                {
                    freezeEvent(event);
                    this._toggleDropZone(true);
                }],
                ['dragleave', (event : Event) => 
                {
                    freezeEvent(event);
                    this._toggleDropZone(false);
                }],
                ['drop', (event : DragEvent) => 
                {
                    freezeEvent(event);
                    this._toggleDropZone(false);

                    const files = event?.dataTransfer?.files;
                    if (files)
                    {
                        this._uploadFiles(files);
                        
                    }
                }],
            ];
        }
        return bem;
    }
    setProps (nextProps: Partial< InputImageProps >) 
    {
        InputImage._processProps(nextProps);

        super.setProps(nextProps);

        this._processBlockBem();
    }
    get value () 
    {
        return this.props.avatar ? this.props.avatar.props.image : '';
    }
    set value (image : string) 
    {
        if (image)
        {
            let avatar = this.props.avatar;
            if (!avatar)
            {
                avatar = new Avatar({ image, size: 'large' });

                this.delBemMods([ ['empty'] ]);

                this.setProps({ avatar });
            }
            else
                avatar.setProps({ image });
        }
        else
            this.setProps({ avatar: null });
    }
    protected static _processProps (props : Partial< InputImageProps >)
    {
        if ('image' in props)
        {
            const {image} = props;
            if (image)
            {
                const avatar = new Avatar({ 
                    image, 
                    size: 'large'
                });
                (props.avatar = avatar).bemMix(['inputImage', 'image']);
            }
            else 
                props.avatar = null;  
        }
        return props;
    }
    protected _processBlockBem ()
    {
        if (this.props.avatar)
        {
            this.delBemMods([[ 'empty' ]]);
        }
        else
            this.addBemMods([[ 'empty' ]]);
    }
    protected _toggleDropZone (flag : boolean) 
    {
        if (flag)
        {
            this.addBemMods([ ['active'] ]);
        }
        else
            this.delBemMods([ ['active'] ]);
    }
    protected _uploadFiles (files : FileList)
    {
        const file = files[0];
        if (['image/jpeg', 'image/png'].includes(file.type)) 
        {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = () => 
            {
                const image = reader.result;
                if (typeof image == 'string')
                {   
                    this.value = image;
                    this.files = files;
                }
            }
        }
        else
            alert('Неподдерживаемый формат изображения');
    }      
    get files () 
    {
        return this._input.files;
    }
    set files (files : FileList | null) 
    {
        this._input.files = files;
    }
    protected get _input ()
    {
        // FIXME while have to call it 
        this.processElems();
        
        const input = <unknown> this.elems['input'];
        return (input as HTMLInputElement);
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
