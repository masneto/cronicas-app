"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const core = __importStar(require("@actions/core"));
// Mock the modules
jest.mock('nodemailer');
jest.mock('@actions/core');
// Import the action file
const index_1 = require("../src/index"); // Importando a função run diretamente
describe('Email Notification Action', () => {
    let mockSendMail;
    let mockCreateTransport;
    beforeEach(() => {
        // Clear all mocks
        jest.resetModules();
        jest.clearAllMocks();
        // Mock the core inputs
        core.getInput = jest.fn((name) => {
            const inputs = {
                smtp_server: 'smtp.gmail.com',
                smtp_port: '465',
                username: 'test@example.com',
                password: 'password123',
                to: 'recipient@example.com',
                from: 'sender@example.com',
                subject: '[ALERT] Workflow Failed',
                workflow_name: 'Test Workflow',
                branch: 'main',
                author_name: 'Test User',
                author_email: 'test.user@example.com',
                run_url: 'https://github.com/owner/repo/actions/runs/123',
                error_message: 'Build failed during test execution',
            };
            return inputs[name] || '';
        });
        // Mock process.env
        process.env.GITHUB_REPOSITORY = 'owner/repo';
        process.env.GITHUB_SERVER_URL = 'https://github.com';
        process.env.GITHUB_RUN_ID = '456';
        // Mock nodemailer functions
        mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
        mockCreateTransport = jest.fn().mockReturnValue({
            sendMail: mockSendMail,
        });
        nodemailer_1.default.createTransport = mockCreateTransport;
        // Spy on core methods
        jest.spyOn(core, 'info').mockImplementation(() => { });
        jest.spyOn(core, 'setOutput').mockImplementation(() => { });
        jest.spyOn(core, 'setFailed').mockImplementation(() => { });
    });
    test('sends email with correct parameters', async () => {
        // Run the action
        await (0, index_1.run)();
        // Check if createTransport was called with correct parameters
        expect(mockCreateTransport).toHaveBeenCalledWith({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'test@example.com',
                pass: 'password123',
            },
        });
        // Check if sendMail was called with correct parameters
        expect(mockSendMail).toHaveBeenCalled();
        const mailOptions = mockSendMail.mock.calls[0][0];
        expect(mailOptions.from).toBe('sender@example.com');
        expect(mailOptions.to).toBe('recipient@example.com');
        expect(mailOptions.subject).toBe('[ALERT] Workflow Failed');
        expect(mailOptions.text).toContain('Test Workflow');
        expect(mailOptions.text).toContain('owner/repo');
        expect(mailOptions.text).toContain('main');
        expect(mailOptions.text).toContain('Test User');
        expect(mailOptions.text).toContain('test.user@example.com');
        expect(mailOptions.text).toContain('https://github.com/owner/repo/actions/runs/123');
        expect(mailOptions.text).toContain('Build failed during test execution');
        // Check output was set
        expect(core.setOutput).toHaveBeenCalledWith('messageId', 'test-message-id');
    });
    // Outros testes permanecem os mesmos...
});
