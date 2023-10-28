import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { GetUser } from '../auth/decorator';
import { EditProjectDto, ProjectDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { TaskService } from './task/task.service';
import { EditTaskDto, TaskDto } from './task/dto';

@UseGuards(JwtGuard)
@Controller('projects')
export class ProjectController {
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
  ) {}

  // Everything about projects
  @Post()
  createProject(@GetUser('id') userId: number, @Body() dto: ProjectDto) {
    return this.projectService.createProject(userId, dto);
  }

  @Get(':projectId')
  getProjectById(
    @GetUser('id') userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.getProjectAndTasksById(userId, projectId);
  }

  @Get()
  getProjects(@GetUser('id') userId: number) {
    return this.projectService.getProjects(userId);
  }

  @Patch(':projectId')
  updateProjectById(
    @GetUser('id') userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: EditProjectDto,
  ) {
    return this.projectService.updateProjectById(userId, projectId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':projectId')
  deleteProjectById(
    @GetUser('id') userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectService.deleteProjectById(userId, projectId);
  }

  // Everything about tasks
  @Post(':projectId')
  createTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: TaskDto,
  ) {
    return this.taskService.createTask(projectId, dto);
  }

  @Get(':projectId/:taskId')
  getTaskById(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.getTaskById(projectId, taskId);
  }

  @Patch(':projectId/:taskId')
  updateTaskById(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() dto: EditTaskDto,
  ) {
    return this.taskService.updateTaskById(projectId, taskId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':projectId/:taskId')
  deleteTaskById(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
  ) {
    return this.taskService.deleteTaskById(projectId, taskId);
  }
}
