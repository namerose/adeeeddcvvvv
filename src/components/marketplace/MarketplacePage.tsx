import { CodeMarketplace } from './CodeMarketplace';

export function MarketplacePage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header - Always visible */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Code Marketplace</h1>
        <p className="text-muted-foreground">
          Discover, buy and sell high-quality code, components, and templates
        </p>
      </div>

      <CodeMarketplace />
    </div>
  );
}