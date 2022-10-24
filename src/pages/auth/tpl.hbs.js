export default `
{{#each fields}}
<div class="form__fieldBox">
    <div class="form__fieldLabelWrap">
        <label class="form__fieldLabel">{{@key}}:</label>
    </div>
    <div class="form__fieldWrap">
        {{> input-text this}}
    </div>
</div>
{{/each}}
<div class="form__buttonsBox">
    <!-- Пока кнопка сделана ссылкой для навигации -->
    {{> button button}}
    <a href="{{regPageUrl}}" class="form__altSubmitLink link link--size_big">создать аккаунт</a>
</div>
`.trim();
