import { IPolicy, filterPolicies } from "./xacml/policy";
import { AuthorizationActions } from "./xacml/AuthorizationActions";
import { IPDP, denyOverGrantPDP } from "./xacml/pdp";
import { IAuthorizationResponse } from "./xacml/AuthorizationResponse";
import { IAuthorizationRequest } from "./xacml/IAuthorizationRequest";
import { PIPContext } from "./xacml/pip";
import { MissingAuthorizeDataError } from "./xacml/errors/missingAuthorizeDataError";

export type IResourceType = string | number;
export interface IPolicyControlOptions<U, R> {
    policies: IPolicy<U, R>[];
    user: U;
    resource: R;
    resourceType: IResourceType;
    action: AuthorizationActions;
    pdp: IPDP;
}

export interface IPolicyControl<U, R> {
    user(user: U): this;
    resource(resource: R): this;
    policies(policies: IPolicy<U, R>[]): this;
    pdp(pdp: IPDP): this;
    action(action: AuthorizationActions): this;
    resourceType(resourceType: IResourceType): this;
    authorize(): Promise<IAuthorizationResponse>;
}

export default class PolicyControl<U, R> implements IPolicyControl<U, R> {
    private _policies: IPolicy<U, R>[];
    private _user: U | undefined;
    private _resource: R | undefined;
    private _resourceType: IResourceType | undefined;
    private _action: AuthorizationActions | undefined;
    private _pdp: IPDP;

    constructor(options: Partial<IPolicyControlOptions<U, R>> = {}) {
        this._policies = options.policies || [];
        this._user = options.user;
        this._resource = options.resource;
        this._resourceType = options.resourceType;
        this._action = options.action;
        this._pdp = options.pdp || denyOverGrantPDP;
    }

    public policies(policies: IPolicy<U, R>[]) {
        this._policies = policies;
        return this;
    }

    public user(user: U) {
        this._user = user;
        return this;
    }

    public action(action: AuthorizationActions) {
        this._action = action;
        return this;
    }

    public resource(resource: R) {
        this._resource = resource;
        return this;
    }

    public pdp(pdp: IPDP) {
        this._pdp = pdp;
        return this;
    }

    public resourceType(resourceType: IResourceType) {
        this._resourceType = resourceType;
        return this;
    }

    public authorize(): Promise<IAuthorizationResponse> {
        this.validate();

        // this ugly check is required for TS to be happy
        if (!this._user || !this._resource || !this._action || !this._resourceType) {
            throw new Error();
        }

        const request: IAuthorizationRequest<U, R> = {
            user: this._user,
            resource: this._resource,
            resourceType: this._resourceType,
            context: new PIPContext(this._user, this._resource),
            action: this._action,
        };

        const filteredPolicies = filterPolicies(this._policies, request.resourceType, request.action);
        return this._pdp(request, filteredPolicies);
    }

    private validate(): void {
        const missingFields: string[] = [];
        if (this._policies) missingFields.push("policies");
        if (this._user) missingFields.push("user");
        if (this._resource) missingFields.push("resource");
        if (this._resourceType) missingFields.push("resourceType");
        if (this._action) missingFields.push("action");

        if (missingFields.length) {
            throw new MissingAuthorizeDataError(missingFields);
        }
    }
}
