import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodoRouter } from './todo.router';

@Module({
  providers: [TodosService, TodoRouter]
})
export class TodosModule {}
