import PolicyControl, { IPolicyControlOptions } from "./PolicyControl";
import logger from "./logger";

export default function createPolicyControl<U, R>(
    options: Partial<IPolicyControlOptions<U, R>> = {},
): PolicyControl<U, R> {
    logger.debug(`Creating new PolicyControl with options(${JSON.stringify(options)})`);
    return new PolicyControl(options);
}
