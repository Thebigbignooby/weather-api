
import { prop, getModelForClass } from "@typegoose/typegoose";

export class User {
  @prop({ type: () => String, required: true, unique: true })
  email!: string;

  @prop({ type: () => String, required: true })
  password!: string;

  @prop({ type: () => String })
  firstName!: string;

  @prop({ type: () => String })
  lastName!: string;
}

const UserModel = getModelForClass(User);

export default UserModel;