import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BemParams} from '@core/block/bem';
import {BlockProps} from '@core/block';
import Avatar from '@lib-components/avatar';
import Caption, {CaptionSize, CaptionWeight} from '@lib-components/caption';
import DropdownMenu from '@lib-modules/dropdown_menu';
import tpl from './tpl.hbs';
import './style.scss';

export type ProfileCardProps = BlockProps & 
{
    image? : string,
    name : string,
    menu : DropdownMenu
};
export default class ProfileCard extends ComponentBlock 
{
    constructor (props : ProfileCardProps)
    {   
        const {avatar, caption, menu} = ProfileCard._prepareProps(props);

        if (menu)
        {
            menu.bemMix(['profileCard', 'dropdownMenu']);
        }
        super({ avatar, caption, menu });
    }    
    setProps (nextProps: Partial< ProfileCardProps >)
    {
        ProfileCard._prepareProps(nextProps);
        super.setProps(nextProps);  
    }  
    protected static _prepareProps (props : Partial< ProfileCardProps >)
    {
        if ('image' in props)
        {
            props.avatar = new Avatar({ 
                image: props.image, 
                size: 'small'
            });
            props.avatar.bemMix(['profileCard', 'avatar']);            
        }
        if ('name' in props)
        {
            if (props.name)
            {
                props.caption = new Caption({ 
                    caption: props.name,
                    size: CaptionSize.h2, 
                    weight: CaptionWeight.Regular
                });
                props.caption.bemMix(['profileCard', 'name']); 
            }
            else
                props.caption = '';
        }
        return props;
    } 
    protected _prepareBemParams ()
    {
        const bem : BemParams = {name: 'profileCard'};
        return bem;
    }    
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
