export type BaseUserModel = {
  id: number;
  lastName: string;
  firstName: string;
  canAccessClosed?: boolean;
  isClosed?: boolean;
  deactivated?: string;
};
