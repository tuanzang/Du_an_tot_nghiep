export const confirmOrderMailContent = ({
  name,
  orderId,
  orderDate,
  totalPrice,
  products,
}) => {
  return `<div class="container">
        <p>Kính gửi ${name},</p>

        <p>Cảm ơn bạn đã đặt hàng tại FBEE! Chúng tôi rất vui được thông báo rằng đơn hàng của bạn đã được đặt thành công.</p>

        <p>Thông tin đơn hàng của bạn:</p>

        <p>Mã đơn hàng: ${orderId}</p>
        <p>Ngày đặt hàng: ${orderDate}</p>
        <p>Tổng tiền: ${totalPrice}</p>
       <p>Danh sách sản phẩm:</p>

       <table border="1" style="border-collapse: collapse; width: 100%">
            <thead>
                <tr>
                    <th style="padding: 6px 12px;">Sản phẩm</th>
                    <th style="padding: 6px 12px;">Số lượng</th>
                    <th style="padding: 6px 12px;">Đơn giá</th>
                    <th style="padding: 6px 12px;">Thành tiền</th>
                </tr>
            </thead>

            <tbody>
                ${products
                  .map(
                    (it) => `<tr>
                    <td style="padding: 6px 12px;">
                        <p>${it.name}</p>
                        <p>Size ${it.variantId.sizeName}</p>
                        ${
                          it.optionId
                            ? `<p>Phụ kiện: ${it.optionId.name}</p>`
                            : ""
                        }
                    </td>
                    <td style="padding: 6px 12px;">${it.quantity}</td>
                    <td style="padding: 6px 12px;">${it.price}</td>
                    <td style="padding: 6px 12px;">${
                      it.quantity * it.price
                    }</td>
                </tr>`
                  )
                  .join("")}
            </tbody>
       </table>

        <p>Chúng tôi sẽ sớm tiến hành xử lý đơn hàng của bạn và sẽ gửi cho bạn thông tin chi tiết về quá trình giao hàng trong thời gian sớm nhất.</p>

        <p>Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ thêm, xin vui lòng liên hệ với đội ngũ hỗ trợ khách hàng của chúng tôi qua email support@fbee.com hoặc số điện thoại 0983.983.983.</p>

        <p>Một lần nữa, xin chân thành cảm ơn bạn đã tin tưởng và mua sắm tại FBEE. Chúc bạn một ngày tốt lành!</p>

        <p>Trân trọng,</p>

        <p>FBEE</p>

        <p>Thông tin liên hệ:</p>

        <p>Địa chỉ: Trịnh Văn Bô, Nam Từ Liêm, HN</p>
        <p>Email: contact@fbee.com</p>
        <p>Số điện thoại: 0983.983.983</p>
    </div>`;
};

export const completedOrderMailContent = ({ customerName }) => {
  return `<div class="container">
        <p>Kính gửi ${customerName},</p>

        <p>Chúng tôi xin gửi lời cảm ơn chân thành đến bạn vì đã tin tưởng và lựa chọn FBEE cho nhu cầu mua sắm của mình.</p>

        <p>Chúng tôi rất vui khi được phục vụ bạn và hy vọng rằng bạn hài lòng với sản phẩm/dịch vụ của chúng tôi. Sự ủng hộ của bạn là nguồn động viên lớn để chúng tôi tiếp tục cải thiện và mang lại những trải nghiệm tốt nhất cho khách hàng.</p>

        <p>Nếu bạn có bất kỳ phản hồi hoặc câu hỏi nào, xin đừng ngần ngại liên hệ với chúng tôi qua email contact@fbee.com hoặc số điện thoại 0983.983.983. Chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>

        <p>Một lần nữa, xin chân thành cảm ơn bạn đã lựa chọn FBEE. Chúng tôi mong chờ được phục vụ bạn trong những lần mua sắm tiếp theo.</p>

        <p>Chúc bạn một ngày tốt lành!</p>

        <p>Trân trọng,</p>

        <p>FBEE</p>

        <p>Thông tin liên hệ:</p>

        <p>Địa chỉ: Trịnh Văn Bô, Nam Từ Liêm, HN</p>
        <p>Email: contact@fbee.com</p>
        <p>Số điện thoại: 0983.983.983</p>
    </div>`;
};

