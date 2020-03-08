import { IPDP } from "./IPDP";
import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { IPolicyConfig, evaluatePolicy } from "../policy";
import { IAuthorizationResponse, PermissionResponse } from "../AuthorizationResponse";

const denyOverGrantPDP: IPDP = async <U, R>(
    request: IAuthorizationRequest<U, R>,
    policies: IPolicyConfig<U, R>[],
): Promise<IAuthorizationResponse> => {
    const authResponse = await policies
        .map(pc => ({ ...pc, priority: pc.priority || 100 }))
        .sort((a, b) => a.priority - b.priority)
        .reduce(async (curResponsePromise: Promise<PermissionResponse>, curPolicy: IPolicyConfig<U, R>) => {
            const response = await curResponsePromise;
            if (response === PermissionResponse.Deny) {
                return response;
            }

            const newResponse = await evaluatePolicy(curPolicy, request);
            return newResponse === PermissionResponse.Indeterminate ? response : newResponse;
        }, Promise.resolve(PermissionResponse.Indeterminate));

    return { response: authResponse, errors: [] };
};

export default denyOverGrantPDP;
