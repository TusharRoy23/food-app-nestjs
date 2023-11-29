import { ClassSerializerContextOptions, ClassSerializerInterceptor, Injectable } from "@nestjs/common";

@Injectable()
export class ResponseSerializerInterceptor extends ClassSerializerInterceptor {
    serialize(response: any, options: ClassSerializerContextOptions) {
        const rawDataJson = JSON.stringify(response);
        return super.serialize(JSON.parse(rawDataJson), options);
    }
}