import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BemParams} from '@core/block/bem';
import {BlockEvents, BlockProps} from '@core/block';
import Avatar from '@lib-components/avatar';
import Caption, {CaptionSize, CaptionWeight} from '@lib-components/caption';
import IconButton from '@lib-components/icon_button';
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
    constructor (props : ProfileCardProps, btnEvents? : BlockEvents)
    {
        const avatar = new Avatar({ 
            image: props.image, 
            size: 'small'
        });
        const caption = new Caption({ 
            caption: props.name,
            size: CaptionSize.h2, 
            weight: CaptionWeight.Regular
        });
        const button = new IconButton({ 
            icon: new Icon({ variant: IconVar.circle_dots }), 
            size: 'regular',
            importance: 'primary' 

        }, btnEvents);

        avatar.bemMix(['profileCard', 'avatar']);
        caption.bemMix(['profileCard', 'name']); 
        button.bemMix(['profileCard', 'button']);

        super({avatar, caption, button});
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
