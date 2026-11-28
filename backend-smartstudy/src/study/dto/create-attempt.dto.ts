import { IsBoolean, IsInt, Min } from 'class-validator';

export class CreateAttemptDto {
  @IsInt()
  @Min(0)
  cardIndex!: number;

  @IsBoolean()
  correct!: boolean;
}
