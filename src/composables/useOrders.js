const STORAGE_KEY = "aruna_orders";

function loadOrders() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const orders = raw ? JSON.parse(raw) : [];

        return Array.isArray(orders) ? orders : [];
    } catch {
        return [];
    }
}


function customerKey(user) {
    if (!user) {
        return null;
    }

    if (user.id != null) {
        return `id:${user.id}`;
    }

    if (user.email) {
        return `email:${user.email.trim().toLowerCase()}`;
    }

    return null;
}


export function saveOrder(order) {
    const orders = loadOrders();

    orders.unshift(order);

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(orders)
    );

    return order;
}

export function getOrdersByUser(user) {
    const key = customerKey(user);

    if (!key) return [];

    return loadOrders().filter(
        (order) => order.customerKey === key
    );
}