import SurChat from '@app';
import Templator from '@core/templator';
import Page, {PageAccess} from '@core/page';
import ArticleLayout from '@lib-layouts/article';
import articleTpl from './article.hbs';
import './style.scss';

const blockName = '_pageGame';
const pageName = 'Концепт игры Doofus Rick';
const layout = new ArticleLayout( SurChat.instance, {title: pageName} );

const page = new class extends Page
{
    protected _processPageLayout ()
    {
        super._processPageLayout();

        // const mazePicture = new URL(
        //     '../../../../static/images/maze.jpg',
        //     import.meta.url
        // ).pathname;

        const doofusPicture = new URL(
            '../../../../static/images/doofus_rick.gif',
            import.meta.url
        ).pathname;

        this._layout.areas = {article: new Templator( articleTpl ).compile(
            {
                // mazePicture,
                doofusPicture,
                backLink: {
                    url: Page.url( 'messenger' ),
                    title: 'к чатам'
                }
            })};
        this._layout.elemBemMix( 'content', [blockName, 'content'] ); 
    }
    protected get _layout () 
    {
        return layout;
    }
} ('game', pageName, blockName, PageAccess.authorized);

export default page;
