import { Test, TestingModule } from '@nestjs/testing';
import { MissionClientService } from './mission-client.service';

describe('MissionClientService', () => {
  let service: MissionClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MissionClientService],
    }).compile();

    service = module.get<MissionClientService>(MissionClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
