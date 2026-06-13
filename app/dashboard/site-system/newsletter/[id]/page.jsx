import { NewsletterPostEditor } from "../../../../../components/dashboard/newsletter/NewsletterPostEditor";

export default function EditNewsletterPage({ params }) {
  return <NewsletterPostEditor newsletterId={params.id} />;
}
