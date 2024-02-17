import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import * as Joi from 'joi';
import { ReportsModule } from './reports/reports.module';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module';
import { PhotosModule } from './photos/photos.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ArticlesModule,
    AuthenticationModule,
    ReportsModule,
    CategoriesModule,
    EventsModule,
    PhotosModule,
    CommentsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().required(),
      }),
    }),
  ],
})
export class AppModule {}
