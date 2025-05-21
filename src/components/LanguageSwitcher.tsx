import { unitedStatesFlag, vietnamFlag } from "@/assets/images";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher: FunctionComponent = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Select value={i18n.language} onValueChange={changeLanguage}>
      <SelectTrigger className="fixed top-5 right-5">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">
          <img className="w-8 h-8" src={unitedStatesFlag} alt="US" />
        </SelectItem>
        <SelectItem value="vi">
          <img className="w-8 h-8" src={vietnamFlag} alt="Viet Nam" />
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
