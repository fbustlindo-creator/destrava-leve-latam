import Home from '../page';
import { FUNNEL_ROUTES } from '../funnel-routes';

export function generateStaticParams() {
  return FUNNEL_ROUTES.filter(Boolean).map(step => ({ step }));
}

export default async function StepPage({
  params,
}: {
  params: Promise<{ step: string }> | { step: string };
}) {
  const resolved = params instanceof Promise ? await params : params;
  return <Home initialSlug={resolved.step} />;
}
