import { ILoaderConfig } from "./ILoaderConfig";
import { IDecisionRequest } from "../IDecisionRequest";

export default function getLoaderKey<U, R>(
    loader: ILoaderConfig<U, R>,
    requestOrUser: IDecisionRequest<U, R> | U,
    maybeResource?: R,
): string {
    const { name, key } = loader;
    const user = maybeResource ? requestOrUser : requestOrUser["user"];
    const resource = maybeResource || requestOrUser["resource"];
    return key ? key(name, user, resource) : name;
}
