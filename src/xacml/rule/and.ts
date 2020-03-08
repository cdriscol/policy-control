import { IAuthorizationRequest } from "../IAuthorizationRequest";
import { IRuleConfig } from "./IRuleConfig";
import evaluateRule from "./evaluateRule";

export default function and<U, R>(rules: IRuleConfig<U, R>[]): IRuleConfig<U, R> {
    return {
        pips: [],
        evaluate: async (request: IAuthorizationRequest<U, R>): Promise<boolean | undefined | null> => {
            return rules.reduce(async (response, curRule) => {
                const prevResponse = await response;
                if (prevResponse === false) {
                    return prevResponse;
                }

                const newResponse = await evaluateRule(curRule, request);
                const skipRule = newResponse === undefined || newResponse === null;
                if (skipRule) return prevResponse;
                return newResponse;
            }, Promise.resolve<boolean | undefined | null>(undefined));
        },
    };
}
