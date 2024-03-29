import { Test, TestingModule } from '@nestjs/testing';
import { MissionService } from './mission.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('MissionService', () => {
  let service: MissionService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MissionService],
    }).compile();

    service = module.get<MissionService>(MissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
