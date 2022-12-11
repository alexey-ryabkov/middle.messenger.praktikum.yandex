import {expect} from "chai";
import Http from "./http";

const DUMMY_API_HOST = 'https://dummyjson.com';

const http = new Http(DUMMY_API_HOST);

describe( 'HTTP transport', () => 
{
    it ('Expect http request return status 200', async () => expect( await http.get('/products') ).to.have.property( 'status' ).and.equal( 200 ));
});
