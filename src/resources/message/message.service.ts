import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, model } from 'mongoose';
import { Chat, Message, MessageDocument, Reaction, User } from 'src/schemas';
import { MessageDto, MessageReaction } from './message.dto';

import { ReactionTypes } from 'src/utlis/enum';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private model: Model<MessageDocument>) {}

  async create(dto: MessageDto) {
    try {
      
        dto.reactions = [
            {
            reaction: ReactionTypes.LIKE,
            quantity: 0
        },
            {
            reaction:  ReactionTypes.LOVE,
            quantity: 0
        },
            {
            reaction:  ReactionTypes.HAHA,
            quantity: 0
        },
            {
        reaction:  ReactionTypes.WOW,
            quantity: 0
        },
            {
            reaction:  ReactionTypes.SAD,
            quantity: 0
        },
            {
            reaction:  ReactionTypes.ANGRY,
            quantity: 0
        },
    ]
        return await this.model.create(dto)
       
    } catch(e) {
        throw new HttpException(e, 500)
    }
}

async findByChat(id: string) {
    try {
        return await this.model.find({chat: id}).sort({createdAt: -1})
    } catch (error) {
        throw new HttpException(error, 500)
        
    }
  }

  async setReaction(data: MessageReaction ) {
    try {
        let message = await this.model.findById(data.id)
        let usersReaction = message.usersReaction
        let reactions = message.reactions
        let reaction = reactions.findIndex((m) => m.reaction  == data.reaction)
        let u = usersReaction.findIndex((e) => e.user == data.user )

        if(u) {
            if(u['reaction'] == data.reaction) {
                reactions[reaction].quantity -= 1
                usersReaction.filter((e) => e.user != data.user)
            } else {
                reactions[reaction].quantity += 1
                let selectedReactionIndex = reactions.findIndex((e) => e.reaction == u['reaction'])
                reactions[selectedReactionIndex].quantity -= 1
            }
        } else {
            reactions[reaction].quantity += 1
            usersReaction.push({user: data.user, reaction})
            
        }
        return await message.updateOne({
            $set: { reactions, usersReaction}
        })
        
        
    } catch (error) {
        throw new HttpException(error, 500)
    }
  }
}
