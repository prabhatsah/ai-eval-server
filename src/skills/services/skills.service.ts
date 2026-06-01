import { Injectable } from '@nestjs/common';
import { SkillNormalizer } from '../normalizers/skill.normalizer';

@Injectable()
export class SkillsService {
  constructor(private readonly skillNormalizer: SkillNormalizer) {}

  normalizeSkills(skills: string[]): string[] {
    return this.skillNormalizer.normalize(skills);
  }
}
