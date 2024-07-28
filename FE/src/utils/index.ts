export const formatPrice = (value?: number) => {
  if (!value) {
    return 0;
  }

  const formattedNumber = new Intl.NumberFormat("de-DE").format(value);

  return formattedNumber;
};
