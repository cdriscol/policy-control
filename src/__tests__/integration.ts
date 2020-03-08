import * as chai from "chai";

// test build output
// import pc, { IPIPConfig, IRuleConfig, IPolicyConfig } from "../../lib";
// import { and, or } from "../../lib/rules";

// test sources
import pc, { IPIPConfig, IAuthorizationRequest, IRuleConfig, IPolicyConfig, setLogLevel } from "../index";
import { and, or } from "../rules";
import { PermissionResponse } from "../xacml/AuthorizationResponse";

// debug tests
setLogLevel("info");

type User = {
    id: string;
    email: string;
};

type Resource = {
    id: string;
    createdById: string;
};

const prePip1: IPIPConfig<User, Resource> = {
    name: "prePip1",
    resolve: async (): Promise<{ preData: string }> => {
        return { preData: "test" };
    },
};

const pip1: IPIPConfig<User, Resource> = {
    pips: [prePip1],
    name: "pip1",
    key: (name, user, resource) => `${name}:${user.id}:${resource.id}`,
    resolve: async (req: IAuthorizationRequest<User, Resource>): Promise<{ data: string }> => {
        const prePipData = req.context.getPip(prePip1);
        chai.expect(prePipData).to.contain({ preData: "test" });
        return { data: "test" };
    },
};

const rule1: IRuleConfig<User, Resource> = {
    name: "rule1",
    pips: [pip1],
    evaluate: async (req: IAuthorizationRequest<User, Resource>) => {
        const result = req.context.getPip<{ data: string }>(pip1).data === "test";
        chai.expect(result).to.be.true;
        return result;
    },
};

const nullRule: IRuleConfig<User, Resource> = {
    name: "nullRule",
    evaluate: async () => null,
};

const falseRule: IRuleConfig<User, Resource> = {
    name: "falseRule",
    evaluate: async () => false,
};

const policy1: IPolicyConfig<User, Resource> = {
    name: "policy1",
    resourceTypes: ["something", "test"],
    actionTypes: ["create"],
    rules: [and([rule1, or([nullRule, falseRule])])],
};

const pep = pc<User, Resource>()
    .action("create")
    .resourceType("test")
    .policies([policy1]);

describe("integration tests", () => {
    it("works", async () => {
        const result = await pep.authorize({
            user: {
                id: "userId",
                email: "test@test.com",
            },
            resource: {
                id: "resourceId",
                createdById: "userId",
            },
        });
        chai.expect(result.response).to.equal(PermissionResponse.Deny);
    });
});
