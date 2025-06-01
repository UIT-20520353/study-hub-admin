import {
  useUpdateUniversity,
  useGetUniversityDetail,
  useDeleteUniversity,
} from "@/api/universityApi";
import { EUniversityStatus } from "@/enums/university";
import { useAppDispatch } from "@/store/hooks";
import { openModal } from "@/store/slices/modalSlice";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import type { UpdateUniversityForm } from "../types/form";
import type { IUniversity } from "@/types/university";
import { useNavigate } from "react-router";
import { ROUTES } from "@/constants/app";

interface UseEditUniversityFormProps {
  universityId: string | number;
}

const useEditUniversityForm = ({
  universityId,
}: UseEditUniversityFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutateAsync: updateUniversity, isPending: isUpdateLoading } =
    useUpdateUniversity();
  const { data: response, isLoading: isLoadingDetail } =
    useGetUniversityDetail(universityId);
  const { mutateAsync: deleteUniversity, isPending: isDeleting } =
    useDeleteUniversity();

  const universityDetail = response?.body as IUniversity;

  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const onConfirmDelete = async (id: string | number) => {
    await deleteUniversity(id, {
      onSuccess: () => {
        setIsOpenDeletePopup(false);
        navigate(ROUTES.universities);
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

  const onSubmit = async (values: UpdateUniversityForm) => {
    try {
      const formData = new FormData();

      const universityData = {
        ...values,
        status: values.status || EUniversityStatus.ACTIVE,
        address: values.address || undefined,
        city: values.city || undefined,
        website: values.website || undefined,
        description: values.description || undefined,
      };
      const jsonBlob = new Blob([JSON.stringify(universityData)], {
        type: "application/json",
      });

      formData.append("university", jsonBlob);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await updateUniversity({ id: universityId, formData });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(
        openModal({
          title: t("error.title"),
          content: error.message || t("error.generic"),
          size: "sm",
          type: "error",
        })
      );
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t("validation.university.name.required"))
      .max(100, t("validation.university.name.maxLength")),
    shortName: Yup.string()
      .required(t("validation.university.shortName.required"))
      .max(20, t("validation.university.shortName.maxLength")),
    emailDomain: Yup.string()
      .required(t("validation.university.emailDomain.required"))
      .max(100, t("validation.university.emailDomain.maxLength"))
      .matches(
        /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("validation.university.emailDomain.invalid")
      ),
    address: Yup.string().max(
      500,
      t("validation.university.address.maxLength")
    ),
    city: Yup.string().max(50, t("validation.university.city.maxLength")),
    website: Yup.string()
      .max(100, t("validation.university.website.maxLength"))
      .url(t("validation.university.website.invalid")),
    description: Yup.string().max(
      1000,
      t("validation.university.description.maxLength")
    ),
    status: Yup.string()
      .oneOf(Object.values(EUniversityStatus))
      .required(t("validation.university.status.required")),
  });

  const formik = useFormik<UpdateUniversityForm>({
    initialValues: {
      name: "",
      shortName: "",
      address: "",
      emailDomain: "",
      city: "",
      website: "",
      description: "",
      status: EUniversityStatus.ACTIVE,
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (universityDetail && !isInitialized) {
      formik.setValues({
        name: universityDetail.name || "",
        shortName: universityDetail.shortName || "",
        address: universityDetail.address || "",
        emailDomain: universityDetail.emailDomain || "",
        city: universityDetail.city || "",
        website: universityDetail.website || "",
        description: universityDetail.description || "",
        status: universityDetail.status || EUniversityStatus.ACTIVE,
      });

      if (universityDetail.logoUrl) {
        setLogoPreview(universityDetail.logoUrl);
      }

      setIsInitialized(true);
    }
  }, [universityDetail, isInitialized]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        dispatch(
          openModal({
            title: t("validation.file.invalidType.title"),
            content: t("validation.file.invalidType.content"),
            size: "sm",
            type: "error",
          })
        );
        return;
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        dispatch(
          openModal({
            title: t("validation.file.sizeTooBig.title"),
            content: t("validation.file.sizeTooBig.content"),
            size: "sm",
            type: "error",
          })
        );
        return;
      }

      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    // If there was an existing logo, revert to it
    if (universityDetail?.logoUrl) {
      setLogoPreview(universityDetail.logoUrl);
    } else {
      setLogoPreview(null);
    }
  };

  const formFields = [
    {
      name: "name",
      type: "text",
      label: t("university.field.label.name"),
      placeholder: t("university.field.placeholder.name"),
      required: true,
    },
    {
      name: "shortName",
      type: "text",
      label: t("university.field.label.shortName"),
      placeholder: t("university.field.placeholder.shortName"),
      required: true,
    },
    {
      name: "emailDomain",
      type: "text",
      label: t("university.field.label.emailDomain"),
      placeholder: t("university.field.placeholder.emailDomain"),
      required: true,
      helperText: t("university.field.helper.emailDomain"),
    },
    {
      name: "address",
      type: "text",
      label: t("university.field.label.address"),
      placeholder: t("university.field.placeholder.address"),
      required: false,
    },
    {
      name: "city",
      type: "text",
      label: t("university.field.label.city"),
      placeholder: t("university.field.placeholder.city"),
      required: false,
    },
    {
      name: "website",
      type: "text",
      label: t("university.field.label.website"),
      placeholder: t("university.field.placeholder.website"),
      required: false,
    },
    {
      name: "description",
      type: "text",
      label: t("university.field.label.description"),
      placeholder: t("university.field.placeholder.description"),
      required: false,
    },
  ] as const;

  return {
    formik,
    formFields,
    isUpdateLoading,
    isLoadingDetail,
    logoFile,
    logoPreview,
    handleLogoChange,
    handleRemoveLogo,
    universityDetail,
    hasExistingLogo: !!universityDetail?.logoUrl,
    isOpenDeletePopup,
    setIsOpenDeletePopup,
    onConfirmDelete,
    isDeleting,
  };
};

export default useEditUniversityForm;
