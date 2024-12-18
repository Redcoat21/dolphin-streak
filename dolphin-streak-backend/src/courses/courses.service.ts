import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, ProjectionType, QueryOptions } from "mongoose";
import { Course, CourseDocument } from "./schemas/course.schema";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  /**
   * Creates a new course.
   * @param {CreateCourseDto} createCourseDto - Data transfer object for creating a course.
   * @returns {Promise<Course>} The created course.
   */
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDto);
    return createdCourse.save();
  }

  /**
   * Finds all courses that match the given filter.
   * @param {FilterQuery<Course>} [filter={}] - The filter query to apply.
   * @returns {Promise<Course[]>} The list of matching courses.
   */
  async findAll(filter: FilterQuery<Course> = {}): Promise<Course[]> {
    return this.courseModel
      .find(filter)
      .populate("levels")
      .populate("language")
      .exec();
  }

  /**
   * Finds a course by its ID.
   * @param {string} id - The ID of the course to find.
   * @returns {Promise<Course>} The found course.
   * @throws {NotFoundException} If no course is found with the given ID.
   */
  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel
      .findById(id)
      .populate("levels")
      .populate("language")
      .exec();

    if (!course) {
      throw new NotFoundException("Course not found");
    }
    return course;
  }

  /**
   * Updates a course by its ID.
   * @param {string} id - The ID of the course to update.
   * @param {UpdateCourseDto} updateCourseDto - Data transfer object for updating a course.
   * @returns {Promise<Course>} The updated course.
   * @throws {NotFoundException} If no course is found with the given ID.
   */
  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true })
      .populate("levels")
      .populate("language")
      .exec();

    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return updatedCourse;
  }

  /**
   * Removes a course by its ID.
   * @param {string} id - The ID of the course to remove.
   * @returns {Promise<void>}
   * @throws {NotFoundException} If no course is found with the given ID.
   */
  async remove(id: string): Promise<unknown> {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    return result;
  }
}
