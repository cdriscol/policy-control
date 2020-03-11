import PolicyControl, { IPolicyControlOptions } from "./PolicyControl";
import { IDecisionContext } from "./core";
import logger from "./logger";

// this is a simple PolicyControl builder meant to make creating easier (i.e. pc() over new PolicyControl())
export default function createPolicyControl<U, R, C extends IDecisionContext = IDecisionContext>(
    options: Partial<IPolicyControlOptions<U, R, C>> = {},
): PolicyControl<U, R, C> {
    logger.debug(`Creating new PolicyControl with options(${JSON.stringify(options)})`);
    return new PolicyControl(options);
}
