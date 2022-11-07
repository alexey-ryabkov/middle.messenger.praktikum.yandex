export enum MountType 
{
    append = 'append',
    prepend = 'prepend', 
    before = 'before', 
    after = 'after', 
    replaceWith = 'replaceWith'
}
export default function mount (subject : HTMLElement | string, node : HTMLElement | string | null, mountType : MountType = MountType.append)
{
    let nodeElement : Element = document.body;

    if (node instanceof HTMLElement)
    {
        nodeElement = node;
    } 
    else if (typeof node == 'string')
    {
        const element = document.querySelector(node);

        if (element)
        {
            nodeElement = element;
        }
    }

    if (subject instanceof HTMLElement)
    {
        nodeElement[mountType](subject);
    }
    else
        nodeElement.innerHTML = subject;
}
