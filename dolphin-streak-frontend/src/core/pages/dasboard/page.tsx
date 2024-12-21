import { useMediaQuery } from "@/hooks/use-media-query";
import { DashboardDekstopView } from "./components/DekstopView/page";
import { DashboardMobileView } from "./components/MobileView/page";
import { ActivityCardProps } from "./types";

export function Dashboard() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    
    const activities: ActivityCardProps[] = [
        {
            title: "Daily Challenge",
            icon: "/images/daily.png",
            description: "Put your knowledge to the test with our Daily Practice!",
            link: "/challenge"
        },
        {
            title: "Course",
            icon: "/images/course.png",
            description: "Expand your knowledge with our interactive lessons!",
            link: "/course"
        },
        {
            title: "Comprehension",
            icon: "/images/comprehension.png",
            description: "Show off your skills with a comprehension test!",
            link: "/comprehension"
        }
    ];

    return isMobile ? (
        <DashboardMobileView activities={activities} />
    ) : (
        <DashboardDekstopView activities={activities} />
    );
}
