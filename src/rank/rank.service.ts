import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Rank } from './rank.entity';

@Injectable()
export class RankService {
    constructor(
        @InjectRepository(Rank)
        private readonly rankRepository: Repository<Rank>,
    ) {}

    async getAll(): Promise<Rank[]> {
        const ranks = await this.rankRepository.find();
        if (!ranks.length)
            throw new BusinessLogicException('No ranks were found', HttpStatus.NO_CONTENT);
        return ranks;
    }

    async create(rank: Rank): Promise<Rank> {
        const rankFound = await this.rankRepository.findOne({ where: { name: rank.name } });
        if (rankFound)
            throw new BusinessLogicException(`Rank ${rank.name} already exists`, HttpStatus.BAD_REQUEST);

        const previousRank = await this.rankRepository.findOne({ where: { level: rank.level - 1 } });
        if (!previousRank)
            if (rank.level !== 0)
                throw new BusinessLogicException(`Previous rank (${rank.level - 1}) must exist`, HttpStatus.BAD_REQUEST);
        
        const rankLevelFound = await this.rankRepository.findOne({ where: { level: rank.level } });
        if (rankLevelFound)
            // move all ranks with level >= rank.level to level + 1
            await this.rankRepository.createQueryBuilder()
                .update(Rank)
                .set({ level: () => 'level + 1' })
                .where('level >= :level', { level: rank.level })
                .execute();
        
        return await this.rankRepository.save(rank);
    }

    async update(rankName: string, rank: Rank): Promise<Rank> {
        let rankToUpdate = await this.rankRepository.findOne({ where: { name: rankName } });
        if (!rankToUpdate)
            throw new BusinessLogicException(`Rank ${rankName} was not found`, HttpStatus.NOT_FOUND);
        
        rankToUpdate = { ...rankToUpdate, ...rank }
        await this.rankRepository.update(rankName, rankToUpdate);
        return rankToUpdate;
    }

    async delete(rankName: string): Promise<void> {
        const rankToDelete = await this.rankRepository.findOne({ where: { name: rankName } });
        if (!rankToDelete) 
            throw new BusinessLogicException(`Rank ${rankName} was not found`, HttpStatus.NOT_FOUND);
        
        await this.rankRepository.remove(rankToDelete);

        // move all ranks with level > rankToDelete.level to level - 1
        await this.rankRepository.createQueryBuilder()
            .update(Rank)
            .set({ level: () => 'level - 1' })
            .where('level > :level', { level: rankToDelete.level })
            .execute();
    }
}
