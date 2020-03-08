import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { IPolicy } from "../policy";
import { IAuthorizationResponse } from "../AuthorizationResponse";

export type IPDP = <U, R>(
    request: IAuthorizationRequest<U, R>,
    policies: IPolicy<U, R>[],
) => Promise<IAuthorizationResponse>;
