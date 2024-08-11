import { Test, TestingModule } from '@nestjs/testing';
import { WorkExperienceController } from './work_experience.controller';

describe('WorkExperienceController', () => {
  let controller: WorkExperienceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkExperienceController],
    }).compile();

    controller = module.get<WorkExperienceController>(WorkExperienceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
