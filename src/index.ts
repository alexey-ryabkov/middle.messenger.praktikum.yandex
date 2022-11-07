import go2page, {renderCurPage} from '@app-utils/dummy_routing';

renderCurPage();

document.body.addEventListener('click', event =>
{
    const element = event.target as Element;

    if ('A' == element.tagName) 
    {
        event.preventDefault();

        const href = element.getAttribute('href');
        if (href)
        {
            go2page(href);
        }        
    }
});
