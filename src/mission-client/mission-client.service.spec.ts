import { Test, TestingModule } from '@nestjs/testing';
import { MissionClientService } from './mission-client.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('MissionClientService', () => {
  let service: MissionClientService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MissionClientService],
    }).compile();

    service = module.get<MissionClientService>(MissionClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
