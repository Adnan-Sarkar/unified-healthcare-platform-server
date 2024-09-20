export type TBloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "O+"
  | "O-"
  | "AB+"
  | "AB-";

export type TAccountStatus = "active" | "blocked";
export type TGender = "male" | "female";
export type TUserRole = "admin" | "user" | "super_admin" | "doctor" | "patient";

export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: TGender;
  phone: string;
  location: string;
  accountStatus: TAccountStatus;
  dateOfBirth: string;
  role: TUserRole;
  bloodGroup: TBloodGroup;
  age: number;
  profilePicture: string;
};
