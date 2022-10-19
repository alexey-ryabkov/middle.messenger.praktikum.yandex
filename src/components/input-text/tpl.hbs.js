export default `
<div class="inputText {{cssClass}}">
    <input type="{{type}}" class="inputText__input {{inputCssClass}}" name="{{name}}" placeholder="{{placeholder}}"{{#unless isAutocomplete}} autocomplete="off"{{/unless}} />
</div>
`.trim();