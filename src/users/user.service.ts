import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }
    async findbyUser(id: string): Promise<object | string> {
        const existingUser = await this.userModel.findById(id);
        if (!existingUser) return 'User not found'
        return {
            username: existingUser.username,
            email: existingUser.email
        }
    }

    async findAll(): Promise<object | string> {
        const existingUser = await this.userModel.find({});
        if (!existingUser) return 'User not found'

        return existingUser.map((user) => ({
            username: user.username,
            email: user.email
        }));
    }

    async blockedUser(email: string): Promise<string> {
        const existingUser = await this.userModel.findOneAndUpdate(
            {
                email,
            },
            {
                isBlocked: 'true'
            }
        );
        if (!existingUser) { return 'User not found' }
        return 'sucessfully block'
    }

    async unBlockedUser(email: string): Promise<string> {
        const existingUser = await this.userModel.findOneAndUpdate(
            {
                email,
                isBlocked: 'true'
            },
            {
                isBlocked: 'false'
            }
        );
        if (!existingUser) { return 'User not found' }

        return 'sucessfully unblock'
    }
}


