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
        const tags = await this.tagRepository.find();
        if (!tags.length)
            throw new BusinessLogicException(`No tags were found`, HttpStatus.NO_CONTENT);
        return tags;
    }

    async create(tag: string): Promise<Tag> {
        const existentTag = await this.tagRepository.findOne({ where: { tag } });
        if (existentTag)
            throw new BusinessLogicException(`Tag ${tag} already exists`, HttpStatus.BAD_REQUEST);
        const newTag = new Tag();
        newTag.tag = tag;
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
