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
    menu? : DropdownMenu
};
export default class ProfileCard extends ComponentBlock 
{
    constructor (props : ProfileCardProps)
    {   
        super( ProfileCard._prepareProps(props) );
        this._processAvatarProps();
    }    
    setProps (nextProps: Partial< ProfileCardProps >)
    {
        super.setProps( ProfileCard._prepareProps(nextProps) );  
        this._processAvatarProps();
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
        if (props.menu)
        {
            props.menu.bemMix(['profileCard', 'dropdownMenu']);        
        }
        return props;
    } 
    protected _processAvatarProps ()
    {
        if (this.props.avatar)
        {
            const alt = `Аватар ${this.props.name || 'профиля'} `;
            this.props.avatar.setProps({ alt });
        }
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
