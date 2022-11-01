export default `
<span class="caption__headline" bem-element="headline">{{caption}}</span>
{{#if tagline}}
<span class="caption__tagline" bem-element="tagline">{{tagline}}</span>
{{/if}}
`.trim();
