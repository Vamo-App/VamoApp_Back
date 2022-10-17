import { MigrationInterface, QueryRunner } from 'typeorm';

export class DataSetup1544692010000 implements MigrationInterface {
    migration = `
        /*-- Clearing existing data
        DELETE FROM public.rank;
        
        -- Inserting Ranks
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Default', 0, 2000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Bronze', 1, 4000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Silver', 2, 8000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Gold', 3, 16000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Platinum', 4, 32000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Diamond', 5, 64000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Master', 6, 128000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Grand Master', 7, 256000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Challenger', 8, 512000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Legend', 9, 1024000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Myth', 10, 2048000);
        -- Maybe delete this XD
        INSERT INTO public.rank (name, level, xpNext) VALUES ('God', 11, 4096000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Immortal', 12, 8192000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Eternal', 13, 16384000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Unlimited', 14, 32768000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Infinity', 15, 65536000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Universe', 16, 131072000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Multiverse', 17, 262144000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Omni', 18, 524288000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Cosmic', 19, 1048576000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Universal', 20, 2097152000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Galactic', 21, 4194304000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Planetary', 22, 8388608000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Solar', 23, 16777216000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Lunar', 24, 33554432000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Terrestrial', 25, 67108864000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Astral', 26, 134217728000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Celestial', 27, 268435456000);
        INSERT INTO public.rank (name, level, xpNext) VALUES ('Aetherial', 28, 536870912000);*/
    `

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.migration);
    }

    public async down(queryRunner: QueryRunner): Promise<any> { }
}
    