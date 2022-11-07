export default `
<ul class="_chats__list">
    {{#each chats}}
        {{{this}}}
    {{/each}}                       
</ul> 
<div class="_chats__panel">
    {{{search}}}
    {{{buttonAdd}}}
</div>
`.trim();
