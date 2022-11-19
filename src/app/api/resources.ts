import {restResourcesApi} from "./rest";

class ResourcesApi
{
    static upload (file : FormData)
    {
        return restResourcesApi.post('', file) 
            .then(res => 
            {
                console.log(res);
            }); 
    }
}
const resourcesApi = window.resourcesApi = new ResourcesApi();

export default resourcesApi;
