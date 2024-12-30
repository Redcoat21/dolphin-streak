import React, { useState, useEffect } from "react";
import { Container } from "@/core/components/container";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import { useAuthStore } from "@/core/stores/authStore";
import { Header } from "../dasboard/components/Header";
import type { TCourse } from "@/server/types/courses";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { CourseCard } from "./components/CourseCard";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

export function CoursePage() {
  const { getAccessToken } = useAuthStore();
  const accessToken = getAccessToken();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  // Fetch languages data
  const { data: languagesData } = trpc.language.getLanguages.useQuery({
    accessToken: accessToken || "",
  });

  // Set selectedLanguage to the first language if it exists
  useEffect(() => {
    if (languagesData?.data && languagesData.data.length > 0) {
      setSelectedLanguage(languagesData.data[0]._id);
    }
  }, [languagesData]);

  const { data: coursesData, isLoading } = trpc.course.getCourses.useQuery({
    accessToken: accessToken || "",
    language: selectedLanguage,
    type: 1,
  });

  return (
    <Container>
      <Header
        currentPath="/courses"
        languageDropdown={true}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      <main className="min-h-screen bg-slate-950 text-white pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Available Courses</h1>
            <p className="text-slate-400">Choose a course to begin your learning journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <LoadingSkeleton count={3} type="course" cardClassName="" />
            ) : (
              coursesData?.data.map((course) => (<CourseCard
                key={course._id}
                course={course}
                progress={35}
                onClick={() => {
                  router.push(`/course/${course._id}`);
                }}
              />
              ))
            )}
          </div>
        </div>
      </main>
    </Container>
  );
}

export default CoursePage;