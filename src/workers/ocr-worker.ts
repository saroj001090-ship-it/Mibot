export type PdfWorkerMessage={tool:string;payload:unknown};
self.onmessage=(event:MessageEvent<PdfWorkerMessage>)=>{self.postMessage({status:'ready',tool:event.data.tool});};
