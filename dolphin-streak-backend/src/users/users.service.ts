import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/users/schemas/user.schema";
import mongoose, { HydratedDocument, Model, Mongoose } from "mongoose";
import { FindUserQuery } from "./dto/find-user.query";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Create a new user
   * @param createUserDto - Data transfer object for creating a user
   * @returns The created user document
   */
  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  /**
   * Find all users matching the query
   * @param findQuery - Query object to filter users
   * @returns An array of user documents
   */
  findAll(findQuery: FindUserQuery) {
    return this.userModel.find(findQuery ?? {});
  }

  /**
   * Find a single user by ID or email
   * @param query - User ID or email
   * @returns The found user document
   */
  findOne(query: string) {
    if (mongoose.Types.ObjectId.isValid(query)) {
      return this.userModel.findById(query);
    }

    return this.userModel.findOne({
      email: query,
    });
  }

  /**
   * Update a user by ID
   * @param id - User ID
   * @param updateUserDto - Data transfer object for updating a user
   * @returns The updated user document
   */
  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  /**
   * Remove a user by ID
   * @param id - User ID
   * @returns The removed user document
   */
  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
