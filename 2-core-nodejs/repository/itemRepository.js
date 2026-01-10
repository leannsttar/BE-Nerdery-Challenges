const path = require("node:path");
const fs = require("node:fs/promises");

const endpoint = path.join(__dirname, "..", "persistence", "data.json");

async function fetchData() {
  try {
    const data = await fs.readFile(endpoint, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error);
    throw error
  }
}

async function saveData(newData) {
  try {
    const dataJSON = JSON.stringify(newData, null, 2);
    await fs.writeFile(endpoint, dataJSON);
    // console.log("file written sucessfully");
  } catch (error) {
    console.error("Error writing file:", error);
    throw error;
  }
}

module.exports = {
    fetchData,
    saveData
}