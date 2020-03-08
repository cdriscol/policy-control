import {
    filterPolicies,
    IPolicyConfig,
    IDecider,
    AuthorizationActions,
    IAuthorizationRequest,
    IAuthorizationResponse,
    PIPContext,
    MissingAuthorizeDataError,
    IPIPConfig,
    resolvePips,
} from "./xacml";
import { denyOverGrant } from "./deciders";
import logger from "./logger";

export type IResourceType = string | number;
export interface IPolicyControlOptions<U, R> {
    policies: IPolicyConfig<U, R>[];
    user: U;
    resource: R;
    resourceType: IResourceType;
    action: AuthorizationActions;
    decider: IDecider;
    pips: IPIPConfig<U, R>[];
}

export interface IPolicyControl<U, R> {
    user(user: U): this;
    resource(resource: R): this;
    policies(policies: IPolicyConfig<U, R>[]): this;
    decider(decider: IDecider): this;
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
    private _pdp: IDecider;
    private _pips: IPIPConfig<U, R>[];

    constructor(options: Partial<IPolicyControlOptions<U, R>> = {}) {
        this._policies = options.policies || [];
        this._user = options.user;
        this._resource = options.resource;
        this._resourceType = options.resourceType;
        this._action = options.action;
        this._pdp = options.decider || denyOverGrant;
        this._pips = options.pips || [];
    }

    public policies(policies: IPolicyConfig<U, R>[]) {
        logger.debug(`PolicyControl.policies ${JSON.stringify(policies)}`);
        this._policies = policies;
        return this;
    }

    public pips(pips: IPIPConfig<U, R>[]) {
        logger.debug(`PolicyControl.pips ${JSON.stringify(pips)}`);
        this._pips = pips;
        return this;
    }

    public user(user: U) {
        logger.debug(`PolicyControl.user ${JSON.stringify(user)}`);
        this._user = user;
        return this;
    }

    public action(action: AuthorizationActions) {
        logger.debug(`PolicyControl.action ${JSON.stringify(action)}`);
        this._action = action;
        return this;
    }

    public resource(resource: R) {
        logger.debug(`PolicyControl.resource ${JSON.stringify(resource)}`);
        this._resource = resource;
        return this;
    }

    public decider(decider: IDecider) {
        logger.debug(`PolicyControl.decider ${JSON.stringify(decider)}`);
        this._pdp = decider;
        return this;
    }

    public resourceType(resourceType: IResourceType) {
        logger.debug(`PolicyControl.resourceType ${JSON.stringify(resourceType)}`);
        this._resourceType = resourceType;
        return this;
    }

    public async authorize(options: Partial<IPolicyControlOptions<U, R>> = {}): Promise<IAuthorizationResponse> {
        logger.debug(`PolicyControl.authorize ${JSON.stringify(options)}`);
        this.validate(options);

        const policies = options.policies || this._policies;
        const user = options.user || this._user;
        const resource = options.resource || this._resource;
        const resourceType = options.resourceType || this._resourceType;
        const action = options.action || this._action;
        const decider = options.decider || this._pdp;
        const pips = [...(options.pips || []), ...(this._pips || [])];

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

        await resolvePips(pips, request);

        const filteredPolicies = filterPolicies(policies, resourceType, action);
        if (!filteredPolicies.length) {
            logger.warn(`Attempting authorization without policies`);
        }
        return decider(filteredPolicies, request);
    }

    private validate(options: Partial<IPolicyControlOptions<U, R>> = {}): void {
        const missingFields: string[] = [];
        if (!(options.policies || this._policies)) missingFields.push("policies");
        if (!(options.user || this._user)) missingFields.push("user");
        if (!(options.resource || this._resource)) missingFields.push("resource");
        if (!(options.resourceType || this._resourceType)) missingFields.push("resourceType");
        if (!(options.action || this._action)) missingFields.push("action");

        if (missingFields.length) {
            logger.debug(`PolicyControl.validate INVALID missing fields (${missingFields.join(",")})`);
            throw new MissingAuthorizeDataError(missingFields);
        }

        logger.debug(`PolicyControl.validate VALID`);
    }
}
