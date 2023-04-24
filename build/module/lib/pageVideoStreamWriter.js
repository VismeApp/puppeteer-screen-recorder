import { EventEmitter } from 'events';
import { PassThrough } from 'stream';
import { VIDEO_WRITE_STATUS, } from './pageVideoStreamTypes';
/**
 * @ignore
 */
export default class PageVideoStreamWriter extends EventEmitter {
    // @ts-ignore
    constructor(destinationSource, options) {
        super();
        this.screenLimit = 40;
        this.screenCastFrames = [];
        this.duration = '00:00:00:00';
        this.status = VIDEO_WRITE_STATUS.NOT_STARTED;
        this.videoMediatorStream = new PassThrough();
        if (options) {
            this.options = options;
        }
    }
    findSlot(timestamp) {
        if (this.screenCastFrames.length === 0) {
            return 0;
        }
        let i;
        let frame;
        for (i = this.screenCastFrames.length - 1; i >= 0; i--) {
            frame = this.screenCastFrames[i];
            if (timestamp > frame.timestamp) {
                break;
            }
        }
        return i + 1;
    }
    insert(frame) {
        // reduce the queue into half when it is full
        if (this.screenCastFrames.length === this.screenLimit) {
            const numberOfFramesToSplice = Math.floor(this.screenLimit / 2);
            const framesToProcess = this.screenCastFrames.splice(0, numberOfFramesToSplice);
            this.processFrameBeforeWrite(framesToProcess);
        }
        const insertionIndex = this.findSlot(frame.timestamp);
        if (insertionIndex === this.screenCastFrames.length) {
            this.screenCastFrames.push(frame);
        }
        else {
            this.screenCastFrames.splice(insertionIndex, 0, frame);
        }
    }
    trimFrame(fameList) {
        if (!this.lastProcessedFrame) {
            this.lastProcessedFrame = fameList[0];
        }
        return fameList.map((currentFrame) => {
            const duration = currentFrame.timestamp - this.lastProcessedFrame.timestamp;
            this.lastProcessedFrame = currentFrame;
            return {
                ...currentFrame,
                duration,
            };
        });
    }
    processFrameBeforeWrite(frames) {
        const processedFrames = this.trimFrame(frames);
        processedFrames.forEach(({ blob, duration }) => {
            this.write(blob, duration);
        });
    }
    write(data, durationSeconds = 1) {
        this.status = VIDEO_WRITE_STATUS.IN_PROGRESS;
        const NUMBER_OF_FPS = Math.max(Math.floor(durationSeconds * this.options.fps), 1);
        for (let i = 0; i < NUMBER_OF_FPS; i++) {
            this.videoMediatorStream.write(data);
        }
    }
    drainFrames(stoppedTime) {
        this.processFrameBeforeWrite(this.screenCastFrames);
        this.screenCastFrames = [];
        if (!this.lastProcessedFrame)
            return;
        const durationSeconds = stoppedTime - this.lastProcessedFrame.timestamp;
        this.write(this.lastProcessedFrame.blob, durationSeconds);
    }
    stop(stoppedTime = Date.now() / 1000) {
        if (this.status === VIDEO_WRITE_STATUS.COMPLETED) {
            return this.writerPromise;
        }
        this.drainFrames(stoppedTime);
        this.videoMediatorStream.end();
        this.status = VIDEO_WRITE_STATUS.COMPLETED;
        return this.writerPromise;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVZpZGVvU3RyZWFtV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYWdlVmlkZW9TdHJlYW1Xcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUN0QyxPQUFPLEVBQUUsV0FBVyxFQUFZLE1BQU0sUUFBUSxDQUFDO0FBRy9DLE9BQU8sRUFFTCxrQkFBa0IsR0FFbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUdoQzs7R0FFRztBQUNILE1BQU0sQ0FBQyxPQUFPLE9BQU8scUJBQXNCLFNBQVEsWUFBWTtJQVc3RCxhQUFhO0lBQ2IsWUFBWSxpQkFBcUMsRUFBRSxPQUFzQjtRQUN2RSxLQUFLLEVBQUUsQ0FBQztRQVpPLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBQzFCLHFCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUV2QixhQUFRLEdBQUcsYUFBYSxDQUFDO1FBRXhCLFdBQU0sR0FBRyxrQkFBa0IsQ0FBQyxXQUFXLENBQUM7UUFHeEMsd0JBQW1CLEdBQWdCLElBQUksV0FBVyxFQUFFLENBQUM7UUFNM0QsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUN4QjtJQUNILENBQUM7SUFJTyxRQUFRLENBQUMsU0FBaUI7UUFDaEMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN0QyxPQUFPLENBQUMsQ0FBQztTQUNWO1FBRUQsSUFBSSxDQUFTLENBQUM7UUFDZCxJQUFJLEtBQXNCLENBQUM7UUFFM0IsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0RCxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxD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