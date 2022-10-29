import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ClientService', () => {
  let service: ClientService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClientService],
    }).compile();

    service = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
