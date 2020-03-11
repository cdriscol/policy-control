import { ILoaderConfig } from "../loader";
import { IDecisionRequest } from "../IDecisionRequest";

export interface IRuleConfig<U, R> {
    // name of rule, mostly used for debugging
    name: string;
    // loaders needed before rule can be evaluated
    loaders?: ILoaderConfig<U, R>[];
    // evaluate rule returning TRUE if rule passes, FALSE if rule fails, or null/undefined if rule cannot determine a result
    evaluate(R: IDecisionRequest<U, R>): Promise<boolean | undefined | null>;
}
