import pc, { IRuleConfig, IPolicyConfig, IPIPConfig } from "../lib";
import { and, or } from "../lib/rules";

type User = {
    id: string;
};
type Resource = {
    id: string;
};

const pip1: IPIPConfig<User, Resource> = {
    pips: [],
    name: "pip1",
    key: (name, user, resource) => `${name}:${user.id}:${resource.id}`,
    resolve: async (): Promise<{ data: string }> => {
        return { data: "test" };
    },
};

const rule1: IRuleConfig<User, Resource> = {
    pips: [pip1],
    evaluate: async () => true,
};

const rule2: IRuleConfig<User, Resource> = {
    evaluate: async () => true,
};

const rule3: IRuleConfig<User, Resource> = {
    evaluate: async () => true,
};

const policy1: IPolicyConfig<User, Resource> = {
    name: "CreateSomething",
    resourceTypes: ["something"],
    actionTypes: ["create"],
    rules: [and([rule1, or([rule2, rule3])])],
};

pc<User, Resource>()
    .action("create")
    .resourceType("test")
    .user({ id: "userId" })
    .resource({ id: "resourceId" })
    .policies([policy1])
    .authorize();
