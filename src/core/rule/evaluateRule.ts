import { resolveLoaders } from "../loader";
import { IDecisionRequest } from "../IDecisionRequest";
import { IRuleConfig } from "./IRuleConfig";
import logger from "../../logger";

// resolve rule loaders and return evaluation of rule
export default async function evaluateRule<U, R>(
    config: IRuleConfig<U, R>,
    request: IDecisionRequest<U, R>,
): Promise<boolean | undefined | null> {
    logger.debug(`evaluateRule rule:${JSON.stringify(config)}`);
    await resolveLoaders(config.loaders, request);
    const result = await config.evaluate(request);
    logger.debug(`evaluateRule result:${result}`);
    return result;
}
