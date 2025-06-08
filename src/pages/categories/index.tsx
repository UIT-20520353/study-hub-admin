import categoryApi from "@/api/categoryApi";
import { PaginationSimple, SpinLoading } from "@/components/common";
import { Button } from "@/components/common/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DATETIME_FORMAT } from "@/constants/app";
import { ECategoryType } from "@/enums/category";
import type { ICategory } from "@/types/category";
import type { IBaseCriteria } from "@/types/criteria";
import { format } from "date-fns";
import { Edit, Plus, Search, Trash, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CategoryTypeBadge from "./components/category-type-badge";
import CreateCategoryModal from "./components/create-category-modal";
import DeleteCategoryModal from "./components/delete-category-modal";
import UpdateCategoryModal from "./components/update-category-modal";

export interface ICategoryCriteria extends IBaseCriteria {
  isActive: boolean;
  name?: string;
  types: ECategoryType[];
}

const initialCriteria: ICategoryCriteria = {
  isActive: true,
  name: "",
  types: [ECategoryType.TOPIC, ECategoryType.PRODUCT],
  page: 0,
  size: 10,
  sortBy: "createdAt",
  sortDirection: "desc",
};

const Categories: React.FunctionComponent = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<ICategory | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(
    null
  );

  const [searchName, setSearchName] = useState<string>("");
  const [selectedType, setSelectedType] = useState<ECategoryType | undefined>(
    undefined
  );

  const [debouncedSearchName, setDebouncedSearchName] = useState<string>("");
  const [debouncedSelectedType, setDebouncedSelectedType] = useState<
    ECategoryType | undefined
  >(undefined);

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { t } = useTranslation();

  const getCategories = useCallback(async () => {
    setIsFetching(true);
    try {
      const criteria: ICategoryCriteria = {
        ...initialCriteria,
        name: debouncedSearchName || undefined,
        types: debouncedSelectedType
          ? [debouncedSelectedType as ECategoryType]
          : [ECategoryType.TOPIC, ECategoryType.PRODUCT],
        page: currentPage,
      };

      const { ok, body } = await categoryApi.getCategories(criteria);
      if (ok && body) {
        setCategories(body.items);
        setTotalPages(body.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsFetching(false);
    }
  }, [currentPage, debouncedSearchName, debouncedSelectedType]);

  const onEditClick = (category: ICategory) => {
    setCategoryToUpdate(category);
    setIsUpdateModalOpen(true);
  };

  const onDeleteClick = (category: ICategory) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const onCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    getCategories();
  };

  const handleUpdateSuccess = () => {
    getCategories();
  };

  const handleDeleteSuccess = () => {
    getCategories();
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCategoryToUpdate(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleClearFilters = () => {
    setSearchName("");
    setSelectedType(undefined);
    setCurrentPage(0);
  };

  const hasActiveFilters = useMemo(() => {
    return searchName.trim() !== "" || selectedType !== undefined;
  }, [searchName, selectedType]);

  const typeOptions = [
    { value: "", label: t("category.filter.allTypes") },
    ...Object.values(ECategoryType).map((type) => ({
      value: type,
      label: t(`category.type.${type.toLowerCase()}`),
    })),
  ];

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchName(searchName);
      setCurrentPage(0);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchName]);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSelectedType(selectedType);
      setCurrentPage(0);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedType]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("category.management.title")}
            </h1>
            <p className="text-gray-600">{t("category.management.subtitle")}</p>
          </div>

          <Button
            variant="primary"
            onClick={onCreateClick}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {t("category.create.button")}
          </Button>
        </div>

        <div className="block space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t("category.search.placeholder")}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as ECategoryType)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  leftIcon={<X className="w-4 h-4" />}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {t("button.clearFilters")}
                </Button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">
                {t("filter.active-filters")}:
              </span>
              {searchName.trim() !== "" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                  {t("filter.name")}: "{searchName}"
                  <button
                    onClick={() => setSearchName("")}
                    className="hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedType !== undefined && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                  {t("category.filter.type")}: {selectedType}
                  <button
                    onClick={() => setSelectedType(undefined)}
                    className="hover:text-green-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 bg-white rounded-lg shadow-sm">
        <div className="w-full">
          <div className="max-h-[500px] overflow-y-auto w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("category.table.header.id")}</TableHead>
                  <TableHead>{t("category.table.header.name")}</TableHead>
                  <TableHead>{t("category.table.header.type")}</TableHead>
                  <TableHead>{t("category.table.header.createdAt")}</TableHead>
                  <TableHead>{t("category.table.header.action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center">
                      <SpinLoading color="blue" size="xl" />
                    </TableCell>
                  </TableRow>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>
                        <CategoryTypeBadge type={category.type} size="sm" />
                      </TableCell>
                      <TableCell>
                        {format(category.createdAt, DATETIME_FORMAT)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            leftIcon={<Edit className="w-4 h-4 text-white" />}
                            size="sm"
                            onClick={() => onEditClick(category)}
                            iconOnly
                          />
                          <Button
                            variant="destructive"
                            leftIcon={<Trash className="w-4 h-4 text-white" />}
                            size="sm"
                            onClick={() => onDeleteClick(category)}
                            iconOnly
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-gray-500">
                          {hasActiveFilters
                            ? t("common.noResultsFound")
                            : t("common.noData")}
                        </p>
                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearFilters}
                          >
                            {t("button.clearFilters")}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {categories.length > 0 && (
            <div className="w-full p-3 pb-0">
              <PaginationSimple
                currentPage={currentPage + 1}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page - 1)}
                loading={isFetching}
              />
            </div>
          )}
        </div>
      </div>

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <UpdateCategoryModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        category={categoryToUpdate}
        onSuccess={handleUpdateSuccess}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        category={categoryToDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default Categories;
