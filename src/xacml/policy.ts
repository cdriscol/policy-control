import { AuthorizationActions } from "./authorization-actions";
import { IAuthorizationRequest } from "./authorization-request";
import IPIP from "./IPIP";
import IPolicy from "./IPolicy";
import IRule from "./IRule";

interface IPolicyConfig<UserT, ResourceT> {
    // TODO: import from common spot
    resourceTypes: Array<number | string>;
    actionTypes: AuthorizationActions[];
    pips?: IPIP<UserT, ResourceT>[];
    rules: IRule<UserT, ResourceT>[];
}

export class Policy<UserT, ResourceT> implements IPolicy<UserT, ResourceT> {
    public resourceTypes: Array<number | string>;
    public actionTypes: AuthorizationActions[];

    public pips: IPIP<UserT, ResourceT>[];

    public rules: IRule<UserT, ResourceT>[];

    constructor(policyConfig: IPolicyConfig<UserT, ResourceT>) {
        this.resourceTypes = policyConfig.resourceTypes;
        this.actionTypes = policyConfig.actionTypes;
        this.pips = policyConfig.pips || [];
        this.rules = policyConfig.rules;
    }

    public async check(request: IAuthorizationRequest<UserT, ResourceT>): Promise<boolean> {
        const enrichedRequest = await this.enrichRequest(request);
        return this.checkRules(enrichedRequest);
    }

    private async enrichRequest(
        request: IAuthorizationRequest<UserT, ResourceT>,
    ): Promise<IAuthorizationRequest<UserT, ResourceT>> {
        return this.pips.reduce(async (curEnrichedRequestPromise, curPip) => {
            const curEnrichedRequest = await curEnrichedRequestPromise;
            return curPip.enrich(curEnrichedRequest);
        }, Promise.resolve(request));
    }

    private checkRules(request: IAuthorizationRequest<UserT, ResourceT>): boolean {
        return this.rules.some(curRule => !!curRule.evaluate(request));
    }
}
