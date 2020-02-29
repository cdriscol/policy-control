import { AuthorizationActions } from "./authorization-actions";

export interface IAuthorizationRequest<U, R, C = {}> {
    user: U;
    resource: R;
    context: C;
    action: AuthorizationActions;
    // TODO: get resourceType from a more common spot (generic?)
    resourceType: number | string;
}
