import { IPolicyConfig } from "./policy";
import { IDecisionRequest } from "./IDecisionRequest";
import { IDecisionResponse } from "./DecisionResponse";

// evaluate policies and come up with a decision response
export type IDecider = <U, R>(
    policies: IPolicyConfig<U, R>[],
    request: IDecisionRequest<U, R>,
) => Promise<IDecisionResponse>;
