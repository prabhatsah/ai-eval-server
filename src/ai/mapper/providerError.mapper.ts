export const extractProviderError = (
  data: any,
  fallback = 'Unknown AI error',
): string => {
  if (!data) return fallback;

  // plain string response
  if (typeof data === 'string') {
    return data;
  }

  // OpenAI / Gemini
  if (typeof data.error === 'string') {
    return data.error;
  }

  if (typeof data.error?.message === 'string') {
    return data.error.message;
  }

  // Ollama / local models
  if (typeof data.message === 'string') {
    return data.message;
  }

  // other APIs
  if (typeof data.detail === 'string') {
    return data.detail;
  }

  // validation arrays
  if (Array.isArray(data.errors)) {
    return data.errors.join(', ');
  }

  // final fallback
  return fallback;
};
