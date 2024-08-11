import { Test, TestingModule } from '@nestjs/testing';
import { PrescribersService } from './prescribers.service';

describe('PrescribersService', () => {
  let service: PrescribersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrescribersService],
    }).compile();

    service = module.get<PrescribersService>(PrescribersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
