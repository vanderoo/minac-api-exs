class Ewallet {
    constructor(items = [], customer){
        this.items = items
        this.customer = customer
    }

    baseBody() {
        let gross_amount = 0;
        let order_id = new Date().getTime();

        let items = this.items;
        let customer = this.customer;

        items.forEach(function (item) {
            gross_amount += item.price * item.quantity;
        });

        return {
            transaction_details: {
                gross_amount,
                order_id,
            },
            customer_details: {
                email: customer.email,
                first_name: customer.first_name,
                last_name: customer.last_name,
                phone: customer.phone,
            },
            item_details: this.items,
        };
    }

    goPay(){
        let base = this.baseBody()

        return {
            payment_type: "gopay",
            transaction_details: base.transaction_details,
            customer_details: base.customer_details,
            item_details: base.item_details,
            gopay: {
                enable_callback: true,
                callback_url: "gojek://callback"
            },
        }
    }

    shopeePay(){
        let base = this.baseBody()

        return {
            payment_type: "shopeepay",
            transaction_details: base.transaction_details,
            customer_details: base.customer_details,
            item_details: base.item_details,
            shopeepay: {
                callback_url: "https://youtube.com/",
            },
        }
    }

}

export default Ewallet;