export const CERTIFICATE_HTML_STR = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
      }

      .container {
        padding: 12px;
        border: 2px solid #567391;
        margin: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div
        class="header"
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div style="text-align: center; text-transform: uppercase">
          <p style="margin-bottom: 8px">TỔNG CỤC TIÊU CHUẨN</p>
          <p style="margin-bottom: 8px">ĐO LƯỜNG CHẤT LƯỢNG</p>
          <b style="display: block; margin-bottom: 8px"
            >TRUNG TÂM CHỨNG NHẬN PHÙ HỢP</b
          >
          <b style="display: block; margin-bottom: 8px">QUACERT</b>
        </div>

        <div style="text-align: center; text-transform: uppercase">
          <p style="margin-bottom: 8px">Directorate for standards</p>
          <p style="margin-bottom: 8px">Metrology and quality (Stamedq)</p>
          <b style="display: block; margin-bottom: 8px"
            >VietNam Certification Center</b
          >
          <b style="display: block; margin-bottom: 8px">QUACERT</b>
        </div>
      </div>

      <img
        src="https://res.cloudinary.com/dc7ugsbsg/image/upload/v1723739872/quacert_ch6v46.png"
        alt="Quacert"
        style="
          height: 120px;
          display: block;
          margin-top: 32px;
          margin-inline: auto;
          margin-bottom: 32px;
        "
      />

      <p
        style="
          text-align: center;
          color: #779be0;
          font-size: 36px;
          font-weight: 700;
          text-transform: uppercase;
        "
      >
        Giấy chứng nhận
      </p>
      <p
        style="
          text-align: center;
          color: #779be0;
          font-size: 36px;
          font-weight: 700;
          text-transform: uppercase;
          font-style: italic;
          margin-top: 10px;
        "
      >
        Certificate
      </p>
      <p style="text-align: center; margin-top: 12px">No.: HT 019/4.13.03</p>

      <div style="margin-top: 24px">
        <p style="font-weight: 700">
          Chứng nhận hệ thống quản lý chất lượng của:
        </p>
        <p style="margin-top: 4px; font-style: italic">
          This is to certify that the Quality Management System of
        </p>

        <p
          style="
            margin-top: 20px;
            text-align: center;
            text-transform: uppercase;
            font-size: 20px;
            font-weight: 700;
          "
        >
          Công ty cổ phần mía đường lam sơn
        </p>
        <p
          style="
            font-size: 20px;
            text-transform: uppercase;
            text-align: center;
            font-style: italic;
            margin-top: 6px;
          "
        >
          Lam Son sugar join stock corporation
        </p>
      </div>

      <div style="margin-top: 32px">
        <p>
          <b>địa chỉ</b>
          <span style="font-style: italic">/ address:</span>
        </p>

        <p
          style="
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin-top: 18px;
          "
        >
          Thị trấn Lam Sơn, huyện Thọ Xuân, tỉnh Thanh Hoá, Việt Nam
        </p>
        <p style="text-align: center; margin-top: 8px; font-style: italic">
          Lam Son Town, Tho Xuan District, Thanh Hoa Province, Vietnam
        </p>
      </div>

      <div style="margin-top: 32px">
        <p>
          <b>cho lĩnh vực</b>
          <span style="font-style: italic">/ for following activities:</span>
        </p>

        <p
          style="
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin-top: 18px;
          "
        >
          Sản xuất, Cung ứng Đường tinh luyện, Đường trắng và Đường vàng tinh
          khiết
        </p>
        <p style="text-align: center; margin-top: 8px; font-style: italic">
          Manufacture and Supply of Refined. White ad Pure Yellow Sugars
        </p>
      </div>

      <div style="margin-top: 32px">
        <p style="font-weight: bold">
          đã được đánh giá và phù hợp với các yêu cầu của tiêu chuẩn:
        </p>
        <p style="margin-top: 4px; font-style: italic">
          has been assessed and to confirm with the requirements of the
          following standard
        </p>

        <p
          style="
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            margin-top: 18px;
          "
        >
          TCN ISO 9001 : 2008 / ISO 9001 : 2008
        </p>
      </div>

      <div style="margin-top: 32px">
        <p>
          <b>Giấy chứng nhận có giá trị từ</b>
          <span style="font-style: italic"
            >/ This certificate is valid from:</span
          >
        </p>

        <p style="margin-top: 18px; text-align: center">
          <b style="font-size: 20px">02.04.2013</b>
          <b>đến / to</b>
          <b style="font-size: 20px">01.04.2016</b>
        </p>
      </div>

      <div style="margin-top: 32px">
        <p>
          <b>Ngày cấp giấy chứng nhận lần đầu/</b>
          <span>Original Approved date:</span>
          <b style="font-size: 20px">17.06.2009</b>
        </p>
      </div>

      <div style="margin-top: 48px; text-align: right">
        <div style="text-align: center; display: inline-block">
          <b style="display: block">Trung tâm Chứng nhận Phù hợp</b>
          <b style="text-transform: uppercase; margin-top: 8px; display: block"
            >Giám đốc</b
          >
          <p style="margin-top: 8px">(The Director of QUACERT)</p>

          <img
            src="https://res.cloudinary.com/dc7ugsbsg/image/upload/v1723741636/c859f147-64e6-470f-9501-81af87c54432_b2n6hb.jpg"
            alt="Image"
          />
        </div>
      </div>
    </div>
  </body>
</html>
`;
