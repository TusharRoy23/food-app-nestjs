import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model, model } from 'mongoose';
import { IsEmail } from 'class-validator';
import { hashString, isStringMatched } from '../../shared/utils/hashing.utils';
import { CurrentStatus } from '../../shared/utils/enum';

@Schema({
    toJSON: {
        getters: true,
        versionKey: false,
        transform(_, ret) {
            delete ret.password;
            delete ret.hashedRefreshToken;
            return ret;
        },
    },
    id: false
})
export class Adminuser {
    _id: mongoose.Types.ObjectId;

    @Prop({ type: 'String', required: true, unique: true, lowercase: true })
    @IsEmail()
    email: string;

    @Prop({ type: 'String', required: true })
    password: string;

    @Prop({ type: 'String', required: true })
    name: string;

    @Prop({ type: 'String' })
    hashedRefreshToken: string;

    @Prop({
        type: 'String',
        required: true,
        enum: CurrentStatus,
        default: CurrentStatus.ACTIVE,
    })
    current_status: string;

    @Prop({ type: 'Boolean' })
    login_status: boolean;

    async doPasswordHashing(password: string): Promise<string> {
        return await hashString(password);
    }

    async validatePasswords(
        hashedPassword: string,
        password: string,
    ): Promise<boolean> {
        return await isStringMatched(hashedPassword, password);
    }
}

export const AdminuserSchema = SchemaFactory.createForClass(Adminuser);
export type AdminuserDocument = HydratedDocument<Adminuser>;
