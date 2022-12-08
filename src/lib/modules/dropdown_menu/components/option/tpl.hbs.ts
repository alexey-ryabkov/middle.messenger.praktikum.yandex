export default `                                                   
<a href="{{#if url}}{{url}}{{/if}}" class="link dropdownMenu__menuOptLink">
    {{#if icon}}{{{icon}}}{{/if}}
    <span class="dropdownMenu__menuOptTitle">{{title}}</span>
</a>
`.trim();
