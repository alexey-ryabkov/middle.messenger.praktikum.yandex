export default `
{{#if isLink}}
<a href="{{href}}" class="button {{cssClass}}">{{label}}</a>
{{else}}
<button name="{{name}}" class="button {{cssClass}}">{{label}}</button>
{{/if}}
`.trim();
