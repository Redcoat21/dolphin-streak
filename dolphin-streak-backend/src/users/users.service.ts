import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/users/schemas/user.schema";
import { Model } from "mongoose";
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
    * Finds all users matching the query.
    * @param findQuery - Query object to filter users.
    * @returns A list of users.
    */
   findAll(findQuery: FindUserQuery) {
      return this.userModel.find(findQuery ?? {});
   }

   /**
    * Finds a single user by ID.
    * @param id - User ID.
    * @returns The user if found, otherwise null.
    */
   findOne(id: string) {
      return this.userModel.findById(id);
   }

   /**
    * Updates a user by ID.
    * @param id - User ID.
    * @param updateUserDto - Data transfer object for updating a user.
    * @returns The updated user.
    */
   update(id: string, updateUserDto: UpdateUserDto) {
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
