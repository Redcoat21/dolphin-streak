export type ApiResponse = {
    data: any;
    messages: string;
};

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
};

export type EncryptedPayload = {
    iv: string;
    encryptedData: string;
};
