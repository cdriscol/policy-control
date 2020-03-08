import PolicyControl, { IPolicyControlOptions } from "./PolicyControl";

export default function createPolicyControl<U, R>(
    options: Partial<IPolicyControlOptions<U, R>> = {},
): PolicyControl<U, R> {
    return new PolicyControl(options);
}
