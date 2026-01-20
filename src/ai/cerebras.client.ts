import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { aiNotificationSchema, instruction } from "./constants";

export class CerebrasClient {
    private client: Cerebras;

    constructor() {
        if (!process.env.CEREBRAS_API_KEY) {
            throw new Error("CEREBRAS_API_KEY is not defined");
        }
        this.client = new Cerebras({
            apiKey: process.env.CEREBRAS_API_KEY,
        });
    }

    async generateAiNotifications(input: any) {
        const response = await this.client.chat.completions.create({
            model: "gpt-oss-120b",
            messages: [
                {
                    "role": "system",
                    "content": instruction,
                },
                {
                    "role": "user",
                    "content": input,
                }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "AI-Notification-Schema",
                    strict: true,
                    schema: aiNotificationSchema
                }
            }
        })
        return response
    }
}