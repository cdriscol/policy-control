import { IPolicyConfig } from "./policy";
import { IDecisionRequest } from "./IDecisionRequest";
import { IAuthorizationDecision } from "./AuthorizationDecision";

// evaluate policies and come up with a decision response
export type IDecider = <U, R>(
    policies: IPolicyConfig<U, R>[],
    request: IDecisionRequest<U, R>,
) => Promise<IAuthorizationDecision>;
