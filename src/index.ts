// eslint-disable-next-line filenames/match-exported
export { IPolicyConfig, IRuleConfig, IPIPConfig, IAuthorizationRequest } from "./xacml";
import PolicyControl from "./PolicyControl";
import createPolicyControl from "./createPolicyControl";

export { PolicyControl };
export default createPolicyControl;

// added to allow ES6 to import via "const pc = require('policy-control');"
// module.exports = createPolicyControl;
