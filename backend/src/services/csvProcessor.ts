import fs from "fs";
import csv from "csv-parser";

//custom type 
export type AggregatedResult = Record<string, number>;



export function processCSVFile(filePath: string): Promise<AggregatedResult> {
  return new Promise((resolve, reject) => {
    const departmentSales: AggregatedResult = {};
   
    //to stream to file, csv parser
    fs.createReadStream(filePath)
      .pipe(
        csv({
          headers: ["Department Name", "Date", "Number of Sales"],
          skipLines: 0,
          strict: true,
        })
      )
      //to process each row 
      .on("data", (row) => {
        //console.log("🔹 Row:", row);
        const dept = row["Department Name"];
        const salesStr = row["Number of Sales"];
        if (dept && salesStr) {
          const sales = parseInt(salesStr);
          if (!isNaN(sales)) {
            departmentSales[dept] = (departmentSales[dept] || 0) + sales;
          }
        }
      })
      .on("end", () => resolve(departmentSales))
      .on("error", (err) => reject(err));
  });
}
