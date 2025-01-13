import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AnnouncementDocument = HydratedDocument<Announcement>;

@Schema()
export class Announcement {
    @Prop({ required: true, maxlength: 255 })
    content: string;

    @Prop({ type: Date, required: true })
    time: Date;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);