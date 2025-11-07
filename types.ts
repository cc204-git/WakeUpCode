import { Timestamp } from 'firebase/firestore';

export interface Goal {
  id: string; // Document ID from Firestore
  userId: string;
  goal: string;
  deadline: Timestamp;
  lockImage: string | null;
  status: 'active' | 'completed';
}