import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Authorization, Roles } from '@common/decorators/auth.decorator';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TaskResponseDto } from './dto/task-response.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { ReqUser } from '@common/decorators/req-user.decorator';
import { User } from '../users/entities/user.entity';
import { Role } from '@common/enums/common.enum';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CommonResponseDto } from '@common/dto/common-response.dto';
import { SearchTasksResponseDto } from './dto/search-tasks-response.dto';

@Controller('tasks')
@ApiTags('tasks')
@Authorization()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Search tasks' })
  @ApiOkResponse({ type: SearchTasksResponseDto })
  searchTasks(): Promise<SearchTasksResponseDto> {
    return this.tasksService.searchTasks();
  }

  @Get(':taskId')
  @Roles(Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Get task detail' })
  @ApiOkResponse({ type: TaskResponseDto })
  getTaskDetail(
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ): Promise<TaskResponseDto> {
    return this.tasksService.getTaskDetail(taskId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiCreatedResponse({ type: TaskResponseDto })
  createTask(
    @ReqUser() user: User,
    @Body() body: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.createTask(user, body);
  }

  @Patch(':taskId')
  // Admin, manager & contributor can update task
  @Roles(Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Update task' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({ type: TaskResponseDto })
  updateTask(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @ReqUser() user: User,
    @Body() body: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.updateTask(taskId, user, body);
  }

  @Delete(':taskId')
  // Admin, manager & contributor can delete task
  @Roles(Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR)
  @ApiOperation({ summary: 'Delete task' })
  @ApiOkResponse({ type: CommonResponseDto })
  deleteTask(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @ReqUser() user: User,
  ): Promise<CommonResponseDto> {
    return this.tasksService.deleteTask(taskId, user);
  }
}
