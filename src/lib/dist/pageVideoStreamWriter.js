"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var events_1 = require("events");
var stream_1 = require("stream");
var pageVideoStreamTypes_1 = require("./pageVideoStreamTypes");
/**
 * @ignore
 */
var PageVideoStreamWriter = /** @class */ (function (_super) {
    __extends(PageVideoStreamWriter, _super);
    // @ts-ignore
    function PageVideoStreamWriter(destinationSource, options) {
        var _this = _super.call(this) || this;
        _this.screenLimit = 40;
        _this.screenCastFrames = [];
        _this.duration = '00:00:00:00';
        _this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.NOT_STARTED;
        _this.videoMediatorStream = new stream_1.PassThrough();
        if (options) {
            _this.options = options;
        }
        return _this;
    }
    PageVideoStreamWriter.prototype.findSlot = function (timestamp) {
        if (this.screenCastFrames.length === 0) {
            return 0;
        }
        var i;
        var frame;
        for (i = this.screenCastFrames.length - 1; i >= 0; i--) {
            frame = this.screenCastFrames[i];
            if (timestamp > frame.timestamp) {
                break;
            }
        }
        return i + 1;
    };
    PageVideoStreamWriter.prototype.insert = function (frame) {
        // reduce the queue into half when it is full
        if (this.screenCastFrames.length === this.screenLimit) {
            var numberOfFramesToSplice = Math.floor(this.screenLimit / 2);
            var framesToProcess = this.screenCastFrames.splice(0, numberOfFramesToSplice);
            this.processFrameBeforeWrite(framesToProcess);
        }
        var insertionIndex = this.findSlot(frame.timestamp);
        if (insertionIndex === this.screenCastFrames.length) {
            this.screenCastFrames.push(frame);
        }
        else {
            this.screenCastFrames.splice(insertionIndex, 0, frame);
        }
    };
    PageVideoStreamWriter.prototype.trimFrame = function (fameList) {
        var _this = this;
        if (!this.lastProcessedFrame) {
            this.lastProcessedFrame = fameList[0];
        }
        return fameList.map(function (currentFrame) {
            var duration = currentFrame.timestamp - _this.lastProcessedFrame.timestamp;
            _this.lastProcessedFrame = currentFrame;
            return __assign(__assign({}, currentFrame), { duration: duration });
        });
    };
    PageVideoStreamWriter.prototype.processFrameBeforeWrite = function (frames) {
        var _this = this;
        var processedFrames = this.trimFrame(frames);
        processedFrames.forEach(function (_a) {
            var blob = _a.blob, duration = _a.duration;
            _this.write(blob, duration);
        });
    };
    PageVideoStreamWriter.prototype.write = function (data, durationSeconds) {
        if (durationSeconds === void 0) { durationSeconds = 1; }
        this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.IN_PROGRESS;
        var NUMBER_OF_FPS = Math.max(Math.floor(durationSeconds * this.options.fps), 1);
        for (var i = 0; i < NUMBER_OF_FPS; i++) {
            this.videoMediatorStream.write(data);
        }
    };
    PageVideoStreamWriter.prototype.drainFrames = function (stoppedTime) {
        this.processFrameBeforeWrite(this.screenCastFrames);
        this.screenCastFrames = [];
        if (!this.lastProcessedFrame)
            return;
        var durationSeconds = stoppedTime - this.lastProcessedFrame.timestamp;
        this.write(this.lastProcessedFrame.blob, durationSeconds);
    };
    PageVideoStreamWriter.prototype.stop = function (stoppedTime) {
        if (stoppedTime === void 0) { stoppedTime = Date.now() / 1000; }
        if (this.status === pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.COMPLETED) {
            return this.writerPromise;
        }
        this.drainFrames(stoppedTime);
        this.videoMediatorStream.end();
        this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.COMPLETED;
        return this.writerPromise;
    };
    return PageVideoStreamWriter;
}(events_1.EventEmitter));
exports["default"] = PageVideoStreamWriter;
