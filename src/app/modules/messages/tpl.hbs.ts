export default `
<ul class="_messages__box">
    <li class="_messages__dayGroup">
        <div class="_messages__day">{{messagesDay}}</div>    
        <ul class="_messages__list">
            {{#each messages}}
                {{{this}}}
            {{/each}}
        </ul>
    </li>
</ul>
<div class="_messages__sendMessage _sendMessage">
    {{{inputSend}}}
    {{{buttonSend}}}
    {{{buttonAttach}}}
</div>    
`.trim();
