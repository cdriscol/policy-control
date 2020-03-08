import { evaluateRule, or } from "../rule";
import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { PermissionResponse } from "../AuthorizationResponse";
import { IPolicyConfig } from "./IPolicyConfig";

export default async function evaluatePolicy<U, R>(
    config: IPolicyConfig<U, R>,
    request: IAuthorizationRequest<U, R>,
): Promise<PermissionResponse> {
    const ruleResponse = evaluateRule(or(config.rules), request);
    if (ruleResponse) {
        return PermissionResponse.Allow;
    } else if (ruleResponse === false) {
        return PermissionResponse.Deny;
    }
    return PermissionResponse.Indeterminate;
}
