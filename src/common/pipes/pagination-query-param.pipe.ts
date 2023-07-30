import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ValidationError, isBooleanString, validate } from 'class-validator';

@Injectable()
export class PaginationValidateAndTrasnformPipe<T extends object>
  implements PipeTransform
{
  constructor(private readonly dtoClass: new () => T) {}
  async transform(value: any) {
    const dtoInstance = plainToClass(this.dtoClass, value);
    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      const errorMessage = this.buildErrorMessage(errors);
      throw new BadRequestException(errorMessage);
    }

    const fieldsToValidate = ['all', 'isActive', 'relations'];
    fieldsToValidate.forEach((field) => {
      value[field] = this.getBooleanValue(value[field]);
    });
    return value;
  }

  private getBooleanValue(value?: string): boolean {
    return isBooleanString(value)
      ? ['1', 'true'].includes(value.toString())
      : undefined;
  }

  private buildErrorMessage(errors: ValidationError[]): string[] {
    const errorMessages = errors.map((error) => {
      const constraints = Object.values(error.constraints);
      return constraints.join();
    });
    return errorMessages;
  }
}

export const PaginationQueryParamsPipe = <T extends object>(
  dtoClass: new () => T,
) => new PaginationValidateAndTrasnformPipe<T>(dtoClass);
