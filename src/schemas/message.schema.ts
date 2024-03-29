import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document, Types } from 'mongoose';
import { ContentTypes, ReactionTypes } from 'src/utlis/enum';
import { User } from './user.schema';

import { Chat } from './chat.schema';

export type MessageDocument = Document & Message;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  messageType: ContentTypes;

  //   @Prop({ required: true })
  //   type: ContentTypes;
  @Prop({type: Types.ObjectId, ref: 'Messages'})
  parent: string;

@Prop()
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Users' })
  sender: string;

  @Prop()
  reactions: Array<Reaction>;

  @Prop()
  chat: string;
  @Prop()
  usersReaction: UserReaction[];
}
export class Reaction {
  @Prop()
  reaction: ReactionTypes;
  @Prop({ default: 0 })
  quantity: number;
}

export class UserReaction {
  @Prop({ type: Types.ObjectId, ref: 'Users' })
  user: string;
  @Prop()
  reaction: ReactionTypes;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
