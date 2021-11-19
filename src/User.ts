
export default class User {

    private static isUserAuthenticated: boolean = false;

    private constructor() { }

    public static isAuthenticated(): boolean {
        return User.isUserAuthenticated;
    }

    public static setIsAuthenticated(val: boolean): void {
        User.isUserAuthenticated = !!val;
    }
}
