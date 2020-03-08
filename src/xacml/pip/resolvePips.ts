import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { IPIPConfig } from "./IPIPConfig";

export default async function resolvePips<U, R>(
    configs: IPIPConfig<U, R>[] = [],
    request: IAuthorizationRequest<U, R>,
): Promise<void> {
    await configs.reduce(async (prev, pipConfig) => {
        await prev;
        if (request.context.hasPip(pipConfig)) return;
        if (pipConfig.pips && pipConfig.pips.length) {
            // recursively resolve dependent pips
            // TODO: Check for circular pips
            await resolvePips(pipConfig.pips, request);
        }
        const data = await pipConfig.resolve(request);
        request.context.setPip(pipConfig, data);
    }, Promise.resolve());
}
