export async function getDolarBlue() {
  try {
    const res = await fetch("https://dolarapi.com/v1/dolares/blue");
    const data = await res.json();
    return data.venta || 1200;
  } catch (error) {
    console.error("Error fetching Dolar Blue:", error);
    return 1200; // Fallback
  }
}
