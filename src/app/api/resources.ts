import {FileApi} from "@entities/types";
import {restResourcesApi} from "./rest";

class ResourcesApi implements FileApi
{
    get (file : string)
    {
        return restResourcesApi.baseUrl + file;
    }
    upload (file : FormData)
    {
        return restResourcesApi.post('', file) 
            .then(() => 
            {
                // TODO
            }); 
    }
}
const resourcesApi = new ResourcesApi();

export default resourcesApi;
