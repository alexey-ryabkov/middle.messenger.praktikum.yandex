export default `
{{#each fields}}
<div class="form__fieldBox">
    <div class="form__fieldLabelWrap">
        <label class="form__fieldLabel">{{@key}}:</label>
    </div>
    {{{this}}}    
</div>
{{/each}}
<div class="form__buttonsBox">
    {{{button}}}
    {{#if link}}
    <a href="{{link.url}}" class="form__altSubmitLink link link--size_big">{{link.title}}</a>
    {{/if}}
</div>
`.trim();
