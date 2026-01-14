import mongoose, { Schema, Document } from 'mongoose';
import { ICourse } from '../types';

export interface CourseDocument extends ICourse, Document {}

const CourseSchema = new Schema<CourseDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillTag: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    required: true 
  },
  lessons: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<CourseDocument>('Course', CourseSchema);
