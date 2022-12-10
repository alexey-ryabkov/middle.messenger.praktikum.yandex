import {expect} from "chai";
import {Routable} from "./types";
import Router from "./router";

function createDummyPage (pagePathname : string) : Routable
{
   return {
        get title ()
        {
            return '';
        },
        isPathnameMatch (pathname : string)
        {
            return pathname == pagePathname;
        },
        mount ()
        {
            return this;
        },
        unmount ()
        {
            return;
        },
    }
}
describe( 'Router', () => 
{
    it ('Expect history length has correct value after pages navs', () => 
    {
        const router = new Router();

        const firstPageUrl = '/some-page';
        const secondPageUrl = '/another-page';

        router.use( createDummyPage( firstPageUrl ));
        router.use( createDummyPage( secondPageUrl ));

        router.go( firstPageUrl );
        router.back();
        router.forward();
        router.go( secondPageUrl );

        expect( window.history.length ).to.eq( 3 );
    });
});
