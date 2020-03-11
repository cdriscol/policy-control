import { ILoaderConfig } from "./ILoaderConfig";
import { IDecisionRequest } from "../IDecisionRequest";
import logger from "../../logger";
import getLoaderKey from "./getLoaderKey";

// will resolve (recursively) ILoaderConfigs
export default async function resolveLoaders<U, R>(
    configs: ILoaderConfig<U, R>[] = [],
    request: IDecisionRequest<U, R>,
): Promise<void> {
    if (!configs.length) return;
    logger.debug(`resolveLoaders loaders:${configs.map(c => c.name).join(",")}`);
    await configs.reduce(async (prev, loaderConfig) => {
        const loaderKey = getLoaderKey(loaderConfig, request);
        await prev;
        if (request.context.store.has(loaderKey)) {
            logger.debug(`resolveLoaders loader already exists ${loaderConfig.name}`);
            return;
        }
        if (loaderConfig.loaders && loaderConfig.loaders.length) {
            // recursively resolve dependent loaders
            // TODO: Check for circular loaders
            logger.debug(`resolveLoaders resolving dep loaders for ${loaderConfig.name}`);
            await resolveLoaders(loaderConfig.loaders, request);
            logger.debug(`resolveLoaders done resolving dep loaders for ${loaderConfig.name}`);
        }
        const data = await loaderConfig.resolve(request);
        request.context.store.prime(loaderKey, data, loaderConfig.persist);
    }, Promise.resolve());
}
