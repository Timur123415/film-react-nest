import { Test, TestingModule } from '@nestjs/testing';
import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TskvLogger],
    }).compile();

    logger = module.get<TskvLogger>(TskvLogger);
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('должен быть определен', () => {
    expect(logger).toBeDefined();
  });

  it('должен форматировать сообщение в TSKV', () => {
    const message = 'Test Log Message';

    logger.log(message);

    expect(consoleSpy).toHaveBeenCalled();
    const output = consoleSpy.mock.calls[0][0];

    expect(output).toContain('level=log');
    expect(output).toContain(`message=${message}`);
    expect(output).toMatch(/timestamp=\d{4}-\d{2}-\d{2}/);

    expect(output).toMatch(/\t/);
  });

  it('должен корректно обрабатывать параметры (объекты)', () => {
    const message = 'Offer created';
    const params = { id: 123, status: 'ok' };

    logger.log(message, params);

    const output = consoleSpy.mock.calls[0][0];
    expect(output).toContain('params=[{"id":123,"status":"ok"}]');
  });
});
