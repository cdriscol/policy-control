import { IPDP } from "./IPDP";
import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { IPolicy } from "../policy";
import AuthorizationResponse, { IAuthorizationResponse, PermissionResponse } from "../AuthorizationResponse";

const denyOverGrantPDP: IPDP = async <U, R>(
    request: IAuthorizationRequest<U, R>,
    policies: IPolicy<U, R>[],
): Promise<IAuthorizationResponse> => {
    const authResponse = await policies
        .sort((a, b) => a.priority - b.priority)
        .reduce(async (curResponsePromise: Promise<PermissionResponse>, curPolicy: IPolicy<U, R>) => {
            const response = await curResponsePromise;
            if (response === PermissionResponse.Deny) {
                return response;
            }

            const newResponse = await curPolicy.evaluate(request);
            return Math.max(response, newResponse);
        }, Promise.resolve(PermissionResponse.Indeterminate));

    return new AuthorizationResponse(authResponse);
};

export default denyOverGrantPDP;
