import { Rank } from '../../rank/rank.entity';

export const jwtConstants = {
    JWT_EXPIRES_IN: '2h',
}

export const entitiesConstants = {
    DEFAULT_RANK: new Rank(),
}

entitiesConstants.DEFAULT_RANK.name = 'Beginner';
entitiesConstants.DEFAULT_RANK.level = 0;
entitiesConstants.DEFAULT_RANK.xpNext = 1000;

// experimental average error by the GEO API positionstack is 50m (for confidence=1)

export const minimumRadius = 0.050; // 500 meters, maxmimum is 10*0.050 = 0.5 km

export const maximumUncertainity = 0.0001; 
