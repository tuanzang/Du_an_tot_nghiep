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

    const priceArr = data.variants.map((it) => it.price);
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
              <span className="text-uppercase">Ngừng kinh doanh</span>
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
        <div className="cart-hover">
          <button className="btn btn-cart">Thêm vào giỏ hàng</button>
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
