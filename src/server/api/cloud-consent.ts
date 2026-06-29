import { cloudConsentSchema } from '@/lib/security/validation';
export async function requestCloudProcessing(input:unknown){const data=cloudConsentSchema.parse(input);return {jobId:crypto.randomUUID(),status:'queued',deleteAfterHours:2,tool:data.tool,fileCount:data.fileCount};}
