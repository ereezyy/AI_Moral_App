import { describe, it, expect, beforeEach } from 'vitest';
import { Logger } from '../logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = Logger.getInstance();
    logger.clearLogs();
  });

  it('should log messages with different levels', () => {
    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    const logs = logger.getLogs();
    expect(logs).toHaveLength(4);
    expect(logs[0].level).toBe('debug');
    expect(logs[1].level).toBe('info');
    expect(logs[2].level).toBe('warn');
    expect(logs[3].level).toBe('error');
  });

  it('should filter logs by level', () => {
    logger.info('Info 1');
    logger.error('Error 1');
    logger.info('Info 2');

    const infoLogs = logger.getLogs('info');
    expect(infoLogs).toHaveLength(2);
    expect(infoLogs.every(log => log.level === 'info')).toBe(true);
  });
});