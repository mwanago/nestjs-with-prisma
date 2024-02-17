import {
  IsNotEmpty,
  IsString,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

const idKeys: (keyof CreateCommentDto)[] = ['photoId', 'articleId'];

export function ContainsValidForeignKeys() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'containsValidForeignKeys',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `You need to provide exactly one of the following properties: ${idKeys.join(', ',)}`,
      },
      validator: {
        validate(value: unknown, validationArguments: ValidationArguments) {
          const comment = validationArguments.object as CreateCommentDto;

          if (value && !Number.isInteger(value)) {
            return false;
          }

          return (
            !idKeys.every((key) => comment[key]) &&
            idKeys.some((key) => comment[key])
          );
        },
      },
    });
  };
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @ContainsValidForeignKeys()
  photoId?: number;

  @ContainsValidForeignKeys()
  articleId?: number;
}
