import { Test, TestingModule } from '@nestjs/testing';
import { FiestaGateway } from './fiesta.gateway';

describe('FiestaGateway', () => {
  let gateway: FiestaGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FiestaGateway],
    }).compile();

    gateway = module.get<FiestaGateway>(FiestaGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
