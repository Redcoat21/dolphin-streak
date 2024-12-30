import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { TCourse } from "@/server/types/courses";
import Image from "next/image";

export const CourseCard = ({ course, progress = 0, onClick }: { course: TCourse; progress?: number; onClick: () => void }) => (
    <Card
        onClick={onClick}
        className="group relative overflow-hidden bg-slate-900 border-slate-800 hover:border-blue-500 transition-all duration-300"
    >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <div className="relative h-48 w-full overflow-hidden">
            <Image
                src={course.thumbnail}
                alt={course.name}
                fill
                className="object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <div className="flex items-center gap-2 mb-2">
                <Image
                    src={course.language.image}
                    alt={course.language.name}
                    width={24}
                    height={24}
                    className="rounded-full ring-2 ring-white/20"
                />
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                    {course.levels.length} Levels
                </Badge>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{course.name}</h3>
            <p className="text-slate-300 text-sm mb-2">{course.language.name}</p>
            <Progress value={progress} className="h-1 bg-slate-700" />
        </div>
    </Card>
);