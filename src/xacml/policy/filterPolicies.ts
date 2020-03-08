import { AuthorizationActions } from "../AuthorizationActions";
import { IPolicy } from "./Policy";

function policyMatchFilter<U, R>(resourceType: number | string, actionType: AuthorizationActions) {
    return (policy: IPolicy<U, R>): boolean =>
        policy.actionTypes.some(at => at === actionType) && policy.resourceTypes.some(rt => rt === resourceType);
}

export default function filterPolicies<U, R>(
    policies: IPolicy<U, R>[],
    resourceType: string | number,
    action: AuthorizationActions,
): IPolicy<U, R>[] {
    return policies.filter(policyMatchFilter(resourceType, action));
}
