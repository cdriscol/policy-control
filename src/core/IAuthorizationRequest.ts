import { AuthorizationActions } from "./AuthorizationActions";
import { ILoaderContext } from "./loader";

// represents the current authorization request (i.e. when someone calls authorize)
export interface IAuthorizationRequest<U, R> {
    // user who is making request
    user: U;
    // resource the user is trying to act on
    resource: R;
    // type of resource the user is trying to act on
    resourceType: number | string;
    // action the user is taking
    action: AuthorizationActions;
    // data from all the Loaders stored in this context
    context: ILoaderContext;
}
