import { Test, TestingModule } from '@nestjs/testing';
import { TelePrescribersController } from './tele-prescribers.controller';

describe('TelePrescribersController', () => {
  let controller: TelePrescribersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelePrescribersController],
    }).compile();

    controller = module.get<TelePrescribersController>(TelePrescribersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
