import { useParams } from "next/navigation";

export function LevelPageID() {
  const params = useParams();
  const levelId = params?.levelId as string;
  return <></>
}