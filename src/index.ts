// eslint-disable-next-line filenames/match-exported
export { IPolicyConfig, IRuleConfig, ILoaderConfig, IDecisionRequest } from "./core";
import PolicyControl from "./PolicyControl";
import createPolicyControl from "./createPolicyControl";
import logger, { ILogLevel } from "./logger";

export function setLogLevel(level: ILogLevel): void {
    logger.setLogLevel(level);
}

export { PolicyControl };
export default createPolicyControl;

// TODO: added to allow ES6 to import via "const pc = require('policy-control');"
// module.exports = createPolicyControl;
