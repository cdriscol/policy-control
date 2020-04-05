import { evaluateRule, or } from "../rule";
import { IDecisionRequest } from "../IDecisionRequest";
import { PermissionResponse } from "../AuthorizationDecision";
import { IPolicyConfig } from "./IPolicyConfig";
import logger from "../../logger";

// evaluate policy rules and return a permission response (Allow, Deny, Indeterminate)
export default async function evaluatePolicy<U, R>(
    policy: IPolicyConfig<U, R>,
    request: IDecisionRequest<U, R>,
): Promise<PermissionResponse> {
    logger.debug(`evaluatePolicy policy:${JSON.stringify(policy)}`);
    const ruleResponse = await evaluateRule(or(policy.rules), request);

    if (ruleResponse) {
        logger.debug(`evaluatePolicy result:${PermissionResponse.Allow}`);
        return PermissionResponse.Allow;
    } else if (ruleResponse === false) {
        logger.debug(`evaluatePolicy result:${PermissionResponse.Deny}`);
        return PermissionResponse.Deny;
    }

    logger.debug(`evaluatePolicy result:${PermissionResponse.Indeterminate}`);
    return PermissionResponse.Indeterminate;
}
