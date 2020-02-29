import { AuthorizationActions } from "./authorization-actions";
import { IAuthorizationRequest } from "./authorization-request";
import IPolicy from "./IPolicy";
import IPolicySet from "./IPolicySet";
import IPRP from "./IPRP";
import { PolicySet } from "./policy-set";

const policyMatch = <UserT, ResourceT>(resourceType: number | string, actionType: AuthorizationActions) => (
    policy: IPolicy<UserT, ResourceT>,
): boolean => policy.actionTypes.some(at => at === actionType) && policy.resourceTypes.some(rt => rt === resourceType);

const filterPolicies = <UserT, ResourceT>(
    request: IAuthorizationRequest<UserT, ResourceT>,

    policyConfigs: IPolicy<UserT, ResourceT>[],
): IPolicy<UserT, ResourceT>[] => {
    const policyConfigMatchFilter = policyMatch(request.resourceType, request.action);
    return policyConfigs.filter(policyConfigMatchFilter);
};

export default abstract class AbstractPRP<UserT, ResourceT> implements IPRP<UserT, ResourceT> {
    public getPolicySet(request: IAuthorizationRequest<UserT, ResourceT>): IPolicySet<UserT, ResourceT> {
        const pcs = this.getPolicies(request);
        const policies = filterPolicies(request, pcs);
        return new PolicySet(policies);
    }
    public abstract getPolicies(request: IAuthorizationRequest<UserT, ResourceT>): IPolicy<UserT, ResourceT>[];
}
