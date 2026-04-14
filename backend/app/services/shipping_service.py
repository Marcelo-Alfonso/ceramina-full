def calculate_shipping(method: str) -> int:
    if method == "pickup":
        return 0
    elif method == "standard":
        return 3000
    else:
        raise ValueError("Método de envío inválido")