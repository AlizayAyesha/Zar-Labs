import Main from "./Main/Main";
import { getHomeVideosMap, REVALIDATE_SECONDS } from "../lib/supabase/queries";

export const revalidate = REVALIDATE_SECONDS;

export default async function Home() {
  const videos = await getHomeVideosMap();
  return <Main videos={videos} />;
}
