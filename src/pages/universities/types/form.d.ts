import { EUniversityStatus } from "@/enums/university";

export interface CreateUniversityForm {
  name: string;
  shortName: string;
  address: string;
  emailDomain: string;
  city: string;
  website: string;
  description: string;
  status: EUniversityStatus;
}

export interface UpdateUniversityForm {
  name: string;
  shortName: string;
  address: string;
  emailDomain: string;
  city: string;
  website: string;
  description: string;
  status: EUniversityStatus;
}
