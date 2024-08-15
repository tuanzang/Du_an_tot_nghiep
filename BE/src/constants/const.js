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

export const completedOrderMailContent = ({
    customerName
}) => {
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
}