import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { DateTime } from 'luxon';

interface DailyChallenge {
  courseId: string;
  expiresAt: Date;
}

@Injectable()
export class DailyService {
  private dailyChallenges: { [languageId: string]: DailyChallenge } = {};

  constructor(
    private readonly coursesService: CoursesService,
  ) { }

  async getDailyChallenge(languageId: string) {
    const daily = this.dailyChallenges[languageId];

    if (!daily || DateTime.fromJSDate(daily.expiresAt) < DateTime.now()) {
      return await this.generateDailyChallenge(languageId);
    }

    return daily;
  }


  async generateDailyChallenge(languageId: string) {
    const courses = await this.coursesService.findAll({ language: languageId });

    if (!courses || courses.length === 0) {
      throw new NotFoundException(`No courses found for language ID: ${languageId}`);
    }

    const filteredCourses = [];
    for (let i = 0; i < courses.length; i++) {
      if (!courses[i].name.toUpperCase().includes("ESSAY")) {
        filteredCourses.push(courses[i]);
      }
    }

    if (filteredCourses.length === 0) {
      throw new NotFoundException(`No courses found (excluding ESSAY courses) for language ID: ${languageId}`);
    }

    const randomIndex = Math.floor(Math.random() * filteredCourses.length);
    const selectedCourse = filteredCourses[randomIndex];

    const expiresAt = DateTime.now().plus({ days: 1 }).startOf('day').toJSDate();


    this.dailyChallenges[languageId] = {
      courseId: selectedCourse._id,
      expiresAt: expiresAt,
    };

    return this.dailyChallenges[languageId];
  }
}