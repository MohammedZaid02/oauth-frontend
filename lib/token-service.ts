let accessToken: string | null = null;

export const tokenService = {
    
    setToken: (token: string): void => {
        accessToken = token;
    },

   
    getToken: (): string | null => {
        return accessToken;
    },

    
    clearToken: (): void => {
        accessToken = null;
    },

    
    hasToken: (): boolean => {
        return accessToken !== null;
    },
};
