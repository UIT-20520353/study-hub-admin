import {
  useChangeStatusUniversity,
  useDeleteUniversity,
  useGetUniversities,
} from "@/api/universityApi";
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
import { ROUTES } from "@/constants/app";
import { EUniversityStatus } from "@/enums/university";
import type { IUniversity } from "@/types/university";
import { Edit, Eye, Plus, Search, X, Trash, Lock, Unlock } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import UniversityStatus from "./components/university-status";
import { DeleteUniversityPopup } from "./components/delete-university-popup";
import { openModal } from "@/store/slices/modalSlice";
import { useAppDispatch } from "@/store/hooks";
import { ChangeStatusUniversityPopup } from "./components/change-status-university-popup";

const Universities: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [universities, setUniversities] = useState<IUniversity[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [universityToDelete, setUniversityToDelete] =
    useState<IUniversity | null>(null);
  const [universityToChangeStatus, setUniversityToChangeStatus] =
    useState<IUniversity | null>(null);

  const [searchName, setSearchName] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [debouncedSearchName, setDebouncedSearchName] = useState<string>("");
  const [debouncedSelectedStatus, setDebouncedSelectedStatus] =
    useState<string>("");

  const { mutateAsync, isPending: isDeleting } = useDeleteUniversity();
  const { mutateAsync: mutateChangeStatus, isPending: isChangingStatus } =
    useChangeStatusUniversity();
  const {
    data: response,
    isFetching,
    refetch: refetchUniversities,
  } = useGetUniversities(
    currentPage,
    debouncedSearchName,
    debouncedSelectedStatus
  );
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onConfirmDelete = async (id: string | number) => {
    await mutateAsync(id, {
      onSuccess: () => {
        refetchUniversities();
        setUniversityToDelete(null);
        dispatch(
          openModal({
            title: t("common.success.title"),
            content: t("university.delete.success.content"),
            type: "success",
          })
        );
      },
    });
  };

  const onConfirmChangeStatus = async (university: IUniversity) => {
    await mutateChangeStatus(university, {
      onSuccess: () => {
        refetchUniversities();
        setUniversityToChangeStatus(null);
        dispatch(
          openModal({
            title: t("common.success.title"),
            content: t("university.changeStatus.success.content"),
            type: "success",
          })
        );
      },
    });
  };

  const onViewDetailClick = (id: string | number) => {
    navigate(ROUTES.universityDetail(id));
  };

  const onEditClick = (id: string | number) => {
    navigate(ROUTES.universityEdit(id));
  };

  const onCreateClick = () => {
    navigate(ROUTES.universityCreate);
  };

  const handleClearFilters = () => {
    setSearchName("");
    setSelectedStatus("");
    setCurrentPage(0);
  };

  const hasActiveFilters = useMemo(() => {
    return searchName.trim() !== "" || selectedStatus !== "";
  }, [searchName, selectedStatus]);

  useEffect(() => {
    if (response?.body) {
      setTotalPages(response.body.totalPages);
      setUniversities(response.body.items);
    }
  }, [response]);

  const statusOptions = [
    { value: "", label: t("filter.allStatus") },
    ...Object.values(EUniversityStatus).map((status) => ({
      value: status,
      label: t(`university.${status}`),
    })),
  ];

  useEffect(() => {
    if (response?.body) {
      setTotalPages(response.body.totalPages);
      setUniversities(response.body.items);
    }
  }, [response]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchName(searchName);
      setCurrentPage(0);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchName]);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSelectedStatus(selectedStatus);
      setCurrentPage(0);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedStatus]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("university.management.title")}
            </h1>
            <p className="text-gray-600">
              {t("university.management.subtitle")}
            </p>
          </div>

          <Button
            variant="primary"
            onClick={onCreateClick}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {t("university.create.button")}
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
                placeholder={t("university.search.placeholder")}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
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
              {selectedStatus !== "" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                  {t("filter.status")}: {t(`university.${selectedStatus}`)}
                  <button
                    onClick={() => setSelectedStatus("")}
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
                  <TableHead>{t("table.header.id")}</TableHead>
                  <TableHead>{t("table.header.name")}</TableHead>
                  <TableHead>{t("table.header.shortName")}</TableHead>
                  <TableHead>{t("table.header.city")}</TableHead>
                  <TableHead>{t("table.header.website")}</TableHead>
                  <TableHead>{t("table.header.status")}</TableHead>
                  <TableHead>{t("table.header.action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center">
                      <SpinLoading color="blue" size="xl" />
                    </TableCell>
                  </TableRow>
                ) : universities.length > 0 ? (
                  universities.map((university) => (
                    <TableRow key={university.id}>
                      <TableCell>{university.id}</TableCell>
                      <TableCell className="font-medium">
                        {university.name}
                      </TableCell>
                      <TableCell>{university.shortName}</TableCell>
                      <TableCell>{university.city || "--"}</TableCell>
                      <TableCell>
                        {university.website ? (
                          <Link
                            className="text-blue-500 underline hover:text-blue-700"
                            to={university.website}
                            target="_blank"
                          >
                            {university.website}
                          </Link>
                        ) : (
                          <span>--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <UniversityStatus
                          size="sm"
                          status={university.status}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            leftIcon={<Eye className="w-4 h-4 text-white" />}
                            size="sm"
                            onClick={() => onViewDetailClick(university.id)}
                            iconOnly
                          />
                          {university.status !== EUniversityStatus.DELETED && (
                            <>
                              <Button
                                variant="primary"
                                leftIcon={
                                  <Edit className="w-4 h-4 text-white" />
                                }
                                size="sm"
                                onClick={() => onEditClick(university.id)}
                                iconOnly
                              />
                              <Button
                                variant={
                                  university.status === EUniversityStatus.ACTIVE
                                    ? "warning"
                                    : "emerald"
                                }
                                leftIcon={
                                  university.status ===
                                  EUniversityStatus.ACTIVE ? (
                                    <Lock className="w-4 h-4 text-white" />
                                  ) : (
                                    <Unlock className="w-4 h-4 text-white" />
                                  )
                                }
                                size="sm"
                                onClick={() =>
                                  setUniversityToChangeStatus(university)
                                }
                                iconOnly
                              />
                              <Button
                                variant="destructive"
                                leftIcon={
                                  <Trash className="w-4 h-4 text-white" />
                                }
                                size="sm"
                                onClick={() =>
                                  setUniversityToDelete(university)
                                }
                                iconOnly
                              />
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center">
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

          {universities.length > 0 && (
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

      <DeleteUniversityPopup
        isOpen={!!universityToDelete}
        onClose={() => setUniversityToDelete(null)}
        university={universityToDelete}
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
      />
      <ChangeStatusUniversityPopup
        isOpen={!!universityToChangeStatus}
        onClose={() => setUniversityToChangeStatus(null)}
        university={universityToChangeStatus}
        onConfirm={onConfirmChangeStatus}
        isLoading={isChangingStatus}
      />
    </div>
  );
};

export default Universities;
