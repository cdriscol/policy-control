import { IRuleConfig } from "../rule";
import { AuthorizationActions } from "../AuthorizationActions";

export interface IPolicyConfig<U, R> {
    // name of the policy, mostly used for debugging right now
    name: string;
    // resourceTypes supported by this policy
    resourceTypes: Array<number | string>;
    // actionTypes supported by this policy
    actionTypes: AuthorizationActions[];
    // rules that will evaluate this policy
    rules: IRuleConfig<U, R>[];
    // priority the policy will be evaluated in (default is 100)
    priority?: number;
}