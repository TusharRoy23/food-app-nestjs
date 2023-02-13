import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail } from "class-validator";
import mongoose, { HydratedDocument } from "mongoose";
import { Restaurant } from "../../restaurant/schemas";
import { CurrentStatus, UserRole, UserType } from "../../shared/utils/enum";
import { hashString, isStringMatched } from "../../shared/utils/hashing.utils";

@Schema({
    toJSON: {
        getters: true,
        transform(doc, ret, options) {
            delete ret._id;
            delete ret.password;
            delete ret.hashedRefreshToken;
            delete ret.__v;
            return ret;
        },
    },
})
export class User {
    _id: mongoose.Types.ObjectId;

    @Prop({ type: 'String', required: true, unique: true, lowercase: true })
    @IsEmail()
    email: string;

    @Prop({ type: 'String', required: true })
    password: string;

    @Prop({ type: 'String', required: true })
    name: string;

    @Prop({ type: 'String', required: true, default: UserType.VISITOR, enum: UserType })
    user_type: string;

    @Prop({ type: 'String', required: true, enum: UserRole, default: UserRole.NONE })
    role: string;

    @Prop({ type: 'String', required: true, enum: CurrentStatus, default: CurrentStatus.ACTIVE })
    current_status: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
    restaurant: Restaurant;

    @Prop({ type: 'String' })
    hashedRefreshToken: string;

    @Prop({ type: 'Boolean' })
    login_status: boolean;

    async doPasswordHashing(password: string): Promise<string> {
        return await hashString(password);
    }

    async validatePasswords(hashedPassword: string, password: string): Promise<boolean> {
        return await isStringMatched(hashedPassword, password);
    }

    async validateRefreshToken(hashedToken: string, token: string): Promise<boolean> {
        return await isStringMatched(hashedToken, token);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;