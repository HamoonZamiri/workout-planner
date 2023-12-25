import { expect, describe, it } from "@jest/globals";
import UserService from "../services/user.service";

describe("User Service", () => {
    it("should return a false value for a non valid email", () => {
        const email = "test";
        const result = UserService.isValidEmail(email);
        expect(result).toBeFalsy();
    });

    it("should return a true value for a valid email", () => {
        const email = "test@mail.com";
        const result = UserService.isValidEmail(email);
        expect(result).toBeTruthy();
    });

});