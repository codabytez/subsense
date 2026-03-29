import Image from "next/image";
import { Bank, Wallet } from "iconsax-reactjs";

import mastercardSvg from "@/public/cards/Mastercard.svg";
import visaSvg from "@/public/cards/Visa.svg";
import amexSvg from "@/public/cards/Amex.svg";
import discoverSvg from "@/public/cards/Discover.svg";
import verveSvg from "@/public/cards/Verve.svg";
import paypalSvg from "@/public/cards/PayPal.svg";
import applePaySvg from "@/public/cards/ApplePay.svg";
import googlePaySvg from "@/public/cards/GooglePay.svg";
import yandexSvg from "@/public/cards/Yandex.svg";

const CARD_BRAND_LOGOS: Record<string, typeof mastercardSvg> = {
  Mastercard: mastercardSvg,
  Visa: visaSvg,
  Amex: amexSvg,
  Discover: discoverSvg,
  Verve: verveSvg,
};

const WALLET_LOGOS: Record<string, typeof paypalSvg> = {
  paypal: paypalSvg,
  apple_pay: applePaySvg,
  google_pay: googlePaySvg,
};

interface PaymentMethodLogoProps {
  type: string;
  brand?: string;
  width?: number;
  height?: number;
}

export function PaymentMethodLogo({
  type,
  brand,
  width = 32,
  height = 20,
}: PaymentMethodLogoProps) {
  if (type === "card") {
    const src = (brand && CARD_BRAND_LOGOS[brand]) ?? yandexSvg;
    return (
      <Image
        src={src}
        alt={brand ?? "card"}
        width={width}
        height={height}
        className="object-contain shrink-0"
      />
    );
  }
  if (WALLET_LOGOS[type]) {
    return (
      <Image
        src={WALLET_LOGOS[type]}
        alt={type}
        width={width}
        height={height}
        className="object-contain shrink-0"
      />
    );
  }
  if (type === "bank") {
    return (
      <div className="h-6 w-10 rounded flex items-center justify-center shrink-0 bg-emerald-500/30">
        <Bank size={14} color="#fff" />
      </div>
    );
  }
  return <Wallet size={18} color="rgba(255,255,255,0.6)" />;
}
