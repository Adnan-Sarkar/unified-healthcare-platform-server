export type TMedicine = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  brandName: string;
  stockQuantity: number;
  discount: number;
  photo: string;
};

export type TMedicineCategory = {
  id: string;
  categoryName: string;
};
