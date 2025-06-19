import fs from "fs";
import path from "path";
import { processCSVFile } from "../src/services/csvProcessor";

// Silence console.log for cleaner test output
jest.spyOn(console, "log").mockImplementation(() => {});

// Utility: Create a temporary CSV file
function createTempCSV(content: string, fileName = "test-temp.csv"): string {
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}


// Cleanup after each test
afterEach(() => {
  const filePath = path.join(__dirname, "test-temp.csv");
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
});

describe("processCSVFile()", () => {
  it("should aggregate sales correctly from valid CSV", async () => {
    const csv = `New York,2023-01-01,100
Boston,2023-01-01,50
New York,2023-01-01,30`;

    const filePath = createTempCSV(csv);
    const result = await processCSVFile(filePath);

    expect(result).toEqual({
      "New York": 130,
      Boston: 50,
    });
  });

  it("should skip rows with invalid number of sales", async () => {
    const csv = `New York,2023-01-01,abc
Boston,2023-01-01,50`;

    const filePath = createTempCSV(csv);
    const result = await processCSVFile(filePath);

    expect(result).toEqual({
      Boston: 50,
    });
  });

  it("should skip rows with missing department", async () => {
    const csv = `,2023-01-01,100
Boston,2023-01-01,50`;

    const filePath = createTempCSV(csv);
    const result = await processCSVFile(filePath);

    expect(result).toEqual({
      Boston: 50,
    });
  });

  it("should return empty result if all rows are invalid", async () => {
    const csv = `,2023-01-01,abc
,,0
,,`;

    const filePath = createTempCSV(csv);
    const result = await processCSVFile(filePath);

    expect(result).toEqual({});
  });
});
