export const formatDate = (date: Date) => {
    return date.toUTCString().split("T")[0]; // Retorna no formato YYYY-MM-DD
  };
  