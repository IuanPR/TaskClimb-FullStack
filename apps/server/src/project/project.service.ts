import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditProjectDto, ProjectDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(userId: string, dto: ProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        userId: userId,
        title: dto.title,
      },
    });

    return project;
  }

  async getTasks(userId: string) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          userId: userId,
        },
      });

      return tasks;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('The user does not exist');
      }
    }
  }

  async getTasksByProjectId(projectId: string) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          projectId: projectId,
        },
      });

      return tasks;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('The project does not exist');
      }
    }
  }

  async getProjects(userId: string) {
    try {
      const projects = await this.prisma.project.findMany({
        where: {
          userId: userId,
        },
      });

      return projects;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('The user does not exist');
      }
    }
  }

  async updateProjectById(
    userId: string,
    projectId: string,
    dto: EditProjectDto,
  ) {
    try {
      return this.prisma.project.update({
        where: {
          id: projectId,
          userId: userId,
        },
        data: {
          title: dto.title,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('The project does not exist');
      }
    }
  }

  async deleteProjectById(userId: string, projectId: string) {
    try {
      await this.prisma.project.delete({
        where: {
          id: projectId,
          userId: userId,
        },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('The project does not exist');
      }
    }
  }
}
