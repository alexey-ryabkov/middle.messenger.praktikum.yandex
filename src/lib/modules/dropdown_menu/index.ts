import Templator from '@core/templator';
import ComponentBlock from '@core/block/component';
import {BemParams} from '@core/block/bem';
import {BlockProps, HTMLElementExt} from '@core/block';
import IconButton from '@lib-components/icon_button';
import DropdownMenuOption, {DropdownMenuOptionProps} from './components/option';
import tpl from './tpl.hbs';
import './style.scss';

interface DropdownMenuElement extends HTMLElementExt
{
    component : DropdownMenu
}
export type DropdownMenuPosition = [ 'top' | 'bottom', 'Left' | 'Right' ];
export type DropdownMenuProps = BlockProps & 
{
    options : DropdownMenuOptionProps[],    
    button : IconButton,
    position? : DropdownMenuPosition,
};
export {DropdownMenuOptionProps};

export default class DropdownMenu extends ComponentBlock 
{
    static readonly TOP_INDENT = 1;
    static readonly BOTTOM_INDENT = 36;

    protected _isActive = false;
    protected _position : DropdownMenuPosition;

    constructor (props : DropdownMenuProps)
    {
        const {options: optionProps, button, position = [ 'top', 'Left' ]} = props;
        const options = optionProps.map( optProps => new DropdownMenuOption(optProps) );

        button.bemMix([ 'dropdownMenu', 'button' ]);

        super({ options, button }, ['click', event =>
        {
            event.stopPropagation();

            if (event.target && (event.target as HTMLElement).closest('.dropdownMenu__button'))
            {
                event.preventDefault();

                this.toggleMenu();

                document.querySelectorAll('.dropdownMenu').forEach(menuEl =>
                {
                    if (menuEl !== this.element)
                    {
                        const otherMenu = (menuEl as DropdownMenuElement).component;
                        otherMenu.hideMenu();
                    }
                });
            }
        }]);
        document.body.addEventListener( 'click', () => this.hideMenu() );

        Object.assign(this.element, {component: this});

        this._position = position;
    }
    toggleMenu (flag? : boolean)
    {
        if (undefined === flag)
        {
            flag = !this._isActive;
        }
        if (flag !== this._isActive)
        {
            flag   
                ? this.showMenu()
                : this.hideMenu();

            this._isActive = flag;
        }                    
    }
    showMenu () 
    {
        if (!this._isActive)
        {
            this.element.classList.add('dropdownMenu--active');

            let [vertPos] = this._position;   
            const [,horizPos] = this._position;     

            this.clearPosition();

            const menu = this.element.querySelector('.dropdownMenu__menu') as HTMLElement;

            const viewportHeight = document.documentElement.clientHeight;
            const menuRect = menu.getBoundingClientRect();

            const topPosCoord = DropdownMenu.TOP_INDENT;
            const bottomPosCoord = menuRect.height + DropdownMenu.BOTTOM_INDENT;
            
            if ('top' == vertPos)
            {
                const bottomCoord = menuRect.y + menuRect.height;
                if (bottomCoord >= viewportHeight)
                {
                    vertPos = 'bottom';

                    menu.style.top = `-${bottomPosCoord}px`;
                }
                else
                    menu.style.top = `${topPosCoord}px`;
            }
            else
            {
                const topCoord = menuRect.y - (bottomPosCoord);
                if (topCoord <= 0)
                {
                    vertPos = 'top';

                    menu.style.top = `${topPosCoord}px`;
                }
                else
                    menu.style.top = `-${bottomPosCoord}px`;
            }

            this.element.classList.add(`dropdownMenu--pos_${vertPos}${horizPos}`);
            this._isActive = true;
        }
    }
    hideMenu () 
    {
        if (this._isActive)
        {
            this.element.classList.remove('dropdownMenu--active');
            this._isActive = false;			
        }
    }
    clearPosition ()
    {
        const menu = this.element.querySelector('.dropdownMenu__menu') as HTMLElement;

        menu.style.top = '0';
        this.element.classList.remove('dropdownMenu--pos_topLeft');
        this.element.classList.remove('dropdownMenu--pos_topRight');
        this.element.classList.remove('dropdownMenu--pos_bottomLeft');
        this.element.classList.remove('dropdownMenu--pos_bottomRight');
    }
    protected _prepareBemParams ()
    {
        const bem : BemParams = {name: 'dropdownMenu'};
        return bem;
    }    
    protected get _template () 
    {
        return new Templator(tpl);
    }
}
