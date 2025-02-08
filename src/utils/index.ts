export function parseIfJson(data: any) {
  if (typeof data !== "string") {
    // If it's an object or array, recursively check all key-value pairs
    if (typeof data === "object" && data !== null) {
      for (const key in data) {
        if (typeof data[key] === "string") {
          const parsedValue = tryParseJson(data[key]);
          if (parsedValue !== data[key]) {
            data[key] = parsedValue; // Replace only if parsing is successful
          }
        }
      }
    }
    return data;
  }

  return tryParseJson(data); // If it's a string, try parsing directly
}

export function tryParseJson(value: any) {
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" ? parsed : value;
  } catch {
    return value; // Return original value if parsing fails
  }
}
