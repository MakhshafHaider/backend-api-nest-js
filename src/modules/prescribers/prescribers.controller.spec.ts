import { Test, TestingModule } from '@nestjs/testing';
import { PrescribersController } from './prescribers.controller';

describe('PrescribersController', () => {
  let controller: PrescribersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrescribersController],
    }).compile();

    controller = module.get<PrescribersController>(PrescribersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
