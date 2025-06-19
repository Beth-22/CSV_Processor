import fs from "fs";
import path from "path";
import { AggregatedResult } from "../services/csvProcessor";

/**
 * Saves aggregated result to CSV using the original file name + -processed.csv suffix.
 */
export async function writeResultsToCSV(
  data: AggregatedResult,
  originalName: string
): Promise<{ fileName: string; filePath: string }> {

  //new file name
  const baseName = path.parse(originalName).name; 
  const fileName = `${baseName}-processed.csv`;

  
  const filePath = path.join(__dirname, "../../results", fileName);
 
  //data to csv string
  const rows = Object.entries(data)
    .map(([dept, total]) => `${dept},${total}`)
    .join("\n");
  
    //save to file
  await fs.promises.writeFile(filePath, rows, "utf-8");

  return { fileName, filePath };
}
