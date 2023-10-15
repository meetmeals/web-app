import { ApiResponse, NullableNumber, NullableString } from 'models/common';

export interface SaveCustomerContactResponseInterface extends ApiResponse {
    contact: {
        problem_id: string;
        issue_title_id: string;
        title: string;
        problem_text: string;
        email: string;
        type: number;
        submit_type: number;
        user_id: NullableNumber;
        name: NullableString;
        problem_file1: object;
        problem_file2: object;
        updated_at: string;
        created_at: string;
        id: number;
    };
}
