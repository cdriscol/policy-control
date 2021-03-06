import { IRuleConfig } from "../rule";

export interface IPolicyConfig<U, R> {
    // name of the policy, mostly used for debugging right now
    name: string;
    // resourceTypes supported by this policy
    resources: Array<number | string>;
    // actionTypes supported by this policy
    actions: Array<number | string>;
    // rules that will evaluate this policy
    rules: IRuleConfig<U, R>[];
    // priority the policy will be evaluated in (default is 100)
    priority?: number;
}
