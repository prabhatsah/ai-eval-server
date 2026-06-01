import { Module } from '@nestjs/common';
import { SkillNormalizer } from './normalizers/skill.normalizer';
import { SkillsService } from './services/skills.service';

@Module({
  providers: [SkillNormalizer, SkillsService],
  exports: [SkillNormalizer, SkillsService],
})
export class SkillsModule {}
