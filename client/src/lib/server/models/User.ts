import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  gamesPlayed: number;
  gamesWon: number;
  isOnline: boolean;
  activeGameIds: string[];
}

const userSchema = new Schema<IUser>({
  username:   { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  gamesPlayed:{ type: Number, default: 0 },
  gamesWon:   { type: Number, default: 0 },
  isOnline:   { type: Boolean, default: false },
  activeGameIds: [{ type: String }],
}, {
  timestamps: true,
});

export const User = 
  mongoose.models.User || 
  mongoose.model<IUser>('User', userSchema); 