export default `
{{{field}}}
{{#if notification}}
<div class="form__fieldNotification notification notification--lvl_error">
    {{{notification.icon}}}
    <span class="notification__text">{{notification.text}}</span>
</div>
{{/if }}
`.trim();
