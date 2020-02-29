import "mocha";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";

before(async function() {
    chai.use(chaiAsPromised);
});
