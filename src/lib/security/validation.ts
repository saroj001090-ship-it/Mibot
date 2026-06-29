import { z } from 'zod';
export const cloudConsentSchema=z.object({tool:z.string().min(1),consent:z.literal(true),fileCount:z.number().int().positive().max(100)});
export const MAX_FILE_SIZE=200*1024*1024;
export function assertSafeFilename(name:string){return name.replace(/[^a-z0-9._-]/gi,'_').slice(0,120)}
export function friendlyPdfError(code:string){return ({corrupt:'This file looks damaged. Try another PDF or repair it first.',password:'Wrong password. Please enter the correct password to unlock this PDF.',optimized:'This PDF is already smaller than your target size.',cloud:'This conversion needs cloud processing. Continue only if you agree to upload this file.',range:'No pages selected or invalid page range.'} as Record<string,string>)[code] || 'Something went wrong. Please try again without losing your original file.'}
