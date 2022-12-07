export default `
{{#if chats}}
<ul class="_chats__list">
    {{#each chats}}
        {{{this}}}
    {{/each}}                       
</ul>
{{else}}
<div class="_chats__list">
    <div class="text _chats__noChatsMsg">
    У вас пока нет чатов. Добавьте их, используя кнопку &laquo;&plus;&raquo; ниже.  
    </div>
</div>
{{/if}}        
{{{loader}}}
<div class="_chats__panel">
    {{{search}}}
    {{{buttonAdd}}}
</div>
`.trim();
