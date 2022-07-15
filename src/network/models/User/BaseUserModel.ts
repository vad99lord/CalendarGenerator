export type BaseUserModel = {
  id: UserID;
  lastName: string;
  firstName: string;
  canAccessClosed?: boolean;
  isClosed?: boolean;
  deactivated?: string;
};

export type UserID = number;