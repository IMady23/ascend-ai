export const MOCK_IDENTITY = {
    id: 'user_123',
    provider: 'mock',
    roles: ['user'],
    permissions: ['goal.read', 'goal.write'],
    sessionId: 'session_mock',
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600000
};

export const MOCK_EXECUTION_CONTEXT = {
    correlationId: 'cor_mock',
    requestId: 'req_mock',
    identity: MOCK_IDENTITY,
    timeoutBudgetMs: 5000,
    traceId: 'trace_mock',
    timestamp: Date.now()
};
