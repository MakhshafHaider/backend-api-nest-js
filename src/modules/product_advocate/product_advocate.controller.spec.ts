import { Test, TestingModule } from '@nestjs/testing';
import { ProductAdvocateController } from './product_advocate.controller';

describe('ProductAdvocateController', () => {
  let controller: ProductAdvocateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductAdvocateController],
    }).compile();

    controller = module.get<ProductAdvocateController>(ProductAdvocateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
