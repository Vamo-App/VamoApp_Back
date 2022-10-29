import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}

    async getAll(): Promise<Tag[]> {
        return await this.tagRepository.find();
    }

    async create(tag: string): Promise<Tag> {
        const newTag = new Tag();
        newTag.tag = tag;
        const existentTag = await this.tagRepository.findOne({ where: { tag } });
        if (existentTag)
            throw new BusinessLogicException(`Tag ${tag} already exists`, HttpStatus.PRECONDITION_FAILED);
        return await this.tagRepository.save(newTag);
    }

    async update(tag: string, newTag: string): Promise<Tag> {
        const tagToUpdate = await this.tagRepository.findOne({ where: { tag } });
        if (!tagToUpdate) 
            throw new BusinessLogicException(`Tag ${tag} was not found`, HttpStatus.NOT_FOUND);
        tagToUpdate.tag = newTag;
        await this.tagRepository.update(tag, tagToUpdate);
        return tagToUpdate;
    }

    async delete(tag: string): Promise<void> {
        const tagToDelete = await this.tagRepository.findOne({ where: { tag } });
        if (!tagToDelete) 
            throw new BusinessLogicException(`Tag ${tag} was not found`, HttpStatus.NOT_FOUND);
        await this.tagRepository.remove(tagToDelete);
    }    
}
