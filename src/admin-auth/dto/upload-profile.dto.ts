
import { IsNotEmpty , IsString} from 'class-validator';

export class UploadProfileDto {
  @IsNotEmpty()
  @IsString()

  adminid: string;

//   @IsNotEmpty()
//   file: Express.Multer.File;
}
