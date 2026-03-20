import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type AppPaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
};

function buildVisiblePages(page: number, totalPages: number, siblingCount: number): Array<number | "ellipsis"> {
  if (totalPages <= 1) return [1];

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);
  const shouldShowLeftDots = leftSibling > 2;
  const shouldShowRightDots = rightSibling < totalPages - 1;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftRange = Array.from({ length: Math.min(3 + siblingCount * 2, totalPages) }, (_, i) => i + 1);
    return [...leftRange, "ellipsis", totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightRangeStart = Math.max(totalPages - (2 + siblingCount * 2), 1);
    const rightRange = Array.from({ length: totalPages - rightRangeStart + 1 }, (_, i) => rightRangeStart + i);
    return [1, "ellipsis", ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSibling - leftSibling + 1 },
      (_, i) => leftSibling + i
    );
    return [1, "ellipsis", ...middleRange, "ellipsis", totalPages];
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

export function AppPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  siblingCount = 1,
}: AppPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const visiblePages = buildVisiblePages(page, totalPages, siblingCount);

  if (totalItems <= pageSize) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 border-t bg-background/70">
      <p className="text-xs text-muted-foreground">
        Showing {(page - 1) * pageSize + 1}-
        {Math.min(page * pageSize, totalItems)} of {totalItems}
      </p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault();
                onPageChange(Math.max(1, page - 1));
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>

          {visiblePages.map((pageItem, index) => (
            <PaginationItem key={`${pageItem}-${index}`}>
              {pageItem === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={pageItem === page}
                  onClick={(event) => {
                    event.preventDefault();
                    onPageChange(pageItem);
                  }}
                >
                  {pageItem}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault();
                onPageChange(Math.min(totalPages, page + 1));
              }}
              className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
