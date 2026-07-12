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
            const errText = await response.text();
            console.error('AI API Error:', response.status, errText);
            if (response.status === 429) {
                return 'API rate limit exceeded. Please try again in a few minutes or write a description manually.';
            }
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
            const errText = await response.text();
            console.error('AI API Error:', response.status, errText);
            if (response.status === 429) {
                return 'API rate limit exceeded. Please try again in a few minutes.';
            }
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

/**
 * Generates an attractive, short title for the car listing.
 * @param {Object} carData - The details of the car.
 * @returns {Promise<string>} The generated title in plain text.
 */
export async function generateTitle(carData) {
    if (!API_KEY) {
        return 'AI title unavailable';
    }

    const prompt = `You are an expert car copywriter.
Generate a short, attractive, and professional title for this car listing.
Requirements:
- Maximum 70 characters
- No clickbait
- Professional tone
- English language
- Return ONLY the title text, nothing else. No quotes, no markdown.

Examples of good titles:
- BMW 320d xDrive 2021 • 190 HP
- Toyota Corolla Hybrid 2022
- VW Golf 7 2.0 TDI DSG

Vehicle Details:
Brand: ${carData.make || 'Unknown'}
Model: ${carData.model || 'Unknown'}
Year: ${carData.year || 'Unknown'}
Fuel Type: ${carData.fuel_type || 'Unknown'}
Horsepower: ${carData.horsepower || 'Unknown'}
Transmission: ${carData.transmission || 'Unknown'}
Mileage: ${carData.mileage || 'Unknown'} km`;

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
                    max_tokens: 50
                })
            };
        }

        const response = await fetch(fetchUrl, fetchOptions);

        if (!response.ok) {
            const errText = await response.text();
            console.error('AI API Error:', response.status, errText);
            if (response.status === 429) {
                return 'Error: AI Quota Exceeded (Rate Limit). Please try again later.';
            }
            return 'AI Error';
        }

        const data = await response.json();
        
        let title = '';
        if (isGeminiNative) {
            if (data && data.candidates && data.candidates.length > 0) {
                title = data.candidates[0].content.parts[0].text.trim();
            }
        } else {
            if (data && data.choices && data.choices.length > 0) {
                title = data.choices[0].message.content.trim();
            }
        }
        
        if (title) {
            // Remove surrounding quotes if the AI added them
            if (title.startsWith('"') && title.endsWith('"')) {
                title = title.substring(1, title.length - 1);
            }
            if (title.length > 70) {
                title = title.substring(0, 70);
            }
            return title;
        }

        throw new Error('Invalid response format from AI service.');
    } catch (error) {
        console.error('Failed to generate title:', error);
        return 'AI Network Error';
    }
}

/**
 * Extracts car specifications from free text.
 * @param {string} text - The free text description.
 * @returns {Promise<Object|null>} The extracted specifications as a JSON object, or null on error.
 */
export async function extractSpecifications(text) {
    if (!API_KEY || !text || text.trim() === '') {
        return null;
    }

    const prompt = `You are a data extraction assistant.
Extract the following car specifications from the text provided below.
Return ONLY a valid JSON object. Do not include markdown formatting like \`\`\`json.
If a value is not found, omit the key or set it to null. Do not guess or invent values.
Extract the exact values where possible (e.g. year as a number, horsepower as a number).

Keys to extract:
- brand (string)
- model (string)
- year (number)
- mileage (number)
- fuel (string: gasoline, diesel, electric, hybrid, lpg)
- transmission (string: automatic, manual)
- horsepower (number)
- color (string)
- engine (string)
- price (number)

Text:
${text}`;

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
                    temperature: 0.1,
                    max_tokens: 500
                })
            };
        }

        const response = await fetch(fetchUrl, fetchOptions);

        if (!response.ok) {
            const errText = await response.text();
            console.error('AI API Error:', response.status, errText);
            return null;
        }

        const data = await response.json();
        
        let resultText = '';
        if (isGeminiNative) {
            if (data && data.candidates && data.candidates.length > 0) {
                resultText = data.candidates[0].content.parts[0].text.trim();
            }
        } else {
            if (data && data.choices && data.choices.length > 0) {
                resultText = data.choices[0].message.content.trim();
            }
        }
        
        if (resultText) {
            // Clean up any markdown json blocks if the AI ignored the instruction
            resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
            
            try {
                const parsed = JSON.parse(resultText);
                return parsed;
            } catch (parseError) {
                console.error('Failed to parse JSON from AI response:', resultText);
                return null;
            }
        }

        return null;
    } catch (error) {
        console.error('Failed to extract specifications:', error);
        return null;
    }
}

/**
 * Generates 10 SEO search keywords for a car listing.
 * @param {Object} carData - The details of the car.
 * @returns {Promise<string>} A comma-separated string of exactly 10 keywords.
 */
