import { Container } from "@/core/components/container";
import { Header } from "../dasboard/components/Header";
import { trpc } from "@/utils/trpc";

export function FeedbackPage() {
    const { data } = trpc.feedback

    return <Container>
        <Header currentPath="/feedback" />
    </Container>
}






