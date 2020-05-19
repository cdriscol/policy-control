import { ILoaderStore } from "./loader";

export interface IDecisionContext {
    store: ILoaderStore;
}

// represents the current decision request (i.e. when someone calls decide)
export interface IDecisionRequest<U, R, C extends IDecisionContext = IDecisionContext> {
    // user who is making request
    user: U;
    // resource the user is trying to act on
    resource: R;
    // type of resource the user is trying to act on
    resourceType: number | string;
    // action the user is taking
    action: number | string;
    // data from all the Loaders stored in this context
    context: C;
}
