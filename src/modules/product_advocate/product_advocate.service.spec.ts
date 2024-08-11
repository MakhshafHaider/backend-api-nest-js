import { Test, TestingModule } from '@nestjs/testing';
import { ProductAdvocateService } from './product_advocate.service';

describe('ProductAdvocateService', () => {
  let service: ProductAdvocateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductAdvocateService],
    }).compile();

    service = module.get<ProductAdvocateService>(ProductAdvocateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
