export const deduplicateSkills = (skills: string[]): string[] => {
  return [...new Set(skills)];
};
