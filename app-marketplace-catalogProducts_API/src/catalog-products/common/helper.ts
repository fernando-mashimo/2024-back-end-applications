export function formatSellerIds(sellerIds: string) {
  const sellers = JSON.parse(decodeURIComponent(sellerIds));
  return sellers.map((seller) => {
    return {
      sellerId: seller,
    };
  });
}

export function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Adiciona uma barra invertida antes de caracteres especiais
}
