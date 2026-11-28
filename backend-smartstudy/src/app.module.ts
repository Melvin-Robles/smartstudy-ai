import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { StudyModule } from './study/study.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', 'backend-smartstudy/.env'] }),
    PrismaModule,
    AuthModule,
    DocumentsModule,
    StudyModule,
  ],
})
export class AppModule {}
