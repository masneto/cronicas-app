import nodemailer from 'nodemailer';
import * as core from '@actions/core';

// Mock the modules
jest.mock('nodemailer');
jest.mock('@actions/core');

// Import the action file
import { run } from '../src/index'; // Importando a função run diretamente

describe('Email Notification Action', () => {
  let mockSendMail: jest.Mock;
  let mockCreateTransport: jest.Mock;

  beforeEach(() => {
    // Clear all mocks
    jest.resetModules();
    jest.clearAllMocks();

    // Mock the core inputs
    (core.getInput as jest.Mock) = jest.fn((name: string): string => {
      const inputs: Record<string, string> = {
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
    (nodemailer.createTransport as jest.Mock) = mockCreateTransport;

    // Spy on core methods
    jest.spyOn(core, 'info').mockImplementation(() => {});
    jest.spyOn(core, 'setOutput').mockImplementation(() => {});
    jest.spyOn(core, 'setFailed').mockImplementation(() => {});
  });

  test('sends email with correct parameters', async () => {
    // Run the action
    await run();

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
});