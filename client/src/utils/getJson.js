export function getJson(message) {
  const jsonPattern = /```json\s*([\s\S]*?)\s*```/g; // Pattern to match JSON blocks
  const jsonData = [];

  let match;
  while ((match = jsonPattern.exec(message)) !== null) {
    try {
      const parsedData = JSON.parse(match[1]);
      if (Array.isArray(parsedData)) {
        jsonData.push(...parsedData); // Spread to combine multiple JSON arrays
      } else {
        jsonData.push(parsedData); // Add individual JSON objects
      }
    } catch (error) {
      console.error("Error parsing JSON data:", error, match[1]);
    }
  }

  if (jsonData.length === 0) {
    console.warn("No valid JSON data found in the message.");
  }

  return jsonData;
}
