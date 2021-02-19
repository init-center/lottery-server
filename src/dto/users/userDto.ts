import { IsString, Length, Matches } from "class-validator";

export class CreateUserDto {
  @IsString({
    message: "请输入符合规范的姓名！",
  })
  @Length(2, 6, {
    message: "姓名长度必须在 2 - 6 位！",
  })
  @Matches(/^[\u4E00-\u9FA5]{2,6}$/, {
    message: "姓名必须是2 - 6 位的汉字！",
  })
  name: string;

  @IsString({
    message: "请输入符合规范的手机号码！",
  })
  @Length(11, 11, {
    message: "手机号码长度必须为11位！",
  })
  @Matches(/^1[3-9]\d{9}$/, {
    message: "请输入符合规范的11位手机号码！",
  })
  phone: string;
}

export class LoginDto {
  @IsString({
    message: "请输入符合规范的手机号码！",
  })
  @Length(11, 11, {
    message: "手机号码长度必须为11位！",
  })
  @Matches(/^1[3-9]\d{9}$/, {
    message: "请输入符合规范的11位手机号码！",
  })
  phone: string;

  @Length(8, 16, {
    message: "密码长度必须在8 - 16位！",
  })
  password: string;
}

export class OperateAdminDto {
  @IsString({
    message: "请输入符合规范的手机号码！",
  })
  @Length(11, 11, {
    message: "手机号码长度必须为11位！",
  })
  @Matches(/^1[3-9]\d{9}$/, {
    message: "请输入符合规范的11位手机号码！",
  })
  phone: string;

  @IsString({
    message: "请输入符合规范的姓名！",
  })
  @Length(2, 6, {
    message: "姓名长度必须在 2 - 6 位！",
  })
  @Matches(/^[\u4E00-\u9FA5]{2,6}$/, {
    message: "姓名必须是2 - 6 位的汉字！",
  })
  name: string;
}
