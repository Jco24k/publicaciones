import { SetMetadata } from '@nestjs/common';
export const META_USER = 'same_user';
export const UserProtected = (option: boolean) => {
  return SetMetadata(META_USER, option);
};
