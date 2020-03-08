import { IPIPConfig } from "../pip";
import { IAuthorizationRequest } from "../IAuthorizationRequest";

export interface IRuleConfig<U, R> {
    name: string;
    pips?: IPIPConfig<U, R>[];
    evaluate(R: IAuthorizationRequest<U, R>): Promise<boolean | undefined | null>;
}
