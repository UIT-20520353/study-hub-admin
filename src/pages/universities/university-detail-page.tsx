import {
  useChangeStatusUniversity,
  useDeleteUniversity,
  useGetUniversityDetail,
} from "@/api/universityApi";
import { LoadingPage } from "@/components/common";
import { DATETIME_FORMAT, ROUTES } from "@/constants/app";
import { EUniversityStatus } from "@/enums/university";
import { cn } from "@/lib/utils";
import type { IUniversity } from "@/types/university";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building,
  CheckCircle,
  Clock,
  Edit,
  ExternalLink,
  Globe,
  GraduationCap,
  Lock,
  Mail,
  MapPin,
  Trash,
  Unlock,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import UniversityStatus from "./components/university-status";
import { DeleteUniversityPopup } from "./components/delete-university-popup";
import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/slices/modalSlice";
import { ChangeStatusUniversityPopup } from "./components/change-status-university-popup";

const UniversityDetailPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: response,
    isFetching,
    refetch: refetchUniversity,
  } = useGetUniversityDetail(id || "");
  const { mutateAsync, isPending: isDeleting } = useDeleteUniversity();
  const { mutateAsync: mutateChangeStatus, isPending: isChangingStatus } =
    useChangeStatusUniversity();

  const [university, setUniversity] = useState<IUniversity | null>(null);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState<boolean>(false);
  const [isOpenChangeStatusPopup, setIsOpenChangeStatusPopup] =
    useState<boolean>(false);

  const onConfirmChangeStatus = async (university: IUniversity) => {
    await mutateChangeStatus(university, {
      onSuccess: () => {
        refetchUniversity();
        setIsOpenChangeStatusPopup(false);
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
  const onConfirmDelete = async (id: string | number) => {
    await mutateAsync(id, {
      onSuccess: () => {
        refetchUniversity();
        setIsOpenDeletePopup(false);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const onEditClick = (id: string | number) => {
    navigate(ROUTES.universityEdit(id));
  };

  useEffect(() => {
    if (isFetching) return;

    if (response?.body) {
      setUniversity(response.body);
    }
  }, [response, isFetching]);

  return isFetching || !university ? (
    <LoadingPage />
  ) : (
    <div className="min-h-screen">
      <DeleteUniversityPopup
        isOpen={isOpenDeletePopup}
        onClose={() => setIsOpenDeletePopup(false)}
        university={university}
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
      />
      <ChangeStatusUniversityPopup
        isOpen={isOpenChangeStatusPopup}
        onClose={() => setIsOpenChangeStatusPopup(false)}
        university={university}
        onConfirm={onConfirmChangeStatus}
        isLoading={isChangingStatus}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container px-4 py-8 mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-300 ",
              "rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 hover:border-gray-400"
            )}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            <span className="font-medium">{t("button.goBack")}</span>
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 transition-colors border rounded-lg  text-white",
                "shadow-sm cursor-pointer shadow-yellow-500/25",
                {
                  hidden: university.status === EUniversityStatus.DELETED,
                  "bg-yellow-600 hover:bg-yellow-700":
                    university.status === EUniversityStatus.ACTIVE,
                  "bg-emerald-600 hover:bg-emerald-700":
                    university.status === EUniversityStatus.INACTIVE,
                }
              )}
              onClick={() => setIsOpenChangeStatusPopup(true)}
            >
              {university.status === EUniversityStatus.ACTIVE ? (
                <Lock size={18} />
              ) : (
                <Unlock size={18} />
              )}
              <span className="font-medium">{t("button.changeStatus")}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 transition-colors border rounded-lg  bg-red-600 text-white",
                "shadow-sm cursor-pointer hover:bg-red-700 shadow-red-500/25",
                {
                  hidden: university.status === EUniversityStatus.DELETED,
                }
              )}
              onClick={() => setIsOpenDeletePopup(true)}
            >
              <Trash size={18} />
              <span className="font-medium">{t("button.delete")}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 border border-blue-600 rounded-lg",
                "shadow-sm cursor-pointer hover:bg-blue-700 hover:border-blue-700",
                {
                  hidden: university.status === EUniversityStatus.DELETED,
                }
              )}
              onClick={() => onEditClick(university.id)}
            >
              <Edit size={18} />
              <span className="font-medium">{t("button.edit")}</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-8 overflow-hidden bg-white shadow-md rounded-2xl"
        >
          <div className="p-8 text-white bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-24 h-24 p-3 bg-white shadow-lg rounded-2xl"
              >
                {university.logoUrl ? (
                  <img
                    src={university.logoUrl}
                    alt={`${university.name} logo`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <GraduationCap className="w-full h-full text-black" />
                )}
              </motion.div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                  {university.name}
                </h1>
                <div className="flex items-center justify-center gap-3 md:justify-start">
                  <span className="px-3 py-1 text-sm font-medium bg-blue-500 rounded-full">
                    {university.shortName}
                  </span>
                  {university.isActive && (
                    <div className="flex items-center gap-1 text-green-200">
                      <CheckCircle size={16} />
                      <span className="text-sm">
                        {t("university.currentlyActive")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <motion.div
              variants={itemVariants}
              className="p-8 bg-white shadow-md rounded-2xl"
            >
              <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
                <Building className="text-blue-600" />
                {t("university.introduction")}
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                {university.description || t("university.noInfo")}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="p-8 bg-white shadow-md rounded-2xl"
            >
              <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
                <Users className="text-green-600" />
                {t("university.contactInfo")}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-3 p-4 transition-colors bg-gray-50 rounded-xl hover:bg-gray-100"
                >
                  <MapPin
                    className="flex-shrink-0 mt-1 text-red-500"
                    size={20}
                  />
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-800">
                      {t("university.address")}
                    </h3>
                    <p className="text-gray-600">
                      {university.address || "--"}
                    </p>
                    <p
                      className={cn("text-sm text-gray-500", {
                        hidden: !university.city,
                      })}
                    >
                      {university.city}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-3 p-4 transition-colors bg-gray-50 rounded-xl hover:bg-gray-100"
                >
                  <Globe
                    className="flex-shrink-0 mt-1 text-blue-500"
                    size={20}
                  />
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-800">
                      {t("university.website")}
                    </h3>
                    {university.website ? (
                      <a
                        href={university.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {university.website}
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-500">
                        --
                      </span>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-3 p-4 transition-colors bg-gray-50 rounded-xl hover:bg-gray-100"
                >
                  <Mail
                    className="flex-shrink-0 mt-1 text-orange-500"
                    size={20}
                  />
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-800">
                      {t("university.emailDomain")}
                    </h3>
                    <p className="font-mono text-gray-600">
                      {university.emailDomain}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              className="p-6 bg-white shadow-md rounded-2xl"
            >
              <h3 className="mb-4 text-xl font-bold text-gray-800">
                {t("university.quickInfo")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                  <span className="text-gray-600">
                    {t("university.universityId")}
                  </span>
                  <span className="font-semibold text-blue-600">
                    #{university.id}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <span className="text-gray-600">
                    {t("university.status")}
                  </span>
                  <UniversityStatus
                    showIcon={false}
                    status={university.status}
                    size="sm"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="p-6 bg-white shadow-md rounded-2xl"
            >
              <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-800">
                <Clock className="text-gray-500" size={20} />
                {t("university.systemInfo")}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">
                    {t("university.createdAt")}
                  </label>
                  <p className="font-medium text-gray-700">
                    {format(university.createdAt, DATETIME_FORMAT)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    {t("university.updatedAt")}
                  </label>
                  <p className="font-medium text-gray-700">
                    {format(university.updatedAt, DATETIME_FORMAT)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UniversityDetailPage;
