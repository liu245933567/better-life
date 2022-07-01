import { Document } from 'mongoose';

export interface ComicCache extends Document {
  readonly href: string;
  readonly html: string;
  readonly time: string;
}
