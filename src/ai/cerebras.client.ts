import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { Logger } from "@nestjs/common";
import { aiNotificationSchema, instruction } from "./constants";

const MODELS = ["gpt-oss-120b", "llama3.1-8b", "llama-3.3-70b"] as const;
const HARD_TIMEOUT_MS = 60_000;

export class CerebrasClient {
    private readonly logger = new Logger(CerebrasClient.name);
    private client: Cerebras;

    constructor() {
        if (!process.env.CEREBRAS_API_KEY) {
            throw new Error("CEREBRAS_API_KEY is not defined");
        }
        this.client = new Cerebras({
            apiKey: process.env.CEREBRAS_API_KEY,
            timeout: 30000,
        });
    }

    private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
        const timeout = new Promise<never>((_, reject) => {
            const id = setTimeout(() => {
                clearTimeout(id);
                reject(new Error(`Cerebras request timed out after ${ms}ms`));
            }, ms);
        });
        return Promise.race([promise, timeout]);
    }

    async generateAiNotifications(input: any) {
        let lastError: unknown;

        for (const model of MODELS) {
            try {
                this.logger.debug(`Trying model: ${model}`);
                const response = await this.withTimeout(
                    this.client.chat.completions.create({
                        model,
                        messages: [
                            { role: "system", content: instruction },
                            { role: "user", content: input },
                        ],
                        response_format: {
                            type: "json_schema",
                            json_schema: {
                                name: "AI-Notification-Schema",
                                strict: true,
                                schema: aiNotificationSchema,
                            },
                        },
                    }),
                    HARD_TIMEOUT_MS,
                );
                return response;
            } catch (error) {
                this.logger.warn(`Model ${model} failed: ${(error as Error).message}. ${MODELS.indexOf(model) < MODELS.length - 1 ? "Trying next model..." : "No more models to try."}`);
                lastError = error;
            }
        }

        throw lastError;
    }
}