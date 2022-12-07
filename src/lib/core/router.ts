import {Routable, Nullable} from "@core/types";

export default class Router 
{
    protected _history : History;
    protected _routes : Set< Routable >;
    protected _currentRoute : Nullable< Routable >;

    constructor () 
    {
        this._history = window.history;
        this._routes = new Set();
        this._currentRoute = null;
    }
    get curPathname ()
    {
        return location.pathname;
    }
    get routes ()
    {
        return this._routes;
    }
    get currentRoute ()
    {
        return this._currentRoute;
    }
    getRoute (pathname : string) 
    {
        return [...this.routes].find( route => route.isPathnameMatch(pathname) ) ?? null;
    }
    use (route : Routable) 
    {
        this._routes.add(route);
        return this;
    }
    start () 
    {
        window.onpopstate = ( (event : PopStateEvent) => 
        {
            let pathname = event.state?.url;
            if (!pathname)
            {
                pathname = (event.currentTarget as Window).location.pathname;
            }
            this._onRoute(pathname);
        })
        .bind(this);

        return this._onRoute(this.curPathname);
    }    
    go (pathname: string, state : object = {}) 
    {
        const route = this._onRoute(pathname);
        if (route)
        {
            this._history.pushState(state, '', pathname);
        }
        return route;
    }
    back () 
    {
        this._history.back();
    }
    forward() 
    {
        this._history.forward();
    }
    protected _onRoute (pathname : string) 
    {
        const route = this.getRoute(pathname);

        if (!route) 
        {
            return null;
        }
        if (this._currentRoute) 
        {
            this._currentRoute.unmount();
        }
        return (this._currentRoute = route).mount();
    }
}
