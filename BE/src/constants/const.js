export const confirmOrderMailContent = ({
    name,
    orderId,
    orderDate,
    totalPrice,
    products
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
                ${products.map(it => `<tr>
                    <td style="padding: 6px 12px;">
                        <p>${it.name}</p>
                        <p>Size ${it.variantId.sizeName}</p>
                        ${it.optionId ? `<p>Phụ kiện: ${it.optionId.name}</p>` : ''}
                    </td>
                    <td style="padding: 6px 12px;">${it.quantity}</td>
                    <td style="padding: 6px 12px;">${it.price}</td>
                    <td style="padding: 6px 12px;">${it.quantity * it.price}</td>
                </tr>`).join('')}
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