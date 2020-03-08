import { AuthorizationActions } from "../AuthorizationActions";
import { IPolicyConfig } from "./IPolicyConfig";
import logger from "../../logger";

function policyMatchFilter<U, R>(resourceType: number | string, actionType: AuthorizationActions) {
    return (policy: IPolicyConfig<U, R>): boolean => {
        logger.debug(`filterPolicies.policyMatchFilter policy:${JSON.stringify(policy)}`);
        const matchesAction = policy.actionTypes.some(at => at === actionType);
        const matchesResourceType = policy.resourceTypes.some(rt => rt === resourceType);
        const isMatch = matchesAction && matchesResourceType;
        logger.debug(`filterPolicies.policyMatchFilter result:${isMatch}`);
        return isMatch;
    };
}

export default function filterPolicies<U, R>(
    policies: IPolicyConfig<U, R>[],
    resourceType: string | number,
    action: AuthorizationActions,
): IPolicyConfig<U, R>[] {
    logger.debug(`filterPolicies action:${action} resourceType:${resourceType}`);
    logger.debug(`filteredPolicies incoming policies:${JSON.stringify(policies.map(p => p.name))}`);
    const filteredPolicies = policies.filter(policyMatchFilter(resourceType, action));
    logger.debug(`filteredPolicies filtered policies:${JSON.stringify(filteredPolicies.map(p => p.name))}`);
    return filteredPolicies;
}
