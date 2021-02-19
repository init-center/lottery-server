import {
  IsString,
  Min,
  Max,
  Length,
  Matches,
  IsNotEmpty,
} from "class-validator";

export class AddPrizeDto {
  @IsString({
    message: "请输入符合规范的奖品名称！",
  })
  @Length(1, 64, {
    message: "奖品名称长度必须在 1 - 64 位！",
  })
  name: string;

  @Min(0, {
    message: "概率必须是>=0的正数！",
  })
  @Max(100, {
    message: "概率必须是<=100的正数！",
  })
  probability: number;
}

export class DeletePrizeDto {
  @Min(1, {
    message: "id必须是 > 1的正数！",
  })
  id: number;
}

export class RandomPrizeDto {
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

export class AddDrawCountDto {
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

  @IsNotEmpty({
    message: "抽奖次数不能为空！",
  })
  count: number;
}

export class GetDrawCountDto {
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

export class GetWinRecordDto {
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
