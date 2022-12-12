export default `
{{#if author}}
<div class="text icontainer__header message__author">{{author}}:</div>
{{/if}}
<div class="text icontainer__content message__content">{{{msg}}}</div>
<div class="icontainer__footer message__time">{{datetime}}</div>
<!-- {{#if time}}{{time}}{{else}}{{datetime}}{{/if}} -->
`.trim();
