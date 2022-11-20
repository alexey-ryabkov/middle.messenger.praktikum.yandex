import Templator from '@core/templator';
import {BemParams} from '@core/block/bem';
import FormFieldComponent, {FormFieldProps} from '@core/block/form_field';
import Avatar from '@lib-components/avatar';
import {freezeEvent} from '@lib-utils-kit';
import tpl from './tpl.hbs';
import './style.scss';

export type InputImageProps = FormFieldProps & {
    image? : string
};
export default class InputImage extends FormFieldComponent 
{
    constructor (props : InputImageProps)
    {
        const bem : BemParams = { name: 'inputImage', mods: {block: []}, events: {block: []} };

        props.avatar = InputImage._processAvatar(props);

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

                    const dragRes = event?.dataTransfer?.files;
                    if (dragRes)
                    {
                        const file = dragRes[0];

                        if (['image/jpeg', 'image/png'].includes(file.type)) 
                        {
                            this._uploadFile(file);
                            this._previewFile(file);
                        }
                        else
                            alert('Неподдерживаемый формат изображения');
                    }
                }],
            ];
        }
        super({ props, bem });
    }
    setProps (nextProps: any): void 
    {
        if (InputImage._processAvatar(nextProps))
        {
            this.delBemMods([[ 'empty' ]]);
        }
        else
            this.addBemMods([[ 'empty' ]]);

        super.setProps(nextProps);
    }
    protected static _processAvatar (props : any) : Avatar | ''
    {
        let avatar : Avatar | '' = '';

        const {image} = props;
        if (image)
        {
            avatar = new Avatar({ 
                image, 
                size: 'large'
            });
            avatar.bemMix(['inputImage', 'image']);
        }   

        props.avatar = avatar;

        return avatar;
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
    protected _previewFile (file : File)
    {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => 
        {
            const image = reader.result;

            if (typeof image == 'string')
            {   
                let avatar = this.props.avatar;

                if (!avatar)
                {
                    avatar = new Avatar({ 
                        image,
                        size: 'large' 
                    });

                    this.delBemMods([ ['empty'] ]);

                    this.setProps({ avatar });
                }
                else
                    avatar.setProps({ image });
            }
        }                
    }
    protected get _input ()
    {
        // FIXME 
        this.processElems();
        
        const input = <unknown> this.elems['input'];
        return (input as HTMLInputElement);
    }
    protected _uploadFile (file : File)
    {
        // TODO
    }
    get value () 
    {
        // TODO 
        return '';
    }
    set value (value : string) 
    {
        // TODO 
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
