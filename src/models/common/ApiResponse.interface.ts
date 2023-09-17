export interface ApiResponse {
    status: number;
    message: string | string[];
    error?: string;
}
