export const parseJsonSafely = <T>(text: string): T => {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    throw new Error('Invalid AI JSON response');
  }
};
