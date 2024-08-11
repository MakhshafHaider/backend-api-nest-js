import { Test, TestingModule } from '@nestjs/testing';
import { TelePrescribersService } from './tele-prescribers.service';

describe('TelePrescribersService', () => {
  let service: TelePrescribersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelePrescribersService],
    }).compile();

    service = module.get<TelePrescribersService>(TelePrescribersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
