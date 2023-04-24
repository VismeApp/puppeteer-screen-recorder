"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const stream_1 = require("stream");
const pageVideoStreamTypes_1 = require("./pageVideoStreamTypes");
/**
 * @ignore
 */
class PageVideoStreamWriter extends events_1.EventEmitter {
    // @ts-ignore
    constructor(destinationSource, options) {
        super();
        this.screenLimit = 40;
        this.screenCastFrames = [];
        this.duration = '00:00:00:00';
        this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.NOT_STARTED;
        this.videoMediatorStream = new stream_1.PassThrough();
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
            return Object.assign(Object.assign({}, currentFrame), { duration });
        });
    }
    processFrameBeforeWrite(frames) {
        const processedFrames = this.trimFrame(frames);
        processedFrames.forEach(({ blob, duration }) => {
            this.write(blob, duration);
        });
    }
    write(data, durationSeconds = 1) {
        this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.IN_PROGRESS;
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
        if (this.status === pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.COMPLETED) {
            return this.writerPromise;
        }
        this.drainFrames(stoppedTime);
        this.videoMediatorStream.end();
        this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.COMPLETED;
        return this.writerPromise;
    }
}
exports.default = PageVideoStreamWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVZpZGVvU3RyZWFtV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYWdlVmlkZW9TdHJlYW1Xcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBc0M7QUFDdEMsbUNBQStDO0FBRy9DLGlFQUlnQztBQUdoQzs7R0FFRztBQUNILE1BQXFCLHFCQUFzQixTQUFRLHFCQUFZO0lBVzdELGFBQWE7SUFDYixZQUFZLGlCQUFxQyxFQUFFLE9BQXNCO1FBQ3ZFLEtBQUssRUFBRSxDQUFDO1FBWk8sZ0JBQVcsR0FBRyxFQUFFLENBQUM7UUFDMUIscUJBQWdCLEdBQUcsRUFBRSxDQUFDO1FBRXZCLGFBQVEsR0FBRyxhQUFhLENBQUM7UUFFeEIsV0FBTSxHQUFHLHlDQUFrQixDQUFDLFdBQVcsQ0FBQztRQUd4Qyx3QkFBbUIsR0FBZ0IsSUFBSSxvQkFBVyxFQUFFLENBQUM7UUFNM0QsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUN4QjtJQUNILENBQUM7SUFJTyxRQUFRLENBQUMsU0FBaUI7UUFDaEMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN0QyxPQUFPLENBQUMsQ0FBQztTQUNWO1FBRUQsSUFBSSxDQUFTLENBQUM7UUFDZCxJQUFJLEtBQXNCLENBQUM7UUFFM0IsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0RCxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWpDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLEVBQUU7Z0JBQy9CLE1BQU07YUFDUDtTQUNGO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lB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