import React, { useState } from "react";
import { Container } from "@/core/components/container";
import { useRouter } from "next/router";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import { useAuthStore } from "@/core/stores/authStore";
import { TCourse } from "@/server/types/courses";
import { Header } from "../dasboard/components/Header";

export function CoursePage() {
  const { getAccessToken } = useAuthStore();
  const accessToken = getAccessToken();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<TCourse | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("612a4b7e8c4e2c001f1f8c5a"); // Default language ID

  // Fetch courses using tRPC
  const { data: coursesData, isLoading, error } = trpc.course.getCourses.useQuery({
    accessToken: accessToken || "",
    language: selectedLanguage,
    type: 1, // Ensure this is either 0 or 1
  });

  const handleCourseClick = (course: TCourse) => {
    setSelectedCourse(course);
  };

  const handleCloseDrawer = () => {
    setSelectedCourse(null);
  };

  const handleLanguageChange = (languageId: string) => {
    setSelectedLanguage(languageId);
  };

  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return <Container>Error: {error.message}</Container>;
  }

  return (
      <Container>
        <Header
          currentPath={router.pathname}
          languageDropdown={true}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20">
          {coursesData?.data.map((course) => (
            <Card key={course._id} onClick={() => handleCourseClick(course)} className="cursor-pointer">
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.language.name}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Drawer open={!!selectedCourse} onClose={handleCloseDrawer}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{selectedCourse?.name}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <p>Language: {selectedCourse?.language.name}</p>
              <p>Type: {selectedCourse?.type}</p>
              <img src={selectedCourse?.thumbnail} alt={selectedCourse?.name} className="mt-4" />
            </div>
            <DrawerFooter>
              <Button onClick={handleCloseDrawer}>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Container>
  );
}