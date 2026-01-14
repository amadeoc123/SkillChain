import { Request, Response } from 'express';
import Course from '../models/Course';

/**
 * Get all courses
 */
export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find().select('-__v');
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
};

/**
 * Get course by ID
 */
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).select('-__v');
    
    if (!course) {
      res.status(404).json({ success: false, error: 'Course not found' });
      return;
    }

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch course' });
  }
};

/**
 * Create new course (admin only for MVP)
 */
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to create course' });
  }
};
