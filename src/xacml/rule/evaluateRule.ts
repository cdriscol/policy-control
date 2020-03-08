import { resolvePips } from "../pip";
import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { IRuleConfig } from "./IRuleConfig";

export default async function evaluateRule<U, R>(
    config: IRuleConfig<U, R>,
    request: IAuthorizationRequest<U, R>,
): Promise<boolean | undefined | null> {
    await resolvePips(config.pips, request);
    return config.evaluate(request);
}
