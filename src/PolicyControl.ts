import { filterPolicies, IPolicyConfig } from "./xacml/policy";
import { AuthorizationActions } from "./xacml/AuthorizationActions";
import { IPDP, denyOverGrantPDP } from "./xacml/pdp";
import { IAuthorizationResponse } from "./xacml/AuthorizationResponse";
import { IAuthorizationRequest } from "./xacml/IAuthorizationRequest";
import { PIPContext } from "./xacml/pip";
import { MissingAuthorizeDataError } from "./xacml/errors/missingAuthorizeDataError";

export type IResourceType = string | number;
export interface IPolicyControlOptions<U, R> {
    policies: IPolicyConfig<U, R>[];
    user: U;
    resource: R;
    resourceType: IResourceType;
    action: AuthorizationActions;
    pdp: IPDP;
}

export interface IPolicyControl<U, R> {
    user(user: U): this;
    resource(resource: R): this;
    policies(policies: IPolicyConfig<U, R>[]): this;
    pdp(pdp: IPDP): this;
    action(action: AuthorizationActions): this;
    resourceType(resourceType: IResourceType): this;
    authorize(): Promise<IAuthorizationResponse>;
}

export default class PolicyControl<U, R> implements IPolicyControl<U, R> {
    private _policies: IPolicyConfig<U, R>[];
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

    public policies(policies: IPolicyConfig<U, R>[]) {
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

    public authorize(options: Partial<IPolicyControlOptions<U, R>> = {}): Promise<IAuthorizationResponse> {
        this.validate(options);

        const policies = options.policies || this._policies;
        const user = options.user || this._user;
        const resource = options.resource || this._resource;
        const resourceType = options.resourceType || this._resourceType;
        const action = options.action || this._action;
        const pdp = options.pdp || this._pdp;

        // this ugly check is required for TS to be happy
        if (!user || !resource || !action || !resourceType) {
            throw new Error();
        }

        const request: IAuthorizationRequest<U, R> = {
            user,
            resource,
            resourceType,
            action,
            context: new PIPContext(user, resource),
        };

        return pdp(request, filterPolicies(policies, resourceType, action));
    }

    private validate(options: Partial<IPolicyControlOptions<U, R>> = {}): void {
        const missingFields: string[] = [];
        if (!(options.policies || this._policies)) missingFields.push("policies");
        if (!(options.user || this._user)) missingFields.push("user");
        if (!(options.resource || this._resource)) missingFields.push("resource");
        if (!(options.resourceType || this._resourceType)) missingFields.push("resourceType");
        if (!(options.action || this._action)) missingFields.push("action");

        if (missingFields.length) {
            throw new MissingAuthorizeDataError(missingFields);
        }
    }
}
