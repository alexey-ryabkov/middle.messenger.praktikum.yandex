export default `
<{{captionTag}} class="caption__headline">{{caption}}</{{captionTag}}>
{{#if tagline}}
<span class="caption__tagline">{{tagline}}</span>
{{/if}}
`.trim();
