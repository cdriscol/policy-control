import { IPIPConfig } from "../pip";
import { IAuthorizationRequest } from "../IAuthorizationRequest";

export interface IRuleConfig<U, R> {
    // name of rule, mostly used for debugging
    name: string;
    // pips needed before rule can be evaluated
    pips?: IPIPConfig<U, R>[];
    // evaluate rule returning TRUE if rule passes, FALSE if rule fails, or null/undefined if rule cannot determine a result
    evaluate(R: IAuthorizationRequest<U, R>): Promise<boolean | undefined | null>;
}
