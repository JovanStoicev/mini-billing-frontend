export function downloadJson(filename, data) {
  const fileContent = JSON.stringify(data, null, 2);
  const blob = new Blob([fileContent], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
