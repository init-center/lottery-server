import { Test, TestingModule } from "@nestjs/testing";
import { LotteriesService } from "./lotteries.service";

describe("LotteriesService", () => {
  let service: LotteriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LotteriesService],
    }).compile();

    service = module.get<LotteriesService>(LotteriesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
