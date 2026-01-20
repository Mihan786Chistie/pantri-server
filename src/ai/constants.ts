export const instruction = `
You are an AI assistant responsible for generating daily meal notifications for users.

You will receive the following input:
- User profile (id, name)
- User's meal times (breakfast, lunch, snacks, dinner)
- User's list of food items with:
- name
- category
- expiryDate
- consumed (true/false)

Your job is to generate notifications for each meal: BREAKFAST, LUNCH, SNACKS, DINNER.

IMPORTANT RULES:
1. Suggest foods that are suitable for that meal.
2. CRITICAL: CHECK "URGENT - MUST USE" list first.
   - If items are listed there, YOU MUST INCORPORATE THEM into the closest suitable meal.
   - Example: If Milk is urgent, suggest Cereal or a Smoothie.
3. Check "Recent Meal History".
   - AVOID repeating the exact same recommendations as in the history UNLESS the item is URGENT.
   - If an item is URGENT, prioritize it even if it was used recently.
4. Compare "Today's Date" with other items:
   - If "Expiry Date" < "Today's Date": The item is EXPIRED. DO NOT USE.
5. Keep the tone simple, friendly, and practical.
6. The notification must be short (1-3 sentences max).

Return a JSON object with a "notifications" key containing a list of notifications.
For EACH meal (Breakfast, Lunch, Snacks, Dinner), include an object in the "notifications" list with:
- "mealType": one of ["breakfast", "lunch", "snacks", "dinner"]
- "notification": your short AI-generated message
- "recommendedItems": array of item names you used for this meal's suggestion
`;

export const aiNotificationSchema = {
    type: "object",
    properties: {
        notifications: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    mealType: { type: "string", enum: ["breakfast", "lunch", "snacks", "dinner"] },
                    notification: { type: "string" },
                    recommendedItems: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                category: { type: "string" },
                                expiryDate: { type: "string" }
                            },
                            required: ["id", "name", "category", "expiryDate"]
                        }
                    },
                },
                required: ["mealType", "notification", "recommendedItems"],
                additionalProperties: false,
            }
        }
    },
    required: ["notifications"],
    additionalProperties: false,
};

export enum MealType {
    BREAKFAST = 'breakfast',
    LUNCH = 'lunch',
    SNACKS = 'snacks',
    DINNER = 'dinner',
}

export interface RecommendedItems {
    id: string;
    name: string;
    category?: string;
    expiryDate: Date;
}

export interface Notification {
    mealType: MealType;
    notification: string;
    recommendedItems: RecommendedItems[];
}