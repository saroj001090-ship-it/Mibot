import { describe, expect, it } from 'vitest';import { friendlyPdfError } from '@/lib/security/validation';
describe('DocuFlux safeguards',()=>{it('returns friendly privacy/security errors',()=>{expect(friendlyPdfError('password')).toContain('Wrong password');expect(friendlyPdfError('optimized')).toContain('already smaller');});});
