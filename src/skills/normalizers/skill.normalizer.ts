import { Injectable } from '@nestjs/common';
import { buildSkillKey } from '../utils/build-skill-key.util';
import { SKILL_ALIAS_REGISTRY } from '../registries/skill-alias.registry';
import { deduplicateSkills } from '../utils/deduplicate-skills.util';
import { NormalizedSkill } from '../interfaces/normalized-skill.interface';

@Injectable()
export class SkillNormalizer {
  normalize(skills: string[]): string[] {
    const normalizedSkills: string[] = [];

    for (const skill of skills) {
      const key = buildSkillKey(skill);

      const canonicalSkill =
        SKILL_ALIAS_REGISTRY[key] || this.fallbackNormalize(skill);

      normalizedSkills.push(canonicalSkill);
    }

    return deduplicateSkills(normalizedSkills);
  }

  normalizeDetailed(skills: string[]): NormalizedSkill[] {
    return skills.map((skill) => {
      const key = buildSkillKey(skill);

      const normalized =
        SKILL_ALIAS_REGISTRY[key] || this.fallbackNormalize(skill);

      return {
        original: skill,
        normalized,
        key,
      };
    });
  }

  private fallbackNormalize(skill: string): string {
    return skill.trim();
  }
}
