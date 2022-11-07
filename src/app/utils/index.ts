export function processUrl (url : string, relative : string) : string
{
    const urlData = new URL( url, relative );
    return urlData.pathname;
}
