import { evaluateRule, or, IRuleConfig } from "../rule";
import { AuthorizationActions } from "../AuthorizationActions";
import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { PermissionResponse } from "../AuthorizationResponse";

export interface IPolicyConfig<U, R> {
    resourceTypes: Array<number | string>;
    actionTypes: AuthorizationActions[];
    rules: IRuleConfig<U, R>[];
    priority?: number;
}

export interface IPolicy<U, R> {
    resourceTypes: Array<number | string>;
    actionTypes: AuthorizationActions[];
    rules: IRuleConfig<U, R>[];
    evaluate(request: IAuthorizationRequest<U, R>): Promise<PermissionResponse>;
    priority: number;
}

export default class Policy<U, R> implements IPolicy<U, R> {
    public resourceTypes: Array<number | string>;
    public actionTypes: AuthorizationActions[];
    public rules: IRuleConfig<U, R>[];
    public priority: number;

    constructor(policyConfig: IPolicyConfig<U, R>) {
        this.resourceTypes = policyConfig.resourceTypes;
        this.actionTypes = policyConfig.actionTypes;
        this.rules = policyConfig.rules;
        this.priority = policyConfig.priority || 100;
    }

    public async evaluate(request: IAuthorizationRequest<U, R>): Promise<PermissionResponse> {
        const ruleResponse = evaluateRule(or(this.rules), request);
        if (ruleResponse) {
            return PermissionResponse.Allow;
        } else if (ruleResponse === false) {
            return PermissionResponse.Deny;
        }
        return PermissionResponse.Indeterminate;
    }
}
