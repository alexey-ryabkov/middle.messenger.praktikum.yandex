export default `
<div class="_chats">
    <ul class="_chats__list">
        {{#each chats}}
            {{{this}}}
        {{/each}}                       
    </ul> 
    <div class="_chats__panel">
        {{{search}}}
        {{{buttonAdd}}}
    </div>    
</div>
`.trim();
