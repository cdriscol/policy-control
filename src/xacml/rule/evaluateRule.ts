import { resolvePips } from "../pip";
import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { IRuleConfig } from "./IRuleConfig";
import logger from "../../logger";

export default async function evaluateRule<U, R>(
    config: IRuleConfig<U, R>,
    request: IAuthorizationRequest<U, R>,
): Promise<boolean | undefined | null> {
    logger.debug(`evaluateRule rule:${JSON.stringify(config)}`);
    await resolvePips(config.pips, request);
    const result = await config.evaluate(request);
    logger.debug(`evaluateRule result:${result}`);
    return result;
}
