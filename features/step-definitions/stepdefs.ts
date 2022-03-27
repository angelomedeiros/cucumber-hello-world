import { Given, When, Then, AfterAll } from "cucumber";
import assert from "assert";

function isItFriday(today: string) {
    if (today === "Friday") {
        return "TGIF";
    } else {
        return "Nope";
    }
}

Given("today is {string}", function (givenDay) {
    this.today = givenDay;
});

When("I ask whether it's Friday yet", function () {
    this.actualAnswer = isItFriday(this.today);
});

Then("I should be told {string}", function (expectedAnswer) {
    assert.strictEqual(this.actualAnswer, expectedAnswer);
});
