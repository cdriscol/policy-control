import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { IPIPConfig } from "./IPIPConfig";
import logger from "../../logger";

export default async function resolvePips<U, R>(
    configs: IPIPConfig<U, R>[] = [],
    request: IAuthorizationRequest<U, R>,
): Promise<void> {
    if (!configs.length) return;
    logger.debug(`resolvePips pips:${configs.map(c => c.name).join(",")}`);
    await configs.reduce(async (prev, pipConfig) => {
        await prev;
        if (request.context.hasPip(pipConfig)) {
            logger.debug(`resolvePips pip already exists ${pipConfig.name}`);
            return;
        }
        if (pipConfig.pips && pipConfig.pips.length) {
            // recursively resolve dependent pips
            // TODO: Check for circular pips
            logger.debug(`resolvePips resolving dep pips for ${pipConfig.name}`);
            await resolvePips(pipConfig.pips, request);
            logger.debug(`resolvePips done resolving dep pips for ${pipConfig.name}`);
        }
        const data = await pipConfig.resolve(request);
        request.context.setPip(pipConfig, data);
    }, Promise.resolve());
}
