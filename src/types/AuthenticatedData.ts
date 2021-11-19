
import React from "react";

export type AuthenticatedData = {
    username: string|null,
    areacode: string|null,
}

export type AuthenticatedContext = {
    authenticatedData: AuthenticatedData|null,
    setAuthenticatedData: React.Dispatch<React.SetStateAction<AuthenticatedData|null>> | null,
}