export async function generateKeywords(carData) {
    if (!API_KEY) {
        return '';
    }

    const prompt = `You are an SEO expert.
Generate exactly 10 search keywords for this car listing.
The keywords should include important details that buyers search for, such as brand, model, fuel type, transmission, body type, specific features, horsepower, year, color, or terms like "Used car".
Return ONLY the 10 keywords as a comma-separated list, nothing else. No numbers, no markdown.

Examples of good keywords:
BMW, 320d, Diesel, Automatic, Sedan, xDrive, Used car, 190 HP, 2019, Black

Vehicle Details:
Title: ${carData.title || 'Unknown'}
Brand: ${carData.make || carData.brand || 'Unknown'}
Model: ${carData.model || 'Unknown'}
Year: ${carData.year || 'Unknown'}
Fuel Type: ${carData.fuel_type || 'Unknown'}
Horsepower: ${carData.horsepower || 'Unknown'}
Transmission: ${carData.transmission || 'Unknown'}
Color: ${carData.color || 'Unknown'}
Description: ${carData.description ? carData.description.substring(0, 500) : 'None'}`;

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
                    temperature: 0.5,
                    max_tokens: 100
                })
            };
        }

        const response = await fetch(fetchUrl, fetchOptions);

        if (!response.ok) {
            const errText = await response.text();
            console.error('AI API Error:', response.status, errText);
            return '';
        }

        const data = await response.json();
        
        let resultText = '';
        if (isGeminiNative) {
            if (data && data.candidates && data.candidates.length > 0) {
                resultText = data.candidates[0].content.parts[0].text.trim();
            }
        } else {
            if (data && data.choices && data.choices.length > 0) {
                resultText = data.choices[0].message.content.trim();
            }
        }
        
        if (resultText) {
            return resultText;
        }

        return '';
    } catch (error) {
        console.error('Failed to generate keywords:', error);
        return '';
    }
}

/**
 * Generates an HTML formatted comparison between two car listings.
 * @param {Object} car1 - The details of the first car.
 * @param {Object} car2 - The details of the second car.
 * @returns {Promise<string>} The generated comparison in HTML format.
 */
export async function generateCarComparison(car1, car2) {
    if (!API_KEY) {
        return '<div class="alert alert-warning">AI service is currently unavailable.</div>';
    }

    const prompt = `You are an expert automotive reviewer.
Generate a detailed comparison between two cars based on their specifications.
The output MUST be formatted as an HTML fragment (do not include <html>, <head>, or <body> tags, just the content).
Use Bootstrap 5 classes for styling (e.g., tables, badges, cards, text colors).
Do not use markdown blocks like \`\`\`html.
The comparison MUST include the following sections exactly:
1. Engine
2. Power
3. Economy
4. Comfort
5. Equipment
6. Advantages (for each car)
7. Disadvantages (for each car)
8. Recommendation (overall conclusion)

Car 1 Details:
Brand/Model: ${car1.make || 'Unknown'} ${car1.model || ''}
Year: ${car1.year || 'Unknown'}
Price: €${car1.price || 'Unknown'}
Fuel: ${car1.fuel_type || 'Unknown'}
Engine: ${car1.engine || 'Unknown'}
Transmission: ${car1.transmission || 'Unknown'}
Horsepower: ${car1.horsepower || 'Unknown'}
Mileage: ${car1.mileage || 'Unknown'} km
Description: ${car1.description || 'None'}

Car 2 Details:
Brand/Model: ${car2.make || 'Unknown'} ${car2.model || ''}
Year: ${car2.year || 'Unknown'}
Price: €${car2.price || 'Unknown'}
Fuel: ${car2.fuel_type || 'Unknown'}
Engine: ${car2.engine || 'Unknown'}
Transmission: ${car2.transmission || 'Unknown'}
Horsepower: ${car2.horsepower || 'Unknown'}
Mileage: ${car2.mileage || 'Unknown'} km
Description: ${car2.description || 'None'}`;

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
                    max_tokens: 1500
                })
            };
        }

        const response = await fetch(fetchUrl, fetchOptions);

        if (!response.ok) {
            console.error('AI API Error:', response.status);
            return '<div class="alert alert-danger">Failed to generate comparison. AI service error.</div>';
        }

        const data = await response.json();
        
        let resultText = '';
        if (isGeminiNative) {
            if (data && data.candidates && data.candidates.length > 0) {
                resultText = data.candidates[0].content.parts[0].text.trim();
            }
        } else {
            if (data && data.choices && data.choices.length > 0) {
                resultText = data.choices[0].message.content.trim();
            }
        }
        
        if (resultText) {
            // Remove markdown HTML wrappers if present
            resultText = resultText.replace(/\`\`\`html/g, '').replace(/\`\`\`/g, '').trim();
            return resultText;
        }

        return '<div class="alert alert-danger">Invalid response from AI.</div>';
    } catch (error) {
        console.error('Failed to generate comparison:', error);
        return '<div class="alert alert-danger">Network error while connecting to AI.</div>';
    }
}
