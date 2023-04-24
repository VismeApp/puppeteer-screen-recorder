import { EventEmitter } from 'events';
import { PassThrough, Writable } from 'stream';


import {
  pageScreenFrame,
  VIDEO_WRITE_STATUS,
  VideoOptions,
} from './pageVideoStreamTypes';


/**
 * @ignore
 */
export default class PageVideoStreamWriter extends EventEmitter {
  private readonly screenLimit = 40;
  private screenCastFrames = [];
  private lastProcessedFrame: pageScreenFrame;
  public duration = '00:00:00:00';

  private status = VIDEO_WRITE_STATUS.NOT_STARTED;
  private options: VideoOptions;

  private videoMediatorStream: PassThrough = new PassThrough();
  private writerPromise: Promise<boolean>;
  // @ts-ignore
  constructor(destinationSource?: string | Writable, options?: VideoOptions) {
    super();

    if (options) {
      this.options = options;
    }
  }



  private findSlot(timestamp: number): number {
    if (this.screenCastFrames.length === 0) {
      return 0;
    }

    let i: number;
    let frame: pageScreenFrame;

    for (i = this.screenCastFrames.length - 1; i >= 0; i--) {
      frame = this.screenCastFrames[i];

      if (timestamp > frame.timestamp) {
        break;
      }
    }

    return i + 1;
  }

  public insert(frame: pageScreenFrame): void {
    // reduce the queue into half when it is full
    if (this.screenCastFrames.length === this.screenLimit) {
      const numberOfFramesToSplice = Math.floor(this.screenLimit / 2);
      const framesToProcess = this.screenCastFrames.splice(
        0,
        numberOfFramesToSplice
      );
      this.processFrameBeforeWrite(framesToProcess);
    }

    const insertionIndex = this.findSlot(frame.timestamp);

    if (insertionIndex === this.screenCastFrames.length) {
      this.screenCastFrames.push(frame);
    } else {
      this.screenCastFrames.splice(insertionIndex, 0, frame);
    }
  }

  private trimFrame(fameList: pageScreenFrame[]): pageScreenFrame[] {
    if (!this.lastProcessedFrame) {
      this.lastProcessedFrame = fameList[0];
    }

    return fameList.map((currentFrame: pageScreenFrame) => {
      const duration =
        currentFrame.timestamp - this.lastProcessedFrame.timestamp;
      this.lastProcessedFrame = currentFrame;

      return {
        ...currentFrame,
        duration,
      };
    });
  }

  private processFrameBeforeWrite(frames: pageScreenFrame[]): void {
    const processedFrames = this.trimFrame(frames);

    processedFrames.forEach(({ blob, duration }) => {
      this.write(blob, duration);
    });
  }

  public write(data: Buffer, durationSeconds = 1): void {
    this.status = VIDEO_WRITE_STATUS.IN_PROGRESS;

    const NUMBER_OF_FPS = Math.max(
      Math.floor(durationSeconds * this.options.fps),
      1
    );

    for (let i = 0; i < NUMBER_OF_FPS; i++) {
      this.videoMediatorStream.write(data);
    }
  }

  private drainFrames(stoppedTime: number): void {
    this.processFrameBeforeWrite(this.screenCastFrames);
    this.screenCastFrames = [];

    if (!this.lastProcessedFrame) return;
    const durationSeconds = stoppedTime - this.lastProcessedFrame.timestamp;
    this.write(this.lastProcessedFrame.blob, durationSeconds);
  }

  public stop(stoppedTime = Date.now() / 1000): Promise<boolean> {
    if (this.status === VIDEO_WRITE_STATUS.COMPLETED) {
      return this.writerPromise;
    }

    this.drainFrames(stoppedTime);

    this.videoMediatorStream.end();
    this.status = VIDEO_WRITE_STATUS.COMPLETED;
    return this.writerPromise;
  }
}
