// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { MoreVertical } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export function DataTable({
//   columns,
//   data,
//   onDelete,
//   onUpdate,
//   onPrint,
//   onStatusChange,
//   showActions = true,
//   actionType = "other",
// }) {
//   return (
//     <div className="overflow-x-auto">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             {columns.map((column) => (
//               <TableHead key={column.key} className="text-center text-xs">
//                 {column.label}
//               </TableHead>
//             ))}
//             {showActions && (
//               <TableHead className="text-center text-xs">অ্যাকশন</TableHead>
//             )}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data.length === 0 ? (
//             <TableRow>
//               <TableCell
//                 colSpan={columns.length + (showActions ? 1 : 0)}
//                 className="text-center py-8 text-gray-500 text-xs"
//               >
//                 কোন ডেটা পাওয়া যায়নি
//               </TableCell>
//             </TableRow>
//           ) : (
//             data.map((row, idx) => (
//               <TableRow key={idx}>
//                 {columns.map((column) => (
//                   <TableCell key={column.key} className="text-center text-xs">
//                     {row[column.key]}
//                   </TableCell>
//                 ))}
//                 {showActions && (
//                   <TableCell className="text-center">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="cursor-pointer h-8 w-8 p-0 hover:bg-gray-100"
//                         >
//                           <MoreVertical className="w-4 h-4 text-gray-600" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end" className="w-40">
//                         {actionType === "product" && onPrint && (
//                           <DropdownMenuItem
//                             onClick={() => onPrint(row.id)}
//                             className="cursor-pointer"
//                           >
//                             প্রিন্ট করুন
//                           </DropdownMenuItem>
//                         )}
//                         {onUpdate && (
//                           <DropdownMenuItem
//                             onClick={() => onUpdate(row.id)}
//                             className="cursor-pointer"
//                           >
//                             আপডেট করুন
//                           </DropdownMenuItem>
//                         )}
//                         {onStatusChange && (
//                           <DropdownMenuItem
//                             onClick={() => onStatusChange(row.id)}
//                             className="cursor-pointer"
//                           >
//                             স্ট্যাটাস আপডেট করুন
//                           </DropdownMenuItem>
//                         )}
//                         {onDelete && (
//                           <DropdownMenuItem
//                             onClick={() => onDelete(row.id)}
//                             className="cursor-pointer text-red-600"
//                           >
//                             ডিলিট করুন
//                           </DropdownMenuItem>
//                         )}
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 )}
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function DataTable({
  columns,
  data,
  onDelete,
  onUpdate,
  onPrint,
  onStatusChange,
  showActions = true,
  actionType = "other",
}) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleActionClick = (actionCallback, id) => {
    actionCallback(id);
    setOpenDropdown(null);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className="text-center text-xs">
                {column.label}
              </TableHead>
            ))}
            {showActions && (
              <TableHead className="text-center text-xs">অ্যাকশন</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (showActions ? 1 : 0)}
                className="text-center py-8 text-gray-500 text-xs"
              >
                কোন ডেটা পাওয়া যায়নি
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((column) => (
                  <TableCell key={column.key} className="text-center text-xs">
                    {row[column.key]}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell className="text-center">
                    <DropdownMenu
                      open={openDropdown === idx}
                      onOpenChange={(open) =>
                        setOpenDropdown(open ? idx : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {actionType === "product" && onPrint && (
                          <DropdownMenuItem
                            onClick={() => handleActionClick(onPrint, row.id)}
                            className="cursor-pointer"
                          >
                            প্রিন্ট করুন
                          </DropdownMenuItem>
                        )}
                        {onUpdate && (
                          <DropdownMenuItem
                            onClick={() => handleActionClick(onUpdate, row.id)}
                            className="cursor-pointer"
                          >
                            আপডেট করুন
                          </DropdownMenuItem>
                        )}
                        {onStatusChange && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleActionClick(onStatusChange, row.id)
                            }
                            className="cursor-pointer"
                          >
                            স্ট্যাটাস আপডেট করুন
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => handleActionClick(onDelete, row.id)}
                            className="cursor-pointer text-red-600"
                          >
                            ডিলিট করুন
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
