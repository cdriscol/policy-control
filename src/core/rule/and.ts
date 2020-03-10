import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { IRuleConfig } from "./IRuleConfig";
import evaluateRule from "./evaluateRule";
import logger from "../../logger";

// combine rules with AND logic (early returns on FALSE)
export default function and<U, R>(rules: IRuleConfig<U, R>[]): IRuleConfig<U, R> {
    return {
        name: "and",
        loaders: [],
        evaluate: async (request: IAuthorizationRequest<U, R>): Promise<boolean | undefined | null> => {
            logger.debug(`and ${JSON.stringify(rules)}`);
            const result = await rules.reduce(async (response, curRule) => {
                const prevResponse = await response;
                if (prevResponse === false) {
                    logger.debug(`and response FALSE, skipping current rule`);
                    return prevResponse;
                }

                const newResponse = await evaluateRule(curRule, request);
                logger.debug(`and response:${newResponse}`);
                const skipRule = newResponse === undefined || newResponse === null;
                if (skipRule) return prevResponse;
                return newResponse;
            }, Promise.resolve<boolean | undefined | null>(undefined));
            logger.debug(`and result:${result}`);
            return result;
        },
    };
}
