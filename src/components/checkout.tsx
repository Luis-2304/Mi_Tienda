import { useState } from "react";
import type { LocalCartItem } from "../use-cases/contracts/LocalCartItem";

export const CheckoutForm = () => {
    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        postalCode: "",
    });

    const { firstName, lastName, email, street, city, postalCode } = state;

    const cart =
        typeof window !== "undefined" && localStorage.getItem("cart")
            ? JSON.parse(localStorage.getItem("cart") || "{}")
            : [];

    const total = cart?.reduce(
        (amount: number, item: LocalCartItem) => item.price + amount,
        0
    );

    const checkoutModel: any = {
        basketModel: cart,
        customer: {
            firstName,
            lastName,
            identifier: email,
            addresses: [
                { type: "billing", email },
                {
                    type: "delivery",
                    street,
                    city,
                    postalCode,
                },
            ],
        },
        total: {
            currency: "MXM",
            gross: total,
            net: total,
            tax: {
                name: "No Ttax",
                percent: 0,
            },
        },
        payment: {
            provider: "custom",
            custom: {
                properties: {
                    property: "payment_method",
                    value: "Crystal Coin",
                },
            },
        },
    };

    const handleClick = async () => {
        let response = await fetch("/order/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(checkoutModel),
        }).then((res) => res.json());

        if (response?.orders?.create?.id) {
            localStorage.removeItem("cart");
            window.location.href = `/order/${response.orders.create.id}`;
        }
    };

    return (
        <div className="p-10 mx-auto bg-background1 w-128 mt-20">
            <h1 className="text-text text-3xl font-bold mb-10 text-center">
                Checkout
            </h1>
            <div className="mx-auto">
                <form method="post" className="flex flex-wrap gap-5">
                    <input
                        type="text"
                        name="Primer Nombre"
                        placeholder="Primer Nombre"
                        className="w-full p-3 border border-text"
                        required
                        onChange={(e) =>
                            setState({ ...state, firstName: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        name="Apellido"
                        required
                        placeholder="Apellido"
                        className="w-full  p-3 border border-text"
                        onChange={(e) =>
                            setState({ ...state, lastName: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        name="Email"
                        required
                        placeholder="Email"
                        className="w-full  p-3 border border-text"
                        onChange={(e) =>
                            setState({ ...state, email: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        name="Calle"
                        placeholder="Calle"
                        className="w-full  p-3 border border-text"
                        onChange={(e) =>
                            setState({ ...state, street: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        name="Ciudad"
                        placeholder="Ciudad"
                        className="w-full  p-3 border border-text"
                        onChange={(e) =>
                            setState({ ...state, city: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        name="Código Postal"
                        placeholder="Código Postal"
                        className="w-full p-3 border border-text"
                        onChange={(e) =>
                            setState({ ...state, postalCode: e.target.value })
                        }
                    />
                </form>
                <button
                    className="w-full bg-text text-primary p-3 mt-10 rounded font-semibold text-center"
                    onClick={handleClick}
                >
                    Pagar Ahora
                </button>
            </div>
        </div>
    );
};
