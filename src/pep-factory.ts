import { AuthorizationActions, DenyOverGrantPDP, IAuthorizationRequest, IPRP, PEP } from "xacml";
import { IAuthorizationResponse } from "xacml/authorization-response";
import { MissingAuthorizeDataError } from "xacml/errors/missingAuthorizeDataError";

export type ResourceTypes = string | number;

export interface IPEPFactoryOptions<UserT, ResourceT, ContextT> {
    prps: IPRP<UserT, ResourceT>[];
    context: ContextT;
    user: UserT;
    resource: ResourceT;
    resourceType: ResourceTypes;
    action: AuthorizationActions;
}

export interface IPEPFactory<UserT, ResourceT, ContextT extends object> {
    prps(prps: IPRP<UserT, ResourceT>[]): this;
    context(context: ContextT): this;
    user(user: UserT): this;
    action(action: AuthorizationActions): this;
    resource(resource: ResourceT): this;
    resourceType(resourceType: ResourceTypes): this;
    authorize(): Promise<IAuthorizationResponse>;
}

export class PEPFactory<UserT, ResourceT, ContextT extends object> implements IPEPFactory<UserT, ResourceT, ContextT> {
    private _prps: IPRP<UserT, ResourceT>[] = [];
    private _context: Partial<ContextT>;
    private _user: UserT | undefined;
    private _resource: ResourceT | undefined;
    private _resourceType: ResourceTypes | undefined;
    private _action: AuthorizationActions | undefined;

    constructor(options: Partial<IPEPFactoryOptions<UserT, ResourceT, ContextT>>) {
        if (options.prps) this._prps = options.prps;
        this._context = options.context || {};
        this._user = options.user;
        this._resource = options.resource;
        this._resourceType = options.resourceType;
        this._action = options.action;
    }

    public prps(prps: IPRP<UserT, ResourceT>[]) {
        this._prps = prps;
        return this;
    }

    public context(context: Partial<ContextT>) {
        this._context = context;
        return this;
    }

    public user(user: UserT) {
        this._user = user;
        return this;
    }

    public action(action: AuthorizationActions) {
        this._action = action;
        return this;
    }

    public resource(resource: ResourceT) {
        this._resource = resource;
        return this;
    }

    public resourceType(resourceType: ResourceTypes) {
        this._resourceType = resourceType;
        return this;
    }

    public authorize(): Promise<IAuthorizationResponse> {
        this.validate();
        const pdp = new DenyOverGrantPDP(this._prps);

        if (!this._user || !this._resource || !this._action || !this._resourceType) {
            throw new Error();
        }
        const request: IAuthorizationRequest<UserT, ResourceT> = {
            user: this._user,
            resource: this._resource,
            resourceType: this._resourceType,
            context: this._context,
            action: this._action,
        };

        return new PEP(pdp, request).authorize();
    }

    private validate(): void {
        const missingFields: string[] = [];
        if (this._prps) missingFields.push("prps");
        if (this._context) missingFields.push("context");
        if (this._user) missingFields.push("user");
        if (this._resource) missingFields.push("resource");
        if (this._resourceType) missingFields.push("resourceType");
        if (this._action) missingFields.push("action");

        if (missingFields.length) {
            throw new MissingAuthorizeDataError(missingFields);
        }
    }
}
