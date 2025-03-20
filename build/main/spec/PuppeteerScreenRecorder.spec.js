"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const globals_1 = require("@jest/globals");
const puppeteer_1 = __importDefault(require("puppeteer"));
const __1 = require("../");
const launchBrowser = async () => {
    const puppeteerPath = process.env['PUPPETEER_EXECUTABLE_PATH'];
    const browser = await puppeteer_1.default.launch(Object.assign({ headless: true }, (puppeteerPath ? { executablePath: puppeteerPath } : {})));
    return browser;
};
(0, globals_1.describe)('Happy path test case', () => {
    (0, globals_1.it)('Should be able to create a new screen-recording session', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const outputVideoPath = './test-output/test/video-recorder/testCase1.mp4';
        const recorder = new __1.PuppeteerScreenRecorder(page);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        (0, globals_1.expect)(recorderValue instanceof __1.PuppeteerScreenRecorder).toBeTruthy();
        (0, globals_1.expect)(status).toBeTruthy();
        (0, globals_1.expect)(fs_1.default.existsSync(outputVideoPath)).toBeTruthy();
    });
    (0, globals_1.it)('Should be able to create a new screen-recording session using mp4 format', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const outputVideoPath = './test-output/test/video-recorder/testCase1.mp4';
        const recorder = new __1.PuppeteerScreenRecorder(page);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        (0, globals_1.expect)(recorderValue instanceof __1.PuppeteerScreenRecorder).toBeTruthy();
        (0, globals_1.expect)(status).toBeTruthy();
        (0, globals_1.expect)(fs_1.default.existsSync(outputVideoPath)).toBeTruthy();
    });
    (0, globals_1.it)('Should be able to create a new screen-recording session using mov', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const outputVideoPath = './test-output/test/video-recorder/testCase1.mov';
        const recorder = new __1.PuppeteerScreenRecorder(page);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        (0, globals_1.expect)(recorderValue instanceof __1.PuppeteerScreenRecorder).toBeTruthy();
        (0, globals_1.expect)(status).toBeTruthy();
        (0, globals_1.expect)(fs_1.default.existsSync(outputVideoPath)).toBeTruthy();
    });
    (0, globals_1.it)('Should be able to create a new screen-recording session using webm', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const outputVideoPath = './test-output/test/video-recorder/testCase1.webm';
        const recorder = new __1.PuppeteerScreenRecorder(page);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        (0, globals_1.expect)(recorderValue instanceof __1.PuppeteerScreenRecorder).toBeTruthy();
        (0, globals_1.expect)(status).toBeTruthy();
        (0, globals_1.expect)(fs_1.default.existsSync(outputVideoPath)).toBeTruthy();
    });
    (0, globals_1.it)('should be to get the total duration of recording using avi', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const outputVideoPath = './test-output/test/video-recorder/testCase2.avi';
        const recorder = new __1.PuppeteerScreenRecorder(page);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        recorder.getRecordDuration();
        await browser.close();
        /** assert */
        (0, globals_1.expect)(recorderValue instanceof __1.PuppeteerScreenRecorder).toBeTruthy();
        (0, globals_1.expect)(status).toBeTruthy();
        (0, globals_1.expect)(fs_1.default.existsSync(outputVideoPath)).toBeTruthy();
    });
    (0, globals_1.it)('should be able to record a video with video frame width, height and aspect ratio', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const options = {
            followNewTab: false,
            videoFrame: {
                width: 1024,
                height: 1024,
            },
            aspectRatio: '4:3',
        };
        const outputVideoPath = './test-output/test/video-recorder/testCase4.mp4';
        const recorder = new __1.PuppeteerScreenRecorder(page, options);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        (0, globals_1.expect)(recorderValue instanceof __1.PuppeteerScreenRecorder).toBeTruthy();
        (0, globals_1.expect)(status).toBeTruthy();
        (0, globals_1.expect)(fs_1.default.existsSync(outputVideoPath)).toBeTruthy();
    });
    (0, globals_1.it)('Should be able to create a new screen-recording session using streams', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const outputVideoPath = './test-output/test/video-recorder/testCase4.mp4';
        try {
            fs_1.default.mkdirSync((0, path_1.dirname)(outputVideoPath), { recursive: true });
        }
        catch (e) {
            console.error(e);
        }
        const fileWriteStream = fs_1.default.createWriteStream(outputVideoPath);
        const recorder = new __1.PuppeteerScreenRecorder(page);
        await recorder.startStream(fileWriteStream);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        (0, globals_1.expect)(status).toBeTruthy();
        (0, globals_1.expect)(fs_1.default.existsSync(outputVideoPath)).toBeTruthy();
        fileWriteStream.on('end', () => {
            (0, globals_1.expect)(fileWriteStream.writableFinished).toBeTruthy();
        });
    });
});
(0, globals_1.describe)('video frame testing', () => {
    (0, globals_1.it)('testing video recording with video frame width, height and autopad color', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const options = {
            followNewTab: false,
            videoFrame: {
                width: 1024,
                height: 1024,
            },
            autopad: {
                color: 'gray',
            },
        };
        const outputVideoPath = './test-output/test/video-recorder/testCase5a.mp4';
        const recorder = new __1.PuppeteerScreenRecorder(page, options);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        (0, globals_1.expect)(recorderValue instanceof __1.PuppeteerScreenRecorder).toBeTruthy();
        (0, globals_1.expect)(status).toBeTruthy();
        (0, globals_1.expect)(fs_1.default.existsSync(outputVideoPath)).toBeTruthy();
    });
    (0, globals_1.it)('testing video recording with video frame width, height and autopad color as hex code', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const options = {
            followNewTab: false,
            videoFrame: {
                width: 1024,
                height: 1024,
            },
            autopad: {
                color: '#008000',
            },
        };
        const outputVideoPath = './test-output/test/video-recorder/testCase5b.mp4';
        const recorder = new __1.PuppeteerScreenRecorder(page, options);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        (0, globals_1.expect)(recorderValue instanceof __1.PuppeteerScreenRecorder).toBeTruthy();
        (0, globals_1.expect)(status).toBeTruthy();
        (0, globals_1.expect)(fs_1.default.existsSync(outputVideoPath)).toBeTruthy();
    });
    (0, globals_1.it)('testing video recording with video frame width, height and default autopad color', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const options = {
            followNewTab: false,
            videoFrame: {
                width: 1024,
                height: 1024,
            },
            autopad: {},
        };
        const outputVideoPath = './test-output/test/video-recorder/testCase5c.mp4';
        const recorder = new __1.PuppeteerScreenRecorder(page, options);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        (0, globals_1.expect)(recorderValue instanceof __1.PuppeteerScreenRecorder).toBeTruthy();
        (0, globals_1.expect)(status).toBeTruthy();
        (0, globals_1.expect)(fs_1.default.existsSync(outputVideoPath)).toBeTruthy();
    });
});
(0, globals_1.describe)('Defensive test', () => {
    (0, globals_1.it)('should throw error if an invalid savePath argument is passed for start method', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        try {
            const outputVideoPath = './test-output/test/video-recorder/';
            const recorder = new __1.PuppeteerScreenRecorder(page);
            await recorder.start(outputVideoPath);
            /** execute */
            await page.goto('https://github.com', { waitUntil: 'load' });
            await page.goto('https://google.com', { waitUntil: 'load' });
            /** clear */
            await recorder.stop();
        }
        catch (error) {
            (0, globals_1.expect)(error.message === 'File format is not supported').toBeTruthy();
        }
    });
    (0, globals_1.it)('should create a video with a custom crf', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const options = {
            followNewTab: false,
            videoFrame: {
                width: 1024,
                height: 1024,
            },
            videoCrf: 0,
        };
        const outputVideoPath = './test-output/test/video-recorder/testCase6.mp4';
        const recorder = new __1.PuppeteerScreenRecorder(page, options);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        (0, globals_1.expect)(recorderValue instanceof __1.PuppeteerScreenRecorder).toBeTruthy();
        (0, globals_1.expect)(status).toBeTruthy();
        (0, globals_1.expect)(fs_1.default.existsSync(outputVideoPath)).toBeTruthy();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVwcGV0ZWVyU2NyZWVuUmVjb3JkZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zcGVjL1B1cHBldGVlclNjcmVlblJlY29yZGVyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0Q0FBb0I7QUFDcEIsK0JBQStCO0FBRS9CLDJDQUFxRDtBQUNyRCwwREFBa0M7QUFFbEMsMkJBQThFO0FBRTlFLE1BQU0sYUFBYSxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQy9CLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUUvRCxNQUFNLE9BQU8sR0FBRyxNQUFNLG1CQUFTLENBQUMsTUFBTSxpQkFDcEMsUUFBUSxFQUFFLElBQUksSUFDWCxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUMzRCxDQUFDO0lBRUgsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyxDQUFDO0FBRUYsSUFBQSxrQkFBUSxFQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtJQUNwQyxJQUFBLFlBQUUsRUFBQyx5REFBeUQsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN2RSxZQUFZO1FBQ1osTUFBTSxPQUFPLEdBQUcsTUFBTSxhQUFhLEVBQUUsQ0FBQztRQUV0QyxNQUFNLElBQUksR0FBRyxNQUFNLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVyQyxNQUFNLGVBQWUsR0FBRyxpREFBaUQsQ0FBQztRQUMxRSxNQUFNLFFBQVEsR0FBRyxJQUFJLDJCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELE1BQU0sYUFBYSxHQUFHLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUU1RCxjQUFjO1FBQ2QsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixF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