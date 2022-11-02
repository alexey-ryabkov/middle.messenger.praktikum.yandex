export default `
<{{captionTag}} class="caption__headline" bem-element="headline">{{caption}}</{{captionTag}}>
{{#if tagline}}
<span class="caption__tagline" bem-element="tagline">{{tagline}}</span>
{{/if}}
`.trim();
