from scripts.ml_image_scraper import obtener_imagen_mercadolibre

MAX_PRODUCTS = 10


def solicitar_productos(max_items: int = MAX_PRODUCTS) -> list[str]:
    productos: list[str] = []
    for idx in range(max_items):
        try:
            nombre = input(
                f"Ingresá el nombre del producto #{idx + 1} (Enter para terminar): "
            ).strip()
        except (EOFError, KeyboardInterrupt):
            print("\nCancelado.")
            raise SystemExit(1)

        if not nombre:
            break

        productos.append(nombre)

    return productos


def mostrar_resultado(producto: str, imagen: str | None) -> None:
    print(f"\nProducto: {producto}")

    if imagen:
        print("Imagen encontrada:")
        print(imagen)
    else:
        print("No se pudo encontrar la imagen.")


if __name__ == "__main__":
    productos = solicitar_productos()

    if not productos:
        print("\nNo se ingresaron productos.")
        raise SystemExit(1)

    for producto in productos:
        imagen = obtener_imagen_mercadolibre(producto)
        mostrar_resultado(producto, imagen)
