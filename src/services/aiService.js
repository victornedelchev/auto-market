/**
 * AI Service for AutoMarket AI.
 * Handles communication with the AI provider to generate and improve car descriptions.
 */

const API_URL = import.meta.env.VITE_AI_API_URL || 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_AI_API_KEY;

/**
 * Generates an attractive car description based on the provided data.
 * @param {Object} carData - The details of the car (make, model, year, etc.).
 * @returns {Promise<string>} The generated description in plain text.
 */
export async function generateDescription(carData) {
    if (!API_KEY) {
        return 'AI service is currently unavailable: API key is not configured. Please write a description manually.';
    }

    const prompt = `You are a professional automotive sales copywriter.
Write in English.

Requirements:
Professional tone
Easy to read
Maximum 180 words
No marketing exaggerations
Do not invent missing information
Mention only supplied specifications
End with a short invitation for contact
Return only the description text.
No markdown.
No headings.

Vehicle Details:
Brand: ${carData.make || 'Unknown'}
Model: ${carData.model || 'Unknown'}
Year: ${carData.year || 'Unknown'}
Price: €${carData.price || 'Unknown'}
Mileage: ${carData.mileage || 'Unknown'} km
Fuel Type: ${carData.fuel_type || 'Unknown'}
Transmission: ${carData.transmission || 'Unknown'}
Horsepower: ${carData.horsepower || 'Unknown'}
Color: ${carData.color || 'Unknown'}`;

    try {
        const isGeminiNative = API_URL.includes('generateContent');
        let fetchUrl = API_URL;
        let fetchOptions = {};

        if (isGeminiNative) {
            // Native Gemini format: Key in query string, different body structure
            const urlObj = new URL(API_URL);
            urlObj.searchParams.set('key', API_KEY);
            fetchUrl = urlObj.toString();
            
            fetchOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            };
        } else {
            // OpenAI / OpenAI-compatible format
            fetchOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    max_tokens: 500
                })
            };
        }

        const response = await fetch(fetchUrl, fetchOptions);

        if (!response.ok) {
            console.error('AI API Error:', response.status, await response.text());
            return 'Sorry, the AI is temporarily unavailable and could not generate a description at this time. Please try again later or write a description manually.';
        }

        const data = await response.json();
        
        if (isGeminiNative) {
            if (data && data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text.trim();
            }
        } else {
            if (data && data.choices && data.choices.length > 0) {
                return data.choices[0].message.content.trim();
            }
        }
        
        throw new Error('Invalid response format from AI service.');
    } catch (error) {
        console.error('Failed to generate description:', error);
        return 'We encountered a network error while connecting to the AI service. Please check your connection and try again, or write your own description.';
    }
}

/**
 * Improves an existing car description to make it more professional and engaging.
 * @param {string} existingDescription - The current description to improve.
 * @returns {Promise<string>} The improved description in plain text.
 */
export async function improveDescription(existingDescription) {
    if (!API_KEY) {
        return 'AI service is currently unavailable: API key is not configured.';
    }

    if (!existingDescription || existingDescription.trim() === '') {
        return 'Please provide an existing description for the AI to improve.';
    }

    const prompt = `You are an editor.

Improve grammar.
Improve punctuation.
Improve readability.
Keep all factual information unchanged.
Never invent specifications.
Keep the language English.
Return only the improved text.

Original description:
${existingDescription}`;

    try {
        const isGeminiNative = API_URL.includes('generateContent');
        let fetchUrl = API_URL;
        let fetchOptions = {};

        if (isGeminiNative) {
            const urlObj = new URL(API_URL);
            urlObj.searchParams.set('key', API_KEY);
            fetchUrl = urlObj.toString();
            
            fetchOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            };
        } else {
            fetchOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    max_tokens: 500
                })
            };
        }

        const response = await fetch(fetchUrl, fetchOptions);

        if (!response.ok) {
            console.error('AI API Error:', response.status, await response.text());
            return 'Sorry, the AI is temporarily unavailable and could not improve the description at this time. Please try again later.';
        }

        const data = await response.json();
        
        if (isGeminiNative) {
            if (data && data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text.trim();
            }
        } else {
            if (data && data.choices && data.choices.length > 0) {
                return data.choices[0].message.content.trim();
            }
        }
        
        throw new Error('Invalid response format from AI service.');
    } catch (error) {
        console.error('Failed to improve description:', error);
        return 'We encountered a network error while connecting to the AI service. Please check your connection and try again.';
    }
}
