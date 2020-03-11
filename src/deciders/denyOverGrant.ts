import {
    IPolicyConfig,
    IDecisionRequest,
    IDecider,
    IDecisionResponse,
    PermissionResponse,
    evaluatePolicy,
} from "../core";
import logger from "../logger";

const denyOverGrant: IDecider = async <U, R>(
    policies: IPolicyConfig<U, R>[],
    request: IDecisionRequest<U, R>,
): Promise<IDecisionResponse> => {
    logger.debug(`denyOverGrantPDP policies:${JSON.stringify(policies)}, request:${JSON.stringify(request)}`);
    const decisionResponse = await policies
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

    const result = { response: decisionResponse, errors: [] };
    logger.debug(`denyOverGrantPDP result:${JSON.stringify(result)}`);
    return result;
};

export default denyOverGrant;
