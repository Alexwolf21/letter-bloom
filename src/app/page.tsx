import { getTodayLetter, getPastLetters } from "@/lib/storage";
import ClientHome from "@/components/ClientHome";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const [letter, pastLetters] = await Promise.all([
    getTodayLetter(),
    getPastLetters()
  ]);
  
  return (
    <ClientHome 
      initialLetter={letter} 
      pastLetters={pastLetters}
    />
  );
}
