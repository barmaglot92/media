import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

import sanitizeFilename from 'sanitize-filename';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/list')
  list() {
    return this.appService.getList();
  }

  @Delete('/delete/:name')
  delete(@Param() { name }: { name: string }) {
    return this.appService.delete(name);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const filename = decodeURIComponent(file.originalname);
    file.originalname = sanitizeFilename(filename);

    return this.appService.downloadTorrent(file);
  }
}
