import { Controller, Sse } from '@nestjs/common';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse()
  doTheSse() {
    return this.sseService.sendEvents();
  }
}
