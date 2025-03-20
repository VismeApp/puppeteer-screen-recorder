import fs from 'fs';
import { dirname } from 'path';
import { describe, expect, it } from '@jest/globals';
import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from '../';
const launchBrowser = async () => {
    const puppeteerPath = process.env['PUPPETEER_EXECUTABLE_PATH'];
    const browser = await puppeteer.launch({
        headless: true,
        ...(puppeteerPath ? { executablePath: puppeteerPath } : {}),
    });
    return browser;
};
describe('Happy path test case', () => {
    it('Should be able to create a new screen-recording session', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const outputVideoPath = './test-output/test/video-recorder/testCase1.mp4';
        const recorder = new PuppeteerScreenRecorder(page);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
        expect(status).toBeTruthy();
        expect(fs.existsSync(outputVideoPath)).toBeTruthy();
    });
    it('Should be able to create a new screen-recording session using mp4 format', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const outputVideoPath = './test-output/test/video-recorder/testCase1.mp4';
        const recorder = new PuppeteerScreenRecorder(page);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
        expect(status).toBeTruthy();
        expect(fs.existsSync(outputVideoPath)).toBeTruthy();
    });
    it('Should be able to create a new screen-recording session using mov', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const outputVideoPath = './test-output/test/video-recorder/testCase1.mov';
        const recorder = new PuppeteerScreenRecorder(page);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
        expect(status).toBeTruthy();
        expect(fs.existsSync(outputVideoPath)).toBeTruthy();
    });
    it('Should be able to create a new screen-recording session using webm', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const outputVideoPath = './test-output/test/video-recorder/testCase1.webm';
        const recorder = new PuppeteerScreenRecorder(page);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
        expect(status).toBeTruthy();
        expect(fs.existsSync(outputVideoPath)).toBeTruthy();
    });
    it('should be to get the total duration of recording using avi', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const outputVideoPath = './test-output/test/video-recorder/testCase2.avi';
        const recorder = new PuppeteerScreenRecorder(page);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        recorder.getRecordDuration();
        await browser.close();
        /** assert */
        expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
        expect(status).toBeTruthy();
        expect(fs.existsSync(outputVideoPath)).toBeTruthy();
    });
    it('should be able to record a video with video frame width, height and aspect ratio', async () => {
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
        const recorder = new PuppeteerScreenRecorder(page, options);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
        expect(status).toBeTruthy();
        expect(fs.existsSync(outputVideoPath)).toBeTruthy();
    });
    it('Should be able to create a new screen-recording session using streams', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const outputVideoPath = './test-output/test/video-recorder/testCase4.mp4';
        try {
            fs.mkdirSync(dirname(outputVideoPath), { recursive: true });
        }
        catch (e) {
            console.error(e);
        }
        const fileWriteStream = fs.createWriteStream(outputVideoPath);
        const recorder = new PuppeteerScreenRecorder(page);
        await recorder.startStream(fileWriteStream);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        expect(status).toBeTruthy();
        expect(fs.existsSync(outputVideoPath)).toBeTruthy();
        fileWriteStream.on('end', () => {
            expect(fileWriteStream.writableFinished).toBeTruthy();
        });
    });
});
describe('video frame testing', () => {
    it('testing video recording with video frame width, height and autopad color', async () => {
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
        const recorder = new PuppeteerScreenRecorder(page, options);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
        expect(status).toBeTruthy();
        expect(fs.existsSync(outputVideoPath)).toBeTruthy();
    });
    it('testing video recording with video frame width, height and autopad color as hex code', async () => {
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
        const recorder = new PuppeteerScreenRecorder(page, options);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
        expect(status).toBeTruthy();
        expect(fs.existsSync(outputVideoPath)).toBeTruthy();
    });
    it('testing video recording with video frame width, height and default autopad color', async () => {
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
        const recorder = new PuppeteerScreenRecorder(page, options);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
        expect(status).toBeTruthy();
        expect(fs.existsSync(outputVideoPath)).toBeTruthy();
    });
});
describe('Defensive test', () => {
    it('should throw error if an invalid savePath argument is passed for start method', async () => {
        /** setup */
        const browser = await launchBrowser();
        const page = await browser.newPage();
        try {
            const outputVideoPath = './test-output/test/video-recorder/';
            const recorder = new PuppeteerScreenRecorder(page);
            await recorder.start(outputVideoPath);
            /** execute */
            await page.goto('https://github.com', { waitUntil: 'load' });
            await page.goto('https://google.com', { waitUntil: 'load' });
            /** clear */
            await recorder.stop();
        }
        catch (error) {
            expect(error.message === 'File format is not supported').toBeTruthy();
        }
    });
    it('should create a video with a custom crf', async () => {
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
        const recorder = new PuppeteerScreenRecorder(page, options);
        const recorderValue = await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        /** clear */
        const status = await recorder.stop();
        await browser.close();
        /** assert */
        expect(recorderValue instanceof PuppeteerScreenRecorder).toBeTruthy();
        expect(status).toBeTruthy();
        expect(fs.existsSync(outputVideoPath)).toBeTruthy();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVwcGV0ZWVyU2NyZWVuUmVjb3JkZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zcGVjL1B1cHBldGVlclNjcmVlblJlY29yZGVyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3BCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFL0IsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sU0FBUyxNQUFNLFdBQVcsQ0FBQztBQUVsQyxPQUFPLEVBQUUsdUJBQXVCLEVBQWtDLE1BQU0sS0FBSyxDQUFDO0FBRTlFLE1BQU0sYUFBYSxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQy9CLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUUvRCxNQUFNLE9BQU8sR0FBRyxNQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDckMsUUFBUSxFQUFFLElBQUk7UUFDZCxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQzVELENBQUMsQ0FBQztJQUVILE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDcEMsRUFBRSxDQUFDLHlEQUF5RCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3ZFLFlBQVk7UUFDWixNQUFNLE9BQU8sR0FBRyxNQUFNLGFBQWEsRUFBRSxDQUFDO1FBRXRDLE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXJDLE1BQU0sZUFBZSxHQUFHLGlEQUFpRCxDQUFDO1FBQzFFLE1BQU0sUUFBUSxHQUFHLElB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