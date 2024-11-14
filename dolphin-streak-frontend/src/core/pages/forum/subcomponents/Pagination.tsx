import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {[...Array(Math.min(3, totalPages))].map((_, index) => (
        <Button
          key={index + 1}
          variant={currentPage === index + 1 ? "default" : "outline"}
          size="sm"
          className={`w-8 h-8 ${
            currentPage === index + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-400"
          }`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </Button>
      ))}
      <span className="text-gray-400">.........</span>
      <Button
        variant="outline"
        size="sm"
        className="w-8 h-8 bg-gray-800 text-gray-400"
      >
        {totalPages}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-8 h-8 bg-gray-800 text-gray-400"
      >
        →
      </Button>
    </div>
  );
}
