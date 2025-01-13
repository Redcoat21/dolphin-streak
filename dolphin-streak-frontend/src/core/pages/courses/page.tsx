import React, { useState, useEffect } from "react";
import { Container } from "@/core/components/container";
import { useRouter } from "next/navigation";
import { Header } from "../dasboard/components/Header";
import { CourseCard } from "./components/CourseCard";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { trpc } from "@/utils/trpc";
import { useAuthStore } from "@/core/stores/authStore";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function CoursePage() {
  const { getAccessToken } = useAuthStore();
  const accessToken = getAccessToken();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter courses based on search query
  const filteredCourses = coursesData?.data.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.language.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header
        currentPath="/courses"
        languageDropdown={true}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      <main className="min-h-screen bg-slate-950 text-white pt-24 pb-8 px-4 md:mt-8 mt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold">Available Courses</h1>
            </div>
            <p className="text-slate-400">Explore our courses and begin your learning journey</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search courses by name or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Courses Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <LoadingSkeleton count={3} />
            </div>
          ) : filteredCourses && filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onClick={() => router.push(`/course/${course._id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                No courses found
              </h3>
              <p className="text-slate-500">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Check back later for new courses"}
              </p>
            </div>
          )}
        </div>
      </main>
    </Container>
  );
}

export default CoursePage;