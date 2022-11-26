import { Generated, ColumnType } from 'kysely';

export type JobType =
  | 'NOW'
  | 'REPEAT_CRON'
  | 'REPEAT_EVERY'
  | 'DELAY_UNTIL'
  | 'DELAY_FOR';

export type Post = {
  id: string;
  title: string;
  content: string;
};

export type Job = {
  id: string;
  recurringJobId: string | null;
  request_url: string;
  request_method: string;
  request_header: string;
  request_body: string | null;
  request_time: ColumnType<Date, Date | string, Date | string>;
  type: JobType;
  repeat_cron: string | null;
  repeat_every: string | null;
  delay_until: ColumnType<
    Date | null,
    Date | null | string,
    Date | null | string
  >;
  delay_for: string | null;
  timezone: string | null;
  startDate: ColumnType<
    Date | null,
    Date | null | string,
    Date | null | string
  >;
  endDate: ColumnType<Date | null, Date | null | string, Date | null | string>;
  response_header: string | null;
  response_body: string | null;
};

export type RecurringJob = {
  id: string;
  request_url: string;
  request_method: string;
  request_header: string;
  request_body: string | null;
  request_time: ColumnType<Date, Date | string, Date | string>;
  type: JobType;
  repeat_cron: string | null;
  repeat_every: string | null;
  delay_until: ColumnType<
    Date | null,
    Date | null | string,
    Date | null | string
  >;
  delay_for: string | null;
  timezone: string | null;
  startDate: ColumnType<
    Date | null,
    Date | null | string,
    Date | null | string
  >;
  endDate: ColumnType<Date | null, Date | null | string, Date | null | string>;
};

export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  refresh_token_expires_in: number | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
};

export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: ColumnType<Date, Date | string, Date | string>;
};

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: ColumnType<
    Date | null,
    Date | null | string,
    Date | null | string
  >;
  image: string | null;
};

export type VerificationToken = {
  identifier: string;
  token: string;
  expires: ColumnType<Date, Date | string, Date | string>;
};

export type Database = {
  Post: Post;
  Job: Job;
  RecurringJob: RecurringJob;
  Account: Account;
  Session: Session;
  User: User;
  VerificationToken: VerificationToken;
};
