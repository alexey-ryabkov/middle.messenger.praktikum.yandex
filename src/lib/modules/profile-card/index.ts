import Templator from '@models/templator';
import ComponentBlock from '@models/component_block';
import {BemParams} from '@models/bem_block';
import {BlockProps} from '@models/block';
import Avatar from '@lib-components/avatar';
import Caption, {CaptionSize} from '@lib-components/caption';
import IconButton from '@lib-components/icon-button';
import Icon, {IconVar} from '@lib-components/icon';
import tpl from './tpl.hbs';
import './style.scss';

export type ProfileCardProps = BlockProps & 
{
    image : string,
    name : string
};
export default class ProfileCard extends ComponentBlock 
{
    constructor (props : ProfileCardProps)
    {
        const bem : BemParams = {name: 'profileCard'};
        
        const avatar = new Avatar({ 
            image: props.image, 
            size: 'small'
        });
        const caption = new Caption({ 
            caption: props.name,
            size: CaptionSize.h2, 
            weight: 'Regular'  
        });
        const button = new IconButton({ 
            icon: new Icon({ variant: IconVar.circle_dots }), 
            size: 'regular' 
        });

        avatar.bemMix(['profileCard', 'avatar']);
        caption.bemMix(['profileCard', 'name']); 
        button.bemMix(['profileCard', 'button']);

        super({props: {avatar, caption, button}, bem});
    }
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
