import {
    filterPolicies,
    IPolicyConfig,
    IDecider,
    IDecisionRequest,
    IAuthorizationDecision,
    LoaderStore,
    MissingDecisionDataError,
    ILoaderConfig,
    resolveLoaders,
    IDecisionContext,
} from "./core";
import { denyOverGrant } from "./deciders";
import logger from "./logger";
import { ILoaderStore } from "./core/loader";

export type IResourceType = string | number;

export interface IPolicyControlOptions<U, R, C> {
    // policies that will be matched and evaluated
    policies: IPolicyConfig<U, R>[];
    // user making request
    user: U;
    // resource the user is acting on
    resource: R;
    // resource type the user is acting on
    resourceType: IResourceType;
    // the action the user is taking
    action: number | string;
    // the decider function that will evaluate policies and make a final decision
    decider: IDecider;
    // loaders to load data before policies are run
    loaders: ILoaderConfig<U, R>[];
    // context
    context: Partial<C>;
}

export interface IPolicyControl<U, R, C extends IDecisionContext = IDecisionContext> {
    user(user: U): this;
    resource(resource: R): this;
    policies(policies: IPolicyConfig<U, R>[]): this;
    decider(decider: IDecider): this;
    action(action: number | string): this;
    resourceType(resourceType: IResourceType): this;
    loaders(loaders: ILoaderConfig<U, R>[]): this;
    context(context: C): this;
    authorize(): Promise<IAuthorizationDecision>;
}

export default class PolicyControl<U, R, C extends IDecisionContext = IDecisionContext>
    implements IPolicyControl<U, R, C> {
    private _policies: IPolicyConfig<U, R>[];
    private _user: U | undefined;
    private _resource: R | undefined;
    private _resourceType: IResourceType | undefined;
    private _action: number | string | undefined;
    private _decider: IDecider;
    private _loaders: ILoaderConfig<U, R>[];
    private _store: ILoaderStore;
    private _context: Partial<C>;

    constructor(options: Partial<IPolicyControlOptions<U, R, C>> = {}) {
        this._policies = options.policies || [];
        this._user = options.user;
        this._resource = options.resource;
        this._resourceType = options.resourceType;
        this._action = options.action;
        this._decider = options.decider || denyOverGrant;
        this._loaders = options.loaders || [];
        this._store = new LoaderStore();
        this._context = options.context || {};
    }

    public policies(policies: IPolicyConfig<U, R>[]) {
        logger.debug(`PolicyControl.policies ${JSON.stringify(policies)}`);
        this._policies = policies;
        return this;
    }

    public loaders(loaders: ILoaderConfig<U, R>[]) {
        logger.debug(`PolicyControl.loaders ${JSON.stringify(loaders)}`);
        this._loaders = loaders;
        return this;
    }

    public context(context: Partial<C>) {
        this._context = context;
        return this;
    }

    public user(user: U) {
        logger.debug(`PolicyControl.user ${JSON.stringify(user)}`);
        this._user = user;
        return this;
    }

    public action(action: number | string) {
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
        this._decider = decider;
        return this;
    }

    public resourceType(resourceType: IResourceType) {
        logger.debug(`PolicyControl.resourceType ${JSON.stringify(resourceType)}`);
        this._resourceType = resourceType;
        return this;
    }

    public async authorize(options: Partial<IPolicyControlOptions<U, R, C>> = {}): Promise<IAuthorizationDecision> {
        logger.debug(`PolicyControl.authorize ${JSON.stringify(options)}`);
        this.validate(options);

        const policies = options.policies || this._policies;
        const user = options.user || this._user;
        const resource = options.resource || this._resource;
        const resourceType = options.resourceType || this._resourceType;
        const action = options.action || this._action;
        const decider = options.decider || this._decider;
        const loaders = [...(options.loaders || []), ...(this._loaders || [])];
        const context: C = {
            ...(options.context || this._context),
            store: this._store,
        } as any;

        // this ugly check is required for TS to be happy
        if (!user || !resource || !action || !resourceType) {
            throw new Error();
        }

        const request: IDecisionRequest<U, R> = {
            user,
            resource,
            resourceType,
            action,
            context,
        };

        await resolveLoaders(loaders, request);

        const filteredPolicies = filterPolicies(policies, resourceType, action);
        if (!filteredPolicies.length) {
            logger.warn(`Attempting decision without policies`);
        }
        return decider(filteredPolicies, request);
    }

    private validate(options: Partial<IPolicyControlOptions<U, R, C>> = {}): void {
        const missingFields: string[] = [];
        if (!(options.policies || this._policies)) missingFields.push("policies");
        if (!(options.user || this._user)) missingFields.push("user");
        if (!(options.resource || this._resource)) missingFields.push("resource");
        if (!(options.resourceType || this._resourceType)) missingFields.push("resourceType");
        if (!(options.action || this._action)) missingFields.push("action");

        if (missingFields.length) {
            logger.debug(`PolicyControl.validate INVALID missing fields (${missingFields.join(",")})`);
            throw new MissingDecisionDataError(missingFields);
        }

        logger.debug(`PolicyControl.validate VALID`);
    }
}
