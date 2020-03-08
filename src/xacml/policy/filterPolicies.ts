import { AuthorizationActions } from "../AuthorizationActions";
import { IPolicyConfig } from "./IPolicyConfig";

function policyMatchFilter<U, R>(resourceType: number | string, actionType: AuthorizationActions) {
    return (policy: IPolicyConfig<U, R>): boolean =>
        policy.actionTypes.some(at => at === actionType) && policy.resourceTypes.some(rt => rt === resourceType);
}

export default function filterPolicies<U, R>(
    policies: IPolicyConfig<U, R>[],
    resourceType: string | number,
    action: AuthorizationActions,
): IPolicyConfig<U, R>[] {
    return policies.filter(policyMatchFilter(resourceType, action));
}
