import { IAuthorizationRequest } from "./authorization-request";
import { PermissionResponse } from "./authorization-response";
import IPolicy from "./IPolicy";
import IPolicySet from "./IPolicySet";

const copyRequest = <UserT, ResourceT>(
    request: IAuthorizationRequest<UserT, ResourceT>,
): IAuthorizationRequest<UserT, ResourceT> => ({
    ...request,
});

const checkPermission = async <UserT, ResourceT>(
    request: IAuthorizationRequest<UserT, ResourceT>,
    curPolicy: IPolicy<UserT, ResourceT>,
): Promise<boolean> => {
    const requestCopy = copyRequest(request);
    return curPolicy.check(requestCopy);
};

export class PolicySet<UserT, ResourceT> implements IPolicySet<UserT, ResourceT> {
    private readonly policies: IPolicy<UserT, ResourceT>[];

    constructor(policies: IPolicy<UserT, ResourceT>[]) {
        this.policies = policies;
    }

    public async evaluate(request: IAuthorizationRequest<UserT, ResourceT>): Promise<PermissionResponse> {
        const policyMatch = await this.policies.reduce(async (curMatchPromise, curPolicy) => {
            const curMatch = await curMatchPromise;
            return curMatch || checkPermission(request, curPolicy);
        }, Promise.resolve(false));
        return policyMatch ? PermissionResponse.Allow : PermissionResponse.Indeterminate;
    }
}
