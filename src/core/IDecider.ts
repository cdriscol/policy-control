import { IPolicyConfig } from "./policy";
import { IAuthorizationRequest } from "./IAuthorizationRequest";
import { IAuthorizationResponse } from "./AuthorizationResponse";

// evaluate policies and come up with a authorization response
export type IDecider = <U, R>(
    policies: IPolicyConfig<U, R>[],
    request: IAuthorizationRequest<U, R>,
) => Promise<IAuthorizationResponse>;
