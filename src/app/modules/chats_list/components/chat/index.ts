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

const template = new Templator(tpl);

export type ProfileCardProps = BlockProps & 
{
    image : string,
    name : string,
    datetime : string,
    msg? : string,
    tag? : 'string'
};
export default class ProfileCard extends ComponentBlock 
{
    constructor (props : ProfileCardProps)
    {
        const bem : BemParams = { name: 'chat', mix: { block: [['icontainer', [['bg', 'grayLight'], ['size', 'small'], ['dropshadow']] ]] }};

        const avatar = new Avatar({ 
            image: props.image, 
            size: 'regular'
        });
        const caption = new Caption({ 
            caption: props.name,
            size: CaptionSize.h3, 
            weight: 'Regular'  
        });
        const button = new IconButton({ 
            icon: new Icon({ variant: IconVar.circle_dots }), 
            size: 'regular' 
        });

        avatar.bemMix([ 'chat', 'avatar' ]);
        caption.bemMix(['chat', 'name']); 
        button.bemMix(['profileCard', 'button']);

        super({props, bem});
    }
    protected get _template () 
    {
        return template;
    }
}
// <li class="icontainer icontainer--bg_grayLight  icontainer--dropshadow icontainer--size_small chat chat--active _chats__listItem">
//     <div class="icontainer__content chat__wrapper">
//         <div class="avatar avatar--size_regular chat__avatar">
//             <img class="avatar__image" src="images/hatt.jpg " alt="Джабба Хатт avatar" />
//         </div>
//         <div class="chat__header">
//             <div class="caption chat__title">
//                 <h3 class="caption__headline caption__headline--size_h3 caption__headline--weight_Regular">Джабба Хатт</h3>
//             </div>
//             <div class="chat__datetime">5м назад</div>
//         </div>
//         <div class="chat__msg">
//             <div class="text chat__msgContent">Твоя сила внушения не действует на меня, мальчишка</div>
//         </div> 
//     </div>                                        
// </li>
