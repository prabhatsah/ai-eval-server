export const buildSkillKey = (skill: string): string => {
  return skill
    .trim()
    .toLowerCase()
    .replace(/[.\-_]/g, '')
    .replace(/\s+/g, '');
};
