import { HttpStatus, Injectable } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { ProjectStatus } from '../projects/entities/project.entity';
import { Role, SortType } from '@common/enums/common.enum';
import { TaskStatus } from './entities/task.entity';
import { Transactional } from 'typeorm-transactional';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { verifyDueDate } from '@common/utils/common';
import { CommonResponseDto } from '@common/dto/common-response.dto';
import { SearchTasksResponseDto } from './dto/search-tasks-response.dto';
import { SearchTasksDto, TASK_SORT_FIELD } from './dto/search-tasks.dto';
import { Brackets } from 'typeorm';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ActivityLogCategory } from '../activity-logs/entities/activity-log.entity';
import { MailerService } from '../../mailer/mailer.service';
import { UsersService } from '../users/users.service';
import { ResponseException } from 'src/filters/exception-response';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectsService: ProjectsService,
    private readonly activityLogsService: ActivityLogsService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async searchTasks(query: SearchTasksDto): Promise<SearchTasksResponseDto> {
    const {
      search,
      projectId,
      assignee,
      dueDateFrom,
      dueDateTo,
      status,
      page,
      limit,
      sort = SortType.DESC,
      sortBy = TASK_SORT_FIELD.CREATED_AT,
    } = query;
    console.log('>> query:', query);
    const qb = this.taskRepository
      .createQueryBuilder('task')
      .innerJoinAndSelect('task.project', 'project')
      .innerJoinAndSelect('task.assignee', 'assignee')
      .innerJoinAndSelect('project.members', 'members');

    // filter by search keyword for task name/ description
    if (search) {
      const searchTrim = search.trim()?.toLowerCase()?.replace(/ +/g, ' ');
      qb.andWhere(
        new Brackets((qb) => {
          qb.orWhere(`LOWER(task.name) LIKE :search`, {
            search: `%${searchTrim}%`,
          }).orWhere(`LOWER(task.description) LIKE :search`, {
            search: `%${searchTrim}%`,
          });
        }),
      );
    }

    // filter by project
    if (projectId) {
      qb.andWhere(`task.projectId = :projectId`, { projectId });
    }

    // filter by assignee name/ email
    if (assignee) {
      const assigneeSearchTrim = assignee
        .trim()
        ?.toLowerCase()
        ?.replace(/ +/g, ' ');
      qb.andWhere(
        new Brackets((qb) => {
          qb.orWhere(`LOWER(assignee.email) LIKE :search`, {
            search: `%${assigneeSearchTrim}%`,
          }).orWhere(
            "CONCAT(assignee.firstName, ' ', assignee.lastName) LIKE :search",
            {
              search: `%${assigneeSearchTrim}%`,
            },
          );
        }),
      );
    }

    // filter by due date
    if (dueDateFrom && !dueDateTo) {
      qb.andWhere('task.dueDate >= :dueDateFrom', {
        dueDateFrom,
      });
    }
    if (!dueDateFrom && dueDateTo) {
      qb.andWhere('task.dueDate <= :dueDateTo', {
        dueDateTo,
      });
    }
    if (dueDateFrom && dueDateTo) {
      qb.andWhere(
        '(task.dueDate >= :dueDateFrom AND task.dueDate <= :dueDateTo)',
        { dueDateFrom, dueDateTo },
      );
    }

    // filter by task status
    if (status) {
      qb.andWhere(`task.status = :status`, { status });
    }

    // sort
    qb.orderBy(`task.${sortBy}`, sort);

    const [tasks, itemCount] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: tasks,
      total: itemCount,
    };
  }

  async getTaskDetail(taskId: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('project.members', 'members')
      .where('task.id = :taskId', { taskId })
      .getOne();

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: task,
    };
  }

  @Transactional()
  async createTask(user: User, body: CreateTaskDto) {
    const { id: userId, role: userRole } = user;
    const { name, description, dueDate, projectId, assigneeId } = body;

    const { data: project } =
      await this.projectsService.getProjectDetail(projectId);

    // verify project status
    if (!project || project.status === ProjectStatus.COMPLETED) {
      throw new ResponseException('Project not found!');
    }
    const { members } = project;

    // verify due date
    const isDueDateValid = verifyDueDate(dueDate);
    if (!isDueDateValid) {
      throw new ResponseException('Invalid task due date!');
    }

    // verify team manager
    const teamMemberIds = members.map((m) => m.userId);
    const managerUserId = teamMemberIds.find((tmId) => tmId === userId);
    if (userRole === Role.MANAGER && !managerUserId) {
      throw new ResponseException('Project not found!', HttpStatus.NOT_FOUND);
    }

    // verify assignee
    if (!teamMemberIds.includes(assigneeId)) {
      throw new ResponseException('Invalid assignee!');
    }

    // create task
    const newTask = await this.taskRepository.save({
      name,
      description,
      dueDate,
      projectId,
      assigneeId,
      status: TaskStatus.TODO,
    });

    // send email notification to asingee
    const assignee = await this.usersService.findUserById(assigneeId);
    this.mailerService.sendTaskAssignedEmail({
      assigneeFullName: `${assignee.firstName} ${assignee.lastName}`,
      taskId: newTask.id,
      dueDate: newTask.dueDate,
      taskName: newTask.name,
      taskUrl: 'some url...',
      toEmail: assignee.email,
    });

    // save activity log
    await this.activityLogsService.create({
      content: `Task ${newTask.name} of project ${project.name} has been created.`,
      category: ActivityLogCategory.TASKS,
      createdBy: user.id,
      projectId: project.id,
      taskId: newTask.id,
    });

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      data: newTask,
    };
  }

  @Transactional()
  async updateTask(
    taskId: string,
    user: User,
    body: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const { id: userId, role: userRole } = user;
    const { assigneeId, dueDate, status } = body;

    const task = await this.taskRepository
      .createQueryBuilder('task')
      .innerJoinAndSelect('task.project', 'project')
      .innerJoinAndSelect('project.members', 'members')
      .where('task.id = :taskId', { taskId })
      .andWhere('task.status <> :status', { status: TaskStatus.COMPLETED })
      .getOne();

    if (!task) {
      throw new ResponseException('Task not found!', HttpStatus.NOT_FOUND);
    }
    const {
      status: currentStatus,
      assigneeId: currentassigneeId,
      project: { members },
    } = task;

    // verify user permission
    if (userRole !== Role.ADMIN && userId !== currentassigneeId) {
      throw new ResponseException('Task not found!', HttpStatus.NOT_FOUND);
    }

    // verify assignee update
    const teamMemberIds = members.map((m) => m.userId);
    if (assigneeId && !teamMemberIds.includes(assigneeId)) {
      throw new ResponseException('Invalid assignee!');
    }

    // verify due date update
    if (dueDate) {
      const isDueDateValid = verifyDueDate(dueDate);
      if (!isDueDateValid) {
        throw new ResponseException('Invalid task due date!');
      }
    }

    // verify status update
    if (status) {
      const isStatusValid = this.verifyTaskStatusUpdate(currentStatus, status);
      if (!isStatusValid) {
        throw new ResponseException('Invalid status update!');
      }
    }

    // update task
    delete body?.projectId;
    const updatedTask = await this.taskRepository.save({
      id: task.id,
      ...body,
    });

    // save activity log
    await this.activityLogsService.create({
      content: `Task ${updatedTask.name} of project ${task.project.name} has been updated.`,
      category: ActivityLogCategory.TASKS,
      createdBy: user.id,
      projectId: task.project.id,
      taskId: updatedTask.id,
    });

    // TODO: send notification to new asingee

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: updatedTask,
    };
  }

  async deleteTask(taskId: string, user: User): Promise<CommonResponseDto> {
    const { id: userId, role: userRole } = user;
    const qb = this.taskRepository
      .createQueryBuilder('task')
      .innerJoinAndSelect('task.project', 'project')
      .innerJoinAndSelect('project.members', 'members')
      .where('task.id = :taskId', { taskId })
      .andWhere('task.status = :status', { status: TaskStatus.TODO });

    // contributor only can delete their task
    if (userRole === Role.CONTRIBUTOR) {
      qb.andWhere('task.assigneeId = :assigneeId', { assigneeId: userId });
    }

    const task = await qb.getOne();
    if (!task) {
      throw new ResponseException('Task not found!', HttpStatus.NOT_FOUND);
    }

    // manager only can delete their tasks inside their project
    const teamMemberIds = task.project.members.map((m) => m.userId);
    if (userRole === Role.MANAGER && !teamMemberIds.includes(userId)) {
      throw new ResponseException('Task not found!', HttpStatus.NOT_FOUND);
    }

    await task.softRemove();

    // save activity log
    await this.activityLogsService.create({
      content: `Task ${task.name} of project ${task.project.name} has been deleted.`,
      category: ActivityLogCategory.TASKS,
      createdBy: user.id,
      projectId: task.project.id,
      taskId: task.id,
    });

    return {
      statusCode: HttpStatus.OK,
      success: true,
    };
  }

  //#region helper
  private verifyTaskStatusUpdate(
    currentStatus: TaskStatus,
    updateStatus: TaskStatus,
  ) {
    const correctCurrentStatuses: TaskStatus[] = [updateStatus];
    switch (updateStatus) {
      case TaskStatus.IN_PROGRESS:
        correctCurrentStatuses.push(TaskStatus.TODO);
        break;
      case TaskStatus.COMPLETED:
        correctCurrentStatuses.push(TaskStatus.IN_PROGRESS);
        break;
      default:
        break;
    }
    if (!correctCurrentStatuses.includes(currentStatus)) {
      return false;
    }

    return true;
  }
  //#endregion helper
}
