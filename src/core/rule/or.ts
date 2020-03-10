import { IRuleConfig } from "./IRuleConfig";
import evaluateRule from "./evaluateRule";
import { IAuthorizationRequest } from "../IAuthorizationRequest";
import logger from "../../logger";

// combine rules with OR logic (early returns on TRUE)
export default function or<U, R>(rules: IRuleConfig<U, R>[]): IRuleConfig<U, R> {
    return {
        name: "or",
        loaders: [],
        evaluate: async (request: IAuthorizationRequest<U, R>): Promise<boolean | undefined | null> => {
            logger.debug(`or ${JSON.stringify(rules)}`);
            const result = await rules.reduce(async (response, curRule) => {
                const prevResponse = await response;
                if (prevResponse) {
                    logger.debug(`or response TRUE, skipping current rule`);
                    return prevResponse;
                }

                const newResponse = await evaluateRule(curRule, request);
                logger.debug(`or response:${newResponse}`);
                const skipRule = newResponse === undefined || newResponse === null;
                if (skipRule) return prevResponse;
                return newResponse;
            }, Promise.resolve<boolean | null | undefined>(undefined));
            logger.debug(`or result:${result}`);
            return result;
        },
    };
}
