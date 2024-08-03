import { useMemo } from "react";
import { IProduct } from "../interface/Products";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils";

interface IProductItemProps {
  data?: IProduct;
}

const ProductItem = ({ data }: IProductItemProps) => {
  const navigate = useNavigate();

  const price = useMemo(() => {
    if (!data?.variants.length) {
      return formatPrice(0);
    }

    const priceArr = data.variants
      .filter((it) => it.quantity > 0) // Chỉ lấy những biến thể có số lượng > 0
      .map((it) => it.price);

    if (priceArr.length === 0) {
      return "Liên hệ"; // Nếu không có biến thể nào có số lượng > 0, hiển thị "Liên hệ"
    }

    const minPrice = Math.min(...priceArr);
    const maxPrice = Math.max(...priceArr);

    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)} VNĐ`;
  }, [data?.variants]);

  const onNavigateToProductDetail = () => {
    if (data?.status) {
      navigate(`/product/${data._id}`);
    }
  };

  return (
    <div className={`product-item ${!data?.status && "product-hidden"}`}>
      <figure className="product-thumb">
        <div onClick={onNavigateToProductDetail}>
          <div className="image-container">
            <img className="pri-img" src={data?.image[0]} alt={data?.name} />
            {data?.image[1] && (
              <img className="sec-img" src={data?.image[1]} alt={data?.name} />
            )}
          </div>
        </div>
        {data?.status ? (
          <div className="product-badge">
            <div className="product-label new">
              <span>HOT</span>
            </div>
          </div>
        ) : (
          <div className="product-badge">
            <div className="product-label new">
              <span className="text-uppercase">SOLD OUT</span>
            </div>
          </div>
        )}
        <div className="button-group">
          <a
            href="#"
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            title="Yêu thích"
          >
            <i className="pe-7s-like"></i>
          </a>
          <a
            href="#"
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            title="So sánhpare"
          >
            <i className="pe-7s-refresh-2"></i>
          </a>
          <a href="#" data-bs-toggle="modal" data-bs-target="#quick_view">
            <span
              data-bs-toggle="tooltip"
              data-bs-placement="left"
              title="Xem chi tiết"
            >
              <i className="pe-7s-search"></i>
            </span>
          </a>
        </div>
        <div className="product-caption text-center">
          <div className="product-identity">
            <p
              className="manufacturer-name"
              onClick={onNavigateToProductDetail}
            >
              {data?.name}
            </p>
          </div>
          <div className="price-box">
            <span className="price-regular">{price}</span>
          </div>
        </div>
      </figure>
    </div>
  );
};

export default ProductItem;
