export default `
<{{tag}} class="caption {{cssClass}}">
    <span class="caption__headline {{headlineCssClass}}">{{caption}}</span>
    {{#if taglineText}}
    <span class="caption__tagline {{taglineCssClass}}">{{taglineText}}</span>
    {{/if}}
</{{tag}}>
`.trim();
