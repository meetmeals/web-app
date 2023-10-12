import { ApiResponse } from 'models/common';

export interface ConstantTextResponseData {
    api_text: {
        magic_box_modal_title: string;
        magic_box_modal_description: string;
        magic_box_modal_beehine_can_not_deliver: string;
        order_rules_title: string;
        order_rules_link: string;
        order_rules_description: string;
        order_popup_title: string;
        order_popup_first_p: string;
        order_popup_second_p: string;
        order_popup_last_line: string;
        order_detail_box_title: string;
        order_detail_box_description: string;
        order_detail_box_description1: string;
        order_detail_box_description2: string;
        order_detail_box_description3: string;
        order_detail_box_description4: string;
        order_detail_last_line: string;
        get_comment_title: string;
        get_comment_description: string;
    };
    cancel_reason: Array<{ id: string; fa: string; en: string }>;
    setting_url: {
        setting_page_rules_url: string;
        setting_page_privacy_url: string;
    };
    urls: {
        web_url: string;
        pwa_url: string;
        app_url: string;
    };
    zarinpal_auth: string;
    diet_preference: Array<{ id: number; fa_title: string }>;
    material_category: Array<{ id: number; fa_title: string }>;
    last_open_order: string;
    help: {
        problem: object;
        subject: object;
    };
    version: {
        android: [
            {
                version_number: string;
            },
            {
                update_link: string;
            },
            {
                force_update: string;
            },
        ];
        ios: [
            {
                version_number: string;
            },
            {
                update_link: string;
            },
            {
                force_update: string;
            },
        ];
    };
    package_view_status: Array<{ en: string; fa: string; color: string }>;
    help_title: Array<{
        id: number;
        text: string;
        subject: Array<{ id: number; fa_title: string }>;
    }>;
}

export interface ConstantTextResponseInterface extends ApiResponse {
    data: ConstantTextResponseData;
    message: string;
}
