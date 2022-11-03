export enum MountType 
{
    append = 'append',
    prepend = 'prepend', 
    before = 'before', 
    after = 'after', 
    replaceWith = 'replaceWith'
}
export default function mount (subject : HTMLElement | string, node : Element | string | null, mountType : MountType = MountType.append)
{
    // TODO тут же нужно вызывать dispatch...

    if (!(node instanceof Element))
    {
        node = document.querySelector(node);
    }    
    if (!node)
    {
        node = document.body;
    }
    if (subject instanceof HTMLElement)
    {
        node[mountType](subject);
    }
    else
        node.innerHTML = subject;
}
