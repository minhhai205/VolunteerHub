/**
 *
 * @param currentPage currentPage, maxVisible = 5
 * @param totalPages totalPages
 * @returns
 */

export function generatePaginationItems(
  currentPage: number,
  totalPages: number
) {
  const items: (number | "ellipsis")[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) items.push(i);
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) items.push(i);
      items.push("ellipsis");
      items.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      items.push(1);
      items.push("ellipsis");
      for (let i = totalPages - 3; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      items.push("ellipsis");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) items.push(i);
      items.push("ellipsis");
      items.push(totalPages);
    }
  }

  return items;
}
