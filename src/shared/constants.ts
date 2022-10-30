import { Rank } from '../rank/rank.entity';

export const jwtConstants = {
    JWT_EXPIRES_IN: '2h',
}

export const entitiesConstants = {
    DEFAULT_RANK: new Rank(),
}

export const minimumRadius = 0.100; // 100 meters, maxmimum is 10*0.100 = 1.0 km

entitiesConstants.DEFAULT_RANK.name = 'Beginner';
entitiesConstants.DEFAULT_RANK.level = 0;
entitiesConstants.DEFAULT_RANK.xpNext = 1000;
