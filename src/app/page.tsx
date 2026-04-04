import { getTodayLetter } from "@/lib/storage";
import ClientHome from "@/components/ClientHome";

export default async function Page() {
  const letter = await getTodayLetter();
  
  return (
    <ClientHome initialLetter={letter ? letter.content : null} />
  );
}
