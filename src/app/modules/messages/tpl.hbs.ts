export default `
{{#if messages}}
<ul class="_messages__box">
    <li class="_messages__dayGroup">
        <!--<div class="_messages__day">{{messagesDay}}</div>-->    
        <ul class="_messages__list">
            {{#each messages}}
                {{{this}}}
            {{/each}}
        </ul>
    </li>
</ul>   
{{else}}
<div class="_messages__box">
    <div class="text _messages__emptyMsg">
    Выберите чат, чтобы отправить сообщение.
    </div>
</div>
{{/if}} 
{{{loader}}}
<div class="_messages__sendMessage _sendMessage">
    {{{inputSend}}}
    {{{buttonSend}}}
    {{{buttonAttach}}}
</div> 
`.trim();
