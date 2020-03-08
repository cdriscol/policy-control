// eslint-disable-next-line filenames/match-exported
export { IPolicyConfig, IRuleConfig, IPIPConfig } from "./xacml";
import PolicyControl from "./PolicyControl";
import createPolicyControl from "./createPolicyControl";

export { PolicyControl };
export default createPolicyControl;
