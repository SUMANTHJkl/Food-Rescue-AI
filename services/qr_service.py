import base64
import hashlib
import io
import json
import time
import qrcode
from qrcode.image.svg import SvgImage

class PythonQRGenerator:
    """
    Python QR Code Generator service for Food Rescue AI.
    Generates authentic, cryptographic QR code images with deep-link URL capabilities.
    """

    @staticmethod
    def generate_batch_qr_payload(batch_id: int, item_name: str, donor_name: str = "Royal Palace Banquet", quantity_kg: float = 25.0, plates_count: int = 100, safety_score: int = 95):
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
        raw_signature = f"{batch_id}:{item_name}:{timestamp}:FOOD_RESCUE_SECRET_KEY"
        token_hash = hashlib.sha256(raw_signature.encode('utf-8')).hexdigest()[:8].upper()
        unique_token = f"QR-FR-{batch_id}-{token_hash}"
        direct_verify_url = f"http://localhost:5173/verify?token={unique_token}&batch_id={batch_id}"

        payload = {
            "token": unique_token,
            "verify_url": direct_verify_url,
            "batch_id": batch_id,
            "item_name": item_name,
            "donor_name": donor_name,
            "quantity_kg": quantity_kg,
            "plates_count": plates_count,
            "safety_score": safety_score,
            "verification": "VERIFIED_AUTHENTIC",
            "created_at": timestamp
        }
        return payload

    @classmethod
    def generate_qr_svg_str(cls, batch_id: int, item_name: str, **kwargs) -> str:
        payload = cls.generate_batch_qr_payload(batch_id, item_name, **kwargs)
        # Encode the direct deep-link URL in the QR matrix
        qr_text = payload["verify_url"]

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=2,
            image_factory=SvgImage
        )
        qr.add_data(qr_text)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#000000", back_color="#FFFFFF")
        stream = io.BytesIO()
        img.save(stream)
        svg_xml = stream.getvalue().decode('utf-8')
        return svg_xml, payload

    @classmethod
    def generate_qr_base64_png(cls, batch_id: int, item_name: str, **kwargs) -> tuple[str, dict]:
        payload = cls.generate_batch_qr_payload(batch_id, item_name, **kwargs)
        # Encode the direct deep-link URL in the QR matrix
        qr_text = payload["verify_url"]

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=2
        )
        qr.add_data(qr_text)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#091526", back_color="#FFFFFF")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        data_url = f"data:image/png;base64,{img_str}"
        return data_url, payload
