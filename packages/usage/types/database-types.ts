import {
  Kysely,
  Generated,
  ColumnType,
  Selectable,
  Insertable,
  Updateable,
} from 'kysely';

export type NotificationType =
  | 'newPosts'
  | 'newComments'
  | 'newFollowers'
  | 'reply'
  | 'heartOnPost'
  | 'heartOnComment'
  | 'heartOnReply';
export type Language =
  | 'Typescript'
  | 'Javascript'
  | 'Rust'
  | 'Go'
  | 'Python'
  | 'Cpp';

export type User = {
  id: number;
  createdAt: ColumnType<Date | null, Date | string, Date | string>;
  email: string;
  name: string | null;
};

export type Post = {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  authorId: number;
};

export type Database = {
  User: User;
  Post: Post;
};
