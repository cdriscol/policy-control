import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { IPolicyConfig } from "../policy";
import { IAuthorizationResponse } from "../AuthorizationResponse";

export type IPDP = <U, R>(
    request: IAuthorizationRequest<U, R>,
    policies: IPolicyConfig<U, R>[],
) => Promise<IAuthorizationResponse>;
