import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/users/schemas/user.schema";
import mongoose, { Model } from "mongoose";
import { FindUserQuery } from "./dto/find-user.query";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findAll(findQuery: FindUserQuery) {
    return this.userModel.find(findQuery ?? {});
  }

  findOne(query: string) {
    if (mongoose.Types.ObjectId.isValid(query)) {
      return this.userModel.findById(query);
    }

    return this.userModel.findOne({
      email: query,
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
