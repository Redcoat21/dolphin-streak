import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const activities = [
    {
      title: "Daily Challenge",
      image: "/imgSource/daily.png",
      description: "Put your knowledge to the test with our Daily Practice!",
      route: "/daily-challenge",
    },
    {
      title: "Course",
      image: "/imgSource/course.png",
      description: "Expand your knowledge with our interactive lessons!",
      route: "/course",
    },
    {
      title: "Comprehension",
      image: "/imgSource/comprehension.png",
      description: "Show off your skills with a comprehension test!",
      route: "/comprehension",
    },
  ];


  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-500">
              <Image
                src="/imgSource/User.png"
                alt="User Icon"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Hello, User</h3>
          </div>
          <Button
            onClick={() => router.push("/forum")}
            variant="custom-blue"
            className="px-6"
          >
            Forum
          </Button>
        </div>

        {/* Activities */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Choose Your Activity</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <div
                key={activity.title}
                className="bg-gray-900 rounded-lg p-6 space-y-4 hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => router.push(activity.route)}
              >
                <h3 className="text-xl font-semibold">{activity.title}</h3>
                <div className="relative h-32 w-full">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-gray-400">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
