import { AuthorizationActions } from "./AuthorizationActions";
import { IPIPContext } from "./rule/pip";

export interface IAuthorizationRequest<U, R> {
    user: U;
    resource: R;
    action: AuthorizationActions;
    resourceType: number | string;
    context: IPIPContext<U, R>;
}
