import { IPolicyConfig } from "./policy";
import { IAuthorizationRequest } from "./IAuthorizationRequest";
import { IAuthorizationResponse } from "./AuthorizationResponse";

export type IDecider = <U, R>(
    policies: IPolicyConfig<U, R>[],
    request: IAuthorizationRequest<U, R>,
) => Promise<IAuthorizationResponse>;
