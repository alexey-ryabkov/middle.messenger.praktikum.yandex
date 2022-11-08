import Templator from '@models/templator';
import {BlockEvents} from '@models/block';
import {BemParams} from '@models/bem_block';
import FormFieldComponent, {FormFieldProps} from '@models/form_field';
import Avatar from '@lib-components/avatar';
import tpl from './tpl.hbs';
import './style.scss';
import { freezeEvent } from '@lib-utils-kit';

export type InputImageProps = FormFieldProps & {
    image? : string
};
export default class InputImage extends FormFieldComponent 
{
    constructor (props : InputImageProps) // , events : BlockEvents = []
    {
        //const {name} = props;
        const bem : BemParams = { name: 'inputImage', mods: {block: []}, events: {block: []} };

        props.avatar = InputImage._processAvatar(props);

        if (!props.avatar && bem?.mods?.block)
        {
            bem.mods.block.push(['empty']);
        }

        // let avatar : Avatar | '' = '';

        // if (image)
        // {
        //     avatar = new Avatar({ 
        //         image, 
        //         size: 'large'
        //     });
        //     avatar.bemMix(['inputImage', 'image']);
        // }
        // else if (bem?.mods?.block)
        // {
        //     bem.mods.block.push(['empty']);
        // }

        // function highlight () 
        // {
        //     // @todo как раз тут ситуация, когда нету удаления модификаци...
        //     // к setBemMods нужен delMods. bemClear это unmix... (стоит его так и назвать)
        //     this.element.classList.add('inputImage--active');
        // }
        // function unhighlight () 
        // {
        //     this.element.classList.remove('inputImage--active');
        // }

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

        // flag
        //     ? this.element.addCssCls('inputImage--active') 
        //     : this.element.delCssCls('inputImage--active');
    }
    protected _previewFile (file : File)
    {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        // let img : HTMLImageElement = this.elems['image'];

        reader.onloadend = () => 
        {
            const image = reader.result;

            if (typeof image == 'string')
            {   
                let avatar = this.props.avatar;

                if (!avatar)
                {
                    // img = document.createElement('img');
                    // img.className = 'avatar__image';

                    // const imgBox = document.createElement('div'); 
                    // imgBox.className = 'avatar avatar--size_large inputImage__imageBox';
                    // imgBox.append(img);
                    // this.element.prepend(imgBox);

                    avatar = new Avatar({ 
                        image,
                        size: 'large' 
                    });



                    // @todo запустить processElems
                    this.delBemMods([ ['empty'] ]);

                    this.setProps({ avatar });
                }
                else
                    avatar.setProps({ image });
            }
        }                
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
