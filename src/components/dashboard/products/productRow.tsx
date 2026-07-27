import ProductStatus from "./productStatus";
import { ProductWithCategory } from "@/types/products";

type ProductRowProps = {
  products: ProductWithCategory;
};

export default function ProductRow({
  products,
}: ProductRowProps) {
  return (
    <tr className="border-b">
      <td className="p-3">
        {products.image}
      </td>

      <td className="p-3">
        {products.name}
      </td>

      <td className="p-3">
        {products.category.name}
      </td>

      <td className="p-3">
        {products.price} FCFA
      </td>

      <td className="p-3">
        <ProductStatus
          status={products.status}
        />
      </td>

      <td className="p-3">
        ...
      </td>
    </tr>
  );
}