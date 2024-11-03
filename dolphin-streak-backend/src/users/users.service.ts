import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "src/users/schemas/user.schema";
import { FilterQuery, Model, ProjectionType, QueryOptions } from "mongoose";
import { FindUserQuery } from "./dto/find-user.query";

@Injectable()
/**
 * Service for managing users.
 */
export class UsersService {
   /**
    * Constructs the UsersService.
    * @param userModel - The user model injected by Mongoose.
    */
   constructor(@InjectModel(User.name) private userModel: Model<User>) {}

   /**
    * Creates a new user.
    * @param createUserDto - Data transfer object for creating a user.
    * @returns The created user.
    */
   create(createUserDto: CreateUserDto) {
      return this.userModel.create(createUserDto);
   }

   /**
    * Find many users matching the query.
    * @param query Filter used to filter the founded users.
    * @param projection What should be included or excluded in the result.
    * @param options Options to customize how a query should be executed.
    * @see {@link FilterQuery}
    * @see {@link ProjectionType}
    * @see {@link QueryOptions}
    * @returns {Promise<UserDocument[] | null>} The founded users.
    */
   findAll(
      query: FilterQuery<User>,
      projection?: ProjectionType<User>,
      options?: QueryOptions<User>,
   ) {
      return this.userModel.find(query, projection, options);
   }

   /**
    * Find one user.
    * @param query Filter used to filter the founded users, to find by id, include { _id } in the query.
    * @param projection What should be included or excluded in the result.
    * @param options Options to customize how a query should be executed.
    * @see {@link ProjectionType}
    * @see {@link QueryOptions}
    * @returns {Promise<UserDocument | null>} The founded user.
    */
   findOne(
      query: FilterQuery<User>,
      projection?: ProjectionType<User>,
      options?: QueryOptions<User>,
   ) {
      return this.userModel.findById(query, projection, options);
   }

   /**
    * Updates a user by ID.
    * @param id - User ID.
    * @param updateUserDto - Data transfer object for updating a user.
    * @returns The updated user.
    */
   update(id: string, updateUserDto: Partial<CreateUserDto>) {
      return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
   }

   /**
    * Removes a user by ID.
    * @param id - User ID.
    * @returns The removed user.
    */
   remove(id: string) {
      return this.userModel.findByIdAndDelete(id);
   }
}
