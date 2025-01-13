// CourseCard/index.tsx
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Shield } from "lucide-react";
import { TCourse } from "@/server/types/courses";

type CourseCardProps = { course: TCourse; onClick: () => void };

export const CourseCard = ({ course, onClick }: CourseCardProps) => (
    <Card
        onClick={onClick}
        className="group cursor-pointer relative overflow-hidden bg-slate-900 border-slate-800 hover:border-blue-500 transition-all duration-300"
    >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />

        {/* Course Thumbnail with Fallback */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-800">
            {course.thumbnail ? (
                <Image
                    src={course.thumbnail}
                    alt={course.name}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-slate-700" />
                </div>
            )}
        </div>

        {/* Course Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <div className="flex items-center gap-2 mb-3">
                <div className="relative w-6 h-6">
                    <Image
                        src={course.language.image}
                        alt={course.language.name}
                        fill
                        className="rounded-full object-cover ring-2 ring-white/20"
                    />
                </div>
                <span className="text-sm text-slate-300">{course.language.name}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {course.name}
            </h3>

            <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="inline-flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                </span>
            </div>
        </div>
    </Card>
);