import { Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile:"../../packages/trpc/src/server"
    }),
    TodosModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
