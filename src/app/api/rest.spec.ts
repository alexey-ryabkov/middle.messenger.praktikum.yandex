import {expect} from "chai";
import RestApi from "./rest";

const DUMMY_API_HOST = 'https://dummyjson.com';
const DUMMY_API_PATH = `/products`;

const restApi = new RestApi( DUMMY_API_PATH, 
    {
        credentials: false
    }, 
    DUMMY_API_HOST);

describe( 'RestApi', () => 
{
    it ('Expect recieve items by get method', async () =>  
    {
        return expect( await restApi.get() ).to.have.property( 'products' ).and.to.be.an( 'array' );
    });
    it ('Expect add item by post method', async () =>  
    {
        return expect( await restApi.post('/add', { title: 'Mock product' }) ).to.have.property( 'id' );
    });
    it ('Expect update item by put method', async () =>  
    {
        return expect( await restApi.put('/1', { title: 'Mock product' }) ).to.have.property( 'title' ).and.equal( 'Mock product' );
    });
    it ('Expect delete item by delete method', async () =>  
    {
        return expect( await restApi.delete('/1') ).to.have.property( 'id' ).and.equal( 1 );
    });
});
