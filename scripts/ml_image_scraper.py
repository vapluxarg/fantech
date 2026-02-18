import sys
from typing import Optional

import requests
from bs4 import BeautifulSoup


def obtener_imagen_mercadolibre(producto: str) -> Optional[str]:
    """
    Recibe el nombre de un producto y devuelve la URL de la imagen
    del primer resultado en Mercado Libre (Argentina).
    """
    query = producto.strip().replace(" ", "-")
    url = f"https://listado.mercadolibre.com.ar/{query}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
    }

    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
    except requests.RequestException as e:
        # En caso de error de red/HTTP
        sys.stderr.write(f"[ERROR] No se pudo obtener la página: {e}\n")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")

    # Selectores posibles según layout de ML
    candidates = [
        "li.ui-search-layout__item img",
        "div.ui-search-result img",
        "img.ui-search-result__image",
        "section > ol > li img",
    ]

    img_tag = None
    for sel in candidates:
        img_tag = soup.select_one(sel)
        if img_tag:
            break

    if not img_tag:
        return None

    # Soporte para lazy-loading (data-src / srcset)
    src = img_tag.get("data-src") or img_tag.get("src")
    if not src:
        # Extraer del srcset si estuviera presente
        srcset = img_tag.get("data-srcset") or img_tag.get("srcset")
        if srcset:
            # Tomar la primera URL del srcset
            src = srcset.split(",")[0].strip().split(" ")[0]

    return src or None


if __name__ == "__main__":
    try:
        producto = input("Ingresá el nombre del producto: ")
    except (EOFError, KeyboardInterrupt):
        print("\nCancelado.")
        sys.exit(1)

    imagen = obtener_imagen_mercadolibre(producto)

    if imagen:
        print("\nImagen encontrada:")
        print(imagen)
    else:
        print("\nNo se pudo encontrar la imagen.")
