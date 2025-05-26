import categoryApi from "@/api/categoryApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ICategory } from "@/types/category";
import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { DATETIME_FORMAT } from "@/constants/app";
import { ECategoryType } from "@/enums/category";
import type { IBaseCriteria } from "@/types/criteria";

export interface ICategoryCriteria extends IBaseCriteria {
  searchKeyword: string;
  isActive: boolean;
  name: string;
  types: ECategoryType[];
}

const initialCriteria: ICategoryCriteria = {
  searchKeyword: "",
  isActive: true,
  name: "",
  types: [ECategoryType.TOPIC],
  page: 0,
  size: 10,
  sortBy: "createdAt",
  sortDirection: "desc",
};

const Categories: React.FunctionComponent = () => {
  const [criteria, setCriteria] = useState<ICategoryCriteria>(initialCriteria);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const getCategories = useCallback(async () => {
    const { ok, body } = await categoryApi.getCategories(criteria);
    if (ok && body) {
      setCategories(body.items);
    }
  }, [criteria]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <div className="w-full p-5 bg-white rounded shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.type}</TableCell>
              <TableCell>
                {format(category.createdAt, DATETIME_FORMAT)}
              </TableCell>
              <TableCell>dasdasda</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Categories;
