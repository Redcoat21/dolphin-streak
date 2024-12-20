import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useMediaQuery } from '@/hooks/use-media-query';
import { ComprehensionsMobileView } from './components/MobileView';
import { ComprehensionsDesktopView } from './components/DesktopView';

const ComprehensionsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile ? <ComprehensionsMobileView /> : <ComprehensionsDesktopView />;
};

export default ComprehensionsPage;