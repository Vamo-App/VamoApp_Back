import { Test, TestingModule } from '@nestjs/testing';
import { PlaceService } from './place.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { LogModule } from '../log/log.module';

describe('PlaceService', () => {
  let service: PlaceService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), LogModule],
      providers: [PlaceService],
    }).compile();

    service = module.get<PlaceService>(PlaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
