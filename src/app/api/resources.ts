import {FileApi} from "@models/types";
import {restResourcesApi} from "./rest";

class ResourcesApi implements FileApi
{
    get (file : string)
    {
        return restResourcesApi.API_BASE_URL + file;
    }
    upload (file : FormData)
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
