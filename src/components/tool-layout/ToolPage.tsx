import Link from 'next/link';
import { ToolWorkbench } from '@/components/tool-layout/ToolWorkbench';
import { tools } from '@/lib/seo/tools';

export type ToolPageProps = {
  tool: {
    slug: string;
    name: string;
    description: string;
    category: string;
  };
};

export function ToolPage({ tool }: ToolPageProps) {
  const relatedTools = tools.filter((relatedTool) => relatedTool.category === tool.category && relatedTool.slug !== tool.slug).slice(0, 4);

  return (
    <div className="container-page py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section>
          <span className="badge">Free forever • No signup needed • Privacy-first</span>
          <h1 className="mt-4 text-5xl font-black">{tool.name}</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            {tool.description} DocuFlux PDF is browser-first and asks permission before cloud processing.
          </p>
          <div className="mt-8">
            <ToolWorkbench slug={tool.slug} name={tool.name} />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="card p-6">
            <h2 className="text-xl font-bold">How it works</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-slate-600 dark:text-slate-300">
              <li>Upload files with drag-and-drop or file picker.</li>
              <li>Choose ranges, target size, rotation, or related options.</li>
              <li>Process locally whenever possible and download a clean copy.</li>
            </ol>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold">Friendly errors</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
              <li>This file looks damaged. Try another PDF or repair it first.</li>
              <li>This PDF is already smaller than your target size.</li>
              <li>Wrong password. Please enter the correct password to unlock this PDF.</li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold">Related tools</h2>
            <div className="mt-3 grid gap-2">
              {relatedTools.map((relatedTool) => (
                <Link key={relatedTool.slug} href={`/${relatedTool.slug}`}>
                  {relatedTool.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tool.name,
            applicationCategory: 'BusinessApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
    </div>
  );
}
