import { IPDP } from "./IPDP";
import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { IPolicyConfig, evaluatePolicy } from "../policy";
import { IAuthorizationResponse, PermissionResponse } from "../AuthorizationResponse";
import logger from "../../logger";

const denyOverGrantPDP: IPDP = async <U, R>(
    request: IAuthorizationRequest<U, R>,
    policies: IPolicyConfig<U, R>[],
): Promise<IAuthorizationResponse> => {
    logger.debug(`denyOverGrantPDP policies:${JSON.stringify(policies)}, request:${JSON.stringify(request)}`);
    const authResponse = await policies
        .map(pc => ({ ...pc, priority: pc.priority || 100 }))
        .sort((a, b) => a.priority - b.priority)
        .reduce(async (curResponsePromise: Promise<PermissionResponse>, curPolicy: IPolicyConfig<U, R>) => {
            const response = await curResponsePromise;
            if (response === PermissionResponse.Deny) {
                logger.debug(`denyOverGrantPDP skipping policy due to DENY`);
                return response;
            }

            const newResponse = await evaluatePolicy(curPolicy, request);
            const result = newResponse === PermissionResponse.Indeterminate ? response : newResponse;
            logger.debug(`denyOverGrantPDP new result ${result}`);
            return result;
        }, Promise.resolve(PermissionResponse.Indeterminate));

    const result = { response: authResponse, errors: [] };
    logger.debug(`denyOverGrantPDP result:${JSON.stringify(result)}`);
    return result;
};

export default denyOverGrantPDP;
