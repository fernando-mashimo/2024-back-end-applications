
class AuthenticationPrincipal {
    constructor(
        public accountId: string,
        public email: string,
        public subscriptionType: string,
    ) { }
}

class AuthenticationAuthorities {
    constructor(
        public roles: string[],
    ) { }
}

export class Authentication {
    constructor(
        public principal: AuthenticationPrincipal,
        public authorities: AuthenticationAuthorities, // TODO: finish implementation when permissions are needed
    ) { }
}
