export class Profile {
  id: number;
  phone: string;
  fullName: string;
  image?: string;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  mentorProfile?: any;
  courses?: any[];
  ratings?: any[];
  lessonViews?: any[];
}
