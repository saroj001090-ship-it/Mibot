import { tools } from '@/lib/seo/tools';
export default function sitemap(){return ['','tools','dashboard','admin','blog','help','faq','contact','about','support','privacy','terms','cookies','data-deletion','upload','viewer','batch',...tools.map(t=>t.slug)].map(p=>({url:`https://docufluxpdf.com/${p}`,lastModified:new Date()}))}
