import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;

    for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          className={`w-10 h-10 ${currentPage === i
              ? "bg-[#4F46E5] hover:bg-[#4338CA] text-white"
              : "bg-[#1E1F23] text-gray-400 hover:bg-[#2E2F33]"
            } rounded-lg`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }

    if (totalPages > maxVisiblePages) {
      pages.push(
        <span key="dots" className="text-gray-400 px-2">...</span>,
        <Button
          key={totalPages}
          variant="outline"
          size="sm"
          className="w-10 h-10 bg-[#1E1F23] text-gray-400 hover:bg-[#2E2F33] rounded-lg"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        className="w-10 h-10 bg-[#1E1F23] text-gray-400 hover:bg-[#2E2F33] rounded-lg"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {renderPageNumbers()}
      <Button
        variant="outline"
        size="sm"
        className="w-10 h-10 bg-[#1E1F23] text-gray-400 hover:bg-[#2E2F33] rounded-lg"
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